import React, { Component } from 'react'
import Relay from 'react-relay'
import ProfileField from './ProfileField'
import EditPersonMutation from './EditPersonMutation'
import cat from 'styling/burritocat.jpg'

class ProfileContainer extends Component {
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
      profilePicUrl
    } = this.props.user
    return (
      <section>

        <ProfileField
          field={'name'}
          text={name}
          submitField={this.handleSubmitField}
        />

        <img
          src={profilePicUrl ? profilePicUrl : cat}
          role={'presentation'}
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
  ProfileContainer,
  {
    fragments: {
      user: () => Relay.QL`
        fragment on User {
          email
          name
          profilePicUrl
          handle
          ${EditPersonMutation.getFragment('user')}
        }
      `,
    },
  }
)
