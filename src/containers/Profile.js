import React, {Component} from 'react'
import Relay from 'react-relay'
import {ProfileView, Top, Row, Left, Right, Portrait, TopCol, Handle, InputRow, Location, ScoreRow, Score, Divider, Summary, Input, BotLeft, BotRow, BotRight} from 'styled/Profile'
import PinIcon from 'icons/Location'
import Bolt from 'icons/Bolt'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Email from 'icons/Email'
import Link from 'icons/Link'
import {Tabs, Tab} from 'material-ui/Tabs'
import ImageEditor from 'components/ImageEditor'
import UpdateUser from 'mutations/UpdateUser'
import {Async} from 'react-select'
import 'react-select/dist/react-select.css'
import {getAllGenres} from 'utils/graphql'

class Profile extends Component {

  state = {
    imageEditorOpen: false,
    genres: []
  }

  inputChange = (e) => {
    let {
      name,
      value
    } = e.target
    this.setState((prevState, props)=>{
      return {
        [name]: value
      }
    })
  }

  genreChange = (val) => {
    console.log(val)
    let genresIds = val.map(genre=>{
      return genre.value
    })
    console.log(genresIds)
    this.props.relay.commitUpdate(
      new UpdateUser({
        userId: this.props.viewer.user.id,
        genresIds
      }), {
        onSuccess: success => console.log('success')
      }
    )
  }

  componentWillMount = () => {
    this.setState( (prevState, props) => {
      let {User} = this.props.viewer
      let genres = User.genres.edges.map(edge=>{
        let {node: genre} = edge
        return {
          value: genre.id,
          label: genre.name
        }
      })
      return {
        handle: User.handle,
        placename: User.placename || '',
        summary: User.summary || '',
        portraitUrl: User.portrait.url,
        website: User.website || '',
        email: User.email || '',
        genres
      }
    })
  }

  componentWillReceiveProps (newProps) {
    this.setState( (prevState, props) => {
      let {handle, placename, summary, portrait, score, projects, friends, website, email, genres} = newProps.viewer.User
      let newGenres = genres.edges.map(edge=>{
        let {node: genre} = edge
        return {
          value: genre.id,
          label: genre.name
        }
      })
      return {
        handle: handle || '',
        placename: placename || '',
        summary: summary || '',
        score: score || '',
        website: website || '',
        email: email || '',
        portraitUrl: portrait.url,
        projects: projects.edges.length,
        friends: friends.edges.length,
        genres: newGenres
      }
    })
  }

  portraitSuccess = (file) => {
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

  loadGenres = () => {
    return new Promise( (resolve, reject)=> {
      getAllGenres().then(allGenres=>{
        let options = allGenres.map(genre=>{
          return {
            value: genre.id,
            label: genre.name
          }
        })
        resolve({options})
      })
    })
  }

  render () {
    let {handle, imageEditorOpen, portraitUrl, placename, summary, website, email, genres} = this.state
    let {User, user} = this.props.viewer
    let {score} = User
    let projects = User.projects.edges.length
    let friends = User.friends.edges.length
    let ownProfile = (User.id === user.id)
    return (
      <ProfileView>
          <Top>
              <Row>
                <Portrait
                  src={portraitUrl}
                  onClick={()=>{
                    if (ownProfile) {
                      this.setState({imageEditorOpen: true})
                    }
                  }}
                  ownProfile={ownProfile}
                />
                <ImageEditor
                  open={imageEditorOpen}
                  onRequestClose={()=>this.setState({imageEditorOpen:false})}
                  user={user}
                  portraitSuccess={this.portraitSuccess}
                />
                <TopCol>
                  <InputRow>
                    <Handle
                      value={handle}
                      onChange={this.inputChange}
                      disabled={!ownProfile}
                      placeholder={'handle'}
                      name={'handle'}
                    />
                  </InputRow>
                  <InputRow>
                    <PinIcon/>
                    <Location
                      value={placename}
                      onChange={this.inputChange}
                      placeholder={'add your location'}
                      name={'placename'}
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
              </Row>
              <Divider/>
              <Row>
                <Left>
                  <Summary
                    value={summary}
                    onChange={this.inputChange}
                    placeholder={'add your summary'}
                  />
                </Left>
                <Right>
                  <InputRow>
                    <Email/>
                    <Input
                      value={email}
                      placeholder={'Add your email'}
                      onChange={this.inputChange}
                    />
                  </InputRow>
                  <InputRow>
                    <Link/>
                    <Input
                      value={website}
                      placeholder={'Add your website'}
                      onChange={this.inputChange}
                    />
                  </InputRow>
                </Right>
              </Row>
          </Top>
          <BotRow>
            <BotLeft>
              <Tabs
                style={{width: '100%', marginTop: '6px'}}
              >
                <Tab
                  label={'Activity'}
                />
                <Tab
                  label={'Projects'}
                />
                <Tab
                  label={'Bounces'}
                />
              </Tabs>
            </BotLeft>
            <BotRight>
              <Async
                loadOptions={this.loadGenres}
                value={genres}
                onChange={this.genreChange}
                multi={true}
                className={'async'}
              />
              {/* <AsyncCreatable
                loadOptions={this.loadGenres}
                value={genres}
              /> */}
            </BotRight>
          </BotRow>

      </ProfileView>
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
            website
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
            genres (
              first: 500
            ) {
              edges {
                node {
                  id
                  name
                }
              }
            }
          }
        }
      `,
    }
  }
)
