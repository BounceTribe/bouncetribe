import React, {Component} from 'react'


class InfluenceChip extends Component {
  // constructor() {
  //   super()
  // }

  render() {
    return (
      <div>
        <span>{this.props.artist.name}</span>
        <button>X</button>
      </div>
    )
  }
}

export default InfluenceChip
