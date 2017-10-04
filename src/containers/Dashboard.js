import React, {Component} from 'react'
import Relay from 'react-relay'
import Bolt from 'icons/Bolt'
import {View, Button, IconTextContainer, IconText} from 'styled'
import {Container, Header, HeaderOptions} from 'styled/list'
import Headphones from 'icons/Headphones'
import {Tabs, Tab} from 'material-ui/Tabs'
import {purple, grey200} from 'theme'
import {MyTribe, ProfileView, Row, SubRow, TopPanel, LeftPanel, RightPanel, BotLeft, BotRow, BotRight, Divider} from 'styled/Dashboard'
import Notifications from 'icons/Notifications'
import Lock from 'icons/Lock'

class Dashboard extends Component {
  
  render () {
    return (
      <div>
        <MyTribe>
          <Headphones 
          />
          <h3>My Tribe</h3>
        </MyTribe>
        <Divider />
        <ProfileView>
          <TopPanel>
            <h1>This is a header</h1>
          <Bolt
              style={{
                alignSelf: 'flex-end',
                marginRight: '20px',
              }}
              title="Settings"
            />
          </TopPanel>
          <BotRow>
            <BotLeft>
              <h4>Bottom Left Panel</h4>
             </BotLeft>
              <BotRight
                style={{
                  marginLeft: '20px'
                }}  
              >
                <h4>Bottom Right Panel</h4>
                  <Tabs
                    style={{
                      width: '100%',
                      padding: '10px 200px 10px 10px',
                      margin: '60px 0px'
                    }}
                    inkBarStyle={{
                      backgroundColor: purple
                    }}
                  >
                    <Tab
                      label={'Projects'}
                      value={0}
                      style={{
                       borderBottom: `2px solid ${grey200}`
                      }}
                    />
                    <Tab
                      icon={(
                        <Notifications
                        />
                      )}
                      label={'Bounces'}
                      value={1}
                    />
                    <Tab
                      icon={(
                        <Lock
                        />
                      )}
                      label={'Messages'}
                      value={2}
                      disabled={true}
                      style={{
                        cursor: 'not-allowed'
                      }}
                    />
                   </Tabs>
              </BotRight>
          </BotRow> 
        </ProfileView>
      </div>
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