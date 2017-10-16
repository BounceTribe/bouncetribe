import React, {Component} from 'react'
import Relay from 'react-relay'
import {View, Button, BtLink, BtFlatButton} from 'styled'
import {Container, Header, HeaderOptions} from 'styled/list'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Avatar from 'material-ui/Avatar'
import {url} from 'config'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import Headphones from 'icons/Headphones'
import {white, grey700, purple} from 'theme'
import {findMatches} from 'utils/graphql'
import {MatchList, MatchCard, CardArt, CreatorPortrait, CreatorInfo, Handle, Location, ListHandle, ListProject, ListScore, ProjectArtThumb, ThumbLink, CardArtWrapper, ButtonWrapper, Round, NoProjectsCol, NoProjectMsg, NoProjectQuote, NoProjectAuthor} from 'styled/Sessions'
import LocationIcon from 'icons/Location'
import CreateSession from 'mutations/CreateSession'
import Bolt from 'icons/Bolt'
import Checkbox from 'material-ui/Checkbox'
import Logo from 'icons/Logo'
import Upload from 'icons/Upload'


class AllSessions extends Component {

  state = {
    matches: null,
    nearby: false,
  }

  table = () => {
    let {project} = this.props.router.params
    if (project) {
      let currentProject = this.currentProject()
      let sessions =  []
      currentProject.sessions.edges.forEach( (edge) => {
        let sessionId = edge.node.id
        let createdAt = edge.node.createdAt
        edge.node.projects.edges.forEach((edge) => {
          let {node: project} = edge
          if (project.id !== currentProject.id) {
            sessions.push(
              <TableRow
                key={sessionId}
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
                      this.props.router.push(`/session/${this.props.viewer.user.handle}/${sessionId}/theirs`)
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
                  <ThumbLink
                    to={`/session/${this.props.viewer.user.handle}/${sessionId}/theirs`}
                  >
                    <ProjectArtThumb
                      src={(project.artwork) ? project.artwork.url : `${url}/artwork.png`}
                    />
                  </ThumbLink>
                </TableRowColumn>
                <TableRowColumn>
                  <ListProject
                    to={`/session/${this.props.viewer.user.handle}/${sessionId}/theirs`}
                  >
                    {project.title}
                  </ListProject>
                </TableRowColumn>
                <TableRowColumn>
                  {`${new Date(Date.parse(createdAt)).toLocaleDateString('en-US', {month: 'long', 'day': 'numeric'})}`}
                </TableRowColumn>
              </TableRow>
            )
          }
        })
      })


      if (sessions.length > 0 ) {
        return (
          <Table
            style={{
              width: '90%',
              margin: 'auto',
              marginTop: '40px',
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
      } else {
        return (
          <NoProjectsCol
            style={{
              marginTop: '50px'
            }}
          >
            <NoProjectQuote>
              Ready to exchange some feedback?
            </NoProjectQuote>
            <Button
              label={'Find Session'}
              icon={
                <Headphones
                  fill={white}
                />
              }
              primary
              style={{
                margin: '20px auto',
                display: (this.props.router.location.pathname.includes('/find')) ? 'none' : ''
              }}
              onTouchTap={()=>{
                let {router} = this.props
                router.push(`sessions/${router.params.userHandle}/${this.currentProject().title}/find`)
              }}
            />
          </NoProjectsCol>
        )
      }
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

        let self = this.props.viewer.user

        let matches = await findMatches({user: self, project: currentProject})
        if (matches.length === 0 ) {
          matches = (
            <NoProjectsCol>
              <NoProjectMsg>
                Come back later to find more projects
              </NoProjectMsg>
              <NoProjectQuote>
                "Without music, life would be a mistake"
                <br/>
                <NoProjectAuthor>
                  –Friedrich Nietzche
                </NoProjectAuthor>
              </NoProjectQuote>

            </NoProjectsCol>
          )
        } else {
          matches = matches.map( (project) => {
            return (
              <MatchCard
                key={project.id}
              >

                <CardArtWrapper
                >

                  <ButtonWrapper
                    title={`Start Session`}
                    onClick={()=>{
                      let projectsIds = []
                      projectsIds.push(project.id)
                      projectsIds.push(currentProject.id)
                      this.props.relay.commitUpdate(
                        new CreateSession({
                          projectsIds
                        }),{
                          onSuccess: (success) => {
                            let {id: sessionId} = success.createSession.session
                            this.props.router.push(`/session/${this.props.viewer.user.handle}/${sessionId}/theirs`)
                          }
                        }
                      )
                    }}
                  >
                    <Round>
                      <Logo
                        fill={white}
                        style={{
                          height: '60px',
                          width: '60px'
                        }}
                      />
                    </Round>

                  </ButtonWrapper>

                  <CardArt
                    src={(project.artwork) ? project.artwork.url : `${url}/artwork.png`}
                  />


                </CardArtWrapper>
                <BtLink
                  to={`/${project.creator.handle}`}
                >
                  <CreatorPortrait
                    src={(project.creator.portrait) ? project.creator.portrait.url : `${url}/logo.png`}
                    style={{
                      marginLeft: '10px'
                    }}
                  />
                </BtLink>
                <CreatorInfo>
                  <Handle
                    to={`/${project.creator.handle}`}
                  >
                    {project.creator.handle}
                  </Handle>
                  <Location>
                    <LocationIcon
                      style={{
                        marginRight: '4px',
                        display: (project.creator.placename) ? '' : 'none'
                      }}
                    />
                    {project.creator.placename}
                  </Location>
                </CreatorInfo>


              </MatchCard>
            )
          })
        }

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
      if (router.location.pathname.includes('/find')) {
        this.matchCards(currentProject)
        return this.state.matches
      } else {
        return this.table()
      }
    }

  }

  render() {
    let currentProject = this.currentProject()
    return (
      <View>
        <Container>
          <Header>
            <IconMenu
              iconButtonElement={this.headerProject()}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              style={{
                display: (this.props.viewer.user.projects.edges.length < 1) ? 'none' : ''
              }}
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
                      if (router.location.pathname.includes('/find')) {
                        this.setState({matches: false})
                        router.push(`sessions/${router.params.userHandle}/${project.title}/find`)
                      } else {
                        router.push(`sessions/${router.params.userHandle}/${project.title}`)
                      }
                    }}
                  />
                )

              })}
            </IconMenu>


            <HeaderOptions
              style={{
                height: '100%',
                alignItems: 'center',
                display: (this.props.viewer.user.projects.edges.length < 1) ? 'none' : ''

              }}
            >
              <Button
                label={'Find Session'}
                icon={
                  <Headphones
                    fill={white}
                  />
                }
                primary
                style={{
                  display: (this.props.router.location.pathname.includes('/find') ? 'none' : '')
                }}
                onTouchTap={()=>{
                  let {router} = this.props
                  router.push(`sessions/${router.params.userHandle}/${currentProject.title}/find`)
                }}

              />
              <Checkbox
                label={"Search Nearby"}
                style={{
                  display: (this.props.router.location.pathname.includes('/find') ? 'flex' : 'none'),
                }}
                labelStyle={{
                  width: '150px',
                  color: grey700
                }}
                iconStyle={{
                  color: grey700,
                }}
                checked={this.state.nearby}
                onCheck={()=>{
                  this.setState((prevState)=>{
                    let {nearby} = prevState
                    return {
                      nearby: !nearby,
                      matches: false
                    }
                  })
                }}
              />
            </HeaderOptions>
          </Header>
          { this.matches()}
          {(this.props.viewer.user.projects.edges.length < 1) ? (
            <NoProjectsCol style={{ marginTop: '50px' }} >
              <NoProjectMsg>
                Ready to exchange some feedback?
              </NoProjectMsg>
              <NoProjectQuote>
                Upload a public project!
              </NoProjectQuote>
              <BtFlatButton
                label={'New Project'}
                labelStyle={{
                  color: white,
                  fontSize: '13px',
                  fontWeight: '400'
                }}
                backgroundColor={purple}
                to={`/projects/${this.props.viewer.user.handle}/new`}
                icon={<Upload fill={white} />}
                style={{ borderRadius: '8px', marginTop: '20px' }}
              />
            </NoProjectsCol>
          ) : null}
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
            friends (
              first: 999
            ) {
              edges {
                node {
                  id
                }
              }
            }
            projects (
              first: 999
              orderBy: title_ASC
              filter: {
                privacy: PUBLIC
              }
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
                  privacy
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
                    orderBy: createdAt_DESC
                  ) {
                    edges {
                      node {
                        id
                        createdAt
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
                              privacy
                              creator {
                                id
                                handle
                                score
                                portrait {
                                  url
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
        }
      `
    }
  }
)
