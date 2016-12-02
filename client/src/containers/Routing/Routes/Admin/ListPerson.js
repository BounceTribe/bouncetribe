import React, {Component} from 'react'
import Relay from 'react-relay'

class ListPerson extends Component {
  render() {
    return (
      <li>
        <b>{this.props.person.name}: </b> {this.props.person.email}
      </li>
    )
  }
}

// export default ListPerson

export default Relay.createContainer(
  ListPerson,
  {
    fragments: {
      person: () => Relay.QL`
        fragment on Person {
          id
          name
          email
        }
      `,
    },
  }
)
