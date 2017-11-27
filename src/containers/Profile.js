import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProfileView, Top, Row, Left, Right, TopCol, Handle, Location, ScoreRow, Score, Divider, Summary, BotRow, BotRight, Label,  SubRow, Experience, ExperienceRow, EmailWebsite, MissingUserData} from 'styled/Profile'
import PinIcon from 'icons/Location'
import Bolt from 'icons/Bolt'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Email from 'icons/Email'
import Link from 'icons/Link'
import Online from 'icons/Online'
import ExperienceIcon from 'icons/Experience'
import ImageEditor from 'components/ImageEditor'
import UpdateUser from 'mutations/UpdateUser'
import {Async} from 'react-select'
import 'react-select/dist/react-select.css'
import 'theme/newSelect.css'
import {getAllGenres, getAllSkills, ensureBtArtistExists} from 'utils/graphql'
import searchArtists from 'utils/searchArtists'
import {handleValidator, isUniqueField} from 'utils/handles'
import {purple} from 'theme'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RemoveFromFriends from 'mutations/RemoveFromFriends'
import CreateFriendRequest from 'mutations/CreateFriendRequest'
import {formatEnum} from 'utils/strings'
import Snackbar from 'material-ui/Snackbar'
import {Dialog, TextField, FlatButton} from 'material-ui/'
import {BtAvatar} from 'styled'
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
    experiences: [
      { value: 'NOVICE', text: 'Novice (Just Started)' },
      { value: 'BEGINNER', text: 'Beginner (0-2 Years)' },
      { value: 'SKILLED', text: 'Skilled (3-9 Years)' },
      { value: 'ACCOMPLISHED', text: 'Accomplished (10-24 Years)' },
      { value: 'VETERAN', text: 'Veteran (25+ Years)' },
    ],
    notification: false,
    btnStatus: '',
    editProfile: false,
    userhandleError: '',
    emailError: '',
    summaryError: ''
  }
  componentDidMount = () => {
    //TODO-J this is a redirect: maybe there's better way to handle w/ router
    // let location = this.props.router.location;

    this.props.router.push(`/${this.props.router.params.userHandle}/activity`)
    console.log('profile mount props', this.props);
  }

  componentWillMount = () => {
    this.setState( (prevState, props) => {

      let experiences = prevState.experiences.map(experience=>(
        <MenuItem
          primaryText={experience.text}
          key={experience.value}
          value={experience.value}
        />
      ))
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
        experiences,
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
    console.log('CFQ Profile');
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

  genreChange = (val) => {
    let genresIds = val.map(genre=>genre.value)
    this.props.relay.commitUpdate(
      new UpdateUser({ userId: this.props.viewer.user.id, genresIds }), {
        onSuccess: res => this.setState({ notification: `GENRE UPDATED` })
      }
    )
  }

  experienceChange = (experience) => {
    let userId = this.props.viewer.user.id
    this.props.relay.commitUpdate(
      new UpdateUser({ userId, experience: experience.toUpperCase() }), {
        onSuccess: res => this.setState({ notification: `EXPERIENCE UPDATED`})
      }
    )
  }

  skillChange = (val) => {
    let skillsIds = val.map(skill => skill.value)
    let userId = this.props.viewer.user.id
    this.props.relay.commitUpdate(
      new UpdateUser({ userId, skillsIds }), {
        onSuccess: res => this.setState({ notification: `SKILLS UPDATED` })
      }
    )
  }

  influenceChange = (options) => {
    if (options.length < this.state.influences.length) {
      let artistInfluencesIds = options.map((option) => option.value.id)
      let userId = this.props.viewer.user.id
      this.props.relay.commitUpdate(
        new UpdateUser({userId,artistInfluencesIds}), {
          onSuccess: res => this.setState({notification: `INFLUENCES UPDATED`})
        }
      )
    } else {
      let newInfluence = options.find((option) => !option.value.id)
      ensureBtArtistExists(newInfluence).then(artistId => {
        let artistInfluencesIds = options.map(option=>option.value.id || artistId)
        let userId = this.props.viewer.user.id
        this.props.relay.commitUpdate(
          new UpdateUser({userId,artistInfluencesIds}),{
            onSuccess: res => this.setState({notification: `INFLUENCES UPDATED`})
          }
        )
      })
    }
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

  loadGenres = () => {
    return new Promise( (resolve, reject)=> {
      getAllGenres().then(allGenres=>{
        let options = allGenres.map(genre=>{
          return { value: genre.id, label: genre.name }
        })
        resolve({options})
      })
    })
  }
  loadSkills = () => {
    return new Promise( (resolve, reject)=> {
      getAllSkills().then(allSkills=>{
        let options = allSkills.map(skill=>{
          return { value: skill.id, label: skill.name }
        })
        resolve({options})
      })
    })
  }
  influenceOptions = (query) => {
    return new Promise( (resolve, reject) =>
      query ? searchArtists(query).then(options => resolve(options)) : resolve({options: []})
    )
  }

  setTab = (tab) => {
    this.props.router.push(`/${this.props.router.params.userHandle}/${tab}`)
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
            primary={true}
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
        <SubRow style={{paddingTop:'60px'}}>
          <BtAvatar user={this.props.viewer.User}
            size={150}
            hideStatus
            pointer={ownProfile}
            style={{marginTop: '60px'}}
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
              {User.handle} {!ownProfile && <Online size={20} online={isOnline(User)}/>}
            </Handle>
            <span>
              {(User.placename || ownProfile) && <PinIcon/>}
              <Location>{User.placename}</Location>
              <MissingUserData hide={User.placename || !ownProfile}
                onClick={()=>{this.setState({editProfile: true})}}>
                Add your location
              </MissingUserData>
            </span>
            <ScoreRow>
              <Bolt/>
              <Score>{score}</Score>
              <Music height={20} />
              <Score>{projects}</Score>
              <Tribe height={20} />
              <Score>{friends}</Score>
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
          <EmailWebsite>
            <Email style={{marginRight: '10px'}} />
            {User.email}
            <MissingUserData hide={User.email || !ownProfile}
              onClick={()=>{this.setState({editProfile: true})}}>
              Add your email
            </MissingUserData>
          </EmailWebsite>
          <EmailWebsite>
            <Link style={{marginRight: '10px'}} />
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
    let {genres, skills, influences, experience, experiences, notification} = this.state
    let {User, user} = this.props.viewer
    let ownProfile = (User.id === user.id)
    return (
      <ProfileView>
        <Snackbar
          open={notification ? true : false} //requires boolean input
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
            tabChange={(tab)=>this.setTab(tab)}
            labels={['activity', 'projects', 'bounces']}
            locks={[false, false, false]}
            values={[0,0,0]}
            content={this.props.children}
          />
          <BotRight>
            <Label hide={(!ownProfile && !experience.length)} >
              Experience
            </Label>
            {(ownProfile) ? (
              <ExperienceRow>
                <ExperienceIcon
                  style={{ marginRight: '5px' }} />
                <SelectField
                  value={experience}
                  fullWidth={true}
                  onChange={(e, index, value)=>{ this.experienceChange(value) }}
                  disabled={(!ownProfile)}
                  hintText={'add your experience'}
                  selectedMenuItemStyle={{ color: purple }}
                >
                  {experiences}
                </SelectField>
              </ExperienceRow>
            ) : (
              <ExperienceRow hide={(!ownProfile && !experience.length)} >
                <ExperienceIcon style={{ marginRight: '5px' }} />
                <Experience
                  value={formatEnum(experience)}
                  disabled={true}
                  placeholder={'experience'}
                />
              </ExperienceRow>
            )}

            <Label hide={(!ownProfile && !genres.length)} >
              Genres
            </Label>
            <Async
              loadOptions={this.loadGenres}
              value={genres}
              onChange={this.genreChange}
              multi
              className={(ownProfile) ? 'async' : 'async others'}
              disabled={!ownProfile}
              placeholder={'add your genres'}
              style={{ display:(!ownProfile && !genres.length) ? 'none':'',  margin: '4px 0 8px 0'}}
            />
            <Label hide={(!ownProfile && !skills.length)} >
              Skills
            </Label>
            <Async
              loadOptions={this.loadSkills}
              value={skills}
              onChange={this.skillChange}
              multi
              className={(ownProfile) ? 'async' : 'async others'}
              disabled={!ownProfile}
              placeholder={'add your skills'}
              style={{
                display: (!ownProfile && !skills.length) ? 'none' : '',  margin: '4px 0 8px 0'
              }}
            />
            <Label hide={(!ownProfile && !influences.length)} >
              Influences
            </Label>
            <Async
              value={influences}
              loadOptions={this.influenceOptions}
              multi
              onChange={this.influenceChange}
              className={(ownProfile) ? 'async influences' : 'async influences others'}
              disabled={!ownProfile}
              placeholder={'add your influences'}
              style={{
                display: (!ownProfile && !influences.length) ? 'none' : '', margin: '4px 0 8px 0'
              }}
            />
          </BotRight>
        </BotRow>
      </ProfileView>
    )
  }
}

export default Relay.createContainer(
  Profile, {
    initialVariables: {
      userHandle: ''
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
          User (handle: $userHandle) {
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
