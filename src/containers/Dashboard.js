import React, {Component} from 'react'
import Relay from 'react-relay'
import {FbDialogRow, DialogSpacer, DialogRow, ProfileView, TopPanel, DashLeft, DashRight, InviteContainer} from 'styled/Dashboard'
import {BotRow, TopCol, SubRow, FriendButtonCol} from 'styled/Profile'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import {white, purple, grey200, grey400} from 'theme'
import Send from 'icons/Send'
import {Tabs, Tab} from 'material-ui/Tabs'
import { ProfContainer, ProfTop, Portrait, ProfCol, ProfHandle, Score, MoreInfo, ProfLeft} from 'styled/Project'
import {formatEnum} from 'utils/strings'
import Experience from 'icons/Experience'
import Location from 'icons/Location'
import Bolt from 'icons/Bolt'
import {url} from 'config'
import FlatButton from 'material-ui/FlatButton'
import DirectMessages from 'components/DirectMessages'
import {suggestedFriends} from 'utils/graphql'
// import CreateFriendRequest from 'mutations/CreateFriendRequest'
import {SmallPic, Name} from 'styled/Tribe'
import {BtFlatButton} from 'styled'
import AddFriend from 'icons/AddFriend'



class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invite: false,
      email: null,
      selectedUser: {},
      suggestions: []
    }
  }

  componentDidMount() {
    let selectedUser = this.props.viewer.user.friends.edges[0].node;
    this.setState({selectedUser})
    this.props.router.replace('/projects/dash/' + selectedUser.handle)
    this.suggestFriends();
  }

  suggestFriends = () => {
    suggestedFriends(this.props.viewer.user.id).then(suggestions=>{
      this.setState((prevState, props)=>{
        suggestions = suggestions.concat(suggestions);
        console.log('suggestions', suggestions);
        let list = suggestions.map(friend =>
          <FbDialogRow key={Math.random()} user={friend} >
            <SubRow>
              <SmallPic src={friend.portrait.url} to={`/${friend.handle}`} />
              <Name style={{lineHeight:'55px'}} to={`/${friend.handle}`}>{friend.handle}</Name>
            </SubRow>
            <BtFlatButton
              to={`/${friend.handle}/tribe`}
              backgroundColor={white}
              labelStyle={{ color: `${white}` }}
              icon={ <AddFriend fill={purple} height={16} /> }
              style={{
                border: `1px solid ${grey400}`,
                borderRadius: '5px',
                width: '60px',
                height: '4 0px'
              }}
            />
          </FbDialogRow>
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
      //JIM YOUR COMPONENT GOES BELOW
      projects: (<div>projects View</div>)/*<DashProjects />*/,
      bounces: (<div>bounces view</div>)/*<Bounces />*/,
      messages: (<div>direct message view</div>)/*<DirectMessages  {...this.props} />*/
    }
    let selectedUser = this.state.selectedUser;
    console.log('render - this', this);
    return (
      <ProfileView>
        <TopPanel>
          <h4>BounceTribe!</h4>
          <InviteContainer onClick={()=>{this.setState({invite: true})}}/>
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
            }}
          >
            <DialogRow>
              <DialogSpacer>
                <TextField
                  label={'Email'}
                  name={'email'}
                  onChange={(ev, em)=>{this.setState({email: em})}}
                  placeholder={'Email'}
                />
                <FlatButton
                  label={'Send Invite'}
                  backgroundColor={purple}
                  labelStyle={{
                    color: `${white}`,
                    fontSize: '14px',
                    fontFamily: 'Helvetica Neue',
                    textTransform: 'none'
                  }}
                  icon={
                    <Send fill={white} height={14}
                      style={{vertialAlign: 'middle', lineHeight: '41px'}}
                    /> }
                  onClick={()=>{ this.sendInvite() }}
                  style={{
                    border: `1px solid ${grey400}`,
                    borderRadius: '5px',
                    width: '223px',
                    height: '41px',
                    marginTop: '18px'
                  }}
                />
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
                  <Portrait
                    src={(selectedUser.portrait) ? selectedUser.portrait.url : `${url}/logo.png`}
                    to={`/${selectedUser.handle}`}
                  />
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
              style={{ marginTop: '6px', marginBottom: '25px', }}
              tabItemContainerStyle={{ borderBottom: `2px solid ${grey200}` }}
              inkBarStyle={{ backgroundColor: purple }}
              value={this.props.router.params.tab} >
              <Tab label={'projects'} value={'projects'}
                onActive={(e)=>{this.setTab(e)}}
              />
              <Tab label={'bounces'} value={'bounces'}
                onActive={(e)=>{this.setTab(e)}}
              />
              <Tab label={'messages'} value={'messages'}
                onActive={(e)=>{this.setTab(e)}}
              />
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
