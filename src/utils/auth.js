import Auth0Lock from 'auth0-lock'
import Relay from 'react-relay'
import {clientId, domain} from 'config/auth0'
import {url} from 'config'
import {purple} from 'theme'
import CreateUser from 'mutations/CreateUser'
import SigninUser from 'mutations/SigninUser'
import UpdateUser from 'mutations/UpdateUser'
import AddToFriends from 'mutations/AddToFriends'
import {generateHandle} from 'utils/handles'
import uploadImageFromUrl from 'utils/uploadImageFromUrl'
import {findUserIds} from 'utils/graphql'

class AuthService {

  constructor() {

    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        params: {
          scope: 'openid email update:current_user_identities'
        },
        redirectUrl: `${url}/login`,
        responseType: 'token',
      },
      theme: {
        logo: `${window.location.origin}/logo.png`,
        primaryColor: purple,
      },
      languageDictionary: {
        emailInputPlaceholder: "rockstar@band.com",
        title: "BounceTribe"
      },
      allowedConnections: [
        'Username-Password-Authentication',
        'facebook'
      ],
      closable: false,
      container: 'lock',
    })

    this.lock.on('authenticated', this.authFlow)

  }

  showLock () {
    this.lock.show()
  }

  isCurrent() {
    let expString = localStorage.getItem('exp')
    if (!expString) {
      localStorage.removeItem('idToken')
      return false
    }
    let now = new Date()
    let exp =  new Date(parseInt(expString, 10)) //10 = radix

    if (exp < now) {
      this.logout()
      return false
    } else {
      return true
    }
  }

  logout() {
    localStorage.removeItem('idToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('exp')
    location.reload()
  }

  getToken () {
    let idToken = localStorage.getItem('idToken')
    if (this.isCurrent() && idToken) {
      return idToken
    } else {
      localStorage.removeItem('idToken')
      localStorage.removeItem('exp')
      localStorage.removeItem('accessToken')
      return false
    }
  }

  authFlow = (result) => {
    console.log(result)
    let {
      exp,
      email,
    } = result.idTokenPayload
    let {
      idToken,
      accessToken
    } = result
    this.signinUser({
      idToken,
      accessToken,
      email,
      exp
    }).then(
      userId => userId,
      rejected => {
        generateHandle(email).then(
          handle => {
            this.createUser({
              idToken,
              email,
              handle,
              exp,
              accessToken
            }).then(
              userId => {
                this.getUserInfo(accessToken).then(profile=>{
                  this.updateUser(userId, profile)
                })
              },
              rejected => {
                console.log('Sorry a user already exists with that email', rejected)
              }
            )
          }
        )
      }
    )
  }

  setToken = (authFields) => {
    let {
      idToken,
      exp,
      accessToken
    } = authFields
    localStorage.setItem('idToken', idToken)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('exp', exp * 1000)
  }

  createUser = (authFields) => {
    return new Promise( (resolve, reject) => {
      Relay.Store.commitUpdate(
        new CreateUser({
          email: authFields.email,
          idToken: authFields.idToken,
          handle: authFields.handle
        }), {
          onSuccess: (response) => {
            this.signinUser(authFields)
            let userId = response.createUser.user.id
            resolve(userId)
          },
          onFailure: (response) => {
            console.log('CreateUser error', response)
            reject(response.getError())
          }
        }
      )
    })
  }

  signinUser = (authFields) => {
    return new Promise ( (resolve, reject) => {
      Relay.Store.commitUpdate(
        new SigninUser({
          idToken: authFields.idToken
        }), {
          onSuccess: (response) => {
            this.setToken(authFields)
            let userId = response.signinUser.viewer.user.id
            this.addFriends()
            resolve(userId)
          },
          onFailure: (response) => {
            reject(response.getError())
          }
        }
      )
    })
  }

  getUserInfo = (accessToken) => {
    return new Promise((resolve, reject)=>{
      this.lock.getUserInfo(accessToken, (error, profile) => {
        if (profile) {
          resolve(profile)
        }
      })
    })
  }



  updateUser = (userId, profile) => {
    let {
      name,
      pictureLarge,
      picture
    } = profile
    let pictureUrl = (pictureLarge) ? (pictureLarge) : (picture)
    if (pictureUrl) {
      uploadImageFromUrl(pictureUrl).then(portraitId=>{
        Relay.Store.commitUpdate(
          new UpdateUser({
            userId,
            name,
            portraitId
          })
        )
      })
    }
  }


  addFriends = () => {
    let accessToken = localStorage.getItem('accessToken')
    this.getUserInfo(accessToken).then((info, error) => {
      let friends = info.context.mutualFriends.data
      let {userId} = info
      let socialIds = []
      for (let index in friends) {
        if (index) {
          socialIds.push(`"facebook|${friends[index].id}"`)
        }
      }
      Promise.all([
        findUserIds(socialIds),
        findUserIds(`"${userId}"`)
      ])
      .then((result)=>{
        let newFriends = result[0]
        let selfId = result[1][0]
        newFriends.forEach( (newFriendId)=>{
          Relay.Store.commitUpdate(
            new AddToFriends({
              newFriendId,
              selfId
            })
          )
        })

      })
    })
  }


}

const auth = new AuthService()

export default auth
