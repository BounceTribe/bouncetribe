import React, {Component, PropTypes} from 'react'
import Relay from 'react-relay'
import {View, RoundButton, BtFlatButton} from 'styled'
import {Top, Art, Info, TitleGenre, Summary, TrackContainer, Title, Genre, Bot, LeftList, ProfContainer, ProfTop, Portrait, ProfCol, ProfHandle, Score, MoreInfo, ProfLeft, Divider, CommonInfluences, InfluenceChip} from 'styled/Project'
import {CommentContainer, ButtonRow, ButtonColumn, ButtonLabel, CommentScroller} from 'styled/Comments'
import AudioPlayer from 'components/AudioPlayer'
import Music from 'icons/Music'
import {white, purple, grey300, grey200} from 'theme'
import {url} from 'config'
import ProjectTribeList from 'components/ProjectTribeList'
import {Tabs, Tab} from 'material-ui/Tabs'
import CommentMarkers from 'components/CommentMarkers'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import SingleComment from 'containers/SingleComment'
import Bolt from 'icons/Bolt'
import Tribe from 'icons/Tribe'
import Location from 'icons/Location'
import Lock from 'icons/Lock'
import Logo from 'icons/Logo'
import {formatEnum} from 'utils/strings'
import Experience from 'icons/Experience'
import Edit from 'icons/Edit'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {ensureUsersProjectTitleUnique, getAllGenres } from 'utils/graphql'
import {SharingModal, Choice, ChoiceText} from 'styled/ProjectNew'
import UpdateProject from 'mutations/UpdateProject'
class Project extends Component {

  state = {
    time: 0,
    tabs: 'view',
    markers: [],
    active: [],
    edit: false
  }

  static childContextTypes = {
    duration: PropTypes.number,
    time: PropTypes.number
  }

  constructor(props) {
    super(props)
    getAllGenres().then(results=>{
      let genres = results.map(genre=>(
        <MenuItem
          primaryText={genre.name}
          value={genre.id}
          key={genre.id}
        />
      ))
      this.setState({
        genres
      })
    })
  }

  componentWillMount () {
    if (this.props.viewer.user.id === this.props.viewer.User.id) {
      this.setState({
        ownProject:true,
        title: this.props.viewer.allProjects.edges[0].node.title,
        description: this.props.viewer.allProjects.edges[0].node.description,
        genre: this.props.viewer.allProjects.edges[0].node.genres.edges[0].node.id,
        privacy: this.props.viewer.allProjects.edges[0].node.privacy
      })
    } else {
      this.setState({ownProject:false})
    }
    // this.setState({markers: this.props.viewer.allProjects.edges[0].node.comments.edges})
  }

  componentWillReceiveProps(nextProps) {
    // let focus
    // let oldComments = this.props.viewer.allProjects.edges[0].node.comments.edges.map(edge=>edge.node.id)
    // this.setState(
    //   (prevState)=>{
    //     let active = prevState.active
    //     nextProps.viewer.allProjects.edges[0].node.comments.edges.forEach( (edge, index) => {
    //       if (!oldComments.includes(edge.node.id)) {
    //         active.push(index)
    //         focus= edge.node.id
    //       }
    //     })
    //     return {
    //       focus,
    //       active
    //     }
    //   }
    // )
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
    this.setState((prevState)=> {
      // let {edges} = this.props.viewer.allProjects.edges[0].node.comments
      // edges.push({node:{
      //   id: 'newText',
      //   timestamp: this.state.time,
      //   author: {
      //     id: this.props.viewer.user.id
      //   },
      //   project: {
      //     id: this.props.viewer.allProjects.edges[0].node.id
      //   },
      //   text: "",
      //   type
      // }})
      return {
        // markers: edges,
        new: {
          id: 'new',
          type: type,
          text: "",
          author: this.props.viewer.user,
          timestamp: this.state.time,
          project: this.props.viewer.allProjects.edges[0].node
        }
      }
    })
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
          index={index + 1}
          comment={comment}
          key={comment.id}
          focus={this.state.focus}
          active={(this.state.active.includes(index+1))}
          activate={this.activate}
          deactivate={this.deactivate}
          userId={this.props.viewer.user.id}
          tabs={this.state.tabs}
        />
      )
    })
  }

  titleChange = (title) => {
    this.setState({
      title,
      titleUnique: true
    })
    if (this.debounce) {
      clearTimeout(this.debounce)

    }
    this.debounce = setTimeout(()=>{
      ensureUsersProjectTitleUnique(this.props.viewer.user.id, title).then(unique=>{
        this.setState({titleUnique: unique})
      })
    },1000)
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
                to={`/${this.props.viewer.User.handle}`}
              />
              <ProfCol>
                <ProfHandle
                  to={`/${this.props.viewer.User.handle}`}
                >
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
              {formatEnum(this.props.viewer.User.experience)}
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
              <Edit
                fill={purple}
                style={{
                  display: (ownProject) ? '' : 'none',
                  cursor: 'pointer',
                  marginLeft: '15px'
                }}
                onClick={()=>{
                  console.log("hello" )
                  this.setState({edit:true})
                }}
              />
            </TitleGenre>
            <Summary

            >
              {project.description}
            </Summary>
          </Info>

          <Dialog
            open={this.state.edit}
            onRequestClose={()=>{this.setState({edit:false})}}
            title={'Edit Project'}
            actions={<BtFlatButton
              label={'Save'}
              onClick={()=>{
                let project = {
                  id: this.props.viewer.allProjects.edges[0].node.id,
                  privacy: this.state.privacy,
                  title: this.state.title,
                  description: this.state.description,
                }
                this.props.relay.commitUpdate(
                  new UpdateProject({
                    project,
                    genresIds: this.state.genre
                  })
                )
                this.setState({edit: false})
              }}
            />}
          >
            <TextField
              floatingLabelText={'Title'}
              name={'title'}
              type={'text'}
              value={this.state.title}
              disabled
              fullWidth={true}

            />
            <SelectField
              floatingLabelText={'Genre'}
              value={this.state.genre}
              fullWidth={true}
              onChange={(e, index, value)=>{
                this.setState({genre:value})
              }}
              selectedMenuItemStyle={{
                color: purple
              }}
            >
              {this.state.genres}
            </SelectField>
            <TextField
              name={'description'}
              floatingLabelText={'Instructions'}
              multiLine={true}
              rows={3}
              value={this.state.description}
              onChange={(e)=>{this.setState({description:e.target.value})}}
              fullWidth={true}

            />
            <SharingModal>
              <Choice>
                <RoundButton
                  onClick={()=>this.setState({privacy: 'PRIVATE'})}
                  backgroundColor={(this.state.privacy === 'PRIVATE') ? purple : grey300}
                  icon={
                    <Lock
                      style={{}}
                      height={23}
                      width={22}
                      fill={white}
                    />
                  }
                />
                  <ChoiceText>
                    Private
                  </ChoiceText>
              </Choice>
              <Choice>
                <RoundButton
                  onClick={()=>this.setState({privacy: 'TRIBE'})}
                  backgroundColor={(this.state.privacy === 'TRIBE') ? purple : grey300}
                  icon={
                    <Tribe
                      fill={white}
                    />
                  }
                />
                <ChoiceText>
                  Tribe Only
                </ChoiceText>
              </Choice>
              <Choice>
                <RoundButton
                  onClick={()=>this.setState({privacy: 'PUBLIC'})}
                  backgroundColor={(this.state.privacy === 'PUBLIC') ? purple : grey300}
                  icon={
                    <Logo
                      fill={white}
                    />
                  }
                />
                <ChoiceText>
                  Find Sessions
                </ChoiceText>
              </Choice>
            </SharingModal>

          </Dialog>
        </Top>
        <Tabs
          style={{
            width: '85%',
            marginTop: '6px',
            display: (ownProject) ? 'none' : '',
            marginBottom: '25px',
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
            style={{
              borderBottom: `2px solid ${grey200}`
            }}
          />
          <Tab
            label={'View Feedback'}
            value={'view'}
            onActive={()=>{
              this.setState({tabs: 'view'})
            }}
            style={{
              borderBottom: `2px solid ${grey200}`
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
              comments={(this.state.new) ? this.props.viewer.allProjects.edges[0].node.comments.edges.concat({node:this.state.new}) : this.props.viewer.allProjects.edges[0].node.comments.edges}
              duration={this.state.duration}
            />
            <ButtonRow
              hide={(ownProject || this.state.tabs === 'view')}
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
                      id
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
              }
            }
          }
        }
      `,
    }
  }
)
