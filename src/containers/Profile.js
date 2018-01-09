     import React, {Component} from 'react'
import Relay from 'react-relay/classic'
import {ProfileView, Top, Row, Left, Right, TopCol, Handle, Location, ScoreRow, Score, Divider, Summary, BotRow, BotRight, Label,  SubRow, Experience, ExperienceRow, EmailWebsite, MissingUserData, SiteLink} from 'styled/Profile'
import PinIcon from 'icons/Location'
import Bolt from 'icons/Bolt'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import LinkIcon from 'icons/Link'
import Edit from 'icons/Edit'
import Online from 'icons/Online'
import ExperienceIcon from 'icons/Experience'
import ImageEditor from 'components/ImageEditor'
import EditMusicianInfo from 'components/EditMusicianInfo'
import EditProfile from 'components/EditProfile'
import UpdateUser from 'mutations/UpdateUser'
import 'react-select/dist/react-select.css'
import 'theme/newSelect.css'
import {purple} from 'theme'
import RemoveFromFriends from 'mutations/RemoveFromFriends'
import CreateFriendRequest from 'mutations/CreateFriendRequest'
import {formatEnum} from 'utils/strings'
import Snackbar from 'material-ui/Snackbar'
import {BtAvatar, BtTagList} from 'styled'
import {Panel} from 'components/Panel'
import {url} from 'config'
import {TribeButton} from 'components/TribeButton'
import {acceptFriendRequest} from 'utils/updateCommits'
import {isOnline} from 'utils/isOnline'
import {mapUserInfo} from 'utils/mapUserInfo'



class Profile extends Component {

  constructor(props) {
    super(props)
    let {User} = this.props.viewer
    console.log('profile user', User);
    let mappedInfo = mapUserInfo(props.viewer.User)

    this.state = {
      handle: User.handle || '',
      placename: User.placename || '',
      summary: User.summary || '',
      portraitUrl: (User.portrait || {}).url || `${url}/logo.png`,
      portraitSmallUrl: (User.portraitSmall || {}).url || `${url}/logo.png`,
      website: User.website || '',
      email: User.email || '',
      experience: User.experience || '',
      score: User.score || 0,
      genres: mappedInfo.genres,
      skills: mappedInfo.skills,
      influences: mappedInfo.influences,
      projects: User.projects.count,
      friends: User.friends.count,
      imageEditorOpen: false,
      tab: 'activity',
      notification: false,
      btnStatus: '',
      editProfile: false,
      editMusicianInfo: false,
    }
  }
  componentWillMount = () => {
    let {theirHandle} = this.props.router.params
    if (this.props.location.pathname!==(
      `/${theirHandle}/activity/1/` ||
      `/${theirHandle}/projects/1/` ||
      `/${theirHandle}/bounces/1/` )) {
      this.props.router.replace(`/${theirHandle}/activity/1/`)
    }
    console.log('profile mount props', this.props);
  }

  componentWillReceiveProps (newProps) {
    let {portrait, projects, friends} = newProps.viewer.User
    let mappedInfo = mapUserInfo(newProps.viewer.User)
    this.setState(
      Object.assign(this.state, mappedInfo, {
        portraitUrl: (portrait || {}).url || `${url}/logo.png`,
        projects: projects.count,
        friends: friends.count,
    }))
  }

  accept = (requestId) => acceptFriendRequest({
    requestId,
    newFriendId: this.props.viewer.User.id,
    props: this.props,
    successCB: (response)=>this.setState({btnStatus: 'ACCEPTED'}),
    failureCB: (response)=>console.log('failure from Profile', response),
  })

  addToTribe = () => {
    console.log('CFQ Profile')
    let {id: actorId} = this.props.viewer.user
    let {id: recipientId} = this.props.viewer.User
    this.props.relay.commitUpdate(
      new CreateFriendRequest({ actorId, recipientId, }), {
        onSuccess: res => this.setState({
          btnStatus: 'SENT',
          notification: 'TRIBE REQUEST SENT'
        })
      }
    )
  }

  unfriend = () => {
    let {id: selfId} = this.props.viewer.user
    let {id: exfriendId} = this.props.viewer.User
    this.props.relay.commitUpdate(
      new RemoveFromFriends({ selfId, exfriendId }), {
        onSuccess: this.setState({
          btnStatus: 'REMOVED',
          notification: 'REMOVED FROM TRIBE'
        })
      }
    )
  }

  portraitSuccess = (files) => {
    this.setState({imageEditorOpen: false})

    console.log('files', files);
    let updateObj = {
      userId: this.props.viewer.user.id,
      portraitId: files[0].id,
      portraitSmallId: files[1].id,
      portraitMiniId: files[2].id
    }
    console.log('portrait updating', this.state);
    this.props.relay.commitUpdate(
      new UpdateUser(updateObj), {
        onSuccess: success => console.log('portrait success', success),
        failure: failure => console.log('portrait fail', failure)
      }
    )
  }

  setTab = (tab) => {
    this.props.router.replace(`/${this.props.router.params.theirHandle}/${tab}/1/`)
    this.setState({ tab })
  }

  musicianInfoSave = () => {
    this.setState({ notification: 'INFO UPDATED', editMusicianInfo: false })
  }

  profileSave = () => {
    this.setState({ notification: 'PROFILE UPDATED', editProfile: false })
  }

  topRow = () => {
    let { imageEditorOpen, projects, friends, score } = this.state
    let {User, user} = this.props.viewer
    let ownProfile = (User.id === user.id)
    return (
    <Top>
      {this.state.editProfile && <EditProfile
        open={true}
        user={this.state}
        userId={User.id}
        onSave={()=>this.profileSave()}
        onClose={()=>this.setState({editProfile: false})}
      />}
      <Edit
        onClick={()=>this.setState({editProfile: true})}
        fill={purple}
        style={{
          alignSelf: 'flex-end',
          padding: '20px 20px 0 0',
          display: (ownProfile) ? '' : 'none',
          cursor: 'pointer',
          position: 'absolute'
        }}
      />
      <Row>
        <SubRow>
          <BtAvatar size={150} hideStatus user={User} pointer={ownProfile}
            onClick={()=>ownProfile && this.setState({imageEditorOpen: true})}
          />
          {imageEditorOpen && <ImageEditor
            altSizes={[300, 120]}
            open
            onRequestClose={()=>this.setState({imageEditorOpen:false})}
            user={user}
            portraitSuccess={this.portraitSuccess}
          />}
          <TopCol>
            <Handle>
              {User.handle}
              {!ownProfile && isOnline(User) && <Online size={20} online />}
            </Handle>
            <Location>
              {(User.placename || ownProfile) &&
                <PinIcon style={{marginRight: '8px'}} />}
              {User.placename}
              <MissingUserData hide={User.placename || !ownProfile}
                onClick={()=>{this.setState({editProfile: true})}}>
                Add your location
              </MissingUserData>
            </Location>
            <ScoreRow>
              <Bolt/> <Score>{score}</Score>
              <Music height={20}/> <Score>{projects}</Score>
              <Tribe height={20}/> <Score>{friends}</Score>
            </ScoreRow>
          </TopCol>
        </SubRow>
        <TribeButton
          viewer={this.props.viewer}
          accept={(id)=>this.accept(id)}
          addToTribe={this.addToTribe}
          unfriend={this.unfriend}
          btnStatus={this.state.btnStatus}
        />
      </Row>
      {(User.summary || User.email || User.website || ownProfile) && <Divider/>}
      <Row>
        <Left>
          <EmailWebsite>
            {(User.website || ownProfile) &&
              <LinkIcon style={{marginRight: '10px'}}/>}
            <SiteLink href={((User.website || '').substr(0,4)==='http') ? User.website : 'http://' + User.website} target="_blank">{User.website}</SiteLink>
            <MissingUserData hide={User.website || !ownProfile}
              onClick={()=>{this.setState({editProfile: true})}}>
              Add your website
            </MissingUserData>
          </EmailWebsite>
          <Summary>
            {User.summary}
            <MissingUserData hide={User.summary || !ownProfile}
              onClick={()=>{this.setState({editProfile: true})}}>
              Add your summary
            </MissingUserData>
          </Summary>
        </Left>
        <Right>
          {/* <EmailWebsite>
            <Email style={{marginRight: '10px'}} />
            {User.email}
            <MissingUserData hide={User.email || !ownProfile}
              onClick={()=>{this.setState({editProfile: true})}}>
              Add your email
            </MissingUserData>
          </EmailWebsite> */}
        </Right>
      </Row>
    </Top>)
  }

  render () {
    let {genres, skills, influences, experience, notification} = this.state
    let {User, user} = this.props.viewer
    let ownProfile = (User.id === user.id)
    return (
      <ProfileView>
        <Snackbar
          open={!!notification} //requires boolean input
          message={notification}
          autoHideDuration={2000}
          onRequestClose={()=>this.setState({notification: false})}
          onActionTouchTap={()=>this.setState({notification: false})}
          bodyStyle={{ backgroundColor: purple }}
        />
        {this.topRow()}
        <BotRow>
          <Panel
            tab={this.state.tab}
            topBar={null}
            tabChange={tab=>this.setTab(tab)}
            labels={['activity', 'projects', 'bounces']}
            locks={[false, false, false]}
            values={[0,0,0]}
            content={this.props.children}
          />
          <BotRight>
            {this.state.editMusicianInfo && <EditMusicianInfo
              experience={experience}
              genres={genres}
              skills={skills}
              influences={influences}
              open={true}
              user={User}
              onSave={()=>this.musicianInfoSave()}
              onClose={()=>this.setState({editMusicianInfo: false})}
            />}
            {ownProfile && <Edit
              onClick={()=>{this.setState({editMusicianInfo: true})}}
              fill={purple}
              style={{
                alignSelf: 'flex-end',
                padding: '8px 0 0 0',
                cursor: 'pointer',
                position: 'absolute'
              }}
            />}
            <Label hide={(!ownProfile && !experience.length)} >
              Experience
            </Label>
            <ExperienceRow hide={(!ownProfile && !experience.length)} >
              <ExperienceIcon style={{paddingRight: '5px'}} />
              <Experience
                value={formatEnum(experience)}
                disabled
                placeholder={'experience'}
              />
            </ExperienceRow>
            <Label hide={(!ownProfile && !genres.length)} >
              Genres
            </Label>
            <BtTagList items={genres} />
            <Label hide={(!ownProfile && !skills.length)} >
              Skills
            </Label>
            <BtTagList items={skills}/>
            <Label hide={(!ownProfile && !influences.length)} >
              Influences
            </Label>
            <BtTagList items={influences} grayTag />
          </BotRight>
        </BotRow>
      </ProfileView>
    )
  }
}

export default Relay.createContainer(
  Profile, {
    initialVariables: {
      theirHandle: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
            email
            friends (
              first: 999
              filter: {deactivated: false}
             ) {
              edges {
                node { id }
              }
            }
            invitations (
              filter: {
                accepted: false
                ignored: false
              }
              first: 999
              orderBy: createdAt_ASC
            ) {
              edges {
                node {
                  id
                  createdAt
                  actor { id, handle }
                }
              }
            }
            sentRequests (
              filter: {
                accepted: false
                ignored: false
              }
              first: 999
              orderBy: createdAt_ASC
            ) {
              edges {
                node {
                  recipient { id }
                }
              }
            }
          }
          User (handle: $theirHandle) {
            id
            experience
            lastPing
            email
            handle
            summary
            website
            placename
            score
            mentorAccount {id}
            portrait {
              id
              url
            }
            portraitSmall {
              id
              url
            }
            projects { count }
            friends (
              filter: {deactivated: false}
            ) { count }
            genres ( first: 20 ) {
              edges { node { id, name } }
            }
            skills ( first: 20 ) {
              edges {
                node {
                  id
                  name
                }
              }
            }
            artistInfluences ( first: 20 ) {
              edges {
                node {
                  id
                  name
                  spotifyId
                  imageUrl
                }
              }
            }
          }
        }
      `,
    }
  }
)
