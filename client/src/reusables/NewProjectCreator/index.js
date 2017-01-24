import React, { Component } from 'react'
import Relay from 'react-relay'
import styled from 'styled-components'
import UpdateProjectMutation from 'mutations/UpdateProjectMutation'
import BTButton from 'reusables/BTButton'
import notes from 'imgs/icons/notes'
import {btWhite, btGhost, btLight, btMedium, btPurple} from 'styling/T'
import UploadArtwork from 'imgs/icons/UploadArtwork'
import UploadTrack from 'imgs/icons/UploadTrack'
import PrivateButton from 'imgs/icons/PrivateButton'
import TribeOnlyButton from 'imgs/icons/TribeOnlyButton'
import FindSessionsButton from 'imgs/icons/FindSessionsButton'
import Dropzone from 'react-dropzone'
import request from 'superagent'
import TextField from 'material-ui/TextField'
import {titleSanitizer} from 'utils/validators'
import {fileUploadUrl} from 'config/urls'
import AudioPlayer from 'reusables/AudioPlayer'
import {narrate, show} from 'utils'
import AddToProjectTracksMutation from 'mutations/AddToProjectTracksMutation'
import UpdateFileMutation from 'mutations/UpdateFileMutation'


const AudioContainer = styled.div`
  display: flex;
  margin: 10px auto;
  height: 100%;
  justify-content: center;
`

const UploadRow = styled.div`
  display: flex;
  flex-direction: row;
`

const UploadLeft = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  margin: 0 10px;
`
const UploadRight = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  margin: 0 10px;
`

const LabelInputPair = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 5px 0px 5px;
`

const UploadButtonContainer = styled.div`
  display: flex;
  width: 33%;
  margin: 10px 10px;
`

const EqualHeightContainer = styled.div`
  height: 250px;
  display: flex;
  flex-direction: column;
  align-content: space-around;
  align-items: stretch;
  justify-content: space-between;
`


const PrivacyButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0 10px;
`

const ButtonLabelPair = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  margin: 10px 0px;
  cursor: pointer;
`

const ButtonLabel = styled.span`
  margin-top: 5px;
  color: ${btMedium};
  text-align: center;
  font-size: .8em;
`


const Artwork = styled.img`
  height: 250px;
  width: auto;
`

const underlineFocusStyle = {
  color: btPurple
}

class NewProjectCreator extends Component {


  state = {
    description: this.props.project.description || '',
    privacy: this.props.project.privacy || 'PRIVATE',
    genre: this.props.project.genre || '',
    new: true,
    title: this.props.project.title,
    displayTitle: this.props.project.title,
    tracksIds: []
  }

  componentWillMount() {
    let title = this.state.title
    let index = title.search('~')
    if (index === -1) {
      return
    } else {
      let displayTitle = title.split('~')[0]
      this.setState({
        displayTitle: displayTitle
      })
    }
  }

  submitField = () => {
    let title = this.state.title
    let displayTitle = this.state.displayTitle

    if (displayTitle.search('untitled') === -1) {
      title = displayTitle
      title = titleSanitizer(displayTitle)
    }


    Relay.Store.commitUpdate(
      new UpdateProjectMutation({
        project: this.props.project,
        title: title,
        description: this.state.description,
        privacy: this.state.privacy,
        genre: this.state.genre,
        user: this.props.user,
        artworkId: this.state.artworkId,
        new: false,
        tracksIds: this.state.tracksIds
      }),
      {
        onSuccess: (success) => {
          console.log('success', success)
          this.props.router.push({
            pathname: `/${this.props.user.handle}/${success.updateProject.project.title}`
          })
        },
        onFailure: (transaction) => console.log(transaction),
      },
    )
  }


  submitProjectTracks = (fields) => {
    Relay.Store.commitUpdate(
      new AddToProjectTracksMutation({
        tracksFileId: fields.tracksFileId,
        trackProjectProjectId: fields.trackProjectProjectId
      }),
      {
        onSuccess: (success) => {
          console.log('success', success)
        },
        onFailure: (transaction) => console.log(transaction),
      },
    )
  }

  onDropArt = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles) {
      console.log('acceptedFiles', acceptedFiles)


      let file = acceptedFiles[0]

      console.log('file', file)

      request
        .post(fileUploadUrl)
        .attach('data', file)
        .end( (error, response) => {
          if (error || !response.ok ) {
            console.log(error)
          } else {
            console.log(response)
            this.setState({
              artworkId: response.body.id
            })
            this.submitField()
          }
        })

    }
    if (rejectedFiles) {
      console.log('rejectedFiles', rejectedFiles)
    }
  }

  onDropTrack = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles) {
      console.log('acceptedFiles', acceptedFiles)


      let file = acceptedFiles[0]

      console.log('file', file)


      request
      .post(fileUploadUrl)
      .attach('data', file)
      .end( (error, response) => {
        if (error || !response.ok ) {
          console.log(error)
        } else {
          let fileId = response.body.id

          this.submitProjectTracks({
            tracksFileId: fileId,
            trackProjectProjectId: this.props.project.id
          })

          this.createVisualization(file, fileId)

        }
      })



    }
    if (rejectedFiles) {
      console.log('rejectedFiles', rejectedFiles)
    }
  }

  createVisualization = (file, fileId) => {
    narrate('creating visualization')
    show('file', file)

    narrate('creating OfflineAudioContext')
    let ctx = new OfflineAudioContext(2,44100*40,44100)

    // narrate('creating BufferSource')
    // let source = ctx.createBufferSource()

    narrate('creating a FileReader')
    let reader = new FileReader()
    show('reader', reader)

    narrate('creating an onload callback for the reader')
    reader.onload = (event) => {
      narrate('reader onload callback')
      show('reader', reader)

      narrate('initializing buffer')
      let buffer = reader.result

      narrate('decoding audio data')
      ctx.decodeAudioData(buffer).then( (decodedData)=> {
        narrate('succesfully decoded audio data')
        show('decodedData', decodedData)

        narrate('getting channel data')
        let channelData = decodedData.getChannelData(0)
        show('channelData', channelData)

        narrate('looping through channel data to sampel')
        let visualization = []
        let interval = Math.floor(channelData.length / 100)
        show('interval', interval)
        for (let i = 0; visualization.length < 100; i += interval) {
          visualization.push(channelData[i])
        }
        show('visualization', visualization)

        narrate('addVisualizationToFile')
        this.addVisualizationToFile(fileId, visualization)

      })
    }


    narrate('creating a buffer from the file')
    let myBuffer = reader.readAsArrayBuffer(file)
    show('buffer', myBuffer)


  }

  addVisualizationToFile = (fileId, visualization) => {
    narrate('committing update')
    Relay.Store.commitUpdate(
      new UpdateFileMutation({
        fileId: fileId,
        visualization: visualization
      }),
      {
        onSuccess: (transaction) => {
          narrate('UpdateFileMutation succeeded')
          show('success', transaction)
        },
        onFailure: (transaction) => {
          narrate('UpdateFileMutation failed')
          show('transaction', transaction)        },
      },
    )
  }


  showArtwork = () => {
    if (this.props.project.artwork) {
      return (
        <Artwork
          src={this.props.project.artwork.url}
          alt={'project artwork'}
        />
      )
    } else {
      return (
          <Dropzone
            onDrop={this.onDropArt}
            multiple={false}
            accept={'image/*'}
            style={{
              display: 'flex',
              height: '250px',
              width: '100%',
              border: `2px dashed ${btLight} `,
              backgroundColor: `${btGhost}`,
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
          <UploadArtwork/>
        </Dropzone>
      )
    }
  }

  showTrack = () => {
    if (this.props.project.tracks.edges.length > 0) {
      return (
        <AudioPlayer
          id={this.props.project.tracks.edges[0].node.id}
          src={this.props.project.tracks.edges[0].node.url}
          track={this.props.project.tracks.edges[0].node}
        />
      )
    } else {
      return (
          <Dropzone
            onDrop={this.onDropTrack}
            multiple={false}
            accept={'audio/*'}
            style={{
              display: 'flex',
              height: '250px',
              width: '250px',
              border: `2px dashed ${btLight} `,
              backgroundColor: `${btGhost}`,
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
          <UploadTrack/>
        </Dropzone>
      )
    }
  }

  render() {
    return (
      <div>


        <AudioContainer>
          {this.showTrack()}
        </AudioContainer>

        <UploadRow>
          <UploadLeft>
            <EqualHeightContainer>
              <LabelInputPair>
                <TextField
                  name={'title'}
                  type={'text'}
                  value={this.state.displayTitle}
                  onChange={(e)=>{
                    this.setState({
                      displayTitle: e.target.value
                    })
                  }}
                  floatingLabelText={'Title'}
                  underlineFocusStyle={underlineFocusStyle}
                />
              </LabelInputPair>

              <LabelInputPair>
                <TextField
                  name={'genre'}
                  value={this.state.genre}
                  type={'text'}
                  onChange={(e)=>{
                    this.setState({
                      genre: e.target.value
                    })
                  }}
                  floatingLabelText={'Genre'}
                  underlineFocusStyle={underlineFocusStyle}
                />
              </LabelInputPair>

              <LabelInputPair>
                <TextField
                  name={'Description'}
                  floatingLabelText={'Description'}
                  multiLine={true}
                  rows={3}
                  value={this.state.description}
                  onChange={(e)=>{
                    this.setState({
                      description: e.target.value
                    })
                  }}
                  underlineFocusStyle={underlineFocusStyle}

                />
              </LabelInputPair>
            </EqualHeightContainer>




            <UploadButtonContainer>
              <BTButton
                onClick={ () => {
                  this.submitField()
                }}
                text={'Submit'}
                icon={notes}
                iconFill={btWhite}
                flex
              />
            </UploadButtonContainer>


          </UploadLeft>

          <UploadRight>

                {this.showArtwork()}


            <PrivacyButtonRow>
              <ButtonLabelPair
                onClick={()=>{
                  this.setState({privacy: 'PRIVATE'})
                }}
              >
                <PrivateButton
                  fill={(this.state.privacy === 'PRIVATE') ? btPurple : btLight}
                />
                <ButtonLabel>Only Me</ButtonLabel>
              </ButtonLabelPair>

              <ButtonLabelPair
                onClick={()=>{
                  this.setState({privacy: 'TRIBE'})
                }}
              >
                <TribeOnlyButton
                  fill={(this.state.privacy === 'TRIBE') ? btPurple : btLight}
                />
                <ButtonLabel>Tribe Only</ButtonLabel>
              </ButtonLabelPair>

              <ButtonLabelPair
                onClick={()=>{
                  this.setState({privacy: 'PUBLIC'})
                }}
              >
                <FindSessionsButton
                  fill={(this.state.privacy === 'PUBLIC') ? btPurple : btLight}
                />
                <ButtonLabel>Find Session</ButtonLabel>
              </ButtonLabelPair>


            </PrivacyButtonRow>

          </UploadRight>

        </UploadRow>
      </div>
    )
  }
}

export default NewProjectCreator
