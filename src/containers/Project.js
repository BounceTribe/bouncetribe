import React, {Component, PropTypes} from 'react'
import Relay from 'react-relay'
import {View} from 'styled'
import {Top, Art, Info, TitleGenre, Summary, TrackContainer, Title, Genre, Bot, LeftList, CommentContainer} from 'styled/Project'
import AudioPlayer from 'components/AudioPlayer'
import Music from 'icons/Music'
import {white, purple} from 'theme'
import {url} from 'config'
import ProjectTribeList from 'components/ProjectTribeList'
import {Tabs, Tab} from 'material-ui/Tabs'

class Project extends Component {

  state = {
    time: 0,
    tabs: 'listen'
  }

  static childContextTypes = {
    duration: PropTypes.number,
    time: PropTypes.number
  }

  componentWillMount () {
    if (this.props.viewer.user.id === this.props.viewer.User.id) {
      this.setState({ownProject:true})
    } else {
      this.setState({ownProject:false})
    }
    if (this.props.router.params.handle) {
      this.setState({tabs: 'listen'})
    } else {
      this.setState({tabs: 'view'})
    }
  }

  getChildContext() {
    return {
      duration: this.state.duration,
      time: this.state.time
    }
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
    let {ownProject} = this.state
    return (
      <View>
        <Top>
          <Art
            src={ (project.artwork) ? project.artwork.url : `${url}/artwork.png`}
            alt={'Project Art'}
          />
          <Info>
            <TitleGenre>
              <Title>
                {project.title}
              </Title>
              <Genre>
                <Music
                  fill={white}
                  style={{
                    marginRight: '5px',
                    height: '18px'
                  }}
                />
                {project.genres.edges[0].node.name}
              </Genre>
            </TitleGenre>
            <Summary>
              {project.description}
            </Summary>
          </Info>
        </Top>
        <Tabs
          style={{
            width: '85%',
            marginTop: '6px',
            display: (ownProject) ? 'none' : '',
            marginBottom: '25px'
          }}
          inkBarStyle={{
            backgroundColor: purple
          }}
          value={this.state.tabs}
        >
          <Tab
            label={'Listen & Give'}
            value={'listen'}
            onActive={()=>{
              this.setState({tabs: 'listen'})
              this.props.router.replace({
                pathname: `/${this.props.viewer.User.handle}/${project.title}/${this.props.viewer.user.handle}`
              })
            }}
          />
          <Tab
            label={'View Feedback'}
            value={'view'}
            onActive={()=>{
              this.setState({tabs: 'view'})
              this.props.router.replace({
                pathname: `/${this.props.viewer.User.handle}/${project.title}/view/`
              })
            }}
          />
        </Tabs>
        <TrackContainer>
          <AudioPlayer
            track={project.tracks.edges[0].node}
            currentTime={this.currentTime}
            project={project}
            getDuration={this.getDuration}
          />
        </TrackContainer>

        <Bot>
          <LeftList
            hide={( (this.state.tabs === 'listen') && (!ownProject) )}
          >
            <ProjectTribeList
              project={project}
              tribe={this.props.viewer.User.friends.edges}
              recentCommenters={this.props.viewer.allProjects.edges[0].node.comments.edges}
              router={this.props.router}
            />
          </LeftList>
          <CommentContainer>
            {this.props.children}
          </CommentContainer>
        </Bot>

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
            handle
          }
          User (handle: $userHandle) {
            id
            email
            handle
            friends (
              first: 999
              orderBy: handle_ASC
            ) {
              edges {
                node {
                  id
                  handle
                  portrait {
                    url
                  }
                }
              }
            }
          }
          allProjects (
            first: 1
            filter: $projectFilter
          ) {
            edges {
              node {
                id
                title
                description
                privacy
                creator {
                  handle
                }
                genres (
                  first: 3
                ) {
                  edges {
                    node {
                      name
                    }
                  }
                }
                artwork {
                  url
                }
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
                  first: 999
                  orderBy: timestamp_ASC
                ) {
                  edges {
                    node {
                      id
                      author {
                        id
                        handle
                        portrait {
                          url
                        }
                      }
                      project {
                        id
                      }
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
