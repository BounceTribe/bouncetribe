import React, {Component} from 'react'
import Relay from 'react-relay'
import {FbList, SendInviteBtn, DialogSpacer, DialogRow, TopPanel, DashLeft, DashView, InviteButton, DashHeader, DashHeaderRow, Divider, UserName, NavLink, TopColumn, ImgColumn, FeedbackRating, DashProfile, BotRow} from 'styled/Dashboard'
import {FriendList} from 'components/FriendList'
import {NoTribe} from 'components/NoTribe'
import {Dialog, TextField, Snackbar} from 'material-ui'
import {grey400, purple} from 'theme'
import Bolt from 'icons/Bolt'
import {BtAvatar, IconTextContainer, IconText} from 'styled'
import {suggestedFriends} from 'utils/graphql'
import CreateFriendRequest from 'mutations/CreateFriendRequest'
import {Panel} from 'components/Panel'
import sendEmailInvite from 'utils/sendEmailInvite'
import {isUniqueField} from 'utils/handles'


class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invite: false,
      inviteMentors: false,
      email: null,
      emailError: null,
      maxSuggestedFriends: 2,
      selectedUser: {},
      suggestions: [],
      showMentors: true,
      showTribe: true,
      showBand: true,
      tab: 'projects',
      snackbarText: ''
    }
  }

  componentDidMount() {
    console.log('dashmount props', this.props)
    let edges = this.props.viewer.user.friends.edges
    if (edges.length) {
      let foundUser = edges.find(edge =>
        edge.node.handle === this.props.params.userHandle)
      if (foundUser) {
        this.setState( {selectedUser: foundUser.node} )
        this.suggestFriends(this.state.maxSuggestedFriends)
      } else {
        console.log('no found user; redirecting to first friend')
        this.props.router.push(`/dash/${edges[0].node.handle}/projects`)
      }
    } else {
      console.log('dash no tribe');
      //notribe
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
    let oldPath = this.props.location.pathname
    let newPath = oldPath.replace(this.state.selectedUser.handle, selectedUser.handle)
    this.props.router.push(newPath)
    this.setState({selectedUser})
  }

  sendInvite = () => {
    let toEmail = this.state.email
    isUniqueField(toEmail, 'email').then( result => {
      if (!result) {
        this.setState({emailError: 'Already a member!'})
      } else {
        let user = this.props.viewer.user
        let {id: byId, handle: byHandle} = user
        let query = { byId, toEmail, byHandle }
        sendEmailInvite(query).then( result => {
          if (result.status===200) {
            this.setState({
              snackbarText: 'INVITE SENT',
              invite: false,
              email: ''
            })
          } else {
            this.setState({ snackbarText: 'ERROR SENDING EMAIL', })
          }
        })
      }
    })
  }

  createFriendRequest = (recipientId) => {
    let {id: actorId} = this.props.viewer.user
    this.props.relay.commitUpdate(
      new CreateFriendRequest({ actorId, recipientId, })
    )
  }

  setTab = (tab) => {
    this.props.router.push('/dash/' + this.state.selectedUser.handle + '/' + tab)
    this.setState({ tab })
    window.scrollTo(0, document.body.scrollHeight)
  }

  render () {
    let selectedUser = this.state.selectedUser || {}
    let {user} = this.props.viewer
    let tab = this.state.tab
    return (
      <DashView>
        <Snackbar
          open={!!this.state.snackbarText}
          message={this.state.snackbarText}
          autoHideDuration={2000}
          onRequestClose={()=>this.setState({snackbarText: ''})}
          onActionTouchTap={()=>this.setState({snackbarText: ''})}
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
              }} >
              <DialogRow>
                <DialogSpacer>
                  <TextField
                    label={'Email'}
                    errorText={this.state.emailError}
                    name={'email'}
                    onChange={(ev, em) => this.setState({
                      email: em, emailError: null
                    })}
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
              View Profile
            </NavLink>
          </TopColumn>
          <FeedbackRating style={{justifyContent:'flex-end'}}>
            <Bolt style={{ marginRight: '15px' }} />
              {user.score || 0}
          </FeedbackRating>
        </TopPanel>
        <BotRow>
          <DashLeft>
            <FriendList
              select={this.selectUser}
              selected={selectedUser}
              friends={user.friends}
              inviteTribe={() => this.setState({invite: true}) }
              showTribe={this.state.showTribe}
              flipTribe={() => this.setState({showTribe: !this.state.showTribe})}
              mentors={user.mentors} //TODO
              inviteMentors={() => this.setState({inviteMentors: true}) }
              showMentors={this.state.showMentors}
              flipMentors={() =>
                this.setState({showMentors: !this.state.showMentors})}
              />
          </DashLeft>
          {selectedUser.id ? <Panel
            tab={tab}
            topBar={<DashProfile selectedUser={selectedUser} />}
            tabChange={(newTab)=>this.setTab(newTab)}
            labels={['projects', 'bounces', 'messages']}
            locks={[false, false, false]}
            values={[selectedUser.projects.count, selectedUser.bounces.count, 0]}
            content={this.state.selectedUser && this.props.children}
            scroll={true} />
            : <Panel empty
              content={
                <NoTribe invite={()=>this.setState({invite: true})
              }/>}/>
            }
        </BotRow>
      </DashView>
    )
  }
 }

 export default Relay.createContainer( Dashboard, {
    initialVariables: { userHandle: '' },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
            email
            score
            portrait { url }
            friends (first: 999) {
              count
              edges {
                node {
                  id
                  handle
                  score
                  lastPing
                  bounces { count }
                  projects { count }
                  portrait { url }
                }
              }
            }
          }
          User (handle: $userHandle) {
            handle
            id
            email
          }
        }
      `,
    },
  }
)
