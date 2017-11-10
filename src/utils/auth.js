import Auth0Lock from 'auth0-lock'
import Relay from 'react-relay'
import {url, auth0} from 'config'
import {purple} from 'theme'
import CreateUser from 'mutations/CreateUser'
import SigninUser from 'mutations/SigninUser'
import UpdateUser from 'mutations/UpdateUser'
import AddToFriends from 'mutations/AddToFriends'
import {generateHandle} from 'utils/handles'
import uploadImageFromUrl from 'utils/uploadImageFromUrl'
import {findUserIds} from 'utils/graphql'
import {connectAuth0Accounts} from 'utils/connectAuth0Accounts'
import {browserHistory} from 'react-router'

class AuthService {
  constructor() {


    let showSignup = window.location.href.includes('/acceptinvite/')
    this.defaultOptions = {
      auth: {
        params: {
          scope: 'openid email update:current_user_identities',
          state: 'default'
        },
        redirectUrl: `${url}/login/`,
        responseType: 'token',
        connectionScopes: {
          'facebook': ['email', 'public_profile', 'user_friends']
        }
      },
      allowedConnections: [
        'Username-Password-Authentication',
        'facebook'
      ],
      closable: false,
      theme: {
        logo: `${url}/logo.png`,
        primaryColor: purple,
      },
      initialScreen: showSignup ? 'signUp' : 'login',
      languageDictionary: {
        emailInputPlaceholder: "rockstar@band.com",
        title: "BounceTribe"
      },
      container: 'lock',
      rememberLastLogin: false,
    }

    this.lock = new Auth0Lock(auth0.clientId, auth0.domain, this.defaultOptions)

    this.lock.on('authenticated', this.authFlow)

    this.showLock = this.showLock.bind(this)
  }

  hide = () => this.lock.hide()

  fbOptions = (primaryAuthId) => {
    return {
      allowedConnections: ['facebook'],
      rememberLastLogin: false,
      languageDictionary: {
        signin: {title: 'Link your Facebook account'}
      },
      auth: {
        params: {
          state: primaryAuthId,
          scope: 'openid email update:current_user_identities'
        },
        responseType: 'token',
        redirectUrl: `${url}/login/`,
        connectionScopes: {
          'facebook': ['email', 'public_profile', 'user_actions.music', 'user_friends']
        }
      }
    }
  }

  showLock (primaryAuthId) {
    let config = {}
    if (primaryAuthId) {
      config = this.fbOptions(primaryAuthId)
    }
    this.lock.show(config)
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
    localStorage.removeItem('redirect')
    location.replace('/login/')
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
    console.log('authflow result', result);
    let { exp, email, sub }             = result.idTokenPayload
    let { idToken, accessToken, state } = result

    if (!email) {

    } else if (state !== 'default') {
      let primaryAuth0UserId = state
      let primaryToken = localStorage.getItem('idToken')
      let secondaryToken = result.idToken
      connectAuth0Accounts({
        primaryAuth0UserId,
        primaryToken,
        secondaryToken
      }).then(result=>{
        accessToken = localStorage.getItem('accessToken')
        this.signinUser({
          idToken: primaryToken,
          accessToken,
          email,
          exp
        }).then(
          userId => {
            this.getUserInfo(accessToken).then(profile=>{
              profile = {
                ...profile,
                userId: sub
              }
              this.updateUser(userId, profile)
            })
          },
          rejected => rejected
        )
      })
    } else {
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
                    console.log('profile', profile)
                    this.updateUser(userId, profile)
                  })
                },
                rejected => {
                  console.log('Sorry a user already exists with that email', rejected)
                  window.alert('Sorry a user already exists with that email. You may already have an account. Try logging in again using your original credentials.')
                }
              )
            }
          )
        }
      )
    }
  }

  setToken = (authFields) => {
    let { idToken, exp, accessToken } = authFields
    localStorage.setItem('idToken', idToken)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('exp', exp * 1000)
    browserHistory.push('/')
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
        new SigninUser({ idToken: authFields.idToken }), {
          onSuccess: (response) => {
            this.setToken(authFields)
            let userId = response.signinUser.viewer.user.id
            //this.addFriends()
            resolve(userId)
          },
          onFailure: (response) => reject(response.getError())
        }
      )
    })
  }

  getUserInfo = (accessToken) => {
    if (!accessToken) {
      accessToken = localStorage.getItem('accessToken')
    }
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
      picture,
      userId: auth0Id,
      location
    } = profile
    let facebookId
    if (auth0Id.search('facebook') === 0 ) {
      facebookId = auth0Id.split('|')[1]
    }
    let pictureUrl = (pictureLarge) ? (pictureLarge) : (picture)
    let placename = (location) ? (location.name) : undefined
    if (pictureUrl) {
      uploadImageFromUrl(pictureUrl).then(
        portraitId=>{
          Relay.Store.commitUpdate(
            new UpdateUser({
              userId,
              name,
              portraitId,
              facebookId,
              placename
            })
          )
        }
      )
    }
  }


  addFriends = () => {
    let accessToken = localStorage.getItem('accessToken')
    this.getUserInfo(accessToken).then((info, error) => {
      if (info.userId.search('facebook') !== -1) {
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
        ]).then( result => {
          let newFriends = result[0]
          let selfId = result[1][0]
          newFriends.forEach( (newFriendId)=>{
            Relay.Store.commitUpdate(
              new AddToFriends({ newFriendId, selfId })
            )
          })
        })
      }
    })
  }

}

const auth = new AuthService()

export default auth
