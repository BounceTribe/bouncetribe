import React, { Component } from 'react'
import Relay from 'react-relay'
import ProfileField from 'reusables/ProfileField'
import EditPersonMutation from 'mutations/EditPersonMutation'
import {handleValidator} from './handleValidator'

class SettingsContainer extends Component {
  // constructor() {
  //   super()
  //
  // }


  handleSubmitField = (fields = {}) => {
    console.log(fields)
    Relay.Store.commitUpdate(
      new EditPersonMutation({
        user: this.props.user,
        ...this.props.user,
        ...fields,
      }),
      {
        onSuccess: (success) => console.log(success),
        onFailure: (transaction) => console.log(transaction),
      },
    )
  }

  render() {
    const {
      name,
      handle,
    } = this.props.user
    return (
      <section>

        <ProfileField
          field={'name'}
          label={'Name'}
          text={name}
          submitField={this.handleSubmitField}
        />


        <ProfileField
          field={'handle'}
          label={'Handle'}
          validate={handleValidator}
          text={handle}
          submitField={this.handleSubmitField}
        />


      </section>
    )
  }
}

export default Relay.createContainer(
  SettingsContainer,
  {
    fragments: {
      user: () => Relay.QL`
        fragment on User {
          email
          name
          profilePicUrl
          handle
          summary
          id
          influences (first: 1000000) {
            edges {
              node {
                artist {
                  name
                  id
                  imageUrl
                }
              }
            }
          }
          ${EditPersonMutation.getFragment('user')}
        }
      `,
    },
  }
)
