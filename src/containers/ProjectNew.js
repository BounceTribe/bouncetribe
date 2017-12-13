import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProjectNewView, Button, RoundButton, IconText, IconTextContainer} from 'styled'
import {Row, Left, Right, Sharing, Choice, ChoiceText, ArtworkDrop, TrackContainer, Container} from 'styled/ProjectNew'
import {Header} from 'styled/list'
import AudioUploader from 'components/AudioUploader'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'
import CreateProject from 'mutations/CreateProject'
import Music from 'icons/Music'
import AudioPlayer from 'components/AudioPlayer'
import {Spinner} from 'styled/Spinner'
import LinearProgress from 'material-ui/LinearProgress'
import ImageEditor from 'components/ImageEditor'
import {getAllGenres} from 'utils/graphql'
import MenuItem from 'material-ui/MenuItem'
import {url} from 'config'
import {purple, grey300, white} from 'theme'
import {ensureUsersProjectTitleUnique} from 'utils/graphql'
import Lock from 'icons/Lock'
import Tribe from 'icons/Tribe'
import Logo from 'icons/Logo'

class ProjectNew extends Component {

  state = {
    title: '',
    progress: 0,
    imageEditorOpen: false,
    genre: '',
    genres: [],
    privacy: 'PUBLIC',
    artworkUrl: `${url}/uploadartwork.png`,
    artworkSmallUrl: `${url}/uploadartwork.png`
  }

  constructor(props) {
    super(props)
    getAllGenres().then(results=>{
      let genres = results.map(genre=>(
        <MenuItem
          primaryText={genre.name}
          value={genre.id}
          key={genre.id}
        />
      ))
      this.setState({genres})
    })
  }

  createProject = () => {
    let project = this.state
    let {user} = this.props.viewer
    console.log('creating project', project);
    this.props.relay.commitUpdate(
      new CreateProject({project, user}), {
        onSuccess: success => {
          console.log('success', success)
            this.props.router.push(`/${user.handle}/${project.title}`)
        },
        onFailure: failure => console.log('fail', failure)
      }
    )
  }

  audioDropped = ({audioProgress, title, size}) => {
    if (title) {
      this.updateProgress()
      ensureUsersProjectTitleUnique(this.props.viewer.user.id, title)
      .then(unique=>{
        this.setState({
          titleUnique: unique,
          audioProgress,
          title,
          message: 'Generating Waveform',
          size
        })
      })
    } else {
      this.setState({
        audioProgress,
        message: 'Uploading Audio File'
      })
    }
  }

  updateProgress = () => {

    this.timer = setInterval( ()=>{
      this.setState( (prevState, props) => {
        let {progress, audioProgress} = prevState
        if (audioProgress === 'GENERATING' && progress >= 40) {
          progress = 40
        } else if (audioProgress === 'UPLOADING' && progress <= 40) {
          progress += 3
        } else if (audioProgress === 'UPLOADING' && progress >= 90) {
          progress = 90
        } else if (audioProgress === 'COMPLETE') {
          progress = 100
        } else {
          progress ++
        }
        return {
          progress
        }
      })
    }, 500)
  }

  clearTimer = () => clearInterval(this.timer)

  audioSuccess = (file) => {
    console.log('audioSuccess')
    this.clearTimer()
    this.setState({
      track: file,
      tracksIds: [file.id],
      message: false,
      audioProgress: false
    })
  }

  get uploader () {
    let {track, audioProgress} = this.state
    if (!track && audioProgress && audioProgress !== 'COMPLETE' ) {
      return ( <Spinner style={{height: '200px'}} /> )
    } else if (!this.state.track) {
      return (
        <AudioUploader
          audioSuccess={this.audioSuccess}
          self={this.props.viewer.user}
          audioDropped={this.audioDropped}
        />
      )
    } else {
      return (
        <TrackContainer>
          <AudioPlayer track={this.state.track} />
        </TrackContainer>
      )
    }
  }

  artworkSuccess = (files) => {
    this.setState({
      artworkSmallId: files[1].id,
      artworkSmallUrl: files[1].Url,
      artworkUrl: files[0].url,
      artworkId: files[0].id,
      imageEditorOpen: false
    })
  }

  titleChange = (title) => {
    this.setState({
      title,
      titleUnique: true
    })
    if (this.debounce) {
      clearTimeout(this.debounce)
    }
    this.debounce = setTimeout(()=>{
      ensureUsersProjectTitleUnique(this.props.viewer.user.id, title).then(unique=>{
        this.setState({titleUnique: unique})
      })
    },1000)
  }

  get form () {
    let {title, tracksIds, audioProgress, privacy, titleUnique, genre} = this.state
    if (audioProgress && audioProgress !== 'GENERATING') {
      return (
        <Row>
          <Left>
            <TextField
              floatingLabelText={'Title'}
              name={'title'}
              type={'text'}
              value={this.state.title}
              onChange={(e)=>this.titleChange(e.target.value)}
              fullWidth={true}
              errorText={(!titleUnique && title) ? 'Title must be unique' : null}
            />
            <SelectField
              floatingLabelText={'Genre'}
              value={this.state.genre}
              fullWidth={true}
              onChange={(e, index, value)=>{ this.setState({genre:value}) }}
              selectedMenuItemStyle={{ color: purple }}
            >
              {this.state.genres}
            </SelectField>
            <TextField
              name={'description'}
              floatingLabelText={'Details'}
              multiLine={true}
              rows={3}
              value={this.state.description}
              onChange={(e)=>{this.setState({description:e.target.value})}}
              fullWidth={true}
            />
            <Button
              style={{ marginTop: '20px' }}
              primary={true}
              disabled={(!titleUnique || !title || !tracksIds || !genre)}
              label={'Create Project'}
              onClick={this.createProject}
              icon={ <Music fill={white} /> }
            />
          </Left>
          <Right>
            <ArtworkDrop
              onClick={()=>this.setState({imageEditorOpen: true})}
              src={this.state.artworkSmallUrl || this.state.artworkUrl || `${url}/artwork.png` }
            />


            <ImageEditor
              altSizes={[500]}
              open={this.state.imageEditorOpen}
              onRequestClose={()=>this.setState({imageEditorOpen:false})}
              user={this.props.viewer.user}
              portraitSuccess={this.artworkSuccess}
            />
            <Sharing>
              <Choice>
                <RoundButton
                  onClick={()=>this.setState({privacy: 'PRIVATE'})}
                  backgroundColor={(privacy === 'PRIVATE') ? purple : grey300}
                  icon={
                    <Lock style={{}} height={23} width={22} fill={white} />
                  }
                />
                  <ChoiceText>
                    Private
                  </ChoiceText>
              </Choice>
              <Choice>
                <RoundButton
                  onClick={()=>this.setState({privacy: 'TRIBE'})}
                  backgroundColor={(privacy === 'TRIBE') ? purple : grey300}
                  icon={ <Tribe fill={white} /> }
                />
                <ChoiceText>
                  Tribe Only
                </ChoiceText>
              </Choice>
              <Choice>
                <RoundButton
                  onClick={()=>this.setState({privacy: 'PUBLIC'})}
                  backgroundColor={(privacy === 'PUBLIC') ? purple : grey300}
                  icon={ <Logo fill={white} /> }
                />
                <ChoiceText>
                  Public
                </ChoiceText>
              </Choice>
            </Sharing>
          </Right>
        </Row>
      )
    }
  }

  render () {
    let {audioProgress, progress} = this.state
    return (
      <ProjectNewView>
        <Header>
          <IconTextContainer>
            <Music style={{ display: 'flex', marginBottom: '5px' }} fill={purple} />
            <IconText style={{ cursor: '' }} > New Project </IconText>
          </IconTextContainer>
        </Header>
        {
          (this.props.viewer.user.projects.edges.length < 9) ?
          (
            <Container>
              {this.uploader}
              <LinearProgress
                mode={'determinate'}
                value={progress}
                style={{
                  display: (!audioProgress || audioProgress === 'COMPLETE') ? 'none' : ''
                }}
              />
              {this.form}
            </Container>
          ) : (
            <h4>Sorry, you've reached your 10 project limit.</h4>
          )
        }
      </ProjectNewView>
    )
  }
}


export default Relay.createContainer(
  ProjectNew, {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
            score
            ${AudioUploader.getFragment('self')}
            projects (first: 999) {
              edges {
                node {id}
              }
            }
          }
        }
      `,
    }
  }
)
