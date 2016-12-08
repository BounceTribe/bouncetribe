import React, { Component } from 'react'
import Relay from 'react-relay'
import ProfileField from './ProfileField'
import InfluencesField from 'reusables/InfluencesField'
import EditPersonMutation from './EditPersonMutation'
import cat from 'styling/burritocat.jpg'
import BTButton from 'reusables/BTButton'

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
      profilePicUrl,
      summary,
      influences
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

        <BTButton
          icon={'logo'}
        >
          Hello
        </BTButton>

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

        <ProfileField
          field={'summary'}
          text={summary}
          submitField={this.handleSubmitField}
        />

        <InfluencesField
          influences={influences}
          user={this.props.user}
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
          summary
          id
          influences (first: 1000000) {
            edges {
              node {
                artist {
                  name
                  id
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
