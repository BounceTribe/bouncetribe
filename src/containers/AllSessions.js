import React, {Component} from 'react'
import Relay from 'react-relay'
import {View, Button} from 'styled'
import {Container, Header, HeaderOptions} from 'styled/list'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Avatar from 'material-ui/Avatar'
import {url} from 'config'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import Headphones from 'icons/Headphones'
import {white} from 'theme'
import {findMatches} from 'utils/graphql'
import {MatchList, MatchCard, CardArt, CreatorPortrait, CreatorInfo, Handle, Location, ListHandle, ListProject, ListScore, ProjectArtThumb} from 'styled/Sessions'
import LocationIcon from 'icons/Location'
import CreateSession from 'mutations/CreateSession'
import Bolt from 'icons/Bolt'

class AllSessions extends Component {

  state = {
    matches: null
  }

  table = () => {
    let {project} = this.props.router.params
    if (project) {
      let currentProject = this.currentProject()
      let sessions =  []
      currentProject.sessions.edges.forEach( (edge) => {
        let sessionId = edge.node.id
        edge.node.projects.edges.forEach((edge) => {
          let {node: project} = edge
          if (project.id !== currentProject.id) {
            sessions.push(
              <TableRow
                key={project.id}
              >
                <TableRowColumn
                  style={{width: '50px'}}
                >
                  <CreatorPortrait
                    src={(project.creator.portrait) ? project.creator.portrait.url : `${url}/logo.png`}
                  />
                </TableRowColumn>
                <TableRowColumn>
                  <ListHandle
                    onClick={()=>{
                      this.props.router.push(`/${this.props.viewer.user.handle}/session/${sessionId}/theirs`)
                    }}
                  >
                    {project.creator.handle}
                  </ListHandle>
                </TableRowColumn>
                <TableRowColumn
                  style={{width: '50px'}}

                >
                  <ListScore>
                    <Bolt
                      style={{
                        marginRight: '4px'
                      }}
                    />
                    {project.creator.score}
                  </ListScore>
                </TableRowColumn>
                <TableRowColumn
                  style={{width: '50px'}}
                >
                  <ProjectArtThumb
                    src={(project.artwork) ? project.artwork.url : `${url}/artwork.png`}
                  />
                </TableRowColumn>
                <TableRowColumn>
                  <ListProject>
                    {project.title}
                  </ListProject>
                </TableRowColumn>
                <TableRowColumn>
                  {`Created ${new Date(Date.parse(project.createdAt)).toLocaleDateString('en-US', {month: 'long', 'day': 'numeric'})}`}
                </TableRowColumn>
              </TableRow>
            )
          }
        })
      })
      return (
        <Table
          style={{
            width: '90%',
            margin: 'auto',
            marginTop: '40px'
          }}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn
                style={{width: '50px'}}
              >
                {/*portrait*/}
              </TableHeaderColumn>
              <TableHeaderColumn>
                Name
              </TableHeaderColumn>
              <TableHeaderColumn
                style={{width: '50px'}}
              >
                Rating
              </TableHeaderColumn>
              <TableHeaderColumn
                style={{width: '50px'}}
              >
                {/*portrait*/}
              </TableHeaderColumn>
              <TableHeaderColumn>
                Project
              </TableHeaderColumn>
              <TableHeaderColumn>
                Created
              </TableHeaderColumn>
            </TableRow>

          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {sessions}
          </TableBody>
        </Table>
      )
    }
  }

  headerProject = () => {
    let {project} = this.props.router.params
    if (project) {
      let headerProject = this.currentProject()

      return (
        <MenuItem
          leftIcon={<Avatar
            style={{borderRadius: 0}}
            src={(headerProject.artwork) ? headerProject.artwork.url : `${url}/artwork.png`}
          />}
          primaryText={headerProject.title}
        />
      )
    }

    return (
      <MenuItem
        leftIcon={<MoreVertIcon/>}
        primaryText={'Select a Project'}
      />
    )
  }

  currentProject = () => {
    let {project} = this.props.router.params
    if (project) {
      let currentProject = this.props.viewer.user.projects.edges.find( (edge) => {
        let {node} = edge
        return node.title === project
      })
      return currentProject.node
    }
  }

  matchCards = async (currentProject) => {
    try {
      if (!this.state.matches) {
        let currentSessions = []
        currentProject.sessions.edges.forEach((edge) => {
          currentSessions.push(`"${edge.node.id}"`)
        })

        let matches = await findMatches(currentProject, currentSessions)
        matches = matches.map( (project) => {
          return (
            <MatchCard
              key={project.id}
            >
              <CardArt
                src={(project.artwork) ? project.artwork.url : `${url}/artwork.png`}
                onClick={()=>{
                  let projectsIds = []
                  projectsIds.push(project.id)
                  projectsIds.push(currentProject.id)
                  this.props.relay.commitUpdate(
                    new CreateSession({
                      projectsIds
                    }),{
                      onSuccess: (success) => {
                        //this.props.router.push(`/${this.props.viewer.user.handle}/session/${success}`)
                        console.log("success", success )
                      }
                    }
                  )
                }}
              />
              <CreatorPortrait
                src={(project.creator.portrait) ? project.creator.portrait.url : `${url}/logo.png`}
              />
              <CreatorInfo>
                <Handle
                  to={`/${project.creator.handle}`}
                >
                  {project.creator.handle}
                </Handle>
                <Location>
                  <LocationIcon
                    style={{
                      marginRight: '4px'
                    }}
                  />
                  {project.creator.placename}
                </Location>
              </CreatorInfo>


            </MatchCard>
          )
        })
        this.setState({matches: (
          <MatchList>
            {matches}
          </MatchList>
        )})
      }

    } catch (e) {

    }

  }

  matches =  () => {
    let {router} = this.props
    let currentProject = this.currentProject()
    if (currentProject) {
      if (router.location.pathname === `/${currentProject.creator.handle}/sessions/${currentProject.title}/find`) {
        this.matchCards(currentProject)
        return this.state.matches

      } else {
        return this.table()
      }
    }

  }

  render() {
    return (
      <View>
        <Container>
          <Header>
            <IconMenu
              iconButtonElement={this.headerProject()}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
            >
              {this.props.viewer.user.projects.edges.map(edge => {
                let {node: project} = edge
                return (
                  <MenuItem
                    key={project.id}
                    primaryText={project.title}
                    leftIcon={<Avatar
                      style={{borderRadius: 0}}
                      src={(project.artwork) ? project.artwork.url : `${url}/artwork.png`}
                    />}
                    onTouchTap={()=>{
                      let {router} = this.props
                      router.replace(`/${router.params.userHandle}/sessions/${project.title}`)
                    }}
                  />
                )
              })}
            </IconMenu>


            <HeaderOptions>
              <Button
                label={'Find Session'}
                icon={
                  <Headphones
                    fill={white}
                  />
                }
                primary
                onTouchTap={()=>{
                  let {router} = this.props
                  router.replace(`/${router.params.userHandle}/sessions/${this.currentProject().title}/find`)
                }}
              />
            </HeaderOptions>
          </Header>
          { this.matches()}
        </Container>
      </View>
    )
  }
}


export default Relay.createContainer(
  AllSessions, {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
            projects (
              first: 999
              orderBy: title_ASC
            ) {
              edges {
                node {
                  creator {
                    id
                    handle
                  }
                  id
                  title
                  artwork {
                    url
                  }
                  genres (
                    first: 999
                  ) {
                    edges {
                      node {
                        id
                        name
                      }
                    }
                  }
                  sessions (
                    first: 999
                  ) {
                    edges {
                      node {
                        id
                        projects (
                          first: 999
                        ) {
                          edges {
                            node {
                              id
                              createdAt
                              title
                              artwork {
                                url
                              }
                              creator {
                                handle
                                score
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    }
  }
)
