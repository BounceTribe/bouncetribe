import React, {Component} from 'react'
import Relay from 'react-relay'
import ProfileField from './ProfileField'
import EditPersonMutation from './EditPersonMutation'

class ProfileContainer extends Component {
  // constructor(props) {
  //   super(props)
  // }


  handleEditField = (fields = {}) => {
    console.log(fields)
    const person = this.props.viewer.self.edges[0].node
    console.log(person)
    Relay.Store.commitUpdate(
      new EditPersonMutation({
        person: person,
        handle: fields.handle,
      }),
      {
        onSuccess: (success) => console.log(success),
        onFailure: (transaction) => console.log(transaction),
      },
    )
  }

  get renderProfileField() {
      return this.props.viewer.self.edges.map(edge => (
        <ProfileField
          field={'handle'}
          key={edge.node.personID}
          text={edge.node.handle}
          person={edge.node}
          submitField={this.handleEditField}
        />
      ))
    }

  render() {
    console.log(this.props.viewer)
    return (
      <div>
        {/* <img
          src={this.props.self.profilePicUrl}
          alt="Profile"
        /> */}
        <h1>Hi nilan!</h1>
        <h3>{this.props.viewer.self.email}</h3>
        <h4>{this.props.viewer.self.handle}</h4>
        {this.renderProfileField}
      </div>
    )
  }

}

export default Relay.createContainer(
  ProfileContainer,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          self (first: 1000) {
            edges {
              node {
                personID
                email
                name
                handle
                ${EditPersonMutation.getFragment('person')}
              }
            }
          }
        }
      `,
    },
  }
)
