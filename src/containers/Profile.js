import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProfileView, Top, Row, Left, Right, TopCol, Handle, InputRow, Location, ScoreRow, Score, Divider, Summary, Input, BotRow, BotRight, Label, InputError, SubRow, Experience, ExperienceRow} from 'styled/Profile'
import PinIcon from 'icons/Location'
import Bolt from 'icons/Bolt'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Email from 'icons/Email'
import Link from 'icons/Link'
import ExperienceIcon from 'icons/Experience'
import ImageEditor from 'components/ImageEditor'
import UpdateUser from 'mutations/UpdateUser'
import {Async} from 'react-select'
import 'react-select/dist/react-select.css'
import 'theme/newSelect.css'
import {getAllGenres, getAllSkills, ensureBtArtistExists} from 'utils/graphql'
import searchArtists from 'utils/searchArtists'
import {handleValidator} from 'utils/handles'
import {purple, grey400} from 'theme'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import UpdateFriendRequest from 'mutations/UpdateFriendRequest'
import AddToFriends from 'mutations/AddToFriends'
import RemoveFromFriends from 'mutations/RemoveFromFriends'
import CreateFriendRequest from 'mutations/CreateFriendRequest'
import {formatEnum} from 'utils/strings'
import Snackbar from 'material-ui/Snackbar'
import {Dialog, TextField, FlatButton} from 'material-ui/'
import {BtAvatar} from 'styled'
import Checkbox from 'material-ui/Checkbox'
import Edit from 'icons/Edit'
import {Panel} from 'components/Panel'
import {url} from 'config'
import {TribeButton} from 'components/TribeButton'
import {DialogSpacer, DialogRow,} from 'styled/Dashboard'



class Profile extends Component {

  state = {
    imageEditorOpen: false,
    genres: [],
    skills: [],
    influences: [],
    handleError: '',
    experience: '',
    tab: 'projects',
    experiences: [
      { value: 'NOVICE', text: 'Novice (Just Started)' },
      { value: 'BEGINNER', text: 'Beginner (0-2 Years)' },
      { value: 'SKILLED', text: 'Skilled (3-9 Years)' },
      { value: 'ACCOMPLISHED', text: 'Accomplished (10-24 Years)' },
      { value: 'VETERAN', text: 'Veteran (25+ Years)' },
    ],
    notification: false,
    tabs: 'projects',
    settings: false,
    btnStatus: '',
    editProfile: false,

  }
  componentDidMount = () => {
    //TODO-J this is a redirect: maybe there's better way to handle w/ router
    this.props.router.replace(`/${this.props.router.params.userHandle}/projects`)
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
        return {
          value: genre.id,
          label: genre.name
        }
      })
      let skills = User.skills.edges.map(edge=>{
        let {node: skill} = edge
        return {
          value: skill.id,
          label: skill.name
        }
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
        genres,
        skills,
        influences,
        experiences,
        experience: User.experience || '',
      }
    })
  }

  componentWillReceiveProps (newProps) {
    let {handle, placename, summary, portrait, score, projects, friends, website, email, genres, skills, artistInfluences, experience} = newProps.viewer.User
    this.setState( (prevState, props) => {
      let newGenres = genres.edges.map(edge=>{
        let {node: genre} = edge
        return {
          value: genre.id,
          label: genre.name
        }
      })
      let newSkills = skills.edges.map(edge=>{
        let {node: skill} = edge
        return {
          value: skill.id,
          label: skill.name
        }
      })
      let newInfluences = artistInfluences.edges.map(edge=>{
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
        handle: handle || '',
        placename: placename || '',
        summary: summary || '',
        score: score || '',
        website: website || '',
        email: email || '',
        portraitUrl: (portrait || {}).url || `${url}/logo.png`,
        projects: projects.edges.length,
        friends: friends.edges.length,
        genres: newGenres,
        skills: newSkills,
        influences: newInfluences,
        experience: experience || '',
      }
    })
    let oldHandle = this.props.viewer.User.handle
    if (oldHandle !== handle) {
      this.props.router.replace(`/${handle}`)
    }
  }

  accept = (inviteId) => {
    console.log('accept', inviteId);
    let {id: selfId} = this.props.viewer.user
    let {id: newFriendId} = this.props.viewer.User
    this.props.relay.commitUpdate(
      new UpdateFriendRequest({ id: inviteId, accepted: true }),
      {onSuccess: (response) => {
          this.props.relay.commitUpdate(
            new AddToFriends({ selfId, newFriendId }),
            { onSuccess: res => this.setState({btnStatus: 'ACCEPTED'}) }
          )
        },
        onFailure: (response) => { console.log('failure', response) }
      }
    )
  }

  addToTribe = () => {
    let {id: actorId} = this.props.viewer.user
    let {id: recipientId} = this.props.viewer.User
    this.props.relay.commitUpdate(
      new CreateFriendRequest({ actorId, recipientId, }),
      { onSuccess: res => this.setState({btnStatus: 'SENT'}) }
    )
  }

  unfriend = () => {
    let {id: selfId} = this.props.viewer.user
    let {id: exfriendId} = this.props.viewer.User
    this.props.relay.commitUpdate(
      new RemoveFromFriends({ selfId, exfriendId }),
      {onSuccess: this.setState({btnStatus: 'REMOVED'})}
    )
  }

  inputChange = (e) => {
    let { name, value } = e.target
    if (name === 'handle') {
      let {handle: newHandle, error} = handleValidator(value)
      this.setState((prevState, props)=>{
        return {
          [name]: newHandle,
          handleError: error
        }
      })
    } else if (name === 'summary' && value.length >= 150) {
      this.setState((prevState, props)=>{
        return {
          [name]: prevState.summary,
        }
      })
    } else {
      this.setState((prevState, props)=>{
        return {
          [name]: value
        }
      })
    }
  }

  inputSubmit = (e) => {
    let {name, value} = e.target
    console.log('submit name val', e);
    if (this.state[`${name}Error`]) {
      return
    } else {
      document.getElementById(name).blur()
      this.props.relay.commitUpdate(
        new UpdateUser({
          userId: this.props.viewer.user.id,
          [name]: value,
        }), {
          onSuccess: (success) => {
            console.log('success');
            name = name.toUpperCase()
            if (name === 'PLACENAME') {
              name = 'LOCATION'
            }
            this.setState({
              notification: `${name} UPDATED.`
            })
          }
        }
      )
    }
  }

  genreChange = (val) => {
    let genresIds = val.map(genre=>{
      return genre.value
    })
    this.props.relay.commitUpdate(
      new UpdateUser({
        userId: this.props.viewer.user.id,
        genresIds
      }), {
        onSuccess: (success) => {
          this.setState({
            notification: `GENRE UPDATED.`
          })
        }
      }
    )
  }

  experienceChange = (experience) => {
    this.props.relay.commitUpdate(
      new UpdateUser({
        userId: this.props.viewer.user.id,
        experience: experience.toUpperCase()
      }), {
        onSuccess: (success) => {
          this.setState({
            notification: `EXPERIENCE UPDATED.`
          })
        }
      }
    )
  }

  skillChange = (val) => {
    let skillsIds = val.map(skill=>{
      return skill.value
    })
    this.props.relay.commitUpdate(
      new UpdateUser({
        userId: this.props.viewer.user.id,
        skillsIds
      }), {
        onSuccess: (success) => {
          this.setState({
            notification: `SKILLS UPDATED.`
          })
        }
      }
    )
  }

  influenceChange = (options) => {
    if (options.length < this.state.influences.length) {
      let artistInfluencesIds = options.map((option) => {
        return option.value.id
      })
      this.props.relay.commitUpdate(
        new UpdateUser({
          userId: this.props.viewer.user.id,
          artistInfluencesIds
        }), {
          onSuccess: (success) => {
            this.setState({
              notification: `INFLUENCES UPDATED.`
            })
          }
        }
      )
    } else {
      let newInfluence = options.find((option) => {
        return !option.value.id
      })
      ensureBtArtistExists(newInfluence).then(artistId => {
        let artistInfluencesIds = options.map((option) => {
          if (option.value.id) {
            return option.value.id
          } else {
            return artistId
          }
        })
        this.props.relay.commitUpdate(
          new UpdateUser({
            userId: this.props.viewer.user.id,
            artistInfluencesIds
          }),{
            onSuccess: (success) => {
              this.setState({
                notification: `INFLUENCES UPDATED.`
              })
            }
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

  closeSnackbar = () => {
    this.setState( (prevState, props) => {
      return { notification: false }
    })
  }

  tabs = (value) => {
    this.setState({tab:value})}

  setTab = (tab) => {
    this.props.router.replace(`${this.props.router.params.userHandle}/${tab}`)
    this.setState({ tab })
    window.scrollTo(0, document.body.scrollHeight)
  }

  setProfile = () => {
    let {handle, placename, summary, email, website} = this.state
    this.props.relay.commitUpdate(
      new UpdateUser({
        userId: this.props.viewer.user.id,
        handle,
        placename,
        summary,
        email,
        website,
      }), {
        onSuccess: (success) => {
          this.setState({
            notification: `PROFILE UPDATED.`,
            editProfile: false
          })
        }
      }
    )
  }

  topRow = () => {

    let {handle, imageEditorOpen, placename, summary, website, email, handleError} = this.state
    let {User, user} = this.props.viewer
    let editUser = {...User}
    console.log('editUser', editUser, user);
    let {score} = User
    let projects = User.projects.edges.length
    let friends = User.friends.edges.length
    let ownProfile = (User.id === user.id)
    return (
    <Top>
      <Edit
        onClick={()=>{this.setState({editProfile: true})}}
        fill={purple}
        style={{
          alignSelf: 'flex-end',
          margin: '20px 20px 0 0',
          display: (ownProfile) ? '' : 'none',
          cursor: 'pointer'
        }}
        title="Settings" />
        <Dialog
          title={"Edit Profile"}
          modal
          open={this.state.editProfile}
          onRequestClose={()=>{ this.setState({editProfile: false}) }}
          autoScrollBodyContent={true}
          bodyStyle={{padding: '0'}}
          contentStyle={{borderRadius: '5px'}}
          titleStyle={{
            fontSize: '28px',
            borderBottom:`1px solid ${grey400}`,
            padding: '16px 27px 13px 27px',
            fontFamily: 'Helvetica Neue'
          }}
          actions={[
            <FlatButton
              label="Cancel"
              onClick={()=>this.setState({editProfile: false})}
            />,
            <FlatButton
              label="Submit"
              primary={true}
              onClick={()=>this.setProfile()}
            />
          ]}>
          <DialogRow>
            <DialogSpacer>
              <TextField
                floatingLabelText={'Handle'}
                value={this.state.handle}
                onChange={(e)=>this.setState({handle: e.target.value})}
              />
              <TextField
                floatingLabelText={'Location'}
                value={this.state.placename}
                onChange={(e)=>this.setState({placename: e.target.value})}
              />
              <TextField
                floatingLabelText={'Summary'}
                value={this.state.summary}
                onChange={(e)=>this.setState({summary: e.target.value})}
                multiLine
              />
              <TextField
                floatingLabelText={'Email'}
                value={this.state.email}
                onChange={(e)=>this.setState({email: e.target.value})}
              />
              <TextField
                floatingLabelText={'Website'}
                value={this.state.website}
                onChange={(e)=>this.setState({website: e.target.value})}
              />
            </DialogSpacer>
          </DialogRow>
         </Dialog>
      {/*<Dialog
        title={"Settings"}
        actions={[
          <Button
            label={"Close"}
            onClick={()=>{ this.setState({settings: false}) }} /> ]}
        open={this.state.settings}
        modal={true}
      > */}
        {/* <h3> Email Notifications </h3>
        <Checkbox
          label={"Disable all"}
          checked={user.doNotEmail}
          onCheck={(e, isChecked) => {
            this.props.relay.commitUpdate(
              new UpdateUser({
                userId: this.props.viewer.user.id,
                doNotEmail: isChecked
              })
            )
          }}
        />
      </Dialog> */}
      <Row>
        <SubRow>
          <BtAvatar user={this.props.viewer.User}
            size={150}
            hideStatus={ownProfile}
            onClick={()=>{
              if (ownProfile) {
                this.setState({imageEditorOpen: true})
              }
            }}
          />
          <ImageEditor
            open={imageEditorOpen}
            onRequestClose={()=>this.setState({imageEditorOpen:false})}
            user={user}
            portraitSuccess={this.portraitSuccess}
          />
          <TopCol>
            <InputRow>
              <Handle
                value={handle}
                id={'handle'}
                onChange={this.inputChange}
                disabled={!ownProfile}
                placeholder={'handle'}
                name={'handle'}
                onBlur={this.inputSubmit}
                onKeyPress={(e)=>{(e.charCode===13) && this.inputSubmit(e)}}
              />
              <InputError>
                {handleError}
              </InputError>
            </InputRow>
            <InputRow
              hide={(!ownProfile && placename.length < 1)}
            >
              <PinIcon/>
              <Location
                value={placename}
                onChange={this.inputChange}
                placeholder={(ownProfile) ? 'add your location' : ''}
                name={'placename'}
                id={'placename'}
                disabled={!ownProfile}
                onBlur={this.inputSubmit}
                onKeyPress={(e)=>{(e.charCode===13) && this.inputSubmit(e)}}
              />
            </InputRow>
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
      <Divider/>
      <Row>
        <Left>
          <Summary
            value={summary}
            name={'summary'}
            id={'summary'}
            onChange={this.inputChange}
            placeholder={(ownProfile) ? 'add your summary' : ''}
            disabled={!ownProfile}
            onBlur={this.inputSubmit}
            onKeyPress={(e)=>
              (e.charCode===13 && e.shiftKey) && this.inputSubmit(e) }
            ownProfile={ownProfile}
          />
        </Left>
        <Right>
          <InputRow hide={(!ownProfile)} >
            <Email/>
            <Input
              value={email}
              placeholder={(ownProfile) ? 'add your email' : ''}
              onChange={this.inputChange}
              disabled
            />
          </InputRow>
          <InputRow hide={(!ownProfile && website.length < 1)}>
            <Link/>
            <Input
              value={website}
              name={'website'}
              id={'website'}
              placeholder={(ownProfile) ? 'add your website' : ''}
              onChange={this.inputChange}
              disabled={!ownProfile}
              onBlur={this.inputSubmit}
              onKeyPress={(e)=>{(e.charCode===13) && this.inputSubmit(e)}}
            />
          </InputRow>
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
          onRequestClose={this.closeSnackbar}
          onActionTouchTap={this.closeSnackbar}
          bodyStyle={{ backgroundColor: purple }}
        />
        {this.topRow()}
        <BotRow>
          <Panel
            tab={this.state.tab}
            topBar={null}
            tabChange={(tab)=>this.setTab(tab)}
            labels={['activity', 'projects', 'bounces']}
            locks={[true, false, false]}
            content={this.props.children}
          />
          <BotRight>
            <Label hide={(!ownProfile && experience.length < 1)} >
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
              <ExperienceRow hide={(!ownProfile && experience.length < 1)} >
                <ExperienceIcon style={{ marginRight: '5px' }} />
                <Experience
                  value={formatEnum(experience)}
                  disabled={true}
                  placeholder={'experience'}
                />
              </ExperienceRow>
            )}

            <Label hide={(!ownProfile && genres.length < 1)} >
              Genres
            </Label>
            <Async
              loadOptions={this.loadGenres}
              value={genres}
              onChange={this.genreChange}
              multi={true}
              className={(ownProfile) ? 'async' : 'async others'}
              disabled={!ownProfile}
              placeholder={'add your genres'}
              style={{ display:(!ownProfile && genres.length < 1) ? 'none':''}}
            />
            <Label hide={(!ownProfile && skills.length < 1)} >
              Skills
            </Label>
            <Async
              loadOptions={this.loadSkills}
              value={skills}
              onChange={this.skillChange}
              multi={true}
              className={(ownProfile) ? 'async' : 'async others'}
              disabled={!ownProfile}
              placeholder={'add your skills'}
              style={{
                display: (!ownProfile && skills.length < 1) ? 'none' : ''
              }}
            />
            <Label hide={(!ownProfile && influences.length < 1)} >
              Influences
            </Label><div></div>
            <Async
              value={influences}
              loadOptions={this.influenceOptions}
              multi={true}
              onChange={this.influenceChange}
              className={(ownProfile) ? 'async influences' : 'async influences others'}
              disabled={!ownProfile}
              placeholder={'add your influences'}
              style={{
                display: (!ownProfile && influences.length < 1) ? 'none' : ''
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
            friends ( first: 999 ) {
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
            projects (
              first: 8
              orderBy: createdAt_ASC
            ){
              edges {
                node {
                  id
                  title
                  createdAt
                  artwork { url }
                  privacy
                  comments ( first: 999 ) {
                    edges {
                      node {
                        id
                        type
                      }
                    }
                  }

                }
              }
            }
            friends ( first: 999 ){
              edges {
                node {
                  id
                }
              }
            }
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
            artistInfluences ( first: 20 ){
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
