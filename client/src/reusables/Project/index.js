import React, { Component } from 'react'
import styled from 'styled-components'
// import UpdateProjectMutation from 'mutations/UpdateProjectMutation'
// import UploadLight from 'imgs/icons/UploadLight'
// import BTButton from 'reusables/BTButton'
// import notes from 'imgs/icons/notes'
import {btDark} from 'styling/T'
// import UploadArtwork from 'imgs/icons/UploadArtwork'
// import PrivateButton from 'imgs/icons/PrivateButton'
// import TribeOnlyButton from 'imgs/icons/TribeOnlyButton'
// import FindSessionsButton from 'imgs/icons/FindSessionsButton'
// import Dropzone from 'react-dropzone'
// import request from 'superagent'
// import TextField from 'material-ui/TextField'

const ProjectTop = styled.div`
  display: flex;
  margin: auto;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  width: 80%;
  flex-direction: row;
`
const ProjectTextColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 30px;
`

const ProjectArt = styled.img`
  display: flex;
  height: 200px;
  width: 200px;
`

const ProjectTitle = styled.h2`
  color: ${btDark};
  font-size: 1.2em;
  margin-bottom: 20px;
`

const Description = styled.p`
  font-size: .8em;
`

class Project extends Component {


  render() {
    return (
      <div>

        <ProjectTop>
          <ProjectArt
            src={(this.props.project.artwork) ? this.props.project.artwork.url : 'https://files.graph.cool/ciwdr6snu36fj01710o4ssheb/cixc6xvf91rmu0147xkmfqpin' }
          />

          <ProjectTextColumn>
            <ProjectTitle>
              {this.props.project.title}
            </ProjectTitle>

            <Description>
              {this.props.project.description}
            </Description>

          </ProjectTextColumn>

        </ProjectTop>

      </div>
    )
  }
}

export default Project
