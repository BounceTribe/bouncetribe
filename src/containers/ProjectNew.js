import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProjectNewView, Button, RoundButton} from 'styled'
import {Row, Left, Right, Sharing, Choice, ChoiceText} from 'styled/ProjectNew'
import AudioUploader from 'components/AudioUploader'
import ImageUploader from 'components/ImageUploader'
import TextField from 'material-ui/TextField'
import CreateProject from 'mutations/CreateProject'
import Music from 'icons/Music'
import AudioPlayer from 'components/AudioPlayer'
import {Spinner} from 'styled/Spinner'

class ProjectNew extends Component {

  state={
    title: ''
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

  audioDropped = ({audioProgress, title}) => {

    if (title) {
      this.setState({
        audioProgress,
        title
      })
    } else {
      this.setState({
        audioProgress
      })
    }
  }

  audioSuccess = (file) => {
    this.setState({
      track: file,
      tracksIds: [file.id]
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
        <Spinner/>
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
            <ImageUploader
              self={this.props.viewer.user}
              fileSuccess={this.imageSuccess}
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


  get message () {
    let {audioProgress} = this.state
    console.log(audioProgress)
    switch (audioProgress) {
      case 'GENERATING': {
        return (
          <span>Generating Waveform</span>
        )
      }
      case 'UPLOADING': {
        return (
          <span>Uploading Audio File</span>
        )
      }
      default: {
        return null
      }
    }

  }

  render () {
    console.log(this.state)
    return (
      <ProjectNewView>

        {this.uploader}

        {this.message}

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
            ${ImageUploader.getFragment('self')}
          }
        }
      `,
    }
  }
)
