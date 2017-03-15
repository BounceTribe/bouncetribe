import React, {Component} from 'react'
import Relay from 'react-relay'
import {View, Button, RoundButton} from 'styled'
import {Container, Header, HeaderOptions, List} from 'styled/list'
import {ProjectItem, Left, Artwork, Info, ProjectTitle, Trio, TrioItem} from 'styled/ProjectList'
import {IconTextContainer, IconText} from 'styled'
import Music from 'icons/Music'
import Upload from 'icons/Upload'
import Logo from 'icons/Logo'
import {purple, white, grey400} from 'theme'
import {url} from 'config'
import UpdateProject from 'mutations/UpdateProject'
import Headphones from 'icons/Headphones'
import Comment from 'icons/Comment'
import Heart from 'icons/Heart'

class ProjectList extends Component {

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
        return (
          <ProjectItem
            key={project.id}
          >
            <Left>
              <Artwork
                src={(project.artwork) ? project.artwork.url : `${url}/artwork.png`}
                alt={'Project Artwork'}
                to={`/${owner.handle}/${project.title}`}
              />
              <Info>
                <ProjectTitle
                  to={`/${owner.handle}/${project.title}`}
                >
                  {project.title}
                </ProjectTitle>
                <Trio>
                  <TrioItem>
                    <Headphones
                      height={30}
                      width={30}
                      style={{
                        margin: '0 5px 0 0px'
                      }}
                    />
                    {12}
                  </TrioItem>
                  <TrioItem>
                    <Comment
                      height={30}
                      width={30}
                      style={{
                        margin: '0 5px 0 0px'
                      }}
                    />
                    {comments.length}
                  </TrioItem>
                  <TrioItem>
                    <Heart
                      height={30}
                      width={30}
                      style={{
                        margin: '0 5px 0 0px'
                      }}
                    />
                    {likes.length}
                  </TrioItem>
                </Trio>
              </Info>

            </Left>
            <RoundButton
              backgroundColor={(project.privacy === 'PUBLIC') ? purple : grey400}
              title={(project.privacy === 'PUBLIC') ? 'Set privacy to Tribe-Only' : 'Start looking for sessions!'}
              icon={
                <Logo
                  fill={white}
                  style={{
                    display: 'inline-block',
                    lineHeight: '75px',
                    height: '75px'
                  }}

                />
              }
              onClick={()=>{
                project = {
                  ...project,
                  privacy: (project.privacy !== 'PUBLIC') ? 'PUBLIC' : 'TRIBE'
                }
                this.props.relay.commitUpdate(
                  new UpdateProject({
                    project
                  })
                )
              }}
            />
          </ProjectItem>
        )
      }
    })
  }

  render () {
    return (
      <View>
        <Container>
          <Header>

              <IconTextContainer
                to={`/${this.props.viewer.User.handle}/projects`}
              >
                <Music
                  style={{
                    display: 'flex',
                    marginBottom: '5px'
                  }}
                  fill={purple}
                />
                <IconText>
                  My Projects
                </IconText>
              </IconTextContainer>
            <HeaderOptions>
              <Button
                to={`/${this.props.viewer.user.handle}/projects/new`}
                icon={
                  <Upload
                    fill={white}
                  />
                }
                label={'New Project'}
                primary
              />

            </HeaderOptions>
          </Header>
          <List>
            {this.projects}
          </List>
        </Container>
      </View>
    )
  }
}

export default Relay.createContainer(
  ProjectList, {
    initialVariables: {
      userHandle: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
          }
          User (handle: $userHandle) {
            handle
            id
            email
            projects (first: 20) {
              edges {
                node {
                  id
                  title
                  artwork {
                    url
                  }
                  privacy
                  comments (
                    first: 10000
                  ){
                    edges {
                      node {
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
