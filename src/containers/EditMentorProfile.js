import React, {Component} from 'react'
import Relay from 'react-relay'
import UpdateMentor from 'mutations/UpdateMentor'
import CreateMentor from 'mutations/CreateMentor'
import CreatePackage from 'mutations/CreatePackage'
import UpdatePackage from 'mutations/UpdatePackage'
import {Button, IconTextContainer, IconText} from 'styled'
import EditMentorBio from 'components/EditMentorBio'
import EditMentorWork from 'components/EditMentorWork'
import EditMentorServices from 'components/EditMentorServices'
import {Panel} from 'components/Panel'
import {Header, HeaderOptions} from 'styled/list'
import {EditView} from 'styled/MentorProfile'
import {Snackbar} from 'material-ui'
import {mapMentorInfo} from 'utils/mapUserInfo'
import {mapNodes} from 'utils/mapNodes'
import {purple} from 'theme'
import MentorCircle from 'icons/MentorCircle'

// import {isURL} from 'validator'

class EditMentorProfile extends Component {
  constructor(props) {
    super(props)
    this.user = this.props.viewer.user
    let mentorAccount = this.user.mentorAccount || {}
    let packages = mapNodes(mentorAccount.packages)
    this.state = {
      snackbarText: '',
      summaryError: '',
      soundcloudError: '',
      youtubeError: '',
      beatportError: '',
      summary: mentorAccount.summary,
      videoUrl: mentorAccount.videoUrl,
      occupation: mentorAccount.occupation,
      qualifications: mentorAccount.qualifications,
      firstName: mentorAccount.firstName,
      lastName: mentorAccount.lastName,
      specialties: mapMentorInfo(mentorAccount).specialties,
      mediaUrls: mentorAccount.mediaUrls || [],
      userProjects: mapNodes(this.user.projects),
      projectsIds: mapNodes(mentorAccount.projects, '.id'),
      package1: packages[0]
    }
    if (!this.user.mentorAccount) {
      this.becomeMentor()
    }
    if (!packages.length) {
      console.log('no packages, creating package');
      this.createPackage()
    }
  }

  createPackage = (mentorId) => {
    Relay.Store.commitUpdate(
      new CreatePackage({mentorId: this.props.viewer.user.mentorAccount.id || mentorId}), {
        onSuccess: (response) => {
          console.log('createPackage response', response)
          this.setState({package1: { id: response.createPackage.package.id}})
        },
        onFailure: (response) => {
          console.log('CreateMentor error', response)
          debugger
        }
      }
    )
  }

  becomeMentor = () => {
    Relay.Store.commitUpdate(
      new CreateMentor({user: this.props.viewer.user}), {
        onSuccess: (response) => {
          console.log('createMentor response', response)
          this.setState({id: response.createMentor.mentor.id})
          this.createPackage()
        },
        onFailure: (response) => {
          console.log('CreateMentor error', response)
          debugger
        }
      }
    )
  }

  updateMentor = () => {
    let updateObj = Object.assign(this.state, {
      mentorId: (this.user.mentorAccount || {}).id,
      specialtiesIds: this.state.specialties.map(s=>s.value || s)
    })
    console.log('updating', updateObj);
    Relay.Store.commitUpdate(
      new UpdateMentor(updateObj), {
        onSuccess: (success) =>{
          this.setState({snackbarText: 'PROFILE UPDATED'})
          this.updatePackage()
        },
        onFailure: (failure) => console.log({failure})
      }
    )
  }

  updatePackage = (index) => {
    let updateObj = this.state.package1
    console.log('updating package', updateObj);
    Relay.Store.commitUpdate(
      new UpdatePackage(updateObj), {
        onSuccess: (success) =>
          this.setState({snackbarText: 'PACKAGE UPDATED'}),
        onFailure: (failure) => console.log({failure})
      }
    )
  }

  getContent = (tab) => {
    const tabs = {
      bio: () => <EditMentorBio
        setState={obj=>this.setState(obj)}
        firstName={this.state.firstName}
        lastName={this.state.lastName}
        occupation={this.state.occupation}
        qualifications={this.state.qualifications}
        videoUrl={this.state.videoUrl}
        summary={this.state.summary}
        specialties={this.state.specialties}
      />,
      work: () => <EditMentorWork
        setState={obj=>this.setState(obj)}
        projectsIds={this.state.projectsIds}
        userProjects={this.state.userProjects}
        mediaUrls={this.state.mediaUrls}
      />,
      services: () => <EditMentorServices
        setState={obj=>this.setState({package1: obj})}
        package1={{...this.state.package1}}
      />
    }

    return tabs[tab]()
  }

  setTab = (tab, handle) => {
    this.props.router.push(`/mentor/editprofile/${handle}/${tab}`)
    this.setState({ tab })
  }

  render() {
    console.log('em render', this)
    let tab = this.props.params.tab || 'bio'
    let top = (
      <Header>
        <IconTextContainer to={`/mentor/${this.props.params.userHandle}`} >
          <MentorCircle/>
          <IconText>{'My Mentor Profile'}</IconText>
        </IconTextContainer>
        <HeaderOptions>
          <Button
            style={{marginRight: '20px'}}
            onClick={this.updateMentor}
            label={'Save'}
            primary
          />
          <Button
            to={`/mentor/${this.props.params.userHandle}`}
            label={'View My Profile'}
            primary
          />
        </HeaderOptions>
      </Header>
    )
    return (
      <EditView>
        <Snackbar
          open={!!this.state.snackbarText}
          message={this.state.snackbarText}
          autoHideDuration={2000}
          onRequestClose={()=>this.setState({snackbarText: ''})}
          onActionTouchTap={()=>this.setState({snackbarText: ''})}
          bodyStyle={{ backgroundColor: purple }} />
        <Panel
          hideBorder
          tab={tab}
          topBar={top}
          tabChange={(tab)=>this.setTab(tab, this.props.userHandle)}
          labels={['bio', 'work', 'services']}
          names={['mentor bio', 'my work', 'services']}
          content={this.getContent(tab)}
        />
      </EditView>
    )
  }
}

export default Relay.createContainer( EditMentorProfile, {
  initialVariables: { userHandle: '', mentorFilter: {} },
  prepareVariables: (urlParams) => ({
    ...urlParams,
    mentorFilter: {
      userAccount: {
        handle: urlParams.userHandle
      }
    }
  }),
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            handle
            id
            projects (first: 100) {
              edges { node { id, title } }
            }
            mentorAccount {
              id
              firstName
              lastName
              summary
              videoUrl
              occupation
              qualifications
              specialties ( first: 20 ) {
                edges { node { id, name } }
              }
              projects (first: 100) {
                edges { node { id, title } }
              }
              website
              deactivated
              mentees (first: 100) {
                edges { node { id, handle } }
              }
              mediaUrls
              userAccount { id, handle }
              reviews (first: 100) {
                edges { node { id, text, rating } }
              }
              packages (first: 10) {
                edges {
                  node {
                    id
                    responseHours
                    reviewsPerMonth
                    videoChatsPerMonth
                    careerStrategizing
                    mixingMasteringHelp
                    introductionsToNetwork
                    monthlyRate
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
