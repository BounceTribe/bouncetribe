import Auth0Lock from 'auth0-lock'
import {Err, Log} from 'utils'
import {linkAccountsOptions} from 'apis/auth'
import {btPurple} from 'styling/T'
import {auth0} from 'config/urls'

const clientId = 'cKacry8a5wk5N8HfYggEXJ1r7Izpnq8J'

class AuthService {
  constructor(clientId, domain) {
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: 'http://localhost:3000/login/',
        responseType: 'token'
      },
      container: 'auth',
      params: {
        scope: 'openid update:current_user_identities'
      }
    })
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)
  }

  _doAuthentication = async (authResult) => {
    try {
      Log('authResult received', authResult)
      // Saves the user token
      let state = JSON.parse(authResult.state)

      if (state.secondaryToken) {
        let options = linkAccountsOptions({
          ...state,
          primaryToken: authResult.idToken
        })
        const linkResponse = await fetch(...options).then((response)=>{
          if (response.status !== 201) {
            throw response.json()
          } else {
            return response.json()
          }
        }).then(json=>json)
        console.log('linked accounts response', linkResponse)
      }

      this.setTokens(authResult)
      return
    } catch (error) {
      console.log('_doAuthentication error', error)
    }
  }

  login(options = {}) {
    let {
      primaryAuth0UserId,
      secondaryToken,
      provider
    } = options
    // Call the show method to display the widget.
    let allowedConnections = (provider) ? [provider] : ['Username-Password-Authentication', 'facebook']

    this.lock.show({
      auth: {
        params: {
          state: JSON.stringify({
            secondaryToken,
            primaryAuth0UserId,
          }),
          scope: 'openid update:current_user_identities'
        }
      },
      allowedConnections,
      autoFocus: true,
      rememberLastLogin: (provider) ? false : true,
      theme: {
        logo: 'http://bouncetribe.com/wp-content/uploads/2016/03/Logo-150.png',
        primaryColor: btPurple,
      },
      languageDictionary: {
        emailInputPlaceholder: "rockstar@band.com",
        title: "BounceTribe"
      },
    })
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    return !!this.getToken()
  }

  setTokens(authResult) {
    console.log('authResult', authResult)
    localStorage.setItem('access_token', authResult.accessToken)
    // Saves user token to local storage
    localStorage.setItem('id_token', authResult.idToken)
  }

  getToken() {
    // Retrieves the user token from local storage
    return localStorage.getItem('id_token')
  }

  getAccessToken() {
    return localStorage.getItem('access_token')
  }

  logout() {
    // Clear user token and profile data from local storage
    localStorage.removeItem('id_token')
    localStorage.removeItem('access_token')
  }

  getUserInfo = async () => {
    if (!this.loggedIn()){
      let error = Err('No token')
      throw error
    }
    try {
      let accessToken = this.getAccessToken()
      const result = await new Promise( (resolve) => {
        this.lock.getUserInfo(accessToken, (error, profile)=>{
          if (error) throw console.log(error)
          resolve(profile)
        })
      })
      return result
    } catch (error) {
      throw error
    }
  }
}

const auth = new AuthService(clientId, auth0)


export default auth
