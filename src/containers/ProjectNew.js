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

class ProjectNew extends Component {

  state={
    title: ''
  }

  createProject = () => {
    let project = this.state
    this.props.relay.commitUpdate(
      new CreateProject({
        project,
        user: this.props.viewer.user
      })
    )
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
    if (!this.state.track) {
      return (
        <AudioUploader
          audioSuccess={this.audioSuccess}
          self={this.props.viewer.user}
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

  render () {
    return (
      <ProjectNewView>

        {this.uploader}

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
              primary
              label={'Hello'}
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
            ${AudioUploader.getFragment('self')}
            ${ImageUploader.getFragment('self')}
          }
        }
      `,
    }
  }
)
