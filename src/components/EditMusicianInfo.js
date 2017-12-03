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
import {formatEnum} from 'utils/strings'


export default class EditMusicianInfo extends Component {

  constructor(props) {
    super(props)
    this.state = Object.assign({...this.props}, {
      allGenres: [],
      allSkills: [],
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

  loadGenres = () => new Promise((resolve, reject) =>
    getAllGenres().then( allGenres => {
      let options = allGenres.map(genre=>(
        {value: genre.id, label: genre.name}
      ))
      resolve({options})
    })
  )

  loadSkills = () => new Promise((resolve, reject) =>
    getAllSkills().then( allSkills => {
      let options = allSkills.map(skill=>(
        {value: skill.id, label: skill.name}
      ))
      resolve({options})
    })
  )


  influenceOptions = (query) => {
    return new Promise( (resolve, reject) =>
      query ? searchArtists(query).then(options => {
        console.log('infopt', options);
        resolve(options)}) : resolve({options: []})
    )
  }

  // influenceChange = (options) => {
  //   if (options.length < this.state.influences.length) {
  //     let artistInfluencesIds = options.map((option) => option.value.id)
  //     let userId = this.props.viewer.user.id
  //     this.props.relay.commitUpdate(
  //       new UpdateUser({userId,artistInfluencesIds}), {
  //         onSuccess: res => this.setState({notification: `INFLUENCES UPDATED`})
  //       }
  //     )
  //   } else {
  //     let newInfluence = options.find((option) => !option.value.id)
  //     ensureBtArtistExists(newInfluence).then(artistId => {
  //       let artistInfluencesIds = options.map(option=>option.value.id || artistId)
  //       let userId = this.props.viewer.user.id
  //       this.props.relay.commitUpdate(
  //         new UpdateUser({userId,artistInfluencesIds}),{
  //           onSuccess: res => this.setState({notification: `INFLUENCES UPDATED`})
  //         }
  //       )
  //     })
  //   }
  // }

  // genreChange = (val) => {
  //   let genresIds = val.map(genre=>genre.value)
  //   this.props.relay.commitUpdate(
  //     new UpdateUser({ userId: this.props.viewer.user.id, genresIds }), {
  //       onSuccess: res => this.setState({ notification: `GENRE UPDATED` })
  //     }
  //   )
  // }

  sendUpdate = () => {

    let updateObj = {
      userId: this.props.user.id,
      genresIds: this.state.genres.map(genre=>genre.value),
      skillsIds: this.state.skills.map(shill=>shill.value),
      // experience: this.state.experience,
      artistInfluencesIds: this.state.influences.map(option=>option.value.id)
    }

    // let updateObj = Object.assign({userId}, this.state)
    Relay.Store.commitUpdate(
      new UpdateUser(updateObj),{
        onSuccess: res => this.props.onSave(),
        onFailure: res => {console.log('fail', updateObj, res)}//handle failure
      }
    )
  }


  render() {
    console.log('state', this.state);
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
            onClick={this.props.onClose}
          />,
          <FlatButton
            label={"Save"}
            primary
            onClick={this.sendUpdate}
          />
        ]}
      >
        <Label>Experience</Label>
        <ExperienceRow>
          <ExperienceIcon style={{ marginRight: '5px' }} />
          <SelectField
            value={formatEnum(experience)}
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
          onChange={(val)=>{
            console.log('e i val', val);
            this.setState({ genres: val.map(x=>x.value) })
          }}
          multi
          className={'async'}
          placeholder={'add your genres'}
          style={{margin: '4px 0 8px 0'}}
        />
        <Label>Skills</Label>
        <Async
          loadOptions={this.loadSkills}
          value={skills}
          onChange={(val)=>this.setState({ skills: val.map(x=>x.value) })}
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
          onChange={(val)=>{
            console.log('VAL', val)
            this.setState({ influences: val})
          }}
          className={'async influences'}
          placeholder={'add your influences'}
          style={{margin: '4px 0 8px 0'}}
        />
      </Dialog>
    )
  }
}
