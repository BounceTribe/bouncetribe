import React, {Component} from 'react'
import Relay from 'react-relay'
import {connect} from 'react-redux'
import styled from 'styled-components'
import SigninUserMutation from 'mutations/SigninUserMutation'
import CreateUserMutation from 'mutations/CreateUserMutation'
import {Err, Log} from 'utils'
import {loginSuccess} from 'actions/auth'
import {checkIfUserEmailExists} from 'apis/graphql'
import {handleSanitizer} from 'utils/validators'

const AuthDiv = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  width: 250px;
`

class AuthContainer3 extends Component {

  state = {
    message: '',
  }
  componentDidMount() {
    this.init()
  }

  checkBtForEmail = async(email) => {
    let options = checkIfUserEmailExists(email)
    try {
      const btAccount = await fetch(...options).then(data => data.json()).then((json) => {
        Log('btAccount', json)
        if (json.data.allUsers.length < 1) {
          throw json
        } else {
          return json.data.allUsers[0]
        }
      })
      Log('A BT accounts already exists with that email', btAccount)
      return btAccount

    } catch (noUser) {
      Log('No user with that email exists', noUser)
    }
  }

  createUserMutation = async (profile) => {
    try {
      let token = this.props.auth.getToken()
      let handle = handleSanitizer(profile.email.split('@')[0])
      let fields = {}
      fields.email = profile.email
      fields.idToken = token
      if (profile.picture) {
        fields.profilePicThumb = profile.picture
        if (profile['picture_large']) {
          fields.profilePicUrl = profile['picture_large']
        }
      }
      fields.name = profile.name
      fields.handle = handle
      if (profile.location) {
        fields.placename = profile.location.name
      } else {
        fields.placename = null
      }

      await new Promise ((resolve, reject) => {
        this.props.relay.commitUpdate(
          new CreateUserMutation({
            ...fields
          }), {
            onSuccess: (response) => {
              Log('Succesfully created a BT user.', response)
              this.signInMutation()
              resolve()
            },
            onFailure: (response) => {
              Log('Failed to create a BT user.')
              reject(response.getError())
            }
          }
        )
      }).catch((reason) => {
        throw reason
      })
    } catch (error){
      Log('CreateUserMutation error')
      throw error
    }
  }

  signInMutation = async() => {
    try {
      const token = this.props.auth.getToken()
      if (!token) throw Err('No token!')
      await new Promise ( (resolve, reject) => {
        this.props.relay.commitUpdate(
          new SigninUserMutation({
            authToken: token,
          }), {
            onSuccess: (response) => {
              Log('signed in to BT', response)
              let idToken = response.signinUser.token
              let user = response.signinUser.user
              this.props.loginSuccess(idToken, user)
              this.props.router.push({
                pathname: '/'
              })
              resolve()
            },
            onFailure: (response) => {
              Log('Failed to signin to BT')
              reject(response.getError())
            }
          }
        )
      }).catch( (reason) => {
        throw reason
      })
    } catch (error) {
      throw error
    }
  }

  init = async() => {
    if (this.props.auth.getToken() && !this.props.isLoggedIn) {
      Log('...found a token in local storage...', 'this.props', this.props)
      try {
        Log('...attempting to login to BT...')
        await this.signInMutation()
      } catch (error) {
        Log("Couldn't login to BT with the token currently in storage ", error)
        try {
          Log('...fetching auth0Profile using token...')
          const auth0Profile = await this.props.auth.getUserInfo()
          Log('Found a profile: ', 'auth0Profile', auth0Profile)
          Log('Attempting to create a BT user with that auth0Profile')
          try {
            await this.createUserMutation(auth0Profile)
          } catch (error) {
            Log('Encountered an error creating that user.', error)
            try {
              Log('...checking to see if there is already a user with that email... ')
              const primaryUser = await this.checkBtForEmail(auth0Profile.email)

              Log('primaryUser', 'primaryUser', primaryUser)
              let auth0UserId = primaryUser.auth0UserId

              let provider = auth0UserId.split('|')[0]
              if (provider==='auth0') {
                provider = 'Username-Password-Authentication'
              }

              this.setState({
                message: `You've already got an account! Signin to connect them.`
              })
              let token = this.props.auth.getToken()
              this.props.auth.login({
                secondaryToken: token,
                primaryAuth0UserId: auth0UserId,
                provider
              })
            } catch (error) {
              Log("That user doesn't exist in BT's database", error)
            }
          }
        } catch (error) {
          Log("Couldn't find an auth0Profile with that token.")
        }
      }
    } else{
      this.props.auth.login()
    }
  }

  render() {
    return (
      <AuthDiv>
        <h4>{this.state.message}</h4>
        <div
          id={'auth'}
        >

        </div>
      </AuthDiv>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth['id_token'],
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginSuccess: (idToken, user) => {
      dispatch(loginSuccess(idToken, user))
    },
  }
}

AuthContainer3 = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer3)

export default Relay.createContainer(
  AuthContainer3,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          id
        }
      `,
    },
  }
)
