import React, {Component} from 'react'
import Relay from 'react-relay'
import PropTypes from 'prop-types'
import {View, RoundButton, BtFlatButton} from 'styled'
import {Top, Art, Info, TitleGenre, Summary, TrackContainer, Title, Genre, Bot, LeftList, ProfContainer, ProfTop, Portrait, ProfCol, ProfHandle, Score, MoreInfo, ProfLeft, Divider, CommonInfluences, InfluenceChip} from 'styled/Project'
import {CommentContainer, ButtonRow, ButtonColumn, ButtonLabel, CommentScroller} from 'styled/Comments'
import AudioPlayer from 'components/AudioPlayer'
import Music from 'icons/Music'
import {white, purple, grey300, grey200, grey400} from 'theme'
import {url} from 'config'
import ProjectTribeList from 'components/ProjectTribeList'
import {Tabs, Tab} from 'material-ui/Tabs'
import CommentMarkers from 'components/CommentMarkers'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import SingleComment from 'containers/SingleComment'
import Bolt from 'icons/Bolt'
import Tribe from 'icons/Tribe'
import Bounce from 'icons/Bounce'
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
import DeleteProject from 'mutations/DeleteProject'
import CreateBounce from 'mutations/CreateBounce'
import DeleteBounce from 'mutations/DeleteBounce'
import ImageEditor from 'components/ImageEditor'
import FlatButton from 'material-ui/FlatButton'

class Project extends Component {

  static childContextTypes = {
    duration: PropTypes.number,
    time: PropTypes.number
  }

  constructor(props) {
    super(props)
    this.project = this.props.viewer.allProjects.edges[0].node
    this.user = this.props.viewer.user
    this.User = this.props.viewer.User
    this.isOwner = this.user.id === this.User.id
    let friendIds = this.user.friends.edges.map(edge => edge.node.id)
    this.isFriends = friendIds.includes(this.User.id)

    this.state = {
      title: this.project.title,
      description: this.project.description,
      genre: this.project.genres.edges[0].node.id,
      privacy: this.project.privacy,
      tabs: this.isOwner ?  'view' : 'listen',
      time: 0,
      newIndex: 0,
      markers: [],
      active: [],
      edit: false,
      artworkEditorOpen: false,
      selection: false,
      delete: false,
      bounced: false,
      comments: this.project.comments.edges.map(edge=>edge.node),
      newText: ''
    }
  }

  componentWillMount () {
    let notFriends = !this.isFriends
    if (
      ( !this.isOwner && notFriends && this.project.privacy !== "PUBLIC" ) ||
      ( !this.isOwner && this.project.privacy === "PRIVATE" ) ||
      ( this.project.creator.deactivated )
    ) {
      this.props.router.push(`/`)
    }
  }

  componentDidMount(){
    console.log('project didmount', this.state)
    let user = this.user
    let project = this.project
    let bounces = project.bounces.edges
    // let friendIds = user.friends.edges.map(edge => edge.node.id)
    let bouncedByIds = bounces.map(edge => edge.node.bouncer.id)
    // let projectOwnerId = this.User.id
    this.setState({
      disableComments: !this.isFriends,
      bounced: bouncedByIds.includes(user.id)
    })
    getAllGenres().then(results=>{
      let genres = results.map(genre=>(
        <MenuItem
          primaryText={genre.name}
          value={genre.id}
          key={genre.id} />
      ))
      this.setState({ genres })
    })
  }

  getChildContext() {
    return {
      duration: this.state.duration,
      time: this.state.time
    }
  }

  currentTime = (time) =>  this.setState({ time })
  getDuration = (duration) => this.setState({ duration })
  handleSelection = (selection) => this.setState({selection})

  dropMarker = (type) => {
    this.setState({
        new: {
          id: 'new',
          type: type,
          text: this.state.newText,
          author: this.user,
          timestamp: this.state.time,
          project: this.project
        }
      })
  }

  get comments () {
    console.log('getting');
    return this.filteredComments().map((comment, index)=>{
      return <SingleComment
        index={index + 1}
        comment={comment}
        key={comment.id}
        focus={this.state.focus}
        active={(this.state.active.includes(index+1))}
        deactivate={()=>
          this.setState({active: this.state.active.filter(id=>id!==(index+1))})}
        activate={()=>
          this.setState({active: this.state.active.concat(index+1)})}
        user={this.user}
        tabs={this.state.tabs} />

    })
  }

  filteredComments = () => {
    let comments = this.state.comments
    if (this.state.tabs === 'listen') {
      comments = comments.filter( comment => comment.author.id === this.user.id )
    }
    if (this.state.selection) {
      comments = comments.filter( comment => comment.author.handle===this.state.selection)
    }
    return comments
  }

  titleChange = (title) => {
    this.setState({ title, titleUnique: true })
    this.debounce && clearTimeout(this.debounce)
    this.debounce = setTimeout(()=>{
      ensureUsersProjectTitleUnique(this.user.id, title).then(unique=>{
        this.setState({titleUnique: unique})
      })
    },1000)
  }

  artworkSuccess = (file) => {
    this.setState({artworkEditorOpen: false})
    this.props.relay.commitUpdate(
      new UpdateProject({
        project: this.project,
        artworkId: file.id,
      }), {
        onSuccess: success => console.log('artwork success'),
        failure: failure => console.log('fail', failure)
      }
    )
  }

  openArtworkEditor = () => {
    this.isOwner && this.setState({artworkEditorOpen: true})
  }

  setBounce = () => {
    let project = this.project
    let {id: selfId} = this.user
    let {id: projectId} = project
    if (this.state.bounced) {
      let thisBounce = project.bounces.edges.find(edge =>
        edge.node.bouncer.id===selfId)
        console.log('thisbounce', thisBounce);
      this.props.relay.commitUpdate(
        new DeleteBounce({ id: thisBounce.node.id }), {
          onSuccess: (response) => {
            this.setState({bounced: false})
            console.log('success', response)},
          onFailure: (response) => console.log('falure', response)
        }
      )
    } else {
      this.props.relay.commitUpdate(
        new CreateBounce({
          bouncerId: selfId,
          projectId: projectId,
          type: 'BOUNCE',
          text: ' '
        }), {
          onSuccess: (response) => {
            this.setState({bounced: true})
            console.log('success', response)},
          onFailure: (response) => console.log('falure', response)
        }
      )
    }
  }

  render () {
    console.log('render', this.state);
    let {User, user, allProjects} = this.props.viewer
    let { node: project } = allProjects.edges[0]
    let {ownProject} = this.state
    let myInfluences = user.artistInfluences.edges.map(edge=>edge.node.name)
    return (
      <View>
        <ProfContainer hide={(ownProject)} >
          <ProfTop>
            <ProfLeft>
              <Portrait
                src={(User.portrait || {}).url || `${url}/logo.png`}
                to={`/${User.handle}`} />
              <ProfCol>
                <ProfHandle to={`/${User.handle}`} >
                  {User.handle}
                </ProfHandle>
                <Score>
                  <Bolt style={{ marginRight: '5px' }} />
                  {User.score}
                </Score>
              </ProfCol>
            </ProfLeft>
            <MoreInfo>
              <Location fill={purple} height={20} width={20}
                style={{
                  margin: '0 5px 0 15px',
                  display: (User.placename) ? '': 'none'
                }} />
              {User.placename}
              <Experience height={18} width={18}
                style={{
                  margin: '0 5px 0 15px',
                  display: (User.experience) ? '': 'none'
                }} />
              {formatEnum(User.experience)}
              <Tribe height={15} width={15}
                style={{ margin: '0 5px 0 15px', }} />
              {User.friends.edges.length}
            </MoreInfo>
          </ProfTop>
          <Divider/>
          <CommonInfluences>
            {User.artistInfluences.edges.map(edge=>{
              if (myInfluences.includes(edge.node.name)) {
                return (
                  <InfluenceChip key={edge.node.id} >
                    {edge.node.name}
                  </InfluenceChip>
                )
              } else { return <div key={edge.node.id} /> }
            } )}
          </CommonInfluences>
        </ProfContainer>
        <Top>
          <Art
            src={ (project.artwork) ? project.artwork.url : `${url}/artwork.png`}
            alt={'Project Art'}
            onClick={this.openArtworkEditor}
            ownProject={ownProject} />
          <ImageEditor
            open={this.state.artworkEditorOpen}
            onRequestClose={()=>this.setState({artworkEditorOpen:false})}
            user={user}
            portraitSuccess={this.artworkSuccess} />
          <Info>
            <TitleGenre>
              <Title>{project.title}</Title>
              <Genre>
                <Music fill={white}
                  style={{ marginRight: '5px', height: '18px' }} />
                {project.genres.edges[0].node.name}
              </Genre>
              <Edit fill={purple}
                style={{
                  display: (ownProject) ? '' : 'none',
                  cursor: 'pointer',
                  marginLeft: '15px'
                }}
                onClick={()=>{this.setState({edit:true})}} />
            </TitleGenre>
            <Summary>{project.description}</Summary>
            {this.isOwner &&
              <BtFlatButton
                label={(this.state.bounced) ? 'Bounced' : 'Bounce to Tribe'}
                backgroundColor={(this.state.bounced) ? purple : white}
                labelStyle={{ color: (this.state.bounced) ? white : purple}}
                icon={
                  <Bounce
                    fill={(this.state.bounced) ? white : purple}
                    width={21} />
                }
                onClick={()=>{this.setBounce()}}
                style={{
                  border: `1px solid ${grey400}`,
                  borderRadius: '5px',
                  width: '170px',
                  marginTop: '20px'
                }} />
            }
          </Info>
          <Dialog
            modal={false}
            open={this.state.delete}
            onRequestClose={()=>{this.setState({delete: false})}}
            actions={[
              <FlatButton
                label={"Cancel"}
                onClick={()=>{this.setState({delete: false})}} />,
              <FlatButton
                label={"Delete"}
                labelStyle={{color: '#DF5151'}}
                onClick={
                  ()=>{
                    this.props.relay.commitUpdate(
                      new DeleteProject({id: allProjects.edges[0].node.id}),{
                        onSuccess: ()=>{
                          this.props.router.push(`/projects/${user.handle}`)
                        }
                      }
                    )
                  }
                } />
            ]} >
            Are you sure you want to permanently delete this project?
          </Dialog>
          <Dialog
            open={this.state.edit}
            onRequestClose={()=>{this.setState({edit:false})}}
            autoScrollBodyContent
            title={'Edit Project'}
            actionsContainerStyle={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
            actions={[
              <FlatButton
                label={"Delete Project"}
                labelStyle={{ color: '#DF5151' }}
                onClick={()=>{ this.setState({edit: false, delete: true}) }} />,
              <BtFlatButton
                label={'Save'}
                onClick={()=>{
                  let project = {
                    id: allProjects.edges[0].node.id,
                    privacy: this.state.privacy,
                    title: this.state.title,
                    description: this.state.description,
                  }
                  this.props.relay.commitUpdate(
                    new UpdateProject({ project, genresIds: this.state.genre })
                  )
                  this.setState({edit: false})
                }} />
            ]}>
            <TextField
              floatingLabelText={'Title'}
              name={'title'}
              type={'text'}
              value={this.state.title}
              disabled
              fullWidth />
            <SelectField
              floatingLabelText={'Genre'}
              value={this.state.genre}
              fullWidth
              onChange={(e, index, value)=>{ this.setState({genre:value}) }}
              selectedMenuItemStyle={{ color: purple }} >
              {this.state.genres}
            </SelectField>
            <TextField
              name={'description'}
              floatingLabelText={'Instructions'}
              multiLine
              rows={3}
              value={this.state.description}
              onChange={(e)=>{this.setState({description:e.target.value})}}
              fullWidth />
            <SharingModal>
              <Choice>
                <RoundButton
                  onClick={()=>this.setState({privacy: 'PRIVATE'})}
                  backgroundColor={(this.state.privacy === 'PRIVATE') ? purple : grey300}
                  icon={ <Lock height={23} width={22} fill={white} /> } />
                <ChoiceText>
                  Private
                </ChoiceText>
              </Choice>
              <Choice>
                <RoundButton
                  onClick={()=>this.setState({privacy: 'TRIBE'})}
                  backgroundColor={(this.state.privacy === 'TRIBE') ? purple : grey300}
                  icon={ <Tribe fill={white} /> } />
                <ChoiceText>
                  Tribe Only
                </ChoiceText>
              </Choice>
              <Choice>
                <RoundButton
                  onClick={()=>this.setState({privacy: 'PUBLIC'})}
                  backgroundColor={(this.state.privacy === 'PUBLIC') ? purple : grey300}
                  icon={ <Logo fill={white} /> } />
                <ChoiceText>
                  Public
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
          inkBarStyle={{ backgroundColor: purple }}
          value={this.state.tabs} >
          <Tab
            label={'Listen & Give'}
            value={'listen'}
            onActive={()=>{ this.setState({tabs: 'listen'}) }}
            style={{ borderBottom: `2px solid ${grey200}` }} />
          <Tab
            label={'View Feedback'}
            value={'view'}
            onActive={()=>{ this.setState({tabs: 'view'}) }}
            style={{ borderBottom: `2px solid ${grey200}` }} />
        </Tabs>
        <TrackContainer>
          <AudioPlayer
            track={project.tracks.edges[0].node}
            currentTime={this.currentTime}
            project={project}
            getDuration={this.getDuration} />
        </TrackContainer>

        <Bot>
          <LeftList
            hide={( (this.state.tabs === 'listen') && (!ownProject) ) || (this.state.disableComments)} >
            <ProjectTribeList
              self={user}
              project={project}
              tribe={User.friends.edges}
              recentCommenters={allProjects.edges[0].node.comments.edges}
              router={this.props.router}
              handleSelection={this.handleSelection}
              selection={this.state.selection} />
          </LeftList>
          <CommentContainer>
            <CommentMarkers
              comments={this.filteredComments()}
              duration={this.state.duration} />
            <ButtonRow
              hide={(ownProject || this.state.tabs === 'view' || this.state.disableComments)} >
              <ButtonColumn>
                <RoundButton
                  big
                  secondary
                  icon={<Comment height={50} width={50} />}
                  onTouchTap={()=>{this.dropMarker('COMMENT')}} />
                <ButtonLabel>Idea</ButtonLabel>
              </ButtonColumn>
              <ButtonColumn>
                <RoundButton
                  big
                  icon={ <Heart height={50} width={50} /> }
                  onTouchTap={()=>{this.dropMarker('LIKE')}} />
                <ButtonLabel> Like </ButtonLabel>
              </ButtonColumn>
            </ButtonRow>
            <CommentScroller>
              {(this.state.new) &&
                <SingleComment
                  key={0}
                  index={0}
                  comment={this.state.new}
                  focus={this.state.focus}
                  active={(this.state.active.includes('new'))}
                  activate={()=>
                    this.setState({active: this.state.active.concat('new')})}
                  deactivate={()=>
                    this.setState({active: this.state.active.filter(id=>id!=='new')})}
                  user={user}
                  tabs={this.state.tabs}
                  commentCreated={(newComment)=>{
                    console.log('new state', this.state.new, newComment);
                    this.setState({
                      new: false,
                      comments: this.state.comments.concat(newComment)
                    })
                    console.log('added comment', this.state.comments);

                  }} />
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
    prepareVariables: (urlParams)=>{
      return {
        ...urlParams,
        projectFilter: {
          title: urlParams.projectTitle,
          creator: {
            handle: urlParams.userHandle
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
            lastPing
            portrait {url}
            friends (
              first: 999
              filter: {deactivated: false}
            ) {
              edges {
                node {
                  id
                  handle
                }
              }
            }
            artistInfluences (first: 999) {
              edges {
                node {
                  id
                  name
                }
              }
            }
            upvotes (first: 999) {
              edges {
                node {id}
              }
            }
          }
          User (handle: $userHandle) {
            id
            email
            handle
            lastPing
            placename
            experience
            portrait {url}
            score
            artistInfluences (first: 999) {
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
                  deactivated
                  portrait { url }
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
                bounces (first: 999) {
                  edges {
                    node {
                      id
                      bouncer {
                        id
                        deactivated
                        handle
                      }
                    }
                  }
                }
                creator {
                  handle
                  deactivated
                  id
                }
                genres (first: 3) {
                  edges {
                    node {
                      name
                      id
                    }
                  }
                }
                artwork {url}
                tracks (first: 1) {
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
                      session { id }
                      text
                      createdAt
                      type
                      id
                      author {
                        id
                        handle
                        lastPing
                        deactivated
                        portrait { url }
                      }
                      project { id }
                      timestamp
                      children ( first: 999 ) {
                        edges {
                          node {
                            id
                            text
                            author {
                              id
                              handle
                              lastPing
                              deactivated
                              portrait { url }
                            }
                          }
                        }
                      }
                      upvotes ( first: 999 ) {
                        edges {
                          node { id }
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
// componentWillReceiveProps(nextProps) {
  // let focus
  // let oldCommentIds = this.state.comments.edges.map(edge=>edge.node.id)
  // this.setState(
  //   (prevState)=>{
  //     let active = prevState.active
  //     nextProps.viewer.allProjects.edges[0].node.comments.edges.forEach( (edge, index) => {
  //       if (!oldCommentIds.includes(edge.node.id)) {
  //         active.push(index)
  //         focus= edge.node.id
  //       }
  //     })
  //     return { focus, active }
  //   }
  // )
// }
