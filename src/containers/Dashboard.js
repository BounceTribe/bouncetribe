import React, {Component} from 'react'
import Relay from 'react-relay'
import { FbList, SendInviteBtn, DialogSpacer, DialogRow, ProfileView, TopPanel, DashLeft, DashRight, InviteButton, DashHeader, ProfileImg, LogoText, Divider, UserName, NavLink} from 'styled/Dashboard'
import {FriendList} from 'components/FriendList'
import {BotRow} from 'styled/Profile'
import {Dialog, TextField, Tabs, Tab} from 'material-ui'
import {purple, grey200, grey400} from 'theme'
import { ProfContainer, ProfTop, ProfCol, ProfHandle, Score, MoreInfo, ProfLeft} from 'styled/Project'
import {formatEnum} from 'utils/strings'
import Experience from 'icons/Experience'
import Location from 'icons/Location'
import Bolt from 'icons/Bolt'
import {Row} from 'styled/Profile'
import {Column} from 'styled/list'
import {BtAvatar} from 'styled'
// import DirectMessages from 'components/DirectMessages'
import {suggestedFriends} from 'utils/graphql'
import CreateFriendRequest from 'mutations/CreateFriendRequest'

import SetUserOnline from 'mutations/SetUserOnline'
import SetUserOffline from 'mutations/SetUserOffline'
import {TabLabel} from 'styled'

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invite: false,
      email: null,
      maxSuggestedFriends: 2,
      selectedUser: {},
      suggestions: [],
      showMentors: true,
      showTribe: true,
      showBand: true
    }
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    if (this.props.viewer.user.friends.edges.length) {
      let selectedUser = this.props.viewer.user.friends.edges[0].node;
      this.setState( {selectedUser} )
      this.props.router.replace(`/dash/projects/${selectedUser.handle}`)
      this.suggestFriends(this.state.maxSuggestedFriends);
    }
    document.addEventListener('onbeforeunload', this.handleClose());
    this.props.relay.commitUpdate(
      new SetUserOnline({
        user: this.props.viewer.user
      })
    )
  }

  componentWillUnmount() {
    document.removeEventListener('onbeforeunload', this.handleClose());
    // this.userOffline();
  }

  handleClose() {
    this.props.relay.commitUpdate(
      new SetUserOffline({
        user: this.props.viewer.user
      })
    )
  }

  suggestFriends = (max) => {
    suggestedFriends(this.props.viewer.user.id).then( suggestions => {
      this.setState( (prevState, props) => {
        //uncomment below to double suggestion list for testing
        suggestions = suggestions.concat(suggestions);
        // suggestions = suggestions.concat(suggestions);
        let list = suggestions.slice(0, max).map( friend =>
          <FbList
            key={friend.id}
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

  setTab = (tabAction) => {
    this.props.router.replace('/dash/' + tabAction.props.value + '/' + this.state.selectedUser.handle)
    console.log('route set to', this.props.router.location);
    window.scrollTo(0, document.body.scrollHeight)
    console.log('tab', this.props.router.params.tab);
  }

  render () {
    let selectedUser = this.state.selectedUser;
    let user = this.props.viewer.user
    // console.log('user:', user)
    // console.log('render - this', this);
    return (
      <ProfileView>
        <DashHeader>
          <Row>
            <BtAvatar user={selectedUser} size={60} />
            <LogoText>My Tribe</LogoText>
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
          </Row>
        </DashHeader>
        <Divider />
        <TopPanel>
          <Column>
            <ProfileImg src={(user.portrait || {}).url} />
          </Column>
          <Column>
            <UserName
              style={{
                marginRight: '124vmin'
              }}
            >{user.handle}</UserName>
            <NavLink to={`/${user.handle}`}>
              Edit Profile
            </NavLink>
          </Column>
          <Bolt style={{justifyContent:'space-between'}}/>
        </TopPanel>
        <BotRow>
          <DashLeft>
            <FriendList
              selected={selectedUser}
              friends={user.friends}
              category={'Tribe Members'}
              invite={() => this.setState({invite: true}) }
              flip={() => this.setState({showMentors: !this.state.showMentors})}
              select={this.selectUser}
              show={this.state.showMentors} />
          </DashLeft>
          <DashRight>
            <ProfContainer>
              <ProfTop>
                <ProfLeft>
                  <BtAvatar user={selectedUser} size={60} />
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
              <Tab
                label={'projects'}
                value={'projects'}
                onActive={(e)=>{this.setTab(e)}} />
              <Tab
                icon={( <TabLabel text={'bounces'} locked /> )}
                value={'bounces'}
                onActive={(e)=>{this.setTab(e)}}
                style={{ cursor: 'not-allowed' }} disabled />
              <Tab
                icon={( <TabLabel text={'messages'} locked /> )}
                value={'messages'}
                onActive={(e)=>{this.setTab(e)}}
                style={{ cursor: 'not-allowed' }} disabled />
            </Tabs>
            {this.props.children}
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
                  isOnline
                  portrait { url }
                }
              }
            }
            sentMessages ( first: 20 ) {
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
