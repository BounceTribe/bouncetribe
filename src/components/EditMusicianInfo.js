import React, {Component} from 'react'
import Relay from 'react-relay'
import Dialog from 'material-ui/Dialog'
import {Label, ExperienceRow} from 'styled/Profile'
import {getAllGenres, getAllSkills, ensureBtArtistExists} from 'utils/graphql'
import searchArtists from 'utils/searchArtists'
import {Async} from 'react-select'
import 'react-select/dist/react-select.css'
import 'theme/newSelect.css'
import ExperienceIcon from 'icons/Experience'
import SelectField from 'material-ui/SelectField'
import FlatButton from 'material-ui/FlatButton'
import UpdateUser from 'mutations/UpdateUser'
import {purple} from 'theme'

export default class EditMusicianInfo extends Component {

  constructor(props) {
    super()
    this.state = {...props}
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

  sendUpdate() {
    let userId = this.props.user.id
    let updateObj = Object.assign({userId}, this.state)
    let newStatus = this.state.deactivated
    if (newStatus && newStatus!==this.props.user.deactivated) {
      //prevents showing other dialod before booting to login
      this.setState({hide: true})
    }
    Relay.Store.commitUpdate(
      new UpdateUser(updateObj),{
        onSuccess: res => {this.props.onSave()},
        onFailure: res => {}//handle failure
      }
    )
  }


  render() {
    let {genres, skills, influences, experience, experiences} = this.state

    return (
      <Dialog
        title={'Edit Musician Info'}
        open={this.props.open}
        onRequestClose={this.props.onRequestClose}
        contentStyle={{
          height: '800px',
          width: '800px',
        }}
        autoScrollBodyContent
        actions={[
          <FlatButton
            label={"Cancel"}
            onClick={() => {
              this.props.onClose()
              // this.setState({show: false, pass1: '', pass2: ''})
            }}
          />,
          <FlatButton
            label={"Save"}
            primary
            onClick={() => this.sendUpdate()}
          />
        ]}
      >
        <Label>Experience</Label>
        <ExperienceRow>
          <ExperienceIcon
            style={{ marginRight: '5px' }} />
          <SelectField
            value={experience}
            fullWidth={true}
            onChange={(e, index, value)=>{ this.experienceChange(value) }}
            hintText={'add your experience'}
            selectedMenuItemStyle={{ color: purple }}
          >
            {experiences}
          </SelectField>
        </ExperienceRow>
        <Label>Genres</Label>
        <Async
          loadOptions={this.loadGenres}
          value={genres}
          onChange={this.genreChange}
          multi
          className={'async'}
          placeholder={'add your genres'}
          style={{margin: '4px 0 8px 0'}}
        />
        <Label>Skills</Label>
        <Async
          loadOptions={this.loadSkills}
          value={skills}
          onChange={this.skillChange}
          multi
          className={'async'}
          placeholder={'add your skills'}
          style={{margin: '4px 0 8px 0'}}
        />
        <Label>Influences</Label>
        <Async
          value={influences}
          loadOptions={this.influenceOptions}
          multi
          onChange={this.influenceChange}
          className={'async influences'}
          placeholder={'add your influences'}
          style={{margin: '4px 0 8px 0'}}
        />
      </Dialog>
    )
  }
}
