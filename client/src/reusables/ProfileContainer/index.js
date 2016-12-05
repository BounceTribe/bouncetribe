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
    this.props.relay.commitUpdate(
      new EditPersonMutation({
        person: this.props.person,
        personID: this.props.person.personID,
        handle: fields.handle
      })
    )
  }

  render() {
    return (
      <div>
        <img
          src={this.props.person.profilePicUrl}
          alt="Profile"
        />
        <h3>{this.props.person.email}</h3>
        <h4>{this.props.person.handle}</h4>
        <ProfileField
          field={'handle'}
          text={this.props.person.handle}
          person={this.props.person}
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
      person: () => Relay.QL`
        fragment on Person {
          ${EditPersonMutation.getFragment('person')}
          id
          personID
          name
          email
          handle
          profilePicUrl
        }
      `,
    },
  }
)
