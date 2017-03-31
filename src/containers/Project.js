import React, {Component, PropTypes} from 'react'
import Relay from 'react-relay'
import {View, RoundButton} from 'styled'
import {Top, Art, Info, TitleGenre, Summary, TrackContainer, Title, Genre, Bot, LeftList, ProfContainer, ProfTop, Portrait, ProfCol, ProfHandle, Score, MoreInfo, ProfLeft, Divider, CommonInfluences, InfluenceChip} from 'styled/Project'
import {CommentContainer, ButtonRow, ButtonColumn, ButtonLabel, CommentScroller} from 'styled/Comments'
import AudioPlayer from 'components/AudioPlayer'
import Music from 'icons/Music'
import {white, purple} from 'theme'
import {url} from 'config'
import ProjectTribeList from 'components/ProjectTribeList'
import {Tabs, Tab} from 'material-ui/Tabs'
import CommentMarkers from 'components/CommentMarkers'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import SingleComment from 'containers/SingleComment'
import CreateComment from 'mutations/CreateComment'
import Bolt from 'icons/Bolt'
import Tribe from 'icons/Tribe'
import Location from 'icons/Location'
import Experience from 'icons/Experience'

class Project extends Component {

  state = {
    time: 0,
    tabs: 'listen',
    comments: [],
    active: []
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
  }

  componentWillReceiveProps(nextProps) {
    let focus
    let oldComments = this.props.viewer.allProjects.edges[0].node.comments.edges.map(edge=>edge.node.id)
    this.setState(
      (prevState)=>{
        let active = prevState.active
        nextProps.viewer.allProjects.edges[0].node.comments.edges.forEach( (edge, index) => {
          if (!oldComments.includes(edge.node.id)) {
            active.push(index)
            focus= edge.node.id
          }
        })
        return {
          focus,
          active
        }
      }
    )
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

  dropMarker = (type) => {
    this.props.relay.commitUpdate(
      new CreateComment({
        authorId: this.props.viewer.user.id,
        project: this.props.viewer.allProjects.edges[0].node,
        type,
        timestamp: this.state.time,
        text: ''
      }), {
        onSuccess: success => {
          console.log("success", success )
        },
        onFailure: failure => failure
      }
    )
  }

  activate = (index) => {
    console.log("activate", index )
    this.setState( (prevState) => {
      let {active} = prevState
      active.push(index)
      return {
        active
      }
    })
  }

  deactivate = (index) => {
    this.setState( (prevState) => {
      let {active} = prevState
      active.splice(active.indexOf(index),1)
      return {
        active
      }
    })
  }

  get comments () {
    return this.props.viewer.allProjects.edges[0].node.comments.edges.map((edge, index)=>{
      let {node: comment} = edge
      return (
        <SingleComment
          index={index}
          comment={comment}
          key={comment.id}
          focus={this.state.focus}
          active={(this.state.active.includes(index))}
          activate={this.activate}
          deactivate={this.deactivate}
          userId={this.props.viewer.user.id}
          tabs={this.state.tabs}
        />
      )
    })
  }

  render () {
    let {
      node: project
    } = this.props.viewer.allProjects.edges[0]
    let {ownProject} = this.state
    return (
      <View>
        <ProfContainer
          hide={(ownProject)}
        >

          <ProfTop>
            <ProfLeft>
              <Portrait
                src={this.props.viewer.User.portrait.url}
              />
              <ProfCol>
                <ProfHandle>
                  {this.props.viewer.User.handle}
                </ProfHandle>
                <Score>
                  <Bolt
                    style={{
                      marginRight: '5px'
                    }}
                  />
                  {this.props.viewer.User.score}
                </Score>
              </ProfCol>
            </ProfLeft>
            <MoreInfo>
              <Location
                fill={purple}
                height={20}
                width={20}
                style={{
                  marginLeft: '15px',
                  marginRight: '5px',
                  display: (this.props.viewer.User.placename) ? '': 'none'
                }}
              />
              {this.props.viewer.User.placename}
              <Experience
                height={18}
                width={18}
                style={{
                  marginLeft: '15px',
                  marginRight: '5px',
                  display: (this.props.viewer.User.experience) ? '': 'none'
                }}
              />
              {this.props.viewer.User.experience}
              <Tribe
                height={15}
                width={15}
                style={{
                  marginLeft: '15px',
                  marginRight: '5px'
                }}
              />
              {this.props.viewer.User.friends.edges.length}
            </MoreInfo>
          </ProfTop>
          <Divider/>
          <CommonInfluences>
            {this.props.viewer.User.artistInfluences.edges.map(edge=>{
              return (
                <InfluenceChip
                  key={edge.node.id}
                >
                  {edge.node.name}
                </InfluenceChip>
              )}
            )}
          </CommonInfluences>
        </ProfContainer>
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
            }}
          />
          <Tab
            label={'View Feedback'}
            value={'view'}
            onActive={()=>{
              this.setState({tabs: 'view'})
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
            <CommentMarkers
              comments={this.props.viewer.allProjects.edges[0].node.comments.edges}
              duration={this.state.duration}
            />
            <ButtonRow
              hide={(ownProject || this.state.tabs === 'view')}
            >
              <ButtonColumn>
                <RoundButton
                  secondary
                  icon={
                    <Comment
                      height={40}
                      width={40}
                    />
                  }
                  onTouchTap={()=>{this.dropMarker('COMMENT')}}
                />
                <ButtonLabel>
                  Idea
                </ButtonLabel>
              </ButtonColumn>
              <ButtonColumn>
                <RoundButton
                  icon={
                    <Heart
                      height={40}
                      width={40}
                    />
                  }
                  onTouchTap={()=>{this.dropMarker('LIKE')}}
                />
                <ButtonLabel>
                  Like
                </ButtonLabel>
              </ButtonColumn>
            </ButtonRow>
            <CommentScroller>
              {this.comments}

            </CommentScroller>
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
            placename
            experience
            portrait {
              url
            }
            score
            artistInfluences (
              first: 999
            ) {
              edges {
                node {
                  id
                  name
                }
              }
            }
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
                      text
                      type
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
                      children (
                        first: 999
                      ) {
                        edges {
                          node {
                            id
                            text
                          }
                        }
                      }
                      upvotes
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
