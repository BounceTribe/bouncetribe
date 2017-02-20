import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProjectNewView, Button, RoundButton} from 'styled'
import {Row, Left, Right, Sharing, Choice, ChoiceText} from 'styled/ProjectNew'
import AudioUploader from 'components/AudioUploader'
import TextField from 'material-ui/TextField'
import CreateProject from 'mutations/CreateProject'
import Music from 'icons/Music'
import AudioPlayer from 'components/AudioPlayer'
import {Spinner} from 'styled/Spinner'
import LinearProgress from 'material-ui/LinearProgress'
import ImageEditor from 'components/ImageEditor'

class ProjectNew extends Component {

  state = {
    title: '',
    progress: 0,
    imageEditorOpen: false
  }

  createProject = () => {
    let project = this.state
    let {user} = this.props.viewer
    this.props.relay.commitUpdate(
      new CreateProject({
        project,
        user
      }), {
        onSuccess: success => {
          console.log('success', this.props.router)
          this.props.router.push(`/${user.handle}/${project.title}`)
        }
      }
    )
  }

  audioDropped = ({audioProgress, title, size}) => {

    if (title) {
      this.updateProgress()
      this.setState({
        audioProgress,
        title,
        message: 'Generating Waveform',
        size
      })
    } else {
      this.setState({
        audioProgress,
        message: 'Uploading Audio File'
      })
    }
  }

  updateProgress = () => {

    this.timer = setInterval( ()=>{
      this.setState( (prevState, props) => {
        let {progress, audioProgress} = prevState
        if (audioProgress === 'GENERATING' && progress >= 40) {
          progress = 40
        } else if (audioProgress === 'UPLOADING' && progress <= 40) {
          progress += 3
        } else if (audioProgress === 'UPLOADING' && progress >= 90) {
          progress = 90
        } else if (audioProgress === 'COMPLETE') {
          progress = 100
        } else {
          progress ++
        }
        return {
          progress
        }
      })
    }, 500)
  }

  clearTimer = () => {
    clearInterval(this.timer)
  }

  audioSuccess = (file) => {
    console.log('audioSuccess')
    this.clearTimer()
    this.setState({
      track: file,
      tracksIds: [file.id],
      message: false,
      audioProgress: false
    })
  }

  imageSuccess = (file) => {
    this.setState({
      artworkId: file.id
    })
  }

  get uploader () {
    let {track, audioProgress} = this.state
    if (!track && audioProgress && audioProgress !== 'COMPLETE' ) {
      return (
        <Spinner
          style={{height: '200px'}}
        />
      )
    } else if (!this.state.track) {
      return (
        <AudioUploader
          audioSuccess={this.audioSuccess}
          self={this.props.viewer.user}
          audioDropped={this.audioDropped}
        />
      )
    } else {
      return (
        <AudioPlayer
          track={this.state.track}
        />
      )
    }
  }

   get form () {
    let {titleValid, description, tracksIds, artworkId, audioProgress} = this.state
    if (audioProgress  && audioProgress !== 'GENERATING') {
      return (
        <Row>
          <Left>
            <TextField
              floatingLabelText={'Title'}
              name={'title'}
              type={'text'}
              value={this.state.title}
              onChange={(e)=>{this.setState({title:e.target.value})}}
              fullWidth={true}
            />
            <TextField
              name={'description'}
              floatingLabelText={'Description'}
              multiLine={true}
              rows={3}
              value={this.state.description}
              onChange={(e)=>{this.setState({description:e.target.value})}}
              fullWidth={true}

            />
            <Button
              primary={true}
              disabled={(!titleValid || !description || !tracksIds || !artworkId)}
              label={'Create'}
              onClick={this.createProject}
              icon={<Music/>}
            />
          </Left>
          <Right>
            <div
              style={{backgroundColor: 'salmon', height: '100px', width: '100px'}}
              onClick={()=>this.setState({imageEditorOpen: true})}
            />
            <ImageEditor
              open={this.state.imageEditorOpen}
              onRequestClose={()=>this.setState({imageEditorOpen:false})}
              user={this.props.viewer.user}
              portraitSuccess={this.portraitSuccess}
            />
            <Sharing>
              <Choice>
                <RoundButton

                />
                  <ChoiceText>
                    Private
                  </ChoiceText>
              </Choice>
              <Choice>
                <RoundButton

                />
                <ChoiceText>
                  Tribe Only
                </ChoiceText>
              </Choice>
              <Choice>
                <RoundButton

                />
                <ChoiceText>
                  Find Sessions
                </ChoiceText>
              </Choice>
            </Sharing>
          </Right>
        </Row>
      )
    }
  }

  render () {
    let {audioProgress, progress} = this.state
    return (
      <ProjectNewView>

        {this.uploader}

        <LinearProgress
          mode={'determinate'}
          value={progress}
          style={{
            display: (!audioProgress || audioProgress === 'COMPLETE') ? 'none' : ''
          }}
        />

        {this.form}

      </ProjectNewView>
    )
  }
}


export default Relay.createContainer(
  ProjectNew, {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
            ${AudioUploader.getFragment('self')}
          }
        }
      `,
    }
  }
)
