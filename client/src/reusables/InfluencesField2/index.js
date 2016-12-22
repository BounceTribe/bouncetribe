import React, {Component} from 'react'
import Select, {AsyncCreatable} from 'react-select'
import {spotifyConfig} from 'apis/spotify'
import 'react-select/dist/react-select.css';
import styled from 'styled-components'
import InfluenceChip from 'reusables/InfluenceChip'
import {btTeal, btWhite} from 'styling/T'
import Plus from 'imgs/icons/plus'


const InfluencesField2Container = styled.div`
  display: ${props => props.showInput ? 'inline-flex' : 'none' };
  width: ${props => props.showInput ? '200px' : 0 };
  margin-right: ${props => props.showInput ? '15px' : 0 };
  opacity: ${props => props.showInput ? 1 : 0 };
  transition: all .3s;
  visibility: ${props=>(props.ownProfile)? 'visible' : 'hidden'};
`

const ChipContainer = styled.div`
  min-height: 30px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const PlusButton = styled.button`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: ${btTeal};
  align-content: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  visibility: ${props=>(props.ownProfile && props.showButton && !props.showInput)? 'visible' : 'hidden'};
`


class InfluencesField2 extends Component {

  state ={
    showButton: true
  }

  get renderInfluenceChips() {
    return this.props.influences.edges.map((edge) =>
      <InfluenceChip
        key={edge.node.artist.id}
        artist={edge.node.artist}
        influenceId={edge.node.id}
        deleteInfluence={this.props.deleteInfluence}
      />
    )
  }

  submitInfluence = (selection) => {
    if (this.props.ownProfile) {
      this.props.submitInfluence(selection)
    }
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
            imageUrl: artist.images[0].url
          },
          label: artist.name
        }
      })
      console.log('artistsOptions', artists)
      return {
        options: artists
      }
    } catch (error) {
      console.log('spotify error', error)
    }
  }

  showInput = () => {
    this.setState({
      showInput: true
    })
  }


  initialOptions = () => {
    let options = this.props.influences.edges.map((edge) => {
      return {
        value: {
          name: edge.node.artist.name,
          spotifyId: edge.node.artist.spotifyId,
          imageUrl: edge.node.artist.imagesUrl
        },
        label: edge.node.artist.name
      }
    })
    return options
  }

  render() {
    console.log(this.props.influences)

    return (
      <div>
        <ChipContainer>
          {this.renderInfluenceChips}
          <InfluencesField2Container
            showInput={this.state.showInput}
            ownProfile={this.props.ownProfile}
          >
            <Select.Async
              loadOptions={this.asyncOptions}
              name="form-field-name"
              value="drake"
              onChange={(value)=>{
                console.log(value)
                this.submitInfluence(value)
              }}
            />
          </InfluencesField2Container>
          <PlusButton
            onClick={this.showInput}
            ownProfile={this.props.ownProfile}
            showButton={this.state.showButton}
            showInput={this.state.showInput}
          >
            <Plus
              height={'40px'}
              width={'40px'}
              fill={btWhite}
            />
          </PlusButton>
        </ChipContainer>

        <AsyncCreatable
          loadOptions={this.asyncOptions}
          name="form-field-name"
          onChange={(value)=>{
            console.log(value)
            this.submitInfluence(value)
          }}
          value={this.initialOptions()}
          multi={true}
        />
      </div>
    )
  }
}

export default InfluencesField2
