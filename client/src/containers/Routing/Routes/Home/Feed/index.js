import React, {Component} from 'react'
import BTButton from 'reusables/BTButton'

class Feed extends Component {

  render() {
    return (
      <section>
        <h1>Feed</h1>
        <h4>Woah cool check out your feed</h4>
        <BTButton
          onClick={this.props.logout}
          text={'Logout'}
          danger
        />

      </section>
    )
  }
}

export default Feed
