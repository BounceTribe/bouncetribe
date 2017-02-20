import React, {Component} from 'react'
import Relay from 'react-relay'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import {SmallPic, Name, Projects, GenreChip, NoTribe} from 'styled/Tribe'
import Bolt from 'icons/Bolt'
import Music from 'icons/Music'
import {white} from 'theme'

class TribeAll extends Component {

  get friendsList () {

    if (this.props.viewer.User.friends.edges.length < 1) {
      return (
        <NoTribe
          user={this.props.viewer.user}
          handle={this.props.viewer.user.handle}
        />
      )
    }

    return this.props.viewer.User.friends.edges.map(edge=>{
      let {node:friend} = edge
      return (
        <TableRow
          key={friend.id}
        >
          <TableRowColumn
            style={{width: '50px'}}
          >
            <SmallPic
              src={friend.portrait.url}
              to={`/${friend.handle}`}
            />
          </TableRowColumn>
          <TableRowColumn>
            <Name
              to={`/${friend.handle}`}
            >
              {friend.handle}
            </Name>
          </TableRowColumn>
          <TableRowColumn
            style={{
              width: '50px',
            }}
          >
            <Bolt
              height={15}
            />
            <Name>
                {friend.score}
            </Name>
          </TableRowColumn>
          <TableRowColumn>{friend.placename}</TableRowColumn>
          <TableRowColumn>
            {friend.genres.edges.map(edge=>(
              <GenreChip key={edge.node.id}>
                {edge.node.name}
              </GenreChip>
            ))}
          </TableRowColumn>
          <TableRowColumn>
            <Projects>
              <Music
                fill={white}
                height={15}
              />
              {friend.projects.edges.length}
            </Projects>
          </TableRowColumn>
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
            <TableHeaderColumn
              style={{width: '50px'}}
            >{/*image*/}</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn
              style={{width: '50px'}}
            >Rating</TableHeaderColumn>
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
            handle
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
                  score
                  portrait {
                    url
                  }
                  placename
                  genres (
                    first: 2
                  ) {
                    edges {
                      node {
                        id
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
