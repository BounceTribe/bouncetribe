import React, {Component} from 'react'
import Relay from 'react-relay'
import {View} from 'styled'
import {Top, Art, Info, TitleGenre, Summary, TrackContainer} from 'styled/Project'
import AudioPlayer from 'components/AudioPlayer'
import Comments from 'containers/Comments'
import CommentMarkers from 'components/CommentMarkers'

class Project extends Component {

  state = {
    time: 0
  }

  componentWillMount () {
    this.props.relay.setVariables({
      projectId: this.props.viewer.allProjects.edges[0].node.id
    })
  }

  currentTime = (time) => {
    this.setState({
      time
    })
  }

  getDuration = (duration) => {
    this.setState({
      duration
    })
  }

  render () {
    let {
      node: project
    } = this.props.viewer.allProjects.edges[0]
    return (
      <View>
        <Top>
          <Art
            src={project.artwork.url}
            alt={'Project Art'}
          />
          <Info>
            <TitleGenre>
              {project.title}
            </TitleGenre>
            <Summary>
              {project.description}
            </Summary>
          </Info>
        </Top>
        <TrackContainer>
          <AudioPlayer
            track={project.tracks.edges[0].node}
            currentTime={this.currentTime}
            project={project}
            getDuration={this.getDuration}
          />
          <CommentMarkers
            project={project}
            duration={this.state.duration}
          />
        </TrackContainer>
        <Comments
          project={project}
          self={this.props.viewer.user}
          time={this.state.time}
        />
      </View>
    )
  }
}

export default Relay.createContainer(
  Project, {
    initialVariables: {
      userHandle: '',
      projectTitle: '',
      projectFilter: {},
      projectId: ''
    },
    prepareVariables: (prevVar)=>{
      return {
        ...prevVar,
        projectFilter: {
          title: prevVar.projectTitle,
          creator: {
            handle: prevVar.userHandle
          }
        }
      }
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            ${Comments.getFragment('self')}
          }
          User (handle: $userHandle) {
            id
            email
          }
          allProjects (
            first: 1
            filter: $projectFilter
          ) {
            edges {
              node {
                ${Comments.getFragment('project')}
                id
                title
                description
                privacy
                creator
                genre
                artwork {
                  url
                }
                new
                tracks (
                  first: 1
                ) {
                  edges {
                    node {
                      id
                      url
                      visualization
                    }
                  }
                }
                comments (
                  first: 1000
                ) {
                  edges {
                    node {
                      id
                      text
                      timestamp
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
