import React, {Component} from 'react'
import InfluenceChip from 'reusables/InfluenceChip'

class InfluencesField extends Component {
  // constructor(props) {
  //   super(props)
  // }

   get renderInfluenceChips() {
    const influences = this.props.influences.edges.map((edge, id) =>
      <InfluenceChip
        key={edge.node.artist.id}
        artist={edge.node.artist}
      />
    )
    return influences
  }

  render() {
    return (
      <div>
        <h3>Influences</h3>
        <input
          type={'text'}
        />
        <button>
          Add One
        </button>
        <div>
          {this.renderInfluenceChips}
        </div>
      </div>
    )
  }
}

export default InfluencesField
