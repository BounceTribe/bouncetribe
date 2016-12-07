import React, {Component} from 'react'
import Relay from 'react-relay'

class ProfileCard extends Component {
  // constructor(props) {
  //   super(props)
  // }


  render() {
    return (
      <div>
        {/* <img
          src={this.props.user.picture}
          style={{
            maxWidth: '50px',
            height: 'auto'
          }}
          role="presentation"
        ></img> */}
        {/* <span>{this.props.user.email}</span> */}
        <h3>You're logged in.</h3>
        <button
          onClick={()=>{this.props.logout()}}
        >logout</button>
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
          user
        }
      `,
    },
  }
)
