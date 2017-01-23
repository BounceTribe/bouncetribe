import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProjectNewView, Button, RoundButton} from 'styled'
import {Row, Left, Right, Sharing, Choice} from 'styled/ProjectNew'
import AudioUploader from 'components/AudioUploader'
import ImageUploader from 'components/ImageUploader'
import TextField from 'material-ui/TextField'
import CreateProject from 'mutations/CreateProject'
import Music from 'icons/Music'

class ProjectNew extends Component {

  state={
    title: ''
  }

  createProject = () => {
    let project = this.state
    project.tracksIds = [this.props.router.params.trackId]
    this.props.relay.commitUpdate(
      new CreateProject({
        project,
        user: this.props.viewer.user
      })
    )
  }


  fileSuccess = (fileId) => {
    let {
      push,
      location
    } = this.props.router
    push(`${location.pathname}/${fileId}`)
  }

  get uploader () {
    let {params} = this.props.router
    if (!params.trackId) {
      return (
        <AudioUploader
          fileSuccess={this.fileSuccess}
          self={this.props.viewer.user}
        />
      )
    } else {
      return this.props.children
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
            />
            <Sharing>
              <Choice>
                <RoundButton

                />
                Private
              </Choice>
              <Choice>
                <RoundButton

                />
                Tribe Only
              </Choice>
              <Choice>
                <RoundButton

                />
                Find Sessions
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
