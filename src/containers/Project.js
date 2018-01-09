import React, {Component} from 'react'
import Relay from 'react-relay/classic'
import PropTypes from 'prop-types'
import {View, RoundButton, BtFlatButton, ContentPad} from 'styled'
import {Top, Art, Info, GenreBounce, Summary, TrackContainer, Title, Privacy, Bot, LeftList, ProfContainer, ProfTop, Portrait, ProfCol, ProfHandle, Score, MoreInfo, ProfLeft, Divider, CommonInfluences, InfluenceChip} from 'styled/Project'
import {CommentContainer, ButtonRow, ButtonColumn, ButtonLabel, CommentScroller} from 'styled/Comments'
import AudioPlayer from 'components/AudioPlayer'
import Music from 'icons/Music'
import {white, purple, grey200, grey400} from 'theme'
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
import {formatEnum} from 'utils/strings'
import Experience from 'icons/Experience'
import Edit from 'icons/Edit'
import Dialog from 'material-ui/Dialog'
import UpdateProject from 'mutations/UpdateProject'
import DeleteProject from 'mutations/DeleteProject'
import CreateBounce from 'mutations/CreateBounce'
import DeleteBounce from 'mutations/DeleteBounce'
import ImageEditor from 'components/ImageEditor'
import FlatButton from 'material-ui/FlatButton'
import EditProject from 'components/EditProject'


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
      tabs: this.isOwner ?  'view' : 'listen',
      time: 0,
      jumpToTime: 0,
      active: [],
      edit: false,
      artworkEditorOpen: false,
      selection: false,
      delete: false,
      bounced: false,
      artworkUrl: (this.project.artwork || {}).url,
      artworkSmallUrl: (this.project.artworkSmall || {}).url,
      comments: this.project.comments.edges.map(edge=>edge.node),
      newText: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('newprops')
    let focus
    let oldCommentIds = this.state.comments.map(comment=>comment.id)
    this.setState(prevState=>{
        let active = prevState.active
        nextProps.viewer.allProjects.edges[0].node.comments.edges.forEach( (edge, index) => {
          if (!oldCommentIds.includes(edge.node.id)) {
            active.push(index)
            focus= edge.node.id
          }
        })
        return { focus, active }
      }
    )
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
    console.log('project didmount', this)
    let user = this.user
    let project = this.project
    let bounces = project.bounces.edges
    let bouncedByIds = bounces.map(edge => edge.node.bouncer.id)
    this.setState({
      disableComments: (!this.isFriends && this.project.privacy!=='PUBLIC'),
      bounced: bouncedByIds.includes(user.id)
    })
  }

  getChildContext() {
    return {
      duration: this.state.duration,
      time: this.state.time
    }
  }

  setCurrentTime = time =>  this.setState({ time })
  getDuration = duration => this.setState({ duration })
  handleSelection = selection => this.setState({selection})

  dropMarker = (type) => {
    this.setState({
      active: this.state.active.concat('new'),
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

  jumpToTime = (time) => {
    document.getElementsByTagName('canvas')[0]
      .scrollIntoView({behavior:'smooth'})
      if (this.state.jumpToTime===time) {
        this.setState({jumpToTime: time + 0.0001})
      } else {
        this.setState({jumpToTime: time})
      }
  }

  get comments () {
    return this.filteredComments().map((comment, index)=>{
      return <SingleComment
        jumpToTime={(time)=>this.jumpToTime(time)}
        index={index + 1}
        comment={comment}
        key={comment.id}
        focus={this.state.focus}
        activeIds={this.state.active}
        deactivate={(cmtId)=>
          this.setState({active: this.state.active.filter(id=>id!==cmtId)})}
        activate={(cmtId)=>
          this.setState({active: this.state.active.concat(cmtId)})}
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

  artworkSuccess = (files) => {
    this.setState({
      artworkEditorOpen: false,
      artworkUrl: (files[0] || {}).url || this.state.artworkUrl,
      artworkSmallUrl: (files[1] || {}).url || this.state.artworkSmallUrl
    })
    let updateObj = {
      project: this.project,
      artworkId: files[0].id,
      artworkSmallId: files[1].id
    }
    console.log('updating project', {files}, updateObj);

    this.props.relay.commitUpdate(
      new UpdateProject(updateObj), {
        onSuccess: success => console.log('artwork success', success),
        failure: failure => console.log('fail', failure)
      }
    )
  }

  setBounce = () => {
    let project = this.props.viewer.allProjects.edges[0].node
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
          text: ''
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
    let {User, user, isOwner} = this
    let project = this.props.viewer.allProjects.edges[0].node
    let myInfluences = user.artistInfluences.edges.map(edge=>edge.node.name)
    let artwork = this.state.artworkSmallUrl || this.state.artworkUrl ||  (isOwner && `${url}/uploadartwork.png`)

    return (
      <View>
        <Edit fill={purple}
          style={{
            display: (isOwner) ? '' : 'none',
            cursor: 'pointer',
            padding: '20px 20px 0 0',
            position: 'absolute',
            alignSelf: 'flex-end',
          }}
          onClick={()=>this.setState({edit:true})} />
        <ContentPad width={80}>
          {!isOwner && <ProfContainer>
            <ProfTop>
              <ProfLeft>
                <Portrait
                  src={(User.portrait || {}).url || `${url}/logo.png`}
                  to={`/${User.handle}/`} />
                <ProfCol>
                  <ProfHandle to={`/${User.handle}/`} >
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
          </ProfContainer>}
          <Top isOwner={isOwner}>
            <Art
              src={ artwork || `${url}/artwork.png`}
              alt={'Project Art'}
              onClick={()=>this.setState({artworkEditorOpen: true})}
              isOwner={isOwner} />
            <ImageEditor
              altSizes={[500]}
              open={this.state.artworkEditorOpen}
              onRequestClose={()=>this.setState({artworkEditorOpen:false})}
              user={user}
              portraitSuccess={this.artworkSuccess} />
            <Info>
              <Privacy>{project.privacy}</Privacy>
              <Title>{project.title}</Title>
              <GenreBounce>
                <BtFlatButton
                  disabled
                  label={project.genres.edges[0].node.name}
                  backgroundColor={purple}
                  labelStyle={{color: white}}
                  icon={<Music fill={white} style={{height: '18px'}} />}
                  style={{marginRight: '10px'}} />
                {!isOwner &&
                  <BtFlatButton
                    label={this.state.bounced ? 'Bounced' : 'Bounce to Tribe'}
                    backgroundColor={this.state.bounced ? purple : white}
                    labelStyle={{ color: this.state.bounced ? white : purple}}
                    icon={
                      <Bounce fill={this.state.bounced ? white : purple}
                        width={21} />
                    }
                    onClick={()=>{this.setBounce()}}
                    style={{border: `1px solid ${grey400}`, width: '170px',}} />
                }
              </GenreBounce>
              <Summary>{project.description}</Summary>
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
                  onClick={()=>{
                    this.props.relay.commitUpdate(
                      new DeleteProject({id: project.id}),{
                        onSuccess: ()=>{
                          this.props.router.push(`/projects/${user.handle}/`)
                        }
                      }
                    )
                  }}
                />
              ]} >
              Are you sure you want to permanently delete this project?
            </Dialog>
            {this.state.edit && <EditProject
              project={project}
              projectId={project.id}
              delete={()=>this.setState({edit: false, delete: true})}
              onSave={()=>this.setState({edit: false})}
              onClose={()=>this.setState({edit: false})}
            />}
          </Top>
          <Tabs
            style={{
              width: '100%',
              display: (isOwner) ? 'none' : '',
              margin: '6px 0 25px 0',
            }}
            inkBarStyle={{ backgroundColor: purple }}
            value={this.state.tabs} >
            <Tab
              label={'Give Your Feedback'}
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
              setCurrentTime={this.setCurrentTime}
              jumpToTime={this.state.jumpToTime}
              project={project}
              getDuration={this.getDuration} />
          </TrackContainer>

          <Bot>
            <LeftList
              hide={( (this.state.tabs === 'listen') && !isOwner ) || (this.state.disableComments)} >
              <ProjectTribeList
                self={user}
                project={project}
                tribe={User.friends.edges}
                recentCommenters={project.comments.edges}
                router={this.props.router}
                handleSelection={this.handleSelection}
                selection={this.state.selection} />
            </LeftList>
            <CommentContainer listenTab={this.state.tabs==='listen'}>
              <CommentMarkers
                comments={this.filteredComments()}
                duration={this.state.duration} />
              <ButtonRow
                hide={(isOwner || this.state.tabs === 'view' || this.state.disableComments)} >
                <ButtonColumn>
                  <RoundButton big secondary
                    icon={<Comment height={50} width={50} />}
                    onTouchTap={()=>{this.dropMarker('COMMENT')}} />
                  <ButtonLabel>Idea</ButtonLabel>
                </ButtonColumn>
                <ButtonColumn>
                  <RoundButton big
                    icon={ <Heart height={50} width={50} /> }
                    onTouchTap={()=>{this.dropMarker('LIKE')}} />
                  <ButtonLabel>Like</ButtonLabel>
                </ButtonColumn>
              </ButtonRow>
              <CommentScroller>
                {this.state.new &&
                  <SingleComment
                    jumpToTime={(time)=>this.jumpToTime(time)}
                    key={0}
                    index={0}
                    comment={this.state.new}
                    focus={this.state.focus}
                    activeIds={(this.state.active)}
                    activate={(id)=>
                      this.setState({active: this.state.active.concat('new')})}
                    deactivate={(id)=>
                      this.setState({active: this.state.active.filter(id=>id!=='new')})}
                    user={user}
                    tabs={this.state.tabs}
                    commentCreated={(newComment)=>{
                      console.log('new state', this.state.new, newComment);
                      let newSorted = this.state.comments.concat(newComment)
                        .sort((a,b)=>(a.timestamp-b.timestamp))
                      this.setState({
                        new: false,
                        comments: newSorted,
                        focus: newComment.id
                       })
                      console.log('added comment', this.state.comments)
                    }} />
                }
                {this.comments}
              </CommentScroller>
            </CommentContainer>
          </Bot>
        </ContentPad>
      </View>
    )
  }
}

export default Relay.createContainer(
  Project, {
    initialVariables: {
      theirHandle: '',
      projectTitle: '',
      projectFilter: {},
    },
    prepareVariables: (urlParams)=>{
      return {
        ...urlParams,
        projectFilter: {
          title: urlParams.projectTitle,
          creator: {
            handle: urlParams.theirHandle
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
            portraitMini {url}
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
          User (handle: $theirHandle) {
            id
            email
            handle
            lastPing
            placename
            experience
            portraitMini {url}
            portraitSmall {url}
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
                artworkSmall {url}
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
                      text
                      createdAt
                      type
                      id
                      author {
                        id
                        handle
                        lastPing
                        deactivated
                        portraitMini { url }
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
                              portraitMini { url }
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
