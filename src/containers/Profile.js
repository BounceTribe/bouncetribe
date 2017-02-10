import React, {Component} from 'react'
import Relay from 'react-relay'
import {View} from 'styled'
import {Top, Container, Row, Left, Right, Column, Portrait, TopCol, Handle, InputRow, Location, ScoreRow, Score} from 'styled/Profile'
import Edit from 'icons/Edit'
import {purple} from 'theme'
import PinIcon from 'icons/Location'
import Bolt from 'icons/Bolt'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import ImageEditor from 'components/ImageEditor'
import UpdateUser from 'mutations/UpdateUser'

class Profile extends Component {

  state = {
    handle: '',
    handleHover: false,
    handleFocus: false,
    placename: '',
    placenameHover: false,
    placenameFocus: false,
    summary: '',
    portraitUrl: '',
    portraitHover: false,
    imageEditorOpen: false
  }

  componentWillMount(){
    this.setState( (prevState, props) => {
      let {User} = this.props.viewer
      return {
        handle: User.handle,
        placename: User.placename || '',
        summary: User.summary || '',
        portraitUrl: User.portrait.url,
        score: User.score,
        projects: User.projects.edges.length,
        friends: User.friends.edges.length
      }
    })
  }

  componentWillReceiveProps (newProps) {
    this.setState( (prevState, props) => {
      let {User} = newProps.viewer
      return {
        handle: User.handle,
        placename: User.placename || '',
        summary: User.summary || '',
        portraitUrl: User.portrait.url,
        score: User.score,
        projects: User.projects.edges.length,
        friends: User.friends.edges.length
      }
    })
  }

  portraitSuccess = (file) => {
    console.log('portraitSuccess', file)
    this.setState({imageEditorOpen: false})
    this.props.relay.commitUpdate(
      new UpdateUser({
        userId: this.props.viewer.User.id,
        portraitId: file.id,
      }), {
        onSuccess: success => console.log(success),
        failure: failure => console.log('fail', failure)
      }
    )
  }

  render () {
    let {portraitUrl, portraitHover, handle, handleHover, handleFocus, placename, placenameHover, placenameFocus, score, projects, friends, imageEditorOpen} = this.state
    let {User, user} = this.props.viewer
    let ownProfile = (User.id === user.id)
    return (
      <View>
        <Container>
          <Top>
            <Portrait
              src={portraitUrl}
              onMouseOver={()=>this.setState({portraitHover:true})}
              onMouseLeave={()=>this.setState({portraitHover:false})}
              onClick={()=>{
                if (ownProfile) {
                  this.setState({imageEditorOpen: true})
                }
              }}
              ownProfile={ownProfile}
            />
            <Edit
              style={{display: (ownProfile) ? '' : 'none'}}
              fill={(portraitHover) ? purple : ''}
            />
            <ImageEditor
              open={imageEditorOpen}
              onRequestClose={()=>this.setState({imageEditorOpen:false})}
              user={user}
              portraitSuccess={this.portraitSuccess}
            />
            <TopCol>
              <InputRow
                onMouseOver={()=>this.setState({handleHover:true})}
                onMouseLeave={()=>this.setState({handleHover:false})}
                onFocus={()=>this.setState({handleFocus:true})}
                onBlur={()=>this.setState({handleFocus:false})}
              >
                <Handle
                  value={handle}
                  onChange={(e)=>this.setState({handle: e.target.value})}
                  disabled={!ownProfile}
                  placeholder={'handle'}
                />
                <Edit
                  style={{display: (ownProfile) ? '' : 'none'}}
                  fill={(handleHover || handleFocus) ? purple : ''}
                />
              </InputRow>
              <InputRow
                onMouseOver={()=>this.setState({placenameHover:true})}
                onMouseLeave={()=>this.setState({placenameHover:false})}
                onFocus={()=>this.setState({placenameFocus:true})}
                onBlur={()=>this.setState({placenameFocus:false})}
              >
                <PinIcon/>
                <Location
                  value={placename}
                  onChange={(e)=>this.setState({placename: e.target.value})}
                  placeholder={'add your location'}
                />
                <Edit
                  style={{display: (ownProfile) ? '' : 'none'}}
                  fill={(placenameHover || placenameFocus) ? purple : ''}
                />
              </InputRow>
              <ScoreRow>
                <Bolt/>
                <Score>{score}</Score>
                <Music
                  height={20}
                />
                <Score>{projects}</Score>
                <Tribe
                  height={20}
                />
                <Score>{friends}</Score>
              </ScoreRow>
            </TopCol>
          </Top>
          <Row>
            <Left></Left>
            <Right></Right>
          </Row>
          <Column>

          </Column>
        </Container>
      </View>
    )
  }
}

export default Relay.createContainer(
  Profile, {
    initialVariables: {
      userHandle: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
          }
          User (handle: $userHandle) {
            id
            email
            handle
            summary
            portrait {
              id
              url
            }
            placename
            score
            projects (
              first: 100000
            ){
              edges {
                node {
                  id
                }
              }
            }
            friends (
              first: 100000
            ){
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      `,
    }
  }
)
