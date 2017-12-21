import React, {Component} from 'react'
import Relay from 'react-relay'
import {handleValidator, isUniqueField} from 'utils/handles'
import UpdateMentor from 'mutations/UpdateMentor'
import CreateMentor from 'mutations/CreateMentor'
import {Dialog, TextField, FlatButton} from 'material-ui/'


class EditMentorProfile extends Component {

  constructor(props) {
    super(props)
    console.log('emf', props);
    this.user = this.props.viewer.user
    if (this.user.mentorAccount) {
      console.log('has account');
      this.state = Object.assign( {...this.user.mentorAccount}, {
        handleError: '',
        emailError: '',
        summaryError: '',
        id: this.user.mentorAccount.id,
      })
    } else {
      console.log('no account');
      this.state = Object.assign( {...this.user}, {
        handleError: '',
        emailError: '',
        summaryError: '',
        qualifications: ['','','','',''],
      })
    }
  }

  handleSet = (val) => {
    let {handle: newHandle, error} = handleValidator(val)
    this.setState({ handle: newHandle, handleError: error })
    if (val!==(this.user.mentorAccount || {}).handle) {
      isUniqueField(val, 'handle', 'Mentor').then( result =>
        !result && this.setState({handleError: 'handle already in use!'})
      )
    }
  }

  emailSet = (val) => {
    let error = ''
    this.setState({ email: val,  emailError: error })
    if (val!==(this.user.mentorAccount || {}).email) {
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

  setProfile = (user) => {
    let mentorId = (this.user.mentorAccount || {}).id
    let updateObj = Object.assign({...this.state}, {...user}, {mentorId})
    console.log('updating', updateObj);

    Relay.Store.commitUpdate(
      new UpdateMentor(updateObj), {
        onSuccess: (success) =>
          this.props.router.push(`/mentor/${this.state.handle}`),
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
          videoUrl,
          occupation,
          qualifications,
          // specialties,
          website,
          // deactivated,
          handleError,
          emailError,
          summaryError} = this.state
          console.log('state', this.state);
          qualifications = qualifications || []
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <TextField
          floatingLabelText={'Handle'}
          errorText={handleError}
          value={handle || ''}
          onChange={(e)=>this.handleSet(e.target.value)}
        /><br />
        <TextField
          floatingLabelText={'Location'}
          value={placename || ''}
          onChange={(e)=>this.setState({placename: e.target.value})}
        /><br />
        <TextField
          floatingLabelText={'Summary'}
          errorText={summaryError}
          value={summary || ''}
          onChange={(e)=>this.summarySet(e.target.value)}
          multiLine
          rowsMax={5}
          fullWidth
        /><br />
        <TextField
          floatingLabelText={'Email'}
          errorText={emailError}
          value={email || ''}
          onChange={(e)=>this.emailSet(e.target.value)}
        /><br />
        <TextField
          floatingLabelText={'Website'}
          value={website || ''}
          onChange={(e)=>this.setState({website: e.target.value})}
        />
        <TextField
          floatingLabelText={'Current Occupation'}
          value={occupation || ''}
          onChange={(e)=>this.setState({occupation: e.target.value})}
        />
        <TextField
          floatingLabelText={'Video URL'}
          value={videoUrl || ''}
          onChange={(e)=>this.setState({videoUrl: e.target.value})}
        />
        <TextField
          floatingLabelText={'Qualification 1'}
          value={qualifications[0] || ''}
          onChange={(e)=>{
            let quals = this.state.qualifications.slice()
            quals[0] = e.target.value
            this.setState({qualifications: quals})
          }}
        />
        <TextField
          floatingLabelText={'Qualification 2'}
          value={qualifications[1] || ''}
          onChange={(e)=>{
            let quals = this.state.qualifications.slice()
            quals[1] = e.target.value
            this.setState({qualifications: quals})
          }}
        />
        <TextField
          floatingLabelText={'Qualification 3'}
          value={qualifications[2] || ''}
          onChange={(e)=>{
            let quals = this.state.qualifications.slice()
            quals[2] = e.target.value
            this.setState({qualifications: quals})
          }}
        />
        <TextField
          floatingLabelText={'Qualification 4'}
          value={qualifications[3] || ''}
          onChange={(e)=>{
            let quals = this.state.qualifications.slice()
            quals[3] = e.target.value
            this.setState({qualifications: quals})
          }}
        />
        <TextField
          floatingLabelText={'Qualification 5'}
          value={qualifications[4] || ''}
          onChange={(e)=>{
            let quals = this.state.qualifications.slice()
            quals[4] = e.target.value
            this.setState({qualifications: quals})
          }}
        />
        <FlatButton label="Migrate info from user account"
          onClick={()=>this.setProfile(this.props.viewer.user)} />
      </div>
    )
  }

  render() {
    let {handleError, emailError, summaryError, id} = this.state
    console.log({...this.state});
    return (
      <Dialog
        title={"Mentor Profile"}
        modal
        autoScrollBodyContent
        open
        bodyStyle={{minHeight: '60vh'}}
        titleStyle={{ fontSize: '28px' }}
        actions={[
          <FlatButton label="Cancel" onClick={()=>          this.props.router.push(`/mentor/${this.state.handle}`)
          } />,
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
  initialVariables: { userHandle: '', mentorFilter: {} },
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
            mentorAccount {
              id
              email
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
              email
              website
              deactivated
              portrait { id, url }
              portraitSmall { id, url }
              portraitMini { id, url }
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
              mediaLinks (first: 20) { edges { node { id, url, type } } }
              userAccount { id, handle }
              reviews (first: 100) {
                edges { node { id, text, rating } }
              }
            }
            # experience
            lastPing
            email
            handle
            summary
            website
            placename
            score
            portrait { id, url }
            portraitSmall { id, url }
            portraitMini { id, url }
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
        }
      `,
    },
  }
)
