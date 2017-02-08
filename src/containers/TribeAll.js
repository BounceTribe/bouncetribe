import React, {Component} from 'react'
import Relay from 'react-relay'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import {SmallPic, Name} from 'styled/Tribe'

class TribeAll extends Component {

  get friendsList () {
    return this.props.viewer.User.friends.edges.map(edge=>{
      let {node:friend} = edge
      return (
        <TableRow
          key={friend.id}
        >
          <TableRowColumn>
            <SmallPic
              src={friend.portrait.url}
              to={`/${friend.handle}`}
            />
          </TableRowColumn>
          <TableRowColumn>
            <Name
              to={`/${friend.handle}`}
            >
              {friend.name}
            </Name>
          </TableRowColumn>
          <TableRowColumn></TableRowColumn>
          <TableRowColumn>{friend.placename}</TableRowColumn>
          <TableRowColumn>{friend.genres.edges.length}</TableRowColumn>
          <TableRowColumn>{friend.projects.edges.length}</TableRowColumn>
        </TableRow>
      )
    })
  }

  render () {
    return (
      <Table
        style={{
          width: '90%',
          margin: 'auto'
        }}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>{/*image*/}</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Rating</TableHeaderColumn>
            <TableHeaderColumn>Location</TableHeaderColumn>
            <TableHeaderColumn>Genres</TableHeaderColumn>
            <TableHeaderColumn>Projects</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
          {this.friendsList}
        </TableBody>
      </Table>
    )
  }
}

export default Relay.createContainer(
  TribeAll, {
    initialVariables: {
      userHandle: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
          }
          User (handle: $userHandle) {
            id
            email
            friends (
              first: 20
            ) {
              edges {
                node {
                  name
                  handle
                  id
                  portrait {
                    url
                  }
                  placename
                  genres (
                    first: 2
                  ) {
                    edges {
                      node {
                        name
                      }
                    }
                  }
                  projects (
                    first: 9999
                  ) {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
    }
  }
)
