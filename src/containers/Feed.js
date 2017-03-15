import React, {Component} from 'react'
import Relay from 'react-relay'
import {Container, Paper, Profile, Left, Col, Portrait, Artwork, Title, Handle, Genre, Row, Value} from 'styled/Feed'
import {fetchFeed} from 'utils/graphql'
import Music from 'icons/Music'
import Comment from 'icons/Comment'
import Heart from 'icons/Heart'

import {white} from 'theme'
import {Loading} from 'styled/Spinner'
import {url} from 'config'

class Feed extends Component {

  state = {
    feed: false
  }

  componentWillMount () {
    let {handle} = this.props.viewer.user
    fetchFeed(handle).then(feed => this.setState({feed}))
  }


  feed = () => {
    let {feed} = this.state
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
                {project.genres[0].name}
              </Genre>
            </Profile>
            <Artwork
              src={(project.artwork) ? project.artwork.url : `${url}/artwork.png`}
              to={`/${project.creator.handle}/'${project.title}'`}

            />
            <Row>
              <Heart
                height={30}
                width={30}
              />
              <Value>
                {project.comments.length}
              </Value>
              <Comment
                height={30}
                width={30}
              />
              <Value>
                {project.comments.length}
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
          }
        }
      `,
    },
  }
)
