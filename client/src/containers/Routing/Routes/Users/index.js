import React, { Component } from 'react'
import Relay from 'react-relay'
import CreatePersonMutation from './CreatePersonMutation';
import ListPerson from './ListPerson'

class Users extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: ''
    }
  }

  handleCreatePerson() {
    this.props.relay.commitUpdate(
      new CreatePersonMutation({
        email: this.state.email,
        password: this.state.password
      })
    )
    this.setState({
      email: '',
      password: ''
    })
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value,
    })
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    })
  }

  render() {
    return (
      <div
        style={{
          width: '50%',
          margin: 'auto'
        }}
      >

        <ol>
          <li>
            Email:
            <input
              type="text"
              value={this.state.email}
              onChange={(e) => this.handleEmailChange(e)}
            />
          </li>
          <li>
            Password:
            <input
              type="password"
              value={this.state.password}
              onChange={(e) => this.handlePasswordChange(e)}
            />
          </li>
          <li>
            <button
              onClick={()=>{this.handleCreatePerson()}}
            >Create Person</button>
          </li>
        </ol>

        <br />

        <div>
                  {`There are ${this.props.viewer.persons.edges.length} Pokemons in your pokedex`}
        </div>

        <div>
          {this.props.viewer.persons.edges.map((edge) => edge.node).map((person) =>
            <ListPerson key={person.personID} person={person} />
          )
          }
        </div>

      </div>
    )
  }
}


export default Relay.createContainer(
  Users,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          persons (last: 100) {
            edges {
              node {
                ${ListPerson.getFragment('person')}
                personID
              }
            }
          }
          personID
        }
      `,
    },
  }
)
