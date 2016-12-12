import React, { Component } from 'react'
import Relay from 'react-relay'
import ProfileField from 'reusables/ProfileField'
import InfluencesField from 'reusables/InfluencesField'
import EditPersonMutation from 'mutations/EditPersonMutation'
import CreateInfluenceMutation from 'mutations/CreateInfluenceMutation'
import DeleteInfluenceMutation from 'mutations/DeleteInfluenceMutation'
import {searchArtistsOptions, createArtistOptions} from 'apis/graphql'
import ProfileTop from 'reusables/ProfileTop'

class ProfileContainer extends Component {
  // constructor() {
  //   super()
  //
  // }
  handleDeleteInfluence = (fields = {}) => {
    console.log(fields)
    Relay.Store.commitUpdate(
      new DeleteInfluenceMutation({
        user: this.props.user,
        influenceId: fields.influenceId
      }),
      {
        onSuccess: (success) => console.log(success),
        onFailure: (transaction) => console.log(transaction),
      },
    )
  }



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

  handleSubmitInfluence = async (fields = {}) => {
    const {
      spotifyId,
      name,
      imageUrl,
    } = fields
    let options = searchArtistsOptions(spotifyId)
    let artist = await fetch(...options).then(resp=>resp.json()).then(json=>json.data.allArtists)
    if (artist.length < 1) {
      let options = createArtistOptions(spotifyId, name, imageUrl)
      artist = await fetch(...options).then(resp=>resp.json()).then(json=>json.data.createArtist)
    } else {
      artist = artist[0]
    }
    console.log(artist)
    Relay.Store.commitUpdate(
      new CreateInfluenceMutation({
        user: this.props.user,
        artist: artist,
      }),
      {
        onSuccess: (success) => console.log('succes', success),
        onFailure: (transaction) => console.log('failure', transaction),
      }
    )

  }

  render() {
    const {
      email,
      summary,
      influences
    } = this.props.user
    return (
      <section>

        <ProfileTop
          user={this.props.user}
        />


        <ProfileField
          field={'summary'}
          label={'Summary'}
          text={summary}
          submitField={this.handleSubmitField}
        />

        <InfluencesField
          influences={influences}
          user={this.props.user}
          submitInfluence={this.handleSubmitInfluence}
          deleteInfluence={this.handleDeleteInfluence}
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
                  imageUrl
                }
                id
              }
            }
          }
          ${EditPersonMutation.getFragment('user')}
          ${CreateInfluenceMutation.getFragment('user')}
          ${DeleteInfluenceMutation.getFragment('user')}
        }
      `,
    },
  }
)
