import React, {Component} from 'react'
import Relay from 'react-relay'
import {BtLink} from 'styled'
import {ProfileView, TopPanel, LeftPanel, RightPanel, ProfileImg, UserName, NavList, NavLink, NavText} from 'styled/Dashboard'
import AddButton from 'icons/AddButton'
import {Row} from 'styled/Profile'
import {Column} from 'styled/list'


class Dashboard extends Component {

  render () {
    let user = this.props.viewer.user

    console.log('props:', user.portrait.url)
    return (
      <div>
        <ProfileView>
          <TopPanel>
            <ProfileImg src={user.portrait.url} />
            <UserName>{user.handle}</UserName> 
            <NavLink to={`/${user.handle}`}>
              Edit Profile
            </NavLink>
            <BtLink>
              Invite Member<AddButton />
            </BtLink>
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
            email
            portrait {url}
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
