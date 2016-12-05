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
    Relay.Store.commitUpdate(
      new EditPersonMutation({
        personID: this.props.viewer.self.personID,
        handle: fields.handle,
        viewer: this.props.viewer
      }),
      {
        onSuccess: (success) => console.log(success),
        onFailure: (transaction) => console.log(transaction),
      },
    )
  }

  render() {
    console.log(this.props.viewer)
    return (
      <div>
        {/* <img
          src={this.props.self.profilePicUrl}
          alt="Profile"
        /> */}
        <h3>{this.props.viewer.self.email}</h3>
        <h4>{this.props.viewer.self.handle}</h4>
        <ProfileField
          field={'handle'}
          text={this.props.viewer.self.handle}
          person={this.props.viewer.self}
          submitField={this.handleEditField}
        />
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
          self {
            personID
            email
            name
            handle
            profilePicUrl
            influences
          }
        }
      `,
    },
  }
)
