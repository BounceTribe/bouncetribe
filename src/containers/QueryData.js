import React, {Component} from 'react'
import Relay from 'react-relay'
// import CreateSession from 'mutations/CreateSession'


class QueryData extends Component {
  componentDidMount() {
    let self = this
    console.log('self', self);
    this.props.relay.setVariables({
      theirHandle: self.props.User.handle,
      userHandle: self.props.user.handle,
    })
  }
  render() {
    return <div></div>
  }
}

export default Relay.createContainer( QueryData, {
  initialVariables: { userHandle : ''},
   fragments: { user: () => Relay.QL`
       fragment on UserFilter {
         sender: {
           handle: $userHandle
         }
       }
     `,
   },
 }
)
