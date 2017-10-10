import React, {Component} from 'react'
import Relay from 'react-relay'
import {FindEmail, ProfileView, TopPanel, DashLeft, DashRight, InviteContainer} from 'styled/Dashboard'
import {BotRow} from 'styled/Profile'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import {Button} from 'styled'
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

class Dashboard extends Component {

  constructor() {
    super();
    this.state = { invite: false, email: null, selectedUser: {} }
  }

  selectUser = (selectedUser) => {
    this.setState({selectedUser})
    console.log('e', selectedUser);
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


  render () {
    //for testing: remove later
    let user = this.props.viewer
    console.log('user',  user);
    console.log('props', this.props);
    console.log('state', this.state);

    return (
      <ProfileView>
        <TopPanel>
          <h4>BounceTribe!</h4>
          <InviteContainer onClick={()=>{this.setState({invite: true})}}/>
          <Dialog
            title={"Invite to Your Tribe"}
            titleStyle={{
              fontSize: '28px',
              borderBottom:'0.5px solid ' + grey400,
              padding: '16px 27px 13.5px 27px',
              fontFamily: 'Helvetica Neue'
            }}
            bodyStyle={{borderBottom:'0.5px solid ' + grey400}}
            contentStyle={{borderRadius: '5px', overflow: 'hidden'}}
            actions={[
              <Button
                label={"Cancel"}
                onClick={()=>{ this.setState({invite: false}) }}
              />
              //TODO FACEBOOOK FRIENDS HERE
            ]}
            open={this.state.invite}
          >
            <FindEmail>
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
                  color: white,
                  fontSize: '14px',
                  fontFamily: 'Helvetica Neue',
                  textTransform: 'none'
                }}
                icon={
                  <Send
                    fill={white}
                    height={14}
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
              <br />
            </FindEmail>
          </Dialog>
        </TopPanel>
        <BotRow>
          <DashLeft>
            {this.friends(this.props.viewer.user.friends)}
          </DashLeft>
          <DashRight>
            <ProfContainer>
              <ProfTop>
                <ProfLeft>
                  <Portrait
                    src={(this.state.selectedUser.portrait) ? this.state.selectedUser.portrait.url : `${url}/logo.png`}
                    to={`/${this.state.selectedUser.handle}`}
                  />
                  <ProfCol>
                    <ProfHandle to={`/${this.state.selectedUser.handle}`} >
                      {this.state.selectedUser.handle}
                    </ProfHandle>
                    <Score>
                      <Bolt style={{ marginRight: '5px' }} />
                      {this.state.selectedUser.score}
                    </Score>
                  </ProfCol>
                </ProfLeft>
                <MoreInfo>
                  <Location
                    fill={purple}
                    height={20}
                    width={20}
                    style={{
                      marginLeft: '15px',
                      marginRight: '5px',
                      display: (this.state.selectedUser.placename) ? '': 'none'
                    }}
                  />
                  {this.state.selectedUser.placename}
                  <Experience
                    height={18}
                    width={18}
                    style={{
                      marginLeft: '15px',
                      marginRight: '5px',
                      display: (this.state.selectedUser.experience) ? '': 'none'
                    }}
                  />
                  {formatEnum(this.state.selectedUser.experience)}
                </MoreInfo>
              </ProfTop>
            </ProfContainer>
            <Tabs
              style={{ marginTop: '6px', marginBottom: '25px', }}
              inkBarStyle={{ backgroundColor: purple }}
              value={this.props.router.params.tab}
            >
              <Tab
                label={'Projects'}
                value={'projects'}
                onActive={()=>{
                  this.props.router.replace(`/projects/`)
                  window.scrollTo(0, document.body.scrollHeight)
                }}
                style={{ borderBottom: `2px solid ${grey200}` }}
              />
              <Tab
                label={'bounces'}
                value={'bounces'}
                onActive={()=>{
                  this.props.router.replace(`/bounces/`)
                  window.scrollTo(0, document.body.scrollHeight)
                }}
                style={{ borderBottom: `2px solid ${grey200}` }}
              />
              <Tab
                label={'Messages'}
                value={'messages'}
                onActive={()=>{
                  this.props.router.replace(`/messages/${this.state.selectedUser.handle}`)
                  window.scrollTo(0, document.body.scrollHeight)
                }}
                style={{ borderBottom: `2px solid ${grey200}` }}
              />
            </Tabs>
            {
              this.state.selectedUser.id
              ? (<DirectMessages/>)
              : (<div/>)
            }
          </DashRight>
        </BotRow>
      </ProfileView>
    )
  }
 }

 export default Relay.createContainer(
  Dashboard, {
    fragments: {
      viewer: () => Relay.QL`
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
          }
        }
      `,
    },
  }
)
