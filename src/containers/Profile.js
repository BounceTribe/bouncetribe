import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProfileView, Top, Row, Left, Right, Portrait, TopCol, Handle, InputRow, Location, ScoreRow, Score, Divider, Summary, Input, BotLeft, BotRow, BotRight, Label, InputError, TribeButton, SubRow, Experience, ExperienceRow} from 'styled/Profile'
import PinIcon from 'icons/Location'
import Bolt from 'icons/Bolt'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Email from 'icons/Email'
import Link from 'icons/Link'
import Lock from 'icons/Lock'
import ExperienceIcon from 'icons/Experience'
import {Tabs, Tab} from 'material-ui/Tabs'
import ImageEditor from 'components/ImageEditor'
import UpdateUser from 'mutations/UpdateUser'
import {Async} from 'react-select'
import 'react-select/dist/react-select.css'
import 'theme/newSelect.css'
import {getAllGenres, getAllSkills, ensureBtArtistExists} from 'utils/graphql'
import searchArtists from 'utils/searchArtists'
import {handleValidator} from 'utils/handles'
import {purple, grey200} from 'theme'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import UpdateFriendRequest from 'mutations/UpdateFriendRequest'
import AddToFriends from 'mutations/AddToFriends'
import RemoveFromFriends from 'mutations/RemoveFromFriends'
import CreateFriendRequest from 'mutations/CreateFriendRequest'
import {formatEnum} from 'utils/strings'
import Snackbar from 'material-ui/Snackbar'
import { List} from 'styled/list'
import {ProfileProjectItem, Left as ProjectLeft, ProfileArtwork, Info, ProfileProjectTitle, Duo, DuoItem, Bubble, CreatedAt} from 'styled/ProjectList'
import {url} from 'config'
import Heart from 'icons/Heart'
import Comment from 'icons/Comment'
import Settings from 'icons/Settings'
import Dialog from 'material-ui/Dialog'
import {Button} from 'styled'
import Checkbox from 'material-ui/Checkbox'

class Profile extends Component {

  state = {
    imageEditorOpen: false,
    genres: [],
    skills: [],
    influences: [],
    handleError: '',
    experience: '',
    experiences: [
      {
        value: 'NOVICE',
        text: 'Novice (Just Started)'
      },
      {
        value: 'BEGINNER',
        text: 'Beginner (0-2 Years)'
      },
      {
        value: 'SKILLED',
        text: 'Skilled (3-9 Years)'
      },
      {
        value: 'ACCOMPLISHED',
        text: 'Accomplished (10-24 Years)'
      },
      {
        value: 'VETERAN',
        text: 'Veteran (25+ Years)'
      },
    ],
    notification: false,
    tabs: 'projects',
    settings: false

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
        portraitUrl: User.portrait.url,
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
        portraitUrl: portrait.url,
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
    let {id: selfId} = this.props.viewer.user
    let {id: newFriendId} = this.props.viewer.User
    this.props.relay.commitUpdate(
      new UpdateFriendRequest({
        id: inviteId,
        accepted: true
      }), {
        onSuccess: (response) => {
          console.log('success?')
          this.props.relay.commitUpdate(
            new AddToFriends({
              selfId,
              newFriendId
            })
          )
        },
        onFailure: (response) => {
          console.log('failure', response)
        }
      }
    )
  }

  addToTribe = () => {
    let {id: actorId} = this.props.viewer.user
    let {id: recipientId} = this.props.viewer.User
    this.props.relay.commitUpdate(
      new CreateFriendRequest({
        actorId,
        recipientId,
      })
    )
  }

  inputChange = (e) => {
    let {
      name,
      value
    } = e.target
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
          return {
            value: genre.id,
            label: genre.name
          }
        })
        resolve({options})
      })
    })
  }

  loadSkills = () => {
    return new Promise( (resolve, reject)=> {
      getAllSkills().then(allSkills=>{
        let options = allSkills.map(skill=>{
          return {
            value: skill.id,
            label: skill.name
          }
        })
        resolve({options})
      })
    })
  }

  influenceOptions = (query) => {
    return new Promise( (resolve, reject) => {
      if (!query) {
        resolve({options: []})
      } else {
        searchArtists(query).then(options => resolve(options))
      }
    })
  }



  unfriend = () => {
    let {id: selfId} = this.props.viewer.user
    let {id: exfriendId} = this.props.viewer.User
    this.props.relay.commitUpdate(
      new RemoveFromFriends({
        selfId,
        exfriendId
      })
    )
  }

  closeSnackbar = () => {
    this.setState( (prevState, props) => {
      return {
        notification: false
      }
    })
  }

  tabs = (value) => {
    this.setState({tabs:value})
  }

  get projects () {
    let {User, user} = this.props.viewer
    return User.projects.edges.map(edge => {
      let {node:project} = edge
      if (User.id !== user.id && project.privacy === 'PRIVATE') {
        return null
      } else {
        let comments = project.comments.edges.filter( (edge) => {
          return edge.node.type === 'COMMENT'
        })
        let likes = project.comments.edges.filter( (edge) => {
          return edge.node.type === 'LIKE'
        })
        return (
          <ProfileProjectItem key={project.id} >
            <ProjectLeft>
              <ProfileArtwork
                src={(project.artwork) ? project.artwork.url : `${url}/artwork.png`}
                alt={'Project Artwork'}
                to={`/${User.handle}/${project.title}`} />
              <Info>
                <ProfileProjectTitle
                  to={`/${User.handle}/${project.title}`} >
                  {project.title}
                </ProfileProjectTitle>
                <CreatedAt>
                  Created {new Date(Date.parse(project.createdAt)).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric'
                  })}
                </CreatedAt>
                <Duo>
                  <DuoItem>
                    <Bubble secondary >
                        <Comment height={15} width={15} />
                    </Bubble>
                    {comments.length}
                  </DuoItem>
                  <DuoItem>
                    <Bubble>
                      <Heart height={15} width={15} />
                    </Bubble>
                    {likes.length}
                  </DuoItem>
                </Duo>
              </Info>
            </ProjectLeft>
          </ProfileProjectItem>
        )
      }
    })
  }

  render () {
    let {handle, imageEditorOpen, portraitUrl, placename, summary, website, email, genres, skills, influences, handleError, experience, experiences, notification, tabs} = this.state
    let {User, user} = this.props.viewer
    let {score} = User
    let projects = User.projects.edges.length
    let friends = User.friends.edges.length
    let ownProfile = (User.id === user.id)
    return (
      <ProfileView>
        <Snackbar
          open={notification}
          message={notification}
          autoHideDuration={2000}
          onRequestClose={this.closeSnackbar}
          onActionTouchTap={this.closeSnackbar}
          bodyStyle={{ backgroundColor: purple }}
        />
        <Top>
          <Settings
              onClick={()=>{
                this.setState({settings: true})
              }}
              style={{
                alignSelf: 'flex-end',
                marginRight: '20px',
                display: (ownProfile) ? '' : 'none',
                cursor: 'pointer'
              }}
              title="Settings"
            />
            <Dialog
              title={"Settings"}
              actions={[
                <Button
                  label={"Close"}
                  onClick={()=>{
                    this.setState({settings: false})
                  }}
                />
              ]}
              open={this.state.settings}
              modal={true}
            >
              <h3>
                Email Notifications
              </h3>
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
            </Dialog>
            <Row>
              <SubRow>
                <Portrait
                  src={portraitUrl}
                  onClick={()=>{
                    if (ownProfile) {
                      this.setState({imageEditorOpen: true})
                    }
                  }}
                  ownProfile={ownProfile}
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
                      onKeyPress={(e)=>{
                        if (e.charCode === 13) {
                          this.inputSubmit(e)
                        }
                      }}
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
                      onKeyPress={(e)=>{
                        if (e.charCode === 13) {
                          this.inputSubmit(e)
                        }
                      }}
                    />
                  </InputRow>
                  <ScoreRow>
                    <Bolt/>
                    <Score>{score}</Score>
                    <Music
                      height={20}
                    />
                    <Score>{projects}</Score>
                    <Tribe
                      height={20}
                    />
                    <Score>{friends}</Score>
                  </ScoreRow>
                </TopCol>
              </SubRow>

              <TribeButton
                viewer={this.props.viewer}
                accept={this.accept}
                addToTribe={this.addToTribe}
                unfriend={this.unfriend}
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
                  onKeyPress={(e)=>{
                    if (e.charCode === 13 && e.shiftKey) {
                      this.inputSubmit(e)
                    }
                  }}
                  ownProfile={ownProfile}
                />
              </Left>
              <Right>
                <InputRow
                  hide={(!ownProfile)}
                >
                  <Email/>
                  <Input
                    value={email}
                    placeholder={(ownProfile) ? 'add your email' : ''}
                    onChange={this.inputChange}
                    disabled
                  />
                </InputRow>
                <InputRow
                  hide={(!ownProfile && website.length < 1)}

                >
                  <Link/>
                  <Input
                    value={website}
                    name={'website'}
                    id={'website'}
                    placeholder={(ownProfile) ? 'add your website' : ''}
                    onChange={this.inputChange}
                    disabled={!ownProfile}
                    onBlur={this.inputSubmit}
                    onKeyPress={(e)=>{
                      if (e.charCode === 13) {
                        this.inputSubmit(e)
                      }
                    }}
                  />
                </InputRow>
              </Right>
            </Row>
        </Top>
        <BotRow>
          <BotLeft>
            <Tabs
              style={{
                width: '100%',
                marginTop: '6px',
              }}
              inkBarStyle={{
                backgroundColor: purple
              }}
              value={tabs}
              onChange={this.tabs}
            >
              <Tab
                label={'Activity'}
                value={'activity'}
                style={{ borderBottom: `2px solid ${grey200}` }}
                disabled={true}

              >
                <h4>Coming soon!</h4>

              </Tab>

              <Tab
                label={'Projects'}
                value={'projects'}
                style={{ borderBottom: `2px solid ${grey200}` }}
              >
                <List> {this.projects} </List>

              </Tab>
              <Tab
                label={'Bounces'}
                value={'bounces'}
                style={{ borderBottom: `2px solid ${grey200}` }}
                icon={( <Lock /> )} disabled={true} />
            </Tabs>

          </BotLeft>
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
            <Label
              hide={(!ownProfile && influences.length < 1)}
            >
              Influences
            </Label>
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
            friends (
              first: 999
            ) {
              edges {
                node {
                  id
                }
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
                  actor {
                    id
                  }
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
                  recipient {
                    id
                  }
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
                  artwork {
                    url
                  }
                  privacy
                  comments (
                    first: 999
                  ) {
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
            friends (
              first: 999
            ){
              edges {
                node {
                  id
                }
              }
            }
            genres (
              first: 20
            ) {
              edges {
                node {
                  id
                  name
                }
              }
            }
            skills (
              first: 20
            ) {
              edges {
                node {
                  id
                  name
                }
              }
            }
            artistInfluences (
              first: 20
            ){
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
