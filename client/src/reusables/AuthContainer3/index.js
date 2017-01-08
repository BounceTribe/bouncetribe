import React, {Component} from 'react'
import Relay from 'react-relay'
import styled from 'styled-components'
import SigninUserMutation from 'mutations/SigninUserMutation'
import CreateUserMutation from 'mutations/CreateUserMutation'
import {Err, narrate, show} from 'utils'
import {checkIfUserEmailExists} from 'apis/graphql'
import {handleSanitizer} from 'utils/validators'
import auth from 'config/auth'
import Loading from 'reusables/Loading'

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
        show('btAccount', json)
        if (json.data.allUsers.length < 1) {
          throw json
        } else {
          return json.data.allUsers[0]
        }
      })
      narrate('A BT accounts already exists with that email')
      show('btAccount', btAccount)
      return btAccount

    } catch (noUser) {
      narrate('No user with that email exists')
      show('noUser', noUser)

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
              narrate('Succesfully created a BT user.')
              show('response', response)
              this.signInMutation()
              resolve()
            },
            onFailure: (response) => {
              narrate('Failed to create a BT user.')
              reject(response.getError())
            }
          }
        )
      }).catch((reason) => {
        throw reason
      })
    } catch (error){
      narrate('CreateUserMutation error')
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
              narrate('signed in to BT', response)
              show('response', response)
              let idToken = response.signinUser.token
              auth.login({'id_token': idToken})
              this.props.router.push({
                pathname: '/'
              })
              resolve()
            },
            onFailure: (response) => {
              narrate('Failed to signin to BT')
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
    if (this.props.auth.getToken() && !this.props.viewer.user) {
      this.setState({
        loading: true
      })
      narrate('...found a token in local storage...')
      show('this.props', this.props)

      try {
        narrate('...attempting to login to BT...')
        await this.signInMutation()
      } catch (error) {
        narrate("Couldn't login to BT with the token currently in storage ")
        show("error", error)

        try {
          narrate('...fetching auth0Profile using token...')
          const auth0Profile = await this.props.auth.getUserInfo()
          narrate('Found a profile: ')
          show('auth0Profile', auth0Profile)
          narrate('Attempting to create a BT user with that auth0Profile')
          try {
            await this.createUserMutation(auth0Profile)
          } catch (error) {
            narrate('Encountered an error creating that user.')
            show('error', error)
            try {
              narrate('...checking to see if there is already a user with that email... ')
              const primaryUser = await this.checkBtForEmail(auth0Profile.email)

              show('primaryUser', primaryUser)
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
              narrate("That user doesn't exist in BT's database")
              show("error", error)
            }
          }
        } catch (error) {
          narrate("Couldn't find an auth0Profile with that token.")
        }
      }
    } else{
      this.props.auth.login()
    }
  }

  showLoading = () => {
    if (this.state.loading) {
      return (
        <Loading/>
      )
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
        {this.showLoading()}
      </AuthDiv>
    )
  }
}


export default Relay.createContainer(
  AuthContainer3,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          id
          user {
            id
          }
        }
      `,
    },
  }
)
