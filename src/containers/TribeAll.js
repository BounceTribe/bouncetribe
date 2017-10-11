import React, {Component} from 'react'
import Relay from 'react-relay'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import {SmallPic, Name, Projects, NoTribe, TableScore} from 'styled/Tribe'
import Bolt from 'icons/Bolt'


class TribeAll extends Component {

  get friendsList () {

    if (this.props.viewer.User.friends.edges.length < 1) {
      return (
        <NoTribe
          user={this.props.viewer.user}
          handle={this.props.viewer.user.handle}
        />
      )
    } else {
      let friends = this.props.viewer.User.friends.edges.map(edge=>{
        let {node:friend} = edge
        return (
          <TableRow key={friend.id} style={{height: '48px '}}>
            <TableRowColumn style={{width: '50px'}} >
              <SmallPic
                src={friend.portrait.url}
                to={`/${friend.handle}`}
              />
            </TableRowColumn>
            <TableRowColumn>
              <Name to={`/${friend.handle}`} >
                {friend.handle}
              </Name>
            </TableRowColumn>
            <TableRowColumn style={{ width: '50px', }} >
              <Bolt height={18} />
              <TableScore>
                  {friend.score}
              </TableScore>
            </TableRowColumn>
            <TableRowColumn>{friend.placename}</TableRowColumn>
            {/* <TableRowColumn>
              {friend.genres.edges.map(edge=>(
                <GenreChip key={edge.node.id}>
                  {edge.node.name}
                </GenreChip>
              ))}
            </TableRowColumn> */}
            <TableRowColumn>
              <Projects>
                {friend.projects.edges.length}
              </Projects>
            </TableRowColumn>
          </TableRow>
        )
      })
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
              {/* <TableHeaderColumn>Genres</TableHeaderColumn> */}
              <TableHeaderColumn>Projects</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {friends}
          </TableBody>
        </Table>

      )
    }

  }

  render () {
    return (
      <div>
        {this.friendsList}
      </div>
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
                    first: 999
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
