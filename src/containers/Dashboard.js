import React, {Component} from 'react'
import Relay from 'react-relay'
import { FbList, SendInviteBtn, DialogSpacer, DialogRow, ProfileView, TopPanel, DashLeft, DashRight, InviteButton, DashHeader, DashHeaderRow, Divider, UserName, NavLink, TopColumn, ImgColumn, FeedbackRating, DashProfile} from 'styled/Dashboard'
import {FriendList} from 'components/FriendList'
import {BotRow} from 'styled/Profile'
import {Dialog, TextField, Tabs, Tab} from 'material-ui'
import {purple, grey200, grey400, grey600} from 'theme'
import { ProfCol, ProfHandle, Score} from 'styled/Project'
import Bolt from 'icons/Bolt'
import Logo from 'icons/Logo'
import {BtAvatar} from 'styled'
import {suggestedFriends} from 'utils/graphql'
import CreateFriendRequest from 'mutations/CreateFriendRequest'
// import SetUserOnline from 'mutations/SetUserOnline'
// import SetUserOffline from 'mutations/SetUserOffline'
import {IconTextContainer, IconText, TabLabel} from 'styled'
import {Panel} from 'components/Panel'


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
      showBand: true,
      tab: ''
    }
  }

  componentDidMount() {
    if (this.props.viewer.user.friends.edges.length) {
      let selectedUser = this.props.viewer.user.friends.edges[0].node;
      this.setState( {selectedUser} )
      this.props.router.push(`/dash/projects/${selectedUser.handle}`)
      this.suggestFriends(this.state.maxSuggestedFriends);
    }
  }

  suggestFriends = (max) => {
    suggestedFriends(this.props.viewer.user.id).then( suggestions => {
      this.setState( (prevState, props) => {
        suggestions = suggestions.concat(suggestions);
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
    this.props.router.push(location)
    this.setState({selectedUser})
  }

  sendInvite = () => {
    console.log('event', this.state.email)
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

  setTab = (tab) => {
    this.props.router.push('/dash/' + tab + '/' + this.state.selectedUser.handle)
    console.log('route set to', tab);
    window.scrollTo(0, document.body.scrollHeight)
    console.log('tab', this.props.router.params.tab)
  }

  render () {
    let selectedUser = this.state.selectedUser
    let user = this.props.viewer.user
    // console.log('user:', user)
    // console.log('render - this', this);
    return (
      <ProfileView>
        <DashHeader>
          <DashHeaderRow>
            <IconTextContainer to={`/tribe/${user.handle}`} >
              <Logo style={{ display: 'flex', marginBottom: '-5px' }} fill={purple} />
              <IconText>
                My Tribe
              </IconText>
            </IconTextContainer>
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
                borderBottom:`1px solid ${grey400}`,
                padding: '16px 27px 13px 27px',
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
          </DashHeaderRow>
        </DashHeader>
        <Divider widthPercent={100} />
        <TopPanel>
          <TopColumn>
            <ImgColumn>
              <BtAvatar user={user} size={80} />
            </ImgColumn>
            {/* <ProfileImg src={(user.portrait || {}).url} /> */}
            <UserName>{user.handle}</UserName>
            <NavLink to={`/${user.handle}`}>
              Edit Profile
            </NavLink>
          </TopColumn>
          <FeedbackRating style={{justifyContent:'flex-end'}}>
              <Bolt style={{ marginRight: '15px' }} />
                {selectedUser.score}
            </FeedbackRating>
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
          <Panel
            tab={this.state.tab}
            topBar={<DashProfile selectedUser={selectedUser} />}
            tabChange={(tab)=>this.setTab(tab)}
            labels={['projects', 'bounces', 'messages']}
            locks={[false, true, false]}
            content={this.props.children}
            />
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
          }
        }
      `,
    },
  }
)
