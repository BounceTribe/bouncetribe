import Auth0Lock from 'auth0-lock'
import Relay from 'react-relay'
import {clientId, domain} from 'config/auth0'
import {purple} from 'styling'
import CreateUser from 'mutations/CreateUser'
import SigninUser from 'mutations/SigninUser'
import UpdateUser from 'mutations/UpdateUser'
import {generateHandle} from 'utils/handles'
import uploadImageFromUrl from 'utils/uploadImageFromUrl'

class AuthService {

  constructor() {

    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        params: {
          scope: 'openid email update:current_user_identities'
        },
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
    let exp =  new Date(expString)
    if (exp < now) {
      this.logout()
      return false
    } else {
      return true
    }
  }

  logout() {
    localStorage.removeItem('idToken')
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
      return false
    }
  }

  authFlow = (result) => {
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
      email,
      exp
    }).then(
      userId => userId,
      rejected => {
        generateHandle(email).then(
          handle => {
            console.log(handle)
            this.createUser({
              idToken,
              email,
              handle,
              exp
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
      exp
    } = authFields
    localStorage.setItem('idToken', idToken)
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
}

const auth = new AuthService()

export default auth
