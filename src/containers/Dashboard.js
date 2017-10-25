import React, {Component} from 'react'
import Relay from 'react-relay'
import {FbList, SendInviteBtn, DialogSpacer, DialogRow, TopPanel, DashLeft, DashView, InviteButton, DashHeader, DashHeaderRow, Divider, UserName, NavLink, TopColumn, ImgColumn, FeedbackRating, DashProfile} from 'styled/Dashboard'
import {FriendList} from 'components/FriendList'
import {BotRow} from 'styled/Profile'
import {Dialog, TextField} from 'material-ui'
import {grey400, purple} from 'theme'
import Bolt from 'icons/Bolt'
import {BtAvatar, IconTextContainer, IconText} from 'styled'
import {suggestedFriends} from 'utils/graphql'
import CreateFriendRequest from 'mutations/CreateFriendRequest'
import {Panel} from 'components/Panel'
import sendEmailInvite from 'utils/sendEmailInvite'
import Snackbar from 'material-ui/Snackbar'

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
      tab: 'projects',
      snackbarText: '',
      snackbar: false
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
    let user = this.props.viewer.user
    let query = {
      byId: user.id,
      toEmail: this.state.email,
      byHandle: user.handle
    }
    sendEmailInvite(query).then(result => {
      if (result.status===200) {
        this.setState({
          snackbarText: 'Invite Sent!',
          snackbar: open,
          invite: false,
          email: ''
        })
      } else {
        this.setState({
          snackbarText: 'Error Sending Email!',
          snackbar: open,
          invite: false
        })
      }
    })
    this.setState({invite: false, email: ''})
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
    this.setState({ tab })
    window.scrollTo(0, document.body.scrollHeight)
  }

  render () {
    let selectedUser = this.state.selectedUser || {}
    let user = this.props.viewer.user || {}
    let tab = this.state.tab
    // console.log('user:', user)
    // console.log('render - this', this)
    return (
      <DashView>
        <Snackbar
          open={this.state.snackbar ? true : false} //requires boolean input
          message={this.state.snackbarText}
          autoHideDuration={2000}
          onRequestClose={()=>this.setState({snackbar:false})}
          onActionTouchTap={()=>this.setState({snackbar:false})}
          bodyStyle={{ backgroundColor: purple }} />
        <DashHeader>
          <DashHeaderRow>
            <IconTextContainer to={`/tribe/${user.handle}`} >
              <BtAvatar size={40} hideStatus />
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
              <BtAvatar user={user} size={80} hideStatus />
            </ImgColumn>
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
              flip={() => this.setState({showTribe: !this.state.showTribe})}
              select={this.selectUser}
              show={this.state.showTribe} />
          </DashLeft>
          <Panel
            tab={tab}
            topBar={<DashProfile selectedUser={selectedUser} />}
            tabChange={(newTab)=>this.setTab(newTab)}
            labels={['projects', 'bounces', 'messages']}
            locks={[false, false, false]}
            content={this.state.selectedUser && this.props.children} />
        </BotRow>
      </DashView>
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
                  lastPing
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
