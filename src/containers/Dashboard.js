import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProfileView, TopPanel, LeftPanel, RightPanel, InviteContainer} from 'styled/Dashboard'
import {Row} from 'styled/Profile'
import {Column} from 'styled/list'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import {View, IconText, IconTextContainer, Button} from 'styled'
import {FindH3} from 'styled/Tribe'
import {white} from 'theme'
import Send from 'icons/Send'


class Dashboard extends Component {
  state = { invite: false, searching: false }
  render () {
    let {User, user} = this.props.viewer
    let person = (User) ? (User) : (user)
    let {handle} = person
    // let {router} = this.props
    return (
      <ProfileView>
        <TopPanel>
          <h4>BounceTribe!</h4>
          <InviteContainer onClick={()=>{this.setState({invite: true})}}/>
          <Dialog
            title={"Invite to Your Tribe"}
            actions={[
              <Button
                label={"Close"}
                onClick={()=>{ this.setState({invite: false}) }}
              />
            ]}
            open={this.state.invite}
            modal={true}
          >
            <FindH3>
              Email
              <TextField
                label={'Email'}
                name={'email'}
                onChange={()=>{ this.setState({searching: true}) }}
                placeholder={'enter email here'}
              />
              <Button
                to={{
                  pathname: `/${handle}/tribe/find/`,
                  query: { ownId: user.id },
                }}
                icon={ <Send fill={white} /> }
                label={'Send Invite'}
                primary
              />
            </FindH3>
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
    initialVariables: {
      handle: "",
    },
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
                  projects (
                    first: 999
                    filter: {
                      privacy_not: PRIVATE
                    }
                    orderBy: createdAt_DESC
                  ) {
                    edges {
                      node {
                        createdAt
                        id
                        title
                        genres (
                          first: 999
                        ) {
                          edges {
                            node {
                              name
                            }
                          }
                        }
                        artwork {
                          url
                        }
                        creator {
                          handle
                          portrait {
                            url
                          }
                        }
                        comments (
                          first: 999
                        ) {
                          edges {
                            node {
                              type
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
      `,
    },
  }
)
