import React, {Component} from 'react'
import Relay from 'react-relay'
import {handleValidator, isUniqueField} from 'utils/handles'
import UpdateMentor from 'mutations/UpdateMentor'
import CreateMentor from 'mutations/CreateMentor'
import {Dialog, TextField, FlatButton} from 'material-ui/'


class EditMentorProfile extends Component {

  constructor(props) {
    super()
    this.state = Object.assign({...props.viewer.user}, {...props.viewer.allMentors.edges[0].node}, {
      handleError: '',
      emailError: '',
      summaryError: '',
      id: (props.viewer.allMentors.edges[0].node || {}).id,
    })
  }

  handleSet = (val) => {
    let {handle: newHandle, error} = handleValidator(val)
    this.setState({ handle: newHandle, handleError: error })
    if (val!==this.props.viewer.allMentors.edges[0].node.handle) {
      isUniqueField(val, 'handle', 'Mentor').then( result =>
        !result && this.setState({handleError: 'handle already in use!'})
      )
    }
  }

  emailSet = (val) => {
    let error = ''
    this.setState({ email: val,  emailError: error })
    if (val!==this.props.viewer.allMentors.edges[0].node.email) {
      isUniqueField(val, 'email', 'Mentor').then( result => {
          !result && this.setState({emailError: 'email already in use!'})
        }
      )
    }
  }

  summarySet = (val) => {
    console.log('summary', val, val.length);
    let error = ''
    if (val.split(/\r\n|\r|\n/).length > 15) error='Too many lines'
    if (val.length > 400) error='500 character limit exceeded'
    this.setState({summary: val, summaryError: error})
  }

  becomeMentor = () => {
    Relay.Store.commitUpdate(
      new CreateMentor({user: this.props.viewer.user}), {
        onSuccess: (response) => {
          console.log('createMentor response', response)
          let id = response.createMentor.mentor.id
          id && this.setState({id})
        },
        onFailure: (response) => {
          console.log('CreateMentor error', response)
          debugger
        }
      }
    )
  }

  setProfile = () => {
    console.log('updating', this.state);
    let mentorId = this.props.viewer.allMentors.edges[0].node.id
    Relay.Store.commitUpdate(
      new UpdateMentor(Object.assign({...this.state}, {mentorId})), {
        onSuccess: (success) => this.props.onSave(),
        onFailure: (failure) => console.log('updateuser fail', failure)
      }
    )
  }

  textFields = () => {
    let {  handle,
           email,
          // latitude,
          // longitude,
          placename,
          summary,
          // videoUrl,
          // occupation,
          // qualifications,
          // specialties,
          website,
          // deactivated,
          handleError,
          emailError,
          summaryError} = this.state
    return (
      <div>
        <TextField
          floatingLabelText={'Handle'}
          errorText={handleError}
          value={handle}
          onChange={(e)=>this.handleSet(e.target.value)}
        /><br />
        <TextField
          floatingLabelText={'Location'}
          value={placename}
          onChange={(e)=>this.setState({placename: e.target.value})}
        /><br />
        <TextField
          floatingLabelText={'Summary'}
          errorText={summaryError}
          value={summary}
          onChange={(e)=>this.summarySet(e.target.value)}
          multiLine
          rowsMax={5}
          fullWidth
        /><br />
        <TextField
          floatingLabelText={'Email'}
          errorText={emailError}
          value={email}
          onChange={(e)=>this.emailSet(e.target.value)}
        /><br />
        <TextField
          floatingLabelText={'Website'}
          value={website}
          onChange={(e)=>this.setState({website: e.target.value})}
        />
      </div>
    )
  }

  render() {
    let {handleError, emailError, summaryError, id} = this.state

    return (
      <Dialog
        title={"Mentor Profile"}
        modal
        autoScrollBodyContent
        open
        bodyStyle={{minHeight: '60vh'}}
        titleStyle={{ fontSize: '28px' }}
        actions={[
          <FlatButton label="Cancel" onClick={this.props.onClose} />,
          <FlatButton
            label="Save Mentor Info"
            primary
            disabled={!!handleError || !!emailError || !!summaryError || !id}
            onClick={this.setProfile}
          />
        ]}>
        {id ? this.textFields() :
          <FlatButton label="Become A Mentor" onClick={this.becomeMentor} />
        }
      </Dialog>
    )
  }
}

export default Relay.createContainer( EditMentorProfile, {
  initialVariables: { userHandle: '' },
  prepareVariables: (urlParams) => ({
    ...urlParams,
    mentorFilter: {
      userAccount: {
        handle: urlParams.userHandle
      }
    }
  }),
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            experience
            lastPing
            email
            handle
            summary
            website
            placename
            score
            portrait { url }
            portraitSmall { url }
            portraitMini { url }
            genres ( first: 40 ) {
              edges { node { id, name } }
            }
            artistInfluences ( first: 40 ) {
              edges {
                node {
                  id
                  name
                  spotifyId
                  imageUrl
                }
              }
            }
          }
          allMentors (
            first: 1
            filter: $mentorFilter
          ) {
            edges {
              node {
                id
                createdAt
                handle
                lastPing
                latitude
                longitude
                placename
                summary
                videoUrl
                occupation
                qualifications
                specialties
                # email
                website
                deactivated
                portrait { url }
                portraitSmall { url }
                portraitMini { url }
                genres ( first: 40 ) {
                  edges { node { id, name } }
                }
                artistInfluences ( first: 40 ) {
                  edges {
                    node {
                      id
                      name
                      spotifyId
                      imageUrl
                    }
                  }
                }
                mentees (first: 100) {
                  edges { node { id, handle } }
                }
                mediaLinks (first: 20) { edges { node { url, type } } }
                userAccount { id, handle }
                reviews (first: 100) {
                  edges { node { id, text, rating } }
                }
              }
            }
          }
        }
      `,
    },
  }
)
