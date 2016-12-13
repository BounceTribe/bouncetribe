import React, {Component} from 'react'
import {btLight, btWhite, btMedium} from 'styling/T'
import styled from 'styled-components'

const ChipContainer = styled.div`
  height: 30px;
  background-color: ${btLight};
  color: ${btWhite};
  display: inline-flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  border-radius: 30px;
`


class InfluenceChip extends Component {
  // constructor() {
  //   super()
  // }
  state = {
    hovered: false
  }

  handleMouseOver = () => {
    this.setState({
      hovered: true
    })
  }

  handleMouseOut = () => {
    this.setState({
      hovered: false
    })
  }

  handleDelete = () => {
    let fields = {
      influenceId: this.props.influenceId
    }
    this.props.deleteInfluence(fields)
  }

  render() {
    return (
      <ChipContainer
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        <img
          src={this.props.artist.imageUrl}
          alt='presentation'
          style={{
            width: '30px',
            height: '100%',
            display: 'flex',
            borderRadius: '30px'
          }}
        />
        <span
          style={{
            display: 'flex',
            marginLeft: '10px',
            marginRight: 'auto'

          }}
        >{this.props.artist.name}</span>
        <button
          onClick={this.handleDelete}
          style={{
            height:'30px',
            width: '30px',
            borderRadius: '30px',
            backgroundColor: btMedium,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: (this.state.hovered) ? '1' : '0',
            transition: 'all .5s ease',
            marginLeft: '10px'
          }}
        >X</button>
      </ChipContainer>
    )
  }
}

export default InfluenceChip
