import React, { Component } from 'react'
import Relay from 'react-relay'
import styled from 'styled-components'
import UpdateProjectMutation from 'mutations/UpdateProjectMutation'
import UploadLight from 'imgs/icons/UploadLight'
import BTButton from 'reusables/BTButton'
import notes from 'imgs/icons/notes'
import {btWhite, btGhost, btLight} from 'styling/T'
import UploadArtwork from 'imgs/icons/UploadArtwork'

const UploadButton = styled.button`
  display: flex;
  margin: auto;
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
  margin: 10px 10px;
`

const UploadButtonContainer = styled.div`
  display: flex;
  width: 33%;
  margin: 10px 10px;
`

const ArtworkButton = styled.button`
  background-color: ${btGhost};
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  border: 1px solid ${btLight};
  margin: 0 10px;
  height: 100%;
`
const EqualHeightContainer = styled.div`
  height: 250px;
  display: flex;
  flex-direction: column;
  align-content: space-around;
  align-items: stretch;
  justify-content: space-between;
`

const Description = styled.textarea`
  min-height: 100px;
`

class SingleProjectContainer extends Component {

  submitField = () => {
    Relay.Store.commitUpdate(
      new UpdateProjectMutation({
        project: this.props.project,
        title: this.state.title,
        user: this.props.user
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

  render() {
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
                <label>Project Title</label>
                <input
                  type={'text'}
                  onChange={(e)=>{
                    this.setState({
                      title: e.target.value
                    })
                  }}
                />
              </LabelInputPair>

              <LabelInputPair>
                <label>Genre</label>
                <input
                  type={'text'}
                  onChange={(e)=>{
                    this.setState({
                      genre: e.target.value
                    })
                  }}
                />
              </LabelInputPair>

              <LabelInputPair>
                <label>Description</label>
                <Description
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
            <EqualHeightContainer>
              <ArtworkButton>
                <UploadArtwork/>
              </ArtworkButton>
            </EqualHeightContainer>


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
