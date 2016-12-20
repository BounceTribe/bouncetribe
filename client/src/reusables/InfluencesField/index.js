import React, {Component} from 'react'
import InfluenceChip from 'reusables/InfluenceChip'
import {btTeal} from 'styling/T'
import {spotifyConfig} from 'apis/spotify'
import styled from 'styled-components'
import Plus from 'imgs/icons/plus'
import {btWhite, btLight} from 'styling/T'

const ProfileFieldLabel = styled.h3`
  font-weight: bold;
  margin-bottom: 10px;
`

const PlusButton = styled.button`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: ${btTeal};
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  visibility: ${props=>(props.ownProfile && props.showButton)? 'visible' : 'hidden'};
`

const InfluencesInput = styled.input`
  display: flex;
  width: ${props => props.showInput ? '200px' : 0 };
  margin-right: ${props => props.showInput ? '15px' : 0 };
  opacity: ${props => props.showInput ? 1 : 0 };
  transition: all .3s;
  visibility: ${props=>(props.ownProfile)? 'visible' : 'hidden'};
`

const ChipContainer = styled.div`
  min-height: 30px;
`

const InfluencesRow = styled.div`
  display: flex;
  flex-direction: row;
`

const EmptyMessage = styled.p`
  cursor: pointer;
  color: ${btLight};
  font-size: .9em;
`

class InfluencesField extends Component {

  state = {
    artist: '',
    artists: [
      {
        name: ''
      }
    ],
    artistOptions: [],
    active: false,
    showButton: (this.props.influences.length > 0) ? true : false
  }

  submitInfluence = () => {
    if (this.props.ownProfile) {
      let influence = {
        name: this.state.artists[0].name,
        spotifyId: this.state.artists[0].id,
        imageUrl: this.state.artists[0].images[0].url
      }
      this.props.submitInfluence(influence)
    }
  }

  get renderInfluenceChips() {
    if (!this.state.showButton) {
      return (
        <EmptyMessage
          onClick={()=>{
            this.setState({
              showButton: true,
              showInput: true
            })
          }}
        >add your influences
      </EmptyMessage>
      )
    } else {
      return this.props.influences.edges.map((edge) =>
        <InfluenceChip
          key={edge.node.artist.id}
          artist={edge.node.artist}
          influenceId={edge.node.id}
          deleteInfluence={this.props.deleteInfluence}
        />
      )
    }
  }

  callApi = async () => {
    if (this.state.active) {
      let config = spotifyConfig(this.state.artist)
      const response = await fetch(...config).then(resp => resp.json()).then(json => json)
      const artists = response.artists.items.map(artist => artist)
      const artistOptions = response.artists.items.map(artist => (
        <option
          key={artist.id}
          value={artist.name}
        />
      ))
      this.setState({
        artistOptions: artistOptions,
        artists: artists
      })
    }
  }

  editText = (e) => {
    if (this.props.ownProfile) {
      this.setState({
        artist: e.target.value,
      })
    }
  }

  handleChange = (e) => {
    this.setState({
      active:true,
    })
    this.debounce()
    this.editText(e)
    this.timerStart()
  }

  timerStart = () => {
    const timer = setTimeout(()=> {
      this.callApi()
    },1000)
    this.setState({
      timer: timer
    })
  }

  debounce = () => {
    clearTimeout(this.state.timer)
  }

  showInput = () => {
    this.setState({
      showInput: true
    })
  }

  render() {
    return (
      <div
        onKeyPress={(e)=>{
          if (e.key === 'Enter') {
            this.submitInfluence()
          }
        }}
      >
        <ProfileFieldLabel>Influences</ProfileFieldLabel>

        <ChipContainer>
          {this.renderInfluenceChips}
        </ChipContainer>

        <InfluencesRow>

          <InfluencesInput
            type={'text'}
            list={'artistOptions'}
            onChange={(e) => {
              this.handleChange(e)
            }}
            onBlur={()=>{
              this.debounce()
              this.setState({
                active: false
              })
            }}
            showInput={this.state.showInput}
            ownProfile={this.props.ownProfile}
          />
          <datalist
            id={'artistOptions'}
          >
            {this.state.artistOptions}
          </datalist>
          <PlusButton
            onClick={this.showInput}
            ownProfile={this.props.ownProfile}
            showButton={this.state.showButton}
          >
            <Plus
              height={'40px'}
              width={'40px'}
              fill={btWhite}
            />

          </PlusButton>


        </InfluencesRow>


      </div>
    )
  }
}

export default InfluencesField
