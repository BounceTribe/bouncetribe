import React, {Component} from 'react'
import Relay from 'react-relay'
import {View, Button, RoundButton} from 'styled'
import {Container, Header, HeaderOptions, List} from 'styled/list'
import {ProjectItem, Left, Artwork, Info, ProjectTitle, Trio, TrioItem} from 'styled/ProjectList'
import {IconTextContainer, IconText} from 'styled'
import Music from 'icons/Music'
import Upload from 'icons/Upload'
import Logo from 'icons/Logo'
import {purple, white} from 'theme'

class ProjectList extends Component {

  get projects () {
    let {User: owner} = this.props.viewer
    return this.props.viewer.User.projects.edges.map(edge=>{
      let {node:project} = edge
      return (
        <ProjectItem
          key={project.id}
        >
          <Left>
            <Artwork
              src={project.artwork.url}
              alt={'Project Artwork'}
            />
            <Info>
              <ProjectTitle
                to={`/${owner.handle}/${project.title}`}
              >
                {project.title}
              </ProjectTitle>
              <Trio>
                <TrioItem>
                  One
                </TrioItem>
                <TrioItem>
                  Two
                </TrioItem>
                <TrioItem>
                  Three
                </TrioItem>
              </Trio>
            </Info>

          </Left>
          <RoundButton
            icon={
              <Logo
                fill={white}
                style={{
                  display: 'inline-block',
                  lineHeight: '56px',
                  height: '56px'
                }}
              />
            }
          />
        </ProjectItem>
      )
    })
  }

  render () {
    return (
      <View>
        <Container>
          <Header>

              <IconTextContainer
                to={`/${this.props.viewer.User.handle}`}
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
                label={'Create'}
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
                }
              }
            }
          }
        }
      `,
    }
  }
)
