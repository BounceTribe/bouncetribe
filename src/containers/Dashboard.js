import React, {Component} from 'react'
import Relay from 'react-relay'
import {FbList, SendInviteBtn, DialogSpacer, DialogRow, ProfileView, TopPanel, DashLeft, DashRight, InviteButton} from 'styled/Dashboard'
import {BotRow} from 'styled/Profile'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import {purple, grey200, grey400} from 'theme'
import {Tabs, Tab} from 'material-ui/Tabs'
import { ProfContainer, ProfTop, Portrait, ProfCol, ProfHandle, Score, MoreInfo, ProfLeft} from 'styled/Project'
import {formatEnum} from 'utils/strings'
import Experience from 'icons/Experience'
import Location from 'icons/Location'
import Bolt from 'icons/Bolt'
import {url} from 'config'
import {BtAvatar} from 'styled'
// import DirectMessages from 'components/DirectMessages'
import {suggestedFriends} from 'utils/graphql'
import CreateFriendRequest from 'mutations/CreateFriendRequest'



class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invite: false,
      email: null,
      maxSuggestedFriends: 2,
      selectedUser: {},
      suggestions: []
    }
  }

  componentDidMount() {
    let selectedUser = this.props.viewer.user.friends.edges[0].node;
    this.setState( {selectedUser} )
    this.props.router.replace('/projects/dash/' + selectedUser.handle)
    this.suggestFriends(this.state.maxSuggestedFriends);
  }

  suggestFriends = (max) => {
    suggestedFriends(this.props.viewer.user.id).then( suggestions => {
      this.setState( (prevState, props) => {
        //uncomment below to double suggestion list for testing
        suggestions = suggestions.concat(suggestions);
        // suggestions = suggestions.concat(suggestions);
        let list = suggestions.slice(0, max).map( friend =>
          <FbList
            key={Math.random()}
            createFriendRequest={() => this.createFriendRequest(friend.id)}
            friend={friend} />
        )
        return {suggestions: list}
      })
    })
  }

  selectUser = (selectedUser) => {
    let location = this.props.location.pathname
    location = location.replace(this.state.selectedUser.handle, selectedUser.handle)
    this.props.router.replace(location)
    this.setState({selectedUser})
  }

  sendInvite = () => {
    console.log('event', this.state.email);
    this.setState({invite: false})
  }

  createFriendRequest = (recipientId) => {
    let {id: actorId} = this.props.viewer.user
    this.props.relay.commitUpdate(
      new CreateFriendRequest({
        actorId,
        recipientId,
      })
    )
  }

  friends = (list) => (
    <ul>
      {list.edges.map( friend => (
        <li
          onClick={()=>this.selectUser(friend.node)}
          key={friend.node.id}
        >
        {friend.node.handle}
        </li>
      ))}
    </ul>
  )

  setTab = (tabAction) => {
    this.props.router.replace('/' + tabAction.props.value + '/dash/' + this.state.selectedUser.handle)
    console.log('route set to', this.props.router.location);
    window.scrollTo(0, document.body.scrollHeight)
    console.log('tab', this.props.router.params.tab);
  }

  render () {
    const DASHBOARD_STATES = {
      //JIM YOUR COMPONENT GOES BELOW. CREATE IN ANOTHER FILE AND IMPORT IT
      projects: (<div>project view</div>)/*<DashProjects />*/,
      bounces: (<div>bounces view</div>)/*<Bounces />*/,
      messages: (<div>direct message view</div>)/*<DirectMessages  {...this.props} />*/
    }
    let selectedUser = this.state.selectedUser;
    console.log('render - this', this);
    return (
      <ProfileView>
        <TopPanel>
          <h4>BounceTribe!</h4>
          <InviteButton
            onClick={()=>{this.setState({invite: true})}}
            text={'Invite Member'} />
          <Dialog
            title={"Invite to Your Tribe"}
            modal={false}
            open={this.state.invite}
            onRequestClose={()=>{ this.setState({invite: false}) }}
            autoScrollBodyContent={true}
            bodyStyle={{padding: '0'}}
            contentStyle={{borderRadius: '5px'}}
            titleStyle={{
              fontSize: '28px',
              borderBottom:`0.5px solid ${grey400}`,
              padding: '16px 27px 13.5px 27px',
              fontFamily: 'Helvetica Neue'
            }} >
            <DialogRow>
              <DialogSpacer>
                <TextField
                  label={'Email'}
                  name={'email'}
                  onChange={(ev, em)=>{this.setState({email: em})}}
                  placeholder={'Email'}
                />
                <SendInviteBtn onClick={()=>{ this.sendInvite() }} />
              </DialogSpacer>
            </DialogRow>
            <DialogRow>{this.state.suggestions}</DialogRow>
          </Dialog>
        </TopPanel>
        <BotRow>
          <DashLeft>
            {/* JOEY YOUR COMPONENT GOES HERE */}
            <h4>Select a friend</h4>
            {this.friends(this.props.viewer.user.friends)}
          </DashLeft>
          <DashRight>
            <ProfContainer>
              <ProfTop>
                <ProfLeft>
                  <BtAvatar user={selectedUser} size={60} online={true} />
                  <ProfCol>
                    <ProfHandle to={`/${selectedUser.handle}`} >
                      {selectedUser.handle}
                    </ProfHandle>
                    <Score>
                      <Bolt style={{ marginRight: '5px' }} />
                      {selectedUser.score}
                    </Score>
                  </ProfCol>
                </ProfLeft>
                <MoreInfo>
                  <Location fill={purple} height={20} width={20}
                    style={{
                      marginLeft: '15px',
                      marginRight: '5px',
                      display: (selectedUser.placename) ? '': 'none'
                    }}
                  />
                  {selectedUser.placename}
                  <Experience height={18} width={18}
                    style={{
                      marginLeft: '15px',
                      marginRight: '5px',
                      display: (selectedUser.experience) ? '': 'none'
                    }}
                  />
                  {formatEnum(selectedUser.experience)}
                </MoreInfo>
              </ProfTop>
            </ProfContainer>
            <Tabs
              style={{ margin: '6px -19.5px 25px -19.5px' }}
              tabItemContainerStyle={{ borderBottom: `2px solid ${grey200}` }}
              inkBarStyle={{ backgroundColor: purple }}
              value={this.props.router.params.tab} >
              <Tab label={'projects'} value={'projects'}
                onActive={(e)=>{this.setTab(e)}} />
              <Tab label={'bounces'} value={'bounces'}
                onActive={(e)=>{this.setTab(e)}} />
              <Tab label={'messages'} value={'messages'}
                onActive={(e)=>{this.setTab(e)}} />
            </Tabs>

              {DASHBOARD_STATES[this.props.router.params.tab]}
          </DashRight>
        </BotRow>
      </ProfileView>
    )
  }
 }

 export default Relay.createContainer( Dashboard, {
    initialVariables: { userHandle: '' },
    fragments: { viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
            email
            portrait { url }
            friends (first: 999) {
              edges {
                node {
                  id
                  handle
                  score
                  portrait { url }
                  projects (
                    first: 999
                    filter: {privacy_not: PRIVATE}
                    orderBy: createdAt_DESC
                  ) {
                    edges {
                      node {
                        createdAt
                        id
                        title
                        genres (first: 999) {
                          edges {
                            node {name}
                          }
                        }
                        artwork { url }
                        creator {
                          handle
                          portrait { url }
                        }
                        comments (first: 999) {
                          edges {
                            node {type}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            sentMessages (
              first: 20
            ) {
              edges {
                node {
                  text
                  sender
                  createdAt
                  updatedAt
                }
              }
            }
          }
          User (handle: $userHandle) {
            receivedMessages (first: 20) {
              edges {
                node {
                  text
                  sender
                  createdAt
                  updatedAt
                }
              }
            }
          }
        }
      `,
    },
  }
)
