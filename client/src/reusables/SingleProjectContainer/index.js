import React, { Component } from 'react'
import Relay from 'react-relay'
import styled from 'styled-components'
import UpdateProjectMutation from 'mutations/UpdateProjectMutation'
import UploadLight from 'imgs/icons/UploadLight'
import BTButton from 'reusables/BTButton'
import notes from 'imgs/icons/notes'
import {btWhite, btGhost, btLight, btMedium, btPurple} from 'styling/T'
import UploadArtwork from 'imgs/icons/UploadArtwork'
import PrivateButton from 'imgs/icons/PrivateButton'
import TribeOnlyButton from 'imgs/icons/TribeOnlyButton'
import FindSessionsButton from 'imgs/icons/FindSessionsButton'
import Dropzone from 'react-dropzone'
import request from 'superagent'
import TextField from 'material-ui/TextField'


const UploadButton = styled.button`
  display: flex;
  margin: 10px auto;
  height: 100%;
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

class SingleProjectContainer extends Component {

  componentDidMount() {
    this.setState({
      title: this.untitledCheck(this.props.project.title)
    })
  }

  state = {
    description: this.props.project.description || '',
    privacy: this.props.project.privacy || 'PRIVATE',
    genre: this.props.project.genre || '',
  }

  untitledCheck = (title) => {
    if (title.includes('untitled') && title.length > 20) {
      return ''
    } else {
      return title
    }
  }

  submitField = () => {
    Relay.Store.commitUpdate(
      new UpdateProjectMutation({
        project: this.props.project,
        title: this.state.title,
        description: this.state.description,
        privacy: this.state.privacy,
        genre: this.state.genre,
        user: this.props.user,
        artworkId: this.state.artworkId
      }),
      {
        onSuccess: (success) => {
          console.log('success', success)
          this.props.router.replace({
            pathname: `/${this.props.user.handle}/projects/${success.updateProject.project.title}`
          })
        },
        onFailure: (transaction) => console.log(transaction),
      },
    )
  }


  onDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles) {
      console.log('acceptedFiles', acceptedFiles)

      let url = 'https://api.graph.cool/file/v1/ciwdr6snu36fj01710o4ssheb'

      let file = acceptedFiles[0]

      console.log('file', file)

      request
        .post(url)
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
            onDrop={this.onDrop}
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

  render() {
    console.log(this.props.project)
    return (
      <div>


        <UploadButton>
          <UploadLight
          />
        </UploadButton>

        <UploadRow>
          <UploadLeft>
            <EqualHeightContainer>
              <LabelInputPair>
                <TextField
                  name={'title'}
                  type={'text'}
                  value={this.state.title}
                  onChange={(e)=>{
                    this.setState({
                      title: e.target.value
                    })
                  }}
                  floatingLabelText={'Title'}
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
                />
              </LabelInputPair>
            </EqualHeightContainer>




            <UploadButtonContainer>
              <BTButton
                onClick={this.submitField}
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

export default Relay.createContainer(
  SingleProjectContainer,
  {
    fragments: {
      user: () => Relay.QL`
        fragment on User {
          placename
          longitude
          latitude
          website
          experience
          email
          name
          profilePicUrl
          profilePicThumb
          handle
          summary
          id
        }
      `,
    },
  }
)
