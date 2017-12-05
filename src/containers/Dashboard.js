import React, {Component} from 'react'
import Relay from 'react-relay'
import {FbList, SendInviteBtn, DialogSpacer, DialogRow, DashLeft, DashView, InviteButton, DashHeader, DashHeaderRow, Divider, DashProfile, BotRow, UpperInvite} from 'styled/Dashboard'
import {FriendList} from 'components/FriendList'
import {EmptyPanel} from 'components/EmptyPanel'
import {ActivityList} from 'components/ActivityList'
import {Dialog, TextField, Snackbar} from 'material-ui'
import {grey400, purple} from 'theme'
import Tribe from 'icons/Tribe'
// import Bolt from 'icons/Bolt'
import {BtAvatar, IconTextContainer, IconText} from 'styled'
import {suggestedFriends} from 'utils/graphql'
import CreateFriendRequest from 'mutations/CreateFriendRequest'
import {Panel} from 'components/Panel'
import sendEmailInvite from 'utils/sendEmailInvite'
import {isUniqueField} from 'utils/handles'


class Dashboard extends Component {

  constructor(props) {
    console.log('dash constructor props', props)
    super(props)
    this.state = {
      invite: false,
      inviteMentors: false,
      email: null,
      emailError: null,
      maxSuggestedFriends: 20,
      selectedUser: {},
      suggestions: [],
      showMentors: true,
      showTribe: true,
      showBand: true,
      tab: props.location.pathname.split('/')[3] ||'projects',
      snackbarText: ''
    }
  }

  componentWillMount() {console.log('first?')}

  componentDidMount() {
    let friends = this.props.viewer.user.friends.edges.map(edge=>edge.node)
    if (friends.length) {
      let foundUser = friends.find(edge =>
        edge.handle === this.props.params.theirHandle)
      if (foundUser) {
        this.setState( {selectedUser: foundUser || {}} )
      } else {
        this.selectUser(friends[0])
        this.props.router.push(`/dash/${friends[0].handle}/projects`)
      }
    } else {
      console.log('dash no tribe');
    }
  }

  componentWillUnmount() {
    //direct messages
    localStorage.removeItem('newMessages')
    localStorage.removeItem('message')
  }

  inviteDialog = () => {
    this.setState({invite: true})
    this.suggestFriends()
  }

  suggestFriends = (max) => {
    max = max || this.state.maxSuggestedFriends
    suggestedFriends(this.props.viewer.user.id).then( suggestions => {
      this.setState( (prevState, props) => {
        let list = suggestions.slice(0, max).map( friend =>
          <FbList
            key={friend.id}
            createFriendRequest={() => this.createFriendRequest(friend.id)}
            friend={friend} />
        )
        return {suggestions: list, invite: true}
      })
    })
  }

  selectUser = (selectedUser) => {
    localStorage.removeItem('newMessages')
    localStorage.removeItem('message')
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
      new CreateFriendRequest({ actorId, recipientId})
    )
  }

  setTab = (tab) => {
    this.props.router.push('/dash/' + this.state.selectedUser.handle + '/' + tab + '/' + this.props.viewer.user.handle)
    this.setState({ tab })
    // window.scrollTo(0, document.body.scrollHeight)
  }

  panelContent = ({tab, selectedUser}) => {
    if (selectedUser.id) {
      return (
        <Panel
          tab={tab}
          topBar={<DashProfile selectedUser={selectedUser} />}
          tabChange={(newTab)=>this.setTab(newTab)}
          labels={['projects', 'bounces', 'messages']}
          locks={[false, false, false]}
          values={[selectedUser.projects.count, selectedUser.bounces.count, 0]}
          content={this.state.selectedUser && this.props.children}
          scroll={true} />
        )
    } else if (!this.props.viewer.user.friends.count) {
      return (
        <Panel empty
          content={
            <EmptyPanel
              icon={<Tribe height={93} fill={"#D3D3D3"} />}
              headline={`It's a little quiet here...`}
              note={`Invite your friends to begin building your tribe`}
              btnLabel={`Invite Friends`}
              btnClick={()=>this.inviteDialog()}
            />}
        />
      )
    } else {

    }

  }

  render () {
    let {user} = this.props.viewer
    let {tab, selectedUser} = this.state
    if (user.deactivated) return null
    return (
      <DashView>
        <Snackbar
          open={!!this.state.snackbarText}
          message={this.state.snackbarText}
          autoHideDuration={2000}
          onRequestClose={()=>this.setState({snackbarText: ''})}
          onActionTouchTap={()=>this.setState({snackbarText: ''})}
          bodyStyle={{ backgroundColor: purple }} />
        <Dialog
          title={"Invite to Your Tribe"}
          modal={false}
          open={this.state.invite}
          onRequestClose={()=>{ this.setState({invite: false}) }}
          autoScrollBodyContent={true}
          bodyStyle={{padding: '0'}}
          titleStyle={{
            fontSize: '28px',
            borderBottom:`1px solid ${grey400}`,
            padding: '16px 27px 13px 27px',
          }}
          contentStyle={{width: '580px', minHeight: '400px'}} >

          <DialogRow style={{paddingTop: '0'}}>
            <UpperInvite>
              <Tribe width={30} style={{paddingRight: '7px'}}/>
              Send an invitation to your friend
            </UpperInvite>
            <DialogSpacer>
              <TextField
                label={'Email'}
                errorText={this.state.emailError}
                name={'email'}
                onChange={ (ev, em) =>
                  this.setState({ email: em, emailError: null })
                }
                placeholder={'Email'}
              />
              <SendInviteBtn onClick={()=>{ this.sendInvite() }} />
            </DialogSpacer>
          </DialogRow>
          {!!this.state.suggestions.length &&
             <DialogRow>{this.state.suggestions}</DialogRow>}
        </Dialog>

        <DashHeader>
          <DashHeaderRow>
            <IconTextContainer to={`/tribe/${user.handle}`} >
              <BtAvatar size={40} hideStatus />
              <IconText>My Tribe</IconText>
            </IconTextContainer>
            <InviteButton
              onClick={()=>{this.inviteDialog()}}
              text={'Invite Member'} />
          </DashHeaderRow>
        </DashHeader>
        <Divider/>
        <BotRow>
          <DashLeft>
            <FriendList
              select={this.selectUser}
              selected={selectedUser}
              friends={user.friends}
              inviteTribe={() => this.inviteDialog() }
              showTribe={this.state.showTribe}
              flipTribe={() => this.setState({showTribe:  !this.state.showTribe})}
              mentors={user.mentors} //TODO
              inviteMentors={() => this.setState({inviteMentors: true}) }
              showMentors={this.state.showMentors}
              flipMentors={() =>
                this.setState({showMentors: !this.state.showMentors})}
              />
          </DashLeft>
          {this.panelContent({tab, selectedUser})}
        </BotRow>
      </DashView>
    )
  }
 }

 export default Relay.createContainer( Dashboard, {
    initialVariables: { theirHandle: '', userHandle: ''},
    prepareVariables: (urlParams) => {
      console.log('prep PRAMS', urlParams);
      return {

      }
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            deactivated
            handle
            email
            score
            portrait { url }
            friends (
              first: 999
              filter: {deactivated: false}
            ) {
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
        }
      `,
    },
  }
)
