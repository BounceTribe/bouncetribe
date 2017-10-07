import React, {Component} from 'react'
import Relay from 'react-relay'
import {FindEmail, ProfileView, TopPanel, LeftPanel, RightPanel, InviteContainer} from 'styled/Dashboard'
import {Row} from 'styled/Profile'
import {Column} from 'styled/list'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import {Button} from 'styled'
import {white, purple, grey400} from 'theme'
import Send from 'icons/Send'
import CreateFriendRequest from 'mutations/CreateFriendRequest'
import FlatButton from 'material-ui/FlatButton'

class Dashboard extends Component {
  state = { invite: false, email: null }


  createFriendRequest = (recipientId) => {
    let {id: actorId} = this.props.viewer.user
    this.props.relay.commitUpdate(
      new CreateFriendRequest({
        actorId,
        recipientId,
      })
    )
  }

  componentWillMount() {
    this.findFriends()
  }

  findFriends = () => {
    console.log('dash props', this.props);
  }

  sendInvite = () => {
    console.log('event', this.state.email);
    this.setState({invite: false})
  }

  render () {
    let user = this.props.viewer
    console.log('user',  user);

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
        <Row>
          <Column>
            <LeftPanel>
              <h4>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

              The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</h4>
            </LeftPanel>
          </Column>
          <Column>
            <RightPanel>
              <h4>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

              The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</h4>
            </RightPanel>
          </Column>
        </Row>
      </ProfileView>
    )
  }
 }

 export default Relay.createContainer(
  Dashboard, {
    initialVariables: { handle: "", },
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
