import React, {Component} from 'react'
import Relay from 'react-relay'
import BTButton from 'reusables/BTButton'

class ProfileCard extends Component {
  // constructor(props) {
  //   super(props)
  // }


  render() {
    return (
      <div>
        <span>{this.props.viewer.user.name}</span>
        <BTButton
          onClick={()=>{this.props.logout()}}
          text={'Logout'}
        />
      </div>
    )
  }
}

export default Relay.createContainer(
  ProfileCard,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            name
          }
        }
      `,
    },
  }
)
