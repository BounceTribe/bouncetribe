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

class Profile extends Component {

  state = {
    imageEditorOpen: false,
    genres: [],
    skills: [],
    influences: [],
    handleError: '',
    experience: '',
    experiences: ['Novice', 'Professional']
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
      this.props.relay.commitUpdate(
        new UpdateUser({
          userId: this.props.viewer.user.id,
          [name]: value
        })
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
      })
    )
  }

  experienceChange = (experience) => {
    this.props.relay.commitUpdate(
      new UpdateUser({
        userId: this.props.viewer.user.id,
        experience: experience.toUpperCase()
      })
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
      })
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
        })
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
          }), {
            onSuccess: success => console.log('success')
          }
        )
      })
    }
  }

  componentWillMount = () => {
    this.setState( (prevState, props) => {

      let experiences = prevState.experiences.map(experience=>(
        <MenuItem
          primaryText={experience}
          key={experience}
          value={experience}
        />
      ))
      let {User} = this.props.viewer
      console.log(User)
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

  render () {
    let {handle, imageEditorOpen, portraitUrl, placename, summary, website, email, genres, skills, influences, handleError, experience, experiences} = this.state
    let {User, user} = this.props.viewer
    let {score} = User
    let projects = User.projects.edges.length
    let friends = User.friends.edges.length
    let ownProfile = (User.id === user.id)
    return (
      <ProfileView>
          <Top>
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
                        onChange={this.inputChange}
                        disabled={!ownProfile}
                        placeholder={'handle'}
                        name={'handle'}
                        onBlur={this.inputSubmit}
                      />
                      <InputError>
                        {handleError}
                      </InputError>
                    </InputRow>
                    <InputRow>
                      <PinIcon/>
                      <Location
                        value={placename}
                        onChange={this.inputChange}
                        placeholder={(ownProfile) ? 'add your location' : ''}
                        name={'placename'}
                        disabled={!ownProfile}
                        onBlur={this.inputSubmit}
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
                    onChange={this.inputChange}
                    placeholder={(ownProfile) ? 'add your summary' : ''}
                    disabled={!ownProfile}
                    onBlur={this.inputSubmit}
                  />
                </Left>
                <Right>
                  <InputRow>
                    <Email/>
                    <Input
                      value={email}
                      placeholder={(ownProfile) ? 'add your email' : ''}
                      onChange={this.inputChange}
                      disabled
                    />
                  </InputRow>
                  <InputRow>
                    <Link/>
                    <Input
                      value={website}
                      name={'website'}
                      placeholder={(ownProfile) ? 'add your website' : ''}
                      onChange={this.inputChange}
                      disabled={!ownProfile}
                      onBlur={this.inputSubmit}
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
              >
                <Tab
                  label={'Activity'}
                  style={{
                    borderBottom: `2px solid ${grey200}`
                  }}

                />
                <Tab
                  label={'Projects'}
                  style={{
                    borderBottom: `2px solid ${grey200}`
                  }}
                />
                <Tab
                  label={'Bounces'}
                  style={{
                    borderBottom: `2px solid ${grey200}`
                  }}
                  icon={(
                    <Lock
                    />
                  )}
                  disabled={true}
                />
              </Tabs>
            </BotLeft>
            <BotRight>
              <Label>
                Experience
              </Label>
              {(ownProfile) ? (
                <ExperienceRow>
                  <ExperienceIcon
                    style={{
                      marginRight: '5px'
                    }}
                  />
                  <SelectField
                    value={formatEnum(experience)}
                    fullWidth={true}
                    onChange={(e, index, value)=>{
                      this.experienceChange(value)
                    }}
                    disabled={(!ownProfile)}
                    hintText={'add your experience'}
                  >
                    {experiences}
                  </SelectField>
                </ExperienceRow>
              ) : (
                <ExperienceRow>
                  <ExperienceIcon
                    style={{
                      marginRight: '5px'
                    }}
                  />
                  <Experience
                    value={formatEnum(experience)}
                    disabled={true}
                    placeholder={'experience'}
                  />
                </ExperienceRow>

              )}

              <Label>
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
              />
              <Label>
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
              />
              <Label>
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
            friends (
              first: 100000
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
              first: 2147483647
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
            sentRequests (
              filter: {
                accepted: false
                ignored: false
              }
              first: 2147483647
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
              first: 100000
            ){
              edges {
                node {
                  id
                }
              }
            }
            friends (
              first: 100000
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
