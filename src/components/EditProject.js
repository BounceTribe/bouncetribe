import React, {Component} from 'react'
import Relay from 'react-relay'
import Lock from 'icons/Lock'
import Logo from 'icons/Logo'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {SharingModal, Choice, ChoiceText} from 'styled/ProjectNew'
import UpdateProject from 'mutations/UpdateProject'
import {white, purple, grey300} from 'theme'
import {RoundButton, BtFlatButton} from 'styled'
import {ensureUsersProjectTitleUnique, getAllGenres } from 'utils/graphql'
import Tribe from 'icons/Tribe'

export default class EditProfile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      privacy: this.props.project.privacy,
      description: this.props.project.description,
      title: this.props.project.title,
      genre: this.props.project.genres.edges[0].node.id,
      genres: null,
      titleError: '',
      descriptionError: ''
    }
    console.log('edit init', this);

    getAllGenres().then(results=>{
      let genres = results.map(genre=>(
        <MenuItem primaryText={genre.name} value={genre.id} key={genre.id} />
      ))
      this.setState({ genres })
    })
  }

  descriptionSet = (val) => {
    console.log('description', val, val.length);
    let error = ''
    if (val.split(/\r\n|\r|\n/).length > 10) error='Too many lines'
    if (val.length > 400) error='500 character limit exceeded'
    this.setState({description: val, descriptionError: error})
  }

  titleChange = (title) => {
    this.setState({ title, titleUnique: true })
    this.debounce && clearTimeout(this.debounce)
    this.debounce = setTimeout(()=>{
      ensureUsersProjectTitleUnique(this.user.id, title).then(unique=>{
        this.setState({titleUnique: unique})
      })
    }, 1000)
  }

  updateProject = () => {
    let {privacy, title, description} = this.state
    let id = this.props.projectId
    let updatedProject = { id, privacy, title, description }
    Relay.Store.commitUpdate(
      new UpdateProject({
        project: updatedProject,
        genresIds: this.state.genre }), {
          onSuccess: success => this.props.onSave(),
          onFailure: failure =>
            console.log('updateproject fail', failure, {updatedProject})
        }
    )
    this.setState({edit: false})
  }

  render() {
    let { privacy,
          description,
          genres,
          genre,
          title,
          titleError,
          descriptionError } = this.state
    console.log('state', this.state);

    if (!this.state.genres) return null
    return (
      <Dialog
        open
        onRequestClose={()=>this.props.onClose()}
        autoScrollBodyContent
        title={'Edit Project'}
        actionsContainerStyle={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
        actions={[
          <FlatButton
            label={"Delete Project"}
            labelStyle={{ color: '#DF5151' }}
            onClick={this.props.delete}
          />,
          <BtFlatButton
            label={'Save'}
            onClick={()=>this.updateProject()}
            disabled={!!titleError || !!descriptionError}
            />
        ]}>
        <TextField
          floatingLabelText={'Title'}
          errorText={titleError}
          value={title}
          disabled
          fullWidth />
        <SelectField
          floatingLabelText={'Genre'}
          value={genre}
          fullWidth
          onChange={(e, index, value)=>{ this.setState({genre:value}) }}
          selectedMenuItemStyle={{ color: purple }} >
          {genres}
        </SelectField>
        <TextField
          floatingLabelText={'Description'}
          errorText={descriptionError}
          multiLine
          rowsMax={5}
          value={description || ''} //no null value allowed
          onChange={(e)=>this.descriptionSet(e.target.value)}
          fullWidth />
        <SharingModal>
          <Choice>
            <RoundButton
              onClick={()=>this.setState({privacy: 'PRIVATE'})}
              backgroundColor={(privacy === 'PRIVATE') ? purple : grey300}
              icon={ <Lock height={23} width={22} fill={white} /> } />
            <ChoiceText>Private</ChoiceText>
          </Choice>
          <Choice>
            <RoundButton
              onClick={()=>this.setState({privacy: 'TRIBE'})}
              backgroundColor={(privacy === 'TRIBE') ? purple : grey300}
              icon={ <Tribe fill={white} /> } />
            <ChoiceText>Tribe Only</ChoiceText>
          </Choice>
          <Choice>
            <RoundButton
              onClick={()=>this.setState({privacy: 'PUBLIC'})}
              backgroundColor={(privacy === 'PUBLIC') ? purple : grey300}
              icon={ <Logo fill={white} /> } />
            <ChoiceText>Public</ChoiceText>
          </Choice>
        </SharingModal>
      </Dialog>
    )
  }
}
