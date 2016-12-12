import React, {Component} from 'react'
import InfluenceChip from 'reusables/InfluenceChip'
import {btTeal, btWhite} from 'styling/T'
import {spotifyConfig} from 'apis/spotify'
import styled from 'styled-components'

const ProfileFieldLabel = styled.h3`
  font-weight: bold;
  margin-bottom: 10px;
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
  }

  submitInfluence = () => {
    let influence = {
      name: this.state.artists[0].name,
      spotifyId: this.state.artists[0].id,
      imageUrl: this.state.artists[0].images[0].url
    }
    this.props.submitInfluence(influence)
  }

  get renderInfluenceChips() {
    const influences = this.props.influences.edges.map((edge) =>
      <InfluenceChip
        key={edge.node.artist.id}
        artist={edge.node.artist}
        influenceId={edge.node.id}
        deleteInfluence={this.props.deleteInfluence}
      />
    )
    return influences
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
    this.setState({
      artist: e.target.value,
    })
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
        <input
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
        />
        <datalist
          id={'artistOptions'}
        >
          {this.state.artistOptions}
        </datalist>
        <button
          style={{
            height: '50px',
            width: '50px',
            borderRadius: '50px',
            backgroundColor: btTeal,
            color: btWhite,
            verticalAlign: 'center'
          }}
          onClick={this.submitInfluence}
        >
          <span
            style={{
              fontSize: '50px',
              lineHeight: '50px'
            }}
          >
            &#43;
          </span>
        </button>
        <div>
          {this.renderInfluenceChips}
        </div>
      </div>
    )
  }
}

export default InfluencesField
