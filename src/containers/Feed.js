import React, {Component} from 'react'
import Relay from 'react-relay'
import {Bubble} from 'styled'
import {Container, Paper, Profile, Left, Col, Portrait, Artwork, Title, Handle, Genre, Row, Value} from 'styled/Feed'
// import {fetchFeed} from 'utils/graphql'
import Music from 'icons/Music'
import Comment from 'icons/Comment'
import Heart from 'icons/Heart'

import {white} from 'theme'
import {Loading} from 'styled/Spinner'
import {url} from 'config'

// import {SubscriptionClient} from 'subscriptions-transport-ws'

class Feed extends Component {

  state = {
    feed: false
  }

  // constructor(props) {
  //   super(props)
    // this.feedSub = new SubscriptionClient(
    //   'wss://subscriptions.graph.cool/v1/bt-carl',
    //   {
    //     reconnect: true,
    //   }
    // )
    //
    // this.feedSub.subscribe(
    //   {
    //     query: `subscription updateProject {
    //       Project (
    //         filter: {
    //           mutation_in: [UPDATED]
    //         }
    //       ) {
    //         node {
    //           title
    //         }
    //       }
    //     }`
    //   },
    //   (error, result) => {
    //     console.log("error, result", error, result)
    //   }
    // )
  //
  // }

  componentWillMount () {
    // let {handle} = this.props.viewer.user
    //fetchFeed(handle).then(feed => this.setState({feed}))
  }


  countComments = (comments, type) => {
    let counter = 0
    comments.edges.forEach(edge => {
      if (edge.node.type === type) {
        counter++
      }
    })
    return counter
  }

  feed = () => {
    let feed = []
    this.props.viewer.user.friends.edges.forEach( (edge) => {
      edge.node.projects.edges.forEach((projectEdge) => {
        feed.push(projectEdge.node)
      })
    })
    //let {handle} = this.props.viewer.user
    feed.sort( (a, b) => {
      return  Date.parse(b.createdAt) - Date.parse(a.createdAt)
    })
    if (feed) {
      return feed.map(project=>{
        return (
          <Paper
            key={project.id}
          >
            <Profile>
              <Left>
                <Portrait
                  src={project.creator.portrait.url}
                  to={`/${project.creator.handle}`}
                />
                <Col>
                  <Title
                    to={`/${project.creator.handle}/${project.title}`}
                  >
                    {project.title}
                  </Title>
                  <Handle
                    to={`/${project.creator.handle}`}
                  >
                    {project.creator.handle}
                  </Handle>
                </Col>
              </Left>
              <Genre>
                <Music
                  fill={white}
                  height={16}
                  style={{marginRight: '5px'}}
                />
                {(project.genres.edges.length > 0) ? project.genres.edges[0].node.name : ''}
              </Genre>
            </Profile>
            <Artwork
              src={(project.artwork) ? project.artwork.url : `${url}/artwork.png`}
              to={`/${project.creator.handle}/'${project.title}'`}

            />
            <Row>
              <Bubble>
                <Heart
                  height={20}
                  width={20}
                />
              </Bubble>

              <Value>
                {this.countComments(project.comments, 'LIKE')}
              </Value>
              <Bubble
                secondary
              >
                <Comment
                  height={20}
                  width={20}
                />
              </Bubble>

              <Value>
                {this.countComments(project.comments, 'COMMENT')}
              </Value>
            </Row>
          </Paper>
        )
      })
    } else {
      return (<Loading/>)
    }
  }

  render () {
    return (
      <Container>
        {this.feed()}
      </Container>
    )
  }
}

export default Relay.createContainer(
  Feed, {
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
