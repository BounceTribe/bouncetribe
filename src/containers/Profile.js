import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProfileView, Top, Row, Left, Right, TopCol, Handle, Location, ScoreRow, Score, Divider, Summary, BotRow, BotRight, Label,  SubRow, Experience, ExperienceRow, EmailWebsite, MissingUserData} from 'styled/Profile'
import PinIcon from 'icons/Location'
import Bolt from 'icons/Bolt'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
// import Email from 'icons/Email'
import Link from 'icons/Link'
import Online from 'icons/Online'
import ExperienceIcon from 'icons/Experience'
import ImageEditor from 'components/ImageEditor'
import EditMusicianInfo from 'components/EditMusicianInfo'
import UpdateUser from 'mutations/UpdateUser'
import 'react-select/dist/react-select.css'
import 'theme/newSelect.css'
import {handleValidator, isUniqueField} from 'utils/handles'
import {purple} from 'theme'
import RemoveFromFriends from 'mutations/RemoveFromFriends'
import CreateFriendRequest from 'mutations/CreateFriendRequest'
import {formatEnum} from 'utils/strings'
import Snackbar from 'material-ui/Snackbar'
import {Dialog, TextField, FlatButton} from 'material-ui/'
import {BtAvatar, BtTagList} from 'styled'
import Edit from 'icons/Edit'
import {Panel} from 'components/Panel'
import {url} from 'config'
import {TribeButton} from 'components/TribeButton'
import {acceptFriendRequest} from 'utils/updateCommits'
import {isOnline} from 'utils/isOnline'



class Profile extends Component {

  state = {
    imageEditorOpen: false,
    genres: [],
    skills: [],
    influences: [],
    experience: '',
    tab: 'activity',
    notification: false,
    btnStatus: '',
    editProfile: false,
    editMusicianInfo: true,
    userhandleError: '',
    emailError: '',
    summaryError: ''
  }

  componentDidMount = () => {
    //TODO-J this is a redirect: maybe there's better way to handle w/ router
    // let location = this.props.router.location;
    this.props.router.push(`/${this.props.router.params.theirHandle}/activity`)
    console.log('profile mount props', this.props);
  }

  componentWillMount = () => {
    this.setState( (prevState, props) => {
      let {User} = this.props.viewer
      let genres = User.genres.edges.map(edge=>{
        let {node: genre} = edge
        return { value: genre.id, label: genre.name }
      })
      let skills = User.skills.edges.map(edge=>{
        let {node: skill} = edge
        return { value: skill.id, label: skill.name }
      })
      let influences = User.artistInfluences.edges.map(edge=>{
        let {node: influence} = edge
        return {
          value: {
            imageUrl: influence.imageUrl,
            spotifyId: influence.spotifyId,
            id: influence.id
          },
          label: influence.name
        }
      })
      return {
        handle: User.handle,
        placename: User.placename || '',
        summary: User.summary || '',
        portraitUrl: (User.portrait || {}).url || `${url}/logo.png`,
        website: User.website || '',
        email: User.email || '',
        experience: User.experience || '',
        genres,
        skills,
        influences,
      }
    })
  }

  componentWillReceiveProps (newProps) {
    let {handle, placename, summary, portrait, score, projects, friends, website, email, genres, skills, artistInfluences, experience} = newProps.viewer.User
    this.setState( (prevState, props) => {
      let newGenres = genres.edges.map(edge=>{
        let {node: genre} = edge
        return { value: genre.id, label: genre.name }
      })
      let newSkills = skills.edges.map(edge=>{
        let {node: skill} = edge
        return { value: skill.id, label: skill.name }
      })
      let newInfluences = artistInfluences.edges.map(edge=>{
        let {node: influence} = edge
        let {imageUrl, spotifyId, id} = influence
        return {
          value: { imageUrl, spotifyId, id },
          label: influence.name
        }
      })
      return {
        handle: handle || '',
        placename: placename || '',
        summary: summary || '',
        score: score || 0,
        website: website || '',
        email: email || '',
        portraitUrl: (portrait || {}).url || `${url}/logo.png`,
        projects: projects.count,
        friends: friends.count,
        genres: newGenres,
        skills: newSkills,
        influences: newInfluences,
        experience: experience || '',
      }
    })
    // let oldHandle = this.props.viewer.User.handle
    // console.log(oldHandle, handle);
    // if (oldHandle !== handle) {
    //   this.props.router.push(`/${handle}`)
    // }
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

  handleSet = (val) =>{
    let {handle: newHandle, error} = handleValidator(val)
    if (val!==this.props.viewer.User.handle) {
      isUniqueField(val, 'email').then( result =>
        !result && this.setState({emailError: 'Email already in use!'})
      )
    }
    this.setState({ handle: newHandle, userhandleError: error })
  }

  emailSet = (val) => {
    let error = ''
    if (val!==this.props.viewer.User.email) {
      isUniqueField(val, 'email').then( result => {
        if (!result) error='Email already in use!'
      })
    }
    this.setState({ email: val,  emailError: error })
  }

  summarySet = (val) => {
    console.log('summary', val, val.length);
    let error = ''
    if (val.split(/\r\n|\r|\n/).length > 15) error='Too many lines'
    if (val.length > 400) error='500 character limit exceeded'
    this.setState({summary: val, summaryError: error})
  }

  portraitSuccess = (file) => {
    this.setState({imageEditorOpen: false})
    this.props.relay.commitUpdate(
      new UpdateUser({
        userId: this.props.viewer.User.id,
        portraitId: file.id,
      }), {
        onSuccess: success => console.log(success),
        failure: failure => console.log('fail', failure)
      }
    )
  }

  setTab = (tab) => {
    this.props.router.push(`/${this.props.router.params.theirHandle}/${tab}`)
    this.setState({ tab })
    // window.scrollTo(0, document.body.scrollHeight)
  }

  setProfile = () => {
    let {handle, placename, summary, email, website} = this.state
    let userId = this.props.viewer.user.id
    this.props.relay.commitUpdate(
      new UpdateUser({ userId, handle, placename, summary, email, website }), {
        onSuccess: (success) =>
          this.setState({ notification: `PROFILE UPDATED`, editProfile: false })
      }
    )
  }

  musicianInfoSave = () => {
    this.setState( {
      snackbarText: 'INFO UPDATED',
      editMusicianInfo: false
    } )
  }

  topRow = () => {
    let { handle,
          imageEditorOpen,
          placename,
          summary,
          website,
          email,
          userhandleError,
          emailError,
          summaryError} = this.state
    let {User, user} = this.props.viewer
    let {score} = User
    let projects = User.projects.count
    let friends = User.friends.count
    let ownProfile = (User.id === user.id)
    return (
    <Top>
      <Edit
        onClick={()=>{this.setState({editProfile: true})}}
        fill={purple}
        style={{
          alignSelf: 'flex-end',
          padding: '20px 20px 0 0',
          display: (ownProfile) ? '' : 'none',
          cursor: 'pointer',
          position: 'absolute'
        }}
      />
      <Dialog
        title={"Edit Profile"}
        modal
        autoScrollBodyContent
        open={this.state.editProfile}
        onRequestClose={()=>{ this.setState({editProfile: false}) }}
        titleStyle={{ fontSize: '28px' }}
        actions={[
          <FlatButton
            label="Cancel"
            onClick={()=>this.setState({editProfile: false})}
          />,
          <FlatButton
            label="Submit"
            primary
            disabled={!!userhandleError || !!emailError || !!summaryError}
            onClick={this.setProfile}
          />
        ]}>
        <TextField
          floatingLabelText={'Handle'}
          errorText={userhandleError}
          value={handle}
          onChange={(e)=>this.handleSet(e.target.value)}
        /><br />
        <TextField
          floatingLabelText={'Location'}
          value={placename}
          onChange={(e)=>this.setState({placename: e.target.value})}
        /><br />
        <TextField
          floatingLabelText={'Summary'}
          errorText={summaryError}
          value={summary}
          onChange={(e)=>this.summarySet(e.target.value)}
          multiLine
          rowsMax={5}
          fullWidth
        /><br />
        <TextField
          floatingLabelText={'Email'}
          errorText={emailError}
          value={email}
          onChange={(e)=>this.emailSet(e.target.value)}
        /><br />
        <TextField
          floatingLabelText={'Website'}
          value={website}
          onChange={(e)=>this.setState({website: e.target.value})}
        />
      </Dialog>
      <Row>
        <SubRow>
          <BtAvatar user={this.props.viewer.User}
            size={150}
            hideStatus
            pointer={ownProfile}
            onClick={()=>ownProfile && this.setState({imageEditorOpen: true})}
          />
          <ImageEditor
            open={imageEditorOpen}
            onRequestClose={()=>this.setState({imageEditorOpen:false})}
            user={user}
            portraitSuccess={this.portraitSuccess}
          />
          <TopCol>
            <Handle>
              {User.handle}
              {!ownProfile && isOnline(User) && <Online size={20} online/>}
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
              <Music height={20} /> <Score>{projects}</Score>
              <Tribe height={20} /> <Score>{friends}</Score>
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
          <EmailWebsite>
            {(User.website || ownProfile) &&
              <Link style={{marginRight: '10px'}}/>}
            {User.website}
            <MissingUserData hide={User.website || !ownProfile}
              onClick={()=>{this.setState({editProfile: true})}}>
              Add your website
            </MissingUserData>
          </EmailWebsite>
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
            {(this.state.editMusicianInfo) && <EditMusicianInfo
              {...this.state}
              open={true}
              user={user}
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
              <ExperienceIcon style={{margin: '5px 5px 10px 0'}} />
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
                  actor { id }
                }
              }
            }
            doNotEmail
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
            portrait {
              id
              url
            }
            website
            placename
            score
            projects { count }
            friends (
              filter: {deactivated: false}
            ) { count }
            genres ( first: 20 ) {
              edges {
                node {
                  id
                  name
                }
              }
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
