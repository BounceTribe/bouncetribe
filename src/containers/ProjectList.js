import React, {Component} from 'react'
import Relay from 'react-relay'
import {View, Button} from 'styled'
import {Container, Header, HeaderOptions, Title, List, Item} from 'styled/list'
import Music from 'icons/Music'

class ProjectList extends Component {

  get projects () {
    return this.props.viewer.User.projects.edges.map(edge=>{
      let {node:project} = edge
      return (
        <Item
          key={project.id}
        >
          {project.title}
        </Item>
      )
    })
  }

  render () {
    return (
      <View>
        <Container>
          <Header>
            <Title
              to={`/${this.props.viewer.User.handle}`}
            >
              Projects
            </Title>
            <HeaderOptions>
              <Button
                to={`/${this.props.viewer.user.handle}/projects/new`}
                icon={<Music/>}
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
                }
              }
            }
          }
        }
      `,
    }
  }
)
