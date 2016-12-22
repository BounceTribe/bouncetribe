import React, {Component} from 'react'
import {spotifyConfig} from 'apis/spotify'
import AsyncCreatable from 'reusables/react-select/AsyncCreatable'
import 'react-select/dist/react-select.css';

// import Select, {AsyncCreatable} from 'react-select'
// import {spotifyConfig} from 'apis/spotify'
// import 'react-select/dist/react-select.css';
import styled from 'styled-components'
// import InfluenceChip from 'reusables/InfluenceChip'
// import {btTeal, btWhite} from 'styling/T'
// import Plus from 'imgs/icons/plus'


const Container = styled.div`
  width: 400px;
`

class InfluencesField3 extends Component {

  state = {
    influences: []
  }

  componentWillMount() {
    this.initialOptions(this.props)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.influences) {
      this.initialOptions(newProps)
    }
  }

  initialOptions = (props) => {
    let options = props.influences.edges.map((edge) => {
      return {
        value: {
          name: edge.node.artist.name,
          spotifyId: edge.node.artist.spotifyId,
          imageUrl: edge.node.artist.imagesUrl,
          influenceId: edge.node.id
        },
        label: edge.node.artist.name
      }
    })
    this.setState({
      influences: options
    })
  }

  asyncOptions = async (input) => {
    try {
      if (!input) {
        return {
          options: []
        }
      }

      let config = spotifyConfig(input)
      const response = await fetch(...config).then(resp => resp.json()).then((json) =>json)
      const artists = response.artists.items.map((artist) => {
        return {
          value: {
            name: artist.name,
            spotifyId: artist.id,
            imageUrl: (artist.images.length > 0) ? artist.images[0].url : ''
          },
          label: artist.name
        }
      })
      return {
        options: artists
      }
    } catch (error) {
      console.log('spotify error', error)
    }
  }

  submitInfluence = (selection) => {
    if (this.props.ownProfile) {
      const match = this.props.influences.edges.find((edge)=>{
        return edge.node.artist.spotifyId === selection.value.spotifyId
      })

      if (match) {
        console.log('already exists, wont submit')
        return
      } else {
        this.props.submitInfluence(selection)
      }
    }
  }

  handleChange = (newValues) => {
    let oldValues = this.state.influences
    if (newValues.length > oldValues.length) {
      this.submitInfluence(newValues.pop())
    }


    if (newValues.length < oldValues.length) {
      let deleted = oldValues.find((oldValue)=>{
        let match = newValues.find((newValue)=>{
          return newValue.value.spotifyId === oldValue.value.spotifyId
        })
        return !match
      })
      this.props.deleteInfluence({
        influenceId: deleted.value.influenceId
      })
    }

  }



  render() {

    return (
      <Container>

        <AsyncCreatable
          value={this.state.influences}
          loadOptions={this.asyncOptions}
          multi={true}
          onChange={this.handleChange}
        />


      </Container>
    )
  }
}

export default InfluencesField3
