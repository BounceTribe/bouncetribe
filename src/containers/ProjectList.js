import React, {Component} from 'react'
import Relay from 'react-relay'
import {View, Button, RoundButton} from 'styled'
import {Header, HeaderOptions, List} from 'styled/list'
import {ProjectItem, Left, Artwork, Info, ProjectTitle, Trio, TrioItem, BigBubble, ButtonRow} from 'styled/ProjectList'
import {IconTextContainer, IconText} from 'styled'
import Music from 'icons/Music'
import Upload from 'icons/Upload'
import Logo from 'icons/Logo'
import {purple, white, grey300} from 'theme'
import {url} from 'config'
import UpdateProject from 'mutations/UpdateProject'
import Headphones from 'icons/Headphones'
import Comment from 'icons/Comment'
import Heart from 'icons/Heart'
import Lock from 'icons/Lock'
import Tribe from 'icons/Tribe'

class ProjectList extends Component {

  setPrivacy = (currentProject, newPrivacy) => {
    let project = { ...currentProject, privacy: newPrivacy }
    this.props.relay.commitUpdate( new UpdateProject({ project }) )
  }

  uniqueCommenters = (comments) => {
    let uniqueAuthors = []
    comments.edges.forEach( (edge) => {
      if (!uniqueAuthors.includes(edge.node.author.id))  {
        uniqueAuthors.push(edge.node.author.id)
      }
    })
    return uniqueAuthors.length
  }


  get projects () {
    let {User: owner, user} = this.props.viewer
    return this.props.viewer.User.projects.edges.map(edge=>{
      let {node:project} = edge
      if (owner.id !== user.id && project.privacy === 'PRIVATE') {
        return null
      } else {
        let comments = project.comments.edges.filter( (edge) => {
          return edge.node.type === 'COMMENT'
        })
        let likes = project.comments.edges.filter( (edge) => {
          return edge.node.type === 'LIKE'
        })
        let artwork = (project.artworkSmall || {}).url || (project.artwork || {}).url
        return (
          <ProjectItem key={project.id} >
            <Left>
              <Artwork
                src={artwork ||  `${url}/artwork.png`}
                alt={'Project Artwork'}
                to={`/${owner.handle}/${project.title}`}
              />
              <Info>
                <ProjectTitle to={`/${owner.handle}/${project.title}`} >
                  {project.title}
                </ProjectTitle>
                <Trio>
                  <TrioItem>
                    <Headphones
                      height={30}
                      width={30}
                      style={{margin: '0 5px 0 0px'}}
                    />
                    {(project.comments.length > 0) ? this.uniqueCommenters(project.comments) : 0}
                  </TrioItem>
                  <TrioItem>
                    <BigBubble secondary >
                      <Comment height={20} width={20} />
                    </BigBubble>
                    {comments.length}
                  </TrioItem>
                  <TrioItem>
                    <BigBubble>
                      <Heart height={20} width={20} />
                    </BigBubble>
                    {likes.length}
                  </TrioItem>
                </Trio>
              </Info>
            </Left>
            <ButtonRow>
              <RoundButton
                tooltip="Private"
                backgroundColor={(project.privacy === 'PRIVATE') ? purple : grey300}
                icon={
                  <Lock
                    fill={white}
                    style={{
                      display: 'inline-block',
                      lineHeight: '60px',
                      height: '60px'
                    }}
                    height={25}
                    width={25}
                  />
                }
                onClick={()=>this.setPrivacy(project,'PRIVATE')}
              />
              <RoundButton
                tooltip="Tribe Only"
                backgroundColor={(project.privacy === 'TRIBE') ? purple : grey300}
                icon={
                  <Tribe
                    fill={white}
                    style={{
                      display: 'inline-block',
                      lineHeight: '60px',
                      height: '60px'
                    }}
                    height={50}
                    width={50}
                  />
                }
                onClick={()=>this.setPrivacy(project, 'TRIBE')}
              />
              <RoundButton
                tooltip="Public"
                backgroundColor={(project.privacy === 'PUBLIC') ? purple : grey300}
                icon={
                  <Logo
                    fill={white}
                    style={{
                      display: 'inline-block',
                      lineHeight: '60px',
                      height: '60px'
                    }}
                  />
                }
                onClick={()=>this.setPrivacy(project, 'PUBLIC')}
              />
            </ButtonRow>
          </ProjectItem>
        )
      }
    })
  }

  render () {
    return (
      <View>
        <Header>
          <IconTextContainer to={`/projects/${this.props.viewer.User.handle}`}>
            <Music
              style={{ display: 'flex', marginBottom: '5px' }}
              fill={purple}
            />
            <IconText>My Projects</IconText>
          </IconTextContainer>
          <HeaderOptions>
            <Button
              to={`/projects/${this.props.viewer.user.handle}/new`}
              icon={<Upload fill={white} />}
              label={'New Project'}
              primary
            />
          </HeaderOptions>
        </Header>
        <List>{this.projects}</List>
      </View>
    )
  }
}

export default Relay.createContainer(
  ProjectList, {
    initialVariables: {
      theirHandle: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
          }
          User (handle: $theirHandle) {
            handle
            id
            email
            projects (first: 20) {
              edges {
                node {
                  id
                  title
                  artwork {url}
                  artworkSmall {url}
                  privacy
                  comments (first: 999){
                    edges {
                      node {
                        author {id}
                        type
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
    }
  }
)
