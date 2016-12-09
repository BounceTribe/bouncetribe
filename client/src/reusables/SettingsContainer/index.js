import React, { Component } from 'react'
import Relay from 'react-relay'
import ProfileField from 'reusables/ProfileField'
import EditPersonMutation from 'mutations/EditPersonMutation'


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
      email,
      handle,
    } = this.props.user
    return (
      <section>

        <h4>Settings</h4>

        <ProfileField
          field={'name'}
          text={name}
          submitField={this.handleSubmitField}
        />

        <ProfileField
          field={'email'}
          text={email}
          submitField={this.handleSubmitField}
        />

        <ProfileField
          field={'handle'}
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
