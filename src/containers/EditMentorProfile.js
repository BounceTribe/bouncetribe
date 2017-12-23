import React, {Component} from 'react'
import Relay from 'react-relay'
import {handleValidator, isUniqueField} from 'utils/handles'
import UpdateMentor from 'mutations/UpdateMentor'
import CreateMentor from 'mutations/CreateMentor'
import {Dialog, TextField, FlatButton} from 'material-ui/'
import ReactPlayer from 'react-player'
import {mapNodes} from 'utils/mapNodes'
import {Col} from 'styled'

class EditMentorProfile extends Component {
// TODO: look up cascading qualificaitons BtTagList
// TODO: embed preview
  constructor(props) {
    super(props)
    this.user = this.props.viewer.user
    let mentorAccount = this.user.mentorAccount || {}
    this.state = {
      handleError: '',
      summaryError: '',
      mediaUrls: mentorAccount.mediaUrls,
      summary: mentorAccount.summary,
      videoUrl: mentorAccount.videoUrl,
      occupation: mentorAccount.occupation,
      qualifications: mentorAccount.qualifications,
      website: mentorAccount.website,
      id: mentorAccount.id,
      handle: mentorAccount.handle || this.user.handle,
    }
    if (!this.user.mentorAccount) {
      this.becomeMentor()
    }
  }

  handleSet = (val) => {
    let {handle: newHandle, error } = handleValidator(val)
    this.setState({ handle: newHandle, handleError: error })
    if (val!==(this.user.mentorAccount || {}).handle) {
      isUniqueField(val, 'handle', 'Mentor').then( res =>
        isUniqueField(val, 'handle', 'User').then( res2 => {
          let notUnique = !res || !res2
          notUnique && this.setState({handleError: 'handle already in use!'})
        }
      ))
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
          this.setState({id: response.createMentor.mentor.id})
        },
        onFailure: (response) => {
          console.log('CreateMentor error', response)
          debugger
        }
      }
    )
  }

  sendUpdate = () => {
    let mentorId = (this.user.mentorAccount || {}).id
    let updateObj = Object.assign({...this.state}, {mentorId})
    console.log('updating', updateObj);
    Relay.Store.commitUpdate(
      new UpdateMentor(updateObj), {
        onSuccess: (success) =>
          this.props.router.push(`/mentor/${this.state.handle}`),
        onFailure: (failure) => console.log('updatementor fail', failure)
      }
    )
    // for (var i = 0; i < this.state.mediaUrls.length; i++) {
    //   if (this.state.mediaUrls[i].url!==this.oldmediaUrls[i].url)
    //     this.updateMediaLink()
    // }
  }

  textFields = () => {
    let { handle,
          summary,
          videoUrl,
          occupation,
          qualifications,
          // specialties,
          website,
          // deactivated,
          mediaUrls,
          handleError,
          summaryError } = this.state

          console.log('state', this.state);
          qualifications = qualifications || []
    return (
      <Col>
        <TextField
          floatingLabelText={'Handle'}
          errorText={handleError}
          value={handle || ''}
          onChange={(e)=>this.handleSet(e.target.value)}
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
          floatingLabelText={'Qualification 1'}
          value={qualifications[0] || ''}
          onChange={(e)=>{
            let quals = this.state.qualifications.slice()
            quals[0] = e.target.value
            this.setState({qualifications: quals})
          }}
        />
        {/* <TextField
          floatingLabelText={'You Tube URL'}
          value={mediaUrls[0] || ''}
          onChange={(e)=>{
            let newLinks = [...mediaUrls]
            newLinks[0].url = e.target.value
            newLinks[0].type = 'YOU_TUBE'
            this.setState({mediaUrls: e.target.value})
          }}
        /> */}
        <TextField
          floatingLabelText={'Video URL'}
          value={videoUrl || ''}
          onChange={(e)=>this.setState({videoUrl: e.target.value})}
        />
        {videoUrl && <ReactPlayer url={videoUrl} />}
        {/* <TextField
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
        /> */}
      </Col>
    )
  }

  render() {
    let {handleError, summaryError, id} = this.state
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
            disabled={!!handleError || !!summaryError || !id}
            onClick={()=>this.sendUpdate()}
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
              handle
              summary
              videoUrl
              occupation
              qualifications
              specialties
              website
              deactivated
              mentees (first: 100) {
                edges { node { id, handle } }
              }
              mediaUrls
              userAccount { id, handle }
              reviews (first: 100) {
                edges { node { id, text, rating } }
              }
            }
            # experience
            handle
          }
        }
      `,
    },
  }
)
