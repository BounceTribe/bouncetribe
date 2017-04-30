import React, {Component, PropTypes} from 'react'
import Relay from 'react-relay'
import {View, RoundButton} from 'styled'
import {Top, Art, Info, TitleGenre, Summary, TrackContainer, Title, Genre, Bot,  ProfContainer, ProfTop, Portrait, ProfCol, ProfHandle, Score, MoreInfo, ProfLeft, Divider, CommonInfluences, InfluenceChip} from 'styled/Project'
import {formatEnum} from 'utils/strings'
import Experience from 'icons/Experience'
import Location from 'icons/Location'
import Tribe from 'icons/Tribe'
import Bolt from 'icons/Bolt'
import Music from 'icons/Music'
import {url} from 'config'
import {Tabs, Tab} from 'material-ui/Tabs'
import {purple, grey200, white} from 'theme'
import AudioPlayer from 'components/AudioPlayer'
import {CommentContainer, ButtonRow, ButtonColumn, ButtonLabel, CommentScroller} from 'styled/Comments'
import CommentMarkers from 'components/CommentMarkers'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import SingleComment from 'containers/SingleComment'


class Session extends Component {

  state = {
    duration: 0,
    active: []
  }

  static childContextTypes = {
    duration: PropTypes.number,
    time: PropTypes.number
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

  dropMarker = (type) => {
    let self = this.props.viewer.user
    let otherProject = this.props.viewer.Session.projects.edges.find((edge)=>{
      return edge.node.creator.id !== self.id
    })
    let ownProject = this.props.viewer.Session.projects.edges.find((edge)=>{
      return edge.node.creator.id === self.id
    })
    otherProject = otherProject.node
    ownProject = ownProject.node
    let project = (this.props.router.params.tab === 'theirs') ? otherProject : ownProject
    this.setState((prevState)=> {
      return {
        new: {
          id: 'new',
          type: type,
          text: "",
          author: this.props.viewer.user,
          timestamp: this.state.time,
          project
        }
      }
    })
  }

  render() {
    let self = this.props.viewer.user
    let otherProject = this.props.viewer.Session.projects.edges.find((edge)=>{
      return edge.node.creator.id !== self.id
    })
    let ownProject = this.props.viewer.Session.projects.edges.find((edge)=>{
      return edge.node.creator.id === self.id
    })
    otherProject = otherProject.node
    ownProject = ownProject.node
    let otherUser = otherProject.creator
    let project = (this.props.router.params.tab === 'theirs') ? otherProject : ownProject
    return (
      <View>
        <ProfContainer>

          <ProfTop>
            <ProfLeft>
              <Portrait
                src={(otherUser.portrait) ? otherUser.portrait.url : `${url}/logo.png`}
                to={`/${otherUser.handle}`}
              />
              <ProfCol>
                <ProfHandle
                  to={`/${otherUser.handle}`}
                >
                  {otherUser.handle}
                </ProfHandle>
                <Score>
                  <Bolt
                    style={{
                      marginRight: '5px'
                    }}
                  />
                  {otherUser.score}
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
                  display: (otherUser.placename) ? '': 'none'
                }}
              />
              {otherUser.placename}
              <Experience
                height={18}
                width={18}
                style={{
                  marginLeft: '15px',
                  marginRight: '5px',
                  display: (otherUser.experience) ? '': 'none'
                }}
              />
              {formatEnum(otherUser.experience)}
              <Tribe
                height={15}
                width={15}
                style={{
                  marginLeft: '15px',
                  marginRight: '5px'
                }}
              />
              {otherUser.friends.edges.length}
            </MoreInfo>
          </ProfTop>
          <Divider/>
          <CommonInfluences>
            {otherUser.artistInfluences.edges.map(edge=>{
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
        <Tabs
          style={{
            width: '85%',
            marginTop: '6px',
            marginBottom: '25px',
          }}
          inkBarStyle={{
            backgroundColor: purple
          }}
          value={this.props.router.params.tab}
        >
          <Tab
            label={otherUser.handle}
            value={'theirs'}
            onActive={()=>{
              this.props.router.push(`/${this.props.viewer.user.handle}/session/${this.props.viewer.Session.id}/theirs`)
            }}
            style={{
              borderBottom: `2px solid ${grey200}`
            }}
          />
          <Tab
            label={'MY PROJECT'}
            value={'mine'}
            onActive={()=>{
              this.props.router.push(`/${this.props.viewer.user.handle}/session/${this.props.viewer.Session.id}/mine`)
            }}
            style={{
              borderBottom: `2px solid ${grey200}`
            }}
          />
          <Tab
            label={'Messages'}
            value={'messages'}
            onActive={()=>{
              this.props.router.replace(`/${this.props.viewer.user.handle}/session/${this.props.viewer.Session.id}/messages`)
            }}
            style={{
              borderBottom: `2px solid ${grey200}`
            }}
          />
        </Tabs>
        {(this.props.router.params.tab === 'theirs' || this.props.router.params.tab === 'mine' ) ? (
          <Top>
            <Art
              src={ (project.artwork) ? project.artwork.url : `${url}/artwork.png`}
              alt={'Project Art'}
              onClick={this.openArtworkEditor}
              ownProject={ownProject}
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
          </Top>)
            :
            (
              <div/>
            )
          }
          {(this.props.router.params.tab === 'theirs' || this.props.router.params.tab === 'mine') ? (
            <TrackContainer>
              <AudioPlayer
                track={project.tracks.edges[0].node}
                currentTime={this.currentTime}
                project={project}
                getDuration={this.getDuration}
              />
            </TrackContainer>
          ) : (
            <div/>
          )
          }

        {(this.props.router.params.tab === 'theirs' || this.props.router.params.tab === 'mine') ? (
          <Bot>
            <CommentContainer>
              <CommentMarkers
                comments={project.comments.edges}
                duration={this.state.duration}
              />
              <ButtonRow
                hide={(this.props.router.params.tab === 'mine')}
              >
                <ButtonColumn>
                  <RoundButton
                    big
                    secondary
                    icon={
                      <Comment
                        height={50}
                        width={50}
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
                    big
                    icon={
                      <Heart
                        height={50}
                        width={50}
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
                {(this.state.new) ?
                  <SingleComment
                    index={0}
                    comment={this.state.new}
                    key={0}
                    focus={this.state.focus}
                    active={(this.state.active.includes('new'))}
                    activate={this.activate}
                    deactivate={this.deactivate}
                    userId={this.props.viewer.user.id}
                    tabs={this.state.tabs}
                    commentCreated={()=>{this.setState({new: false})}}
                  /> :
                  null
                }

                {this.comments}

              </CommentScroller>
            </CommentContainer>
          </Bot>
        ) : (
          <div>

          </div>
        )
        }


      </View>
    )
  }
}


export default Relay.createContainer(
  Session, {
    initialVariables: {
      userHandle: '',
      sessionId: '',
      projectFilter: {},
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
          }
          Session (
            id: $sessionId
          ) {
            id
            projects (
              first: 999
            ) {
              edges {
                node {
                  id
                  title
                  description
                  genres (
                    first: 999
                  ) {
                    edges {
                      node {
                        id
                        name
                      }
                    }
                  }
                  tracks (
                    first: 1
                  ){
                    edges {
                      node {
                        id
                        url
                        visualization
                      }
                    }
                  }
                  artwork {
                    url
                  }
                  comments (
                    first: 999
                  ) {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                  creator {
                    id
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
                    handle
                    portrait {
                      url
                    }
                    placename
                    friends (
                      first: 999
                    ) {
                      edges {
                        node {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    }
  }
)
