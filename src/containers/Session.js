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
import {Appreciate, AppreciateText, MessageContainer, Messages, MessageText, SenderHandle, MessagePortrait, MessageNamePortraitRow, MessageDivider} from 'styled/Sessions'
import AddToAppreciatedFeedback from 'mutations/AddToAppreciatedFeedback'
import TextField from 'material-ui/TextField'
import CreateMessage from 'mutations/CreateMessage'
import {SubscriptionClient} from 'subscriptions-transport-ws'


class Session extends Component {

  constructor(props) {
    super(props)
    this.feedSub = new SubscriptionClient(
      'wss://subscriptions.graph.cool/v1/bt-api',
      {
        reconnect: true,
      }
    )

    this.feedSub.subscribe(
      {
        query: `subscription createMessage {
          Message (
            filter: {
              mutation_in: [CREATED]
              node: {
                sessionParent: {
                  id: "${this.props.viewer.Session.id}"
                }
              }
            }
          ) {
            node {
              sender {
                id
                handle
                portrait {
                  url
                }
              }
              text
              id
            }
          }
        }`
      },
      (error, result) => {
        if (result) {
          let newMessage = result.Message
          this.setState( (prevState) => {
            let {messages} = prevState
            messages.push(newMessage)
            return {
              messages
            }
          })
        }
      }
    )
  }

  state = {
    duration: 0,
    active: [],
    messages: []
  }

  static childContextTypes = {
    duration: PropTypes.number,
    time: PropTypes.number
  }


  componentWillMount() {
    let {edges: messages} = this.props.viewer.Session.messages
    this.setState({
      messages
    })
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

  commonInfluences = () => {
    let self = this.props.viewer.user
    let ownInfluences = self.artistInfluences.edges
    let otherProject = this.props.viewer.Session.projects.edges.find((edge)=>{
      return edge.node.creator.id !== self.id
    })
    let otherInfluences = otherProject.node.creator.artistInfluences.edges
    let commonInfluences = []
    otherInfluences.forEach( (otherInfluence) => {
      let match = ownInfluences.find((ownInfluence) => {
        return ownInfluence.node.id === otherInfluence.node.id
      })
      if (match) {
        commonInfluences.push(match)
      }
    })


    return commonInfluences.map((edge)=> (
      <InfluenceChip
        key={edge.node.id}
      >
        {edge.node.name}
      </InfluenceChip>
    ))
  }

  activate = (index) => {
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

  get comments() {
    let self = this.props.viewer.user
    let otherProject = this.props.viewer.Session.projects.edges.find((edge)=>{
      return edge.node.creator.id !== self.id
    })
    let ownProject = this.props.viewer.Session.projects.edges.find((edge)=>{
      return edge.node.creator.id === self.id
    })
    otherProject = otherProject.node
    ownProject = ownProject.node
    let {tab} = this.props.router.params
    let otherUser = otherProject.creator

    let project = (tab === 'theirs') ? otherProject : ownProject
    let comments = []
    project.comments.edges.forEach((edge, index) => {
      if (tab === 'theirs' && edge.node.author.id !== self.id) {
      } else if (tab === 'mine' && edge.node.author.id !== otherUser.id ) {
      } else {
        comments.push(edge)
      }

    })
    return comments
  }

  getDuration = (duration) => {
    this.setState({
      duration
    })
  }

  includeNew = () => {
     let comments = this.comments
     if (this.state.new) {
       comments = comments.concat({node: this.state.new})
     }
     return comments
  }

  componentDidMount(){
    window.scrollTo(0, document.body.scrollHeight)
  }

  messages = () => {
    let messages = []
    this.state.messages.forEach( (message, index) =>{
      if (index === 0) {
        messages.push(
          <MessageNamePortraitRow
            key={`portrait${message.node.id}`}
          >
            <MessagePortrait
              src={message.node.sender.portrait.url}
            />
            <SenderHandle
              key={`handle${message.node.id}`}

            >
              {message.node.sender.handle}
            </SenderHandle>
          </MessageNamePortraitRow>
        )
      } else if (message.node.sender.id !== this.state.messages[index - 1].node.sender.id) {
        messages.push(<MessageDivider/>)
        messages.push(
          <MessageNamePortraitRow
            key={`portrait${message.node.id}`}
          >
            <MessagePortrait
              src={message.node.sender.portrait.url}
            />
            <SenderHandle
              key={`handle${message.node.id}`}

            >
              {message.node.sender.handle}
            </SenderHandle>
          </MessageNamePortraitRow>

        )
      }
      messages.push(
        <MessageText
          key={`text${message.node.id}`}
        >
          {message.node.text}
        </MessageText>
      )

    })

    return (
      <Messages
        id={'messages'}
      >
        {messages}

      </Messages>
    )

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
    let appreciated = this.props.viewer.Session.appreciatedFeedback.edges.find((edge) => {
      return edge.node.id === this.props.viewer.user.id
    })
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
            {this.commonInfluences()}
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
          {(this.props.router.params.tab === 'theirs') ? (
            <TrackContainer>
              <AudioPlayer
                track={otherProject.tracks.edges[0].node}
                currentTime={this.currentTime}
                project={otherProject}
                getDuration={this.getDuration}
              />
            </TrackContainer>
            ) : (
              <div/>
            )
          }

          {(this.props.router.params.tab === 'mine') ? (
            <TrackContainer>
              <AudioPlayer
                track={ownProject.tracks.edges[0].node}
                currentTime={this.currentTime}
                project={ownProject}
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
                comments={this.includeNew()}
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
              <ButtonRow
                hide={(this.props.router.params.tab === 'theirs')}
              >
                <ButtonColumn>
                  <Appreciate
                    appreciated={appreciated}
                    onClick={()=>{
                      if (!appreciated) {
                        this.props.relay.commitUpdate(
                          new AddToAppreciatedFeedback({
                            appreciatedFeedbackUserId: this.props.viewer.user.id,
                            appreciatedFeedbackSessionId: this.props.viewer.Session.id

                          })
                        )
                      }

                    }}
                  >
                    <Bolt
                      style={{
                        height: '50px',
                        width: '50px'
                      }}
                      fill={white}
                    />
                  </Appreciate>
                  <AppreciateText
                    appreciated={appreciated}
                  >
                    {(appreciated) ? "Appreciated!" : 'Appreciate Feedback'}
                  </AppreciateText>
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
                    tabs={'view'}
                    commentCreated={()=>{this.setState({new: false})}}
                  /> :
                  null
                }

                {this.comments.map((edge, index) => {
                  let {node: comment} = edge
                  return (
                    <SingleComment
                      index={index + 1}
                      comment={comment}
                      key={comment.id}
                      focus={this.state.focus}
                      active={(this.state.active.includes(index+1))}
                      activate={this.activate}
                      deactivate={this.deactivate}
                      userId={this.props.viewer.user.id}
                      tabs={this.state.tabs}
                      session
                    />
                  )
                }
                )}

              </CommentScroller>
            </CommentContainer>


          </Bot>
        ) : (
          <MessageContainer>
            {this.messages()}
            <TextField
              multiLine
              name="message"
              style={{
                width: '95%',
                margin: '15px 0'
              }}
              hintText={"Your message..."}
              value={this.state.message}
              onChange={(e)=>{
                this.setState({message: e.target.value})
              }}
              onKeyDown={(e)=>{
                if (e.keyCode === 13) {
                  this.props.relay.commitUpdate(
                    new CreateMessage({
                      text: this.state.message,
                      senderId: this.props.viewer.user.id,
                      recipientId: otherUser.id,
                      sessionParentId: this.props.viewer.Session.id
                    }), {
                      onSuccess: (success) => {
                        this.setState({message: ''})
                      }
                    }
                  )
                }
              }}
            />
          </MessageContainer>
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
          }
          Session (
            id: $sessionId
          ) {
            id
            messages (
              first: 999
              orderBy: createdAt_ASC
            ) {
              edges {
                node {
                  id
                  text
                  sender {
                    id
                    handle
                    portrait {
                      url
                    }
                  }
                }
              }
            }
            appreciatedFeedback (
              first: 2
            ) {
              edges {
                node {
                  id
                }
              }
            }
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
                              author {
                                handle
                                portrait {
                                  url
                                }
                              }
                            }
                          }
                        }
                        upvotes (
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
