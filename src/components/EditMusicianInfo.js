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
import MenuItem from 'material-ui/MenuItem'

export default class EditMusicianInfo extends Component {

  constructor(props) {
    super()
    this.state = Object.assign(...props, {
      genres: [],
      skills: [],
      allGenres: [],
      allSkills: [],
      influences: [],
      experience: '',
      experiences: [
        { value: 'NOVICE', text: 'Novice (Just Started)' },
        { value: 'BEGINNER', text: 'Beginner (0-2 Years)' },
        { value: 'SKILLED', text: 'Skilled (3-9 Years)' },
        { value: 'ACCOMPLISHED', text: 'Accomplished (10-24 Years)' },
        { value: 'VETERAN', text: 'Veteran (25+ Years)' },
      ]
    })
  }

  componentDidMount() {
    getAllGenres().then(allGenres=>
      this.setState(allGenres)
    )
    getAllSkills().then(allSkills=>
      this.setState(allSkills)
    )
  }

  loadGenres = () => {
    return new Promise( (resolve, reject)=> {
      getAllGenres().then(allGenres=>{
        let options = allGenres.map(genre=>{
          return { value: genre.id, label: genre.name }
        })
        console.log('genres', options);
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
        onSuccess: res => this.props.onSave(),
        onFailure: res => {}//handle failure
      }
    )
  }


  render() {
    console.log('state', this.state);
    console.log('options', this.influenceOptions());
    let {genres, skills, influences, experience} = this.state
    let experiences = this.state.experiences.map(experience=>(
      <MenuItem
        primaryText={experience.text}
        key={experience.value}
        value={experience.value}
      />
    ))
    return (
      <Dialog
        title={'Edit Musician Info'}
        open={this.props.open}
        onRequestClose={this.props.onRequestClose}
        contentStyle={{ height: '800px', width: '800px', }}
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
          <ExperienceIcon style={{ marginRight: '5px' }} />
          <SelectField
            value={experience}
            fullWidth={true}
            onChange={(e)=>this.setState({experience: e.value})}
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
          onChange={(e,i,val)=>this.setState({ genres: val.map(x=>x.value) })}
          multi
          className={'async'}
          placeholder={'add your genres'}
          style={{margin: '4px 0 8px 0'}}
        />
        <Label>Skills</Label>
        <Async
          loadOptions={this.loadSkills}
          value={skills}
          onChange={(e,i,val)=>this.setState({ skills: val.map(x=>x.value) })}
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
          onChange={(e,i,val)=>this.setState({ influences: val.map(x=>x.value) })}
          className={'async influences'}
          placeholder={'add your influences'}
          style={{margin: '4px 0 8px 0'}}
        />
      </Dialog>
    )
  }
}
