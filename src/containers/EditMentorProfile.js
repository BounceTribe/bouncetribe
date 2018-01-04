import React, {Component} from 'react'
import Relay from 'react-relay'
import UpdateMentor from 'mutations/UpdateMentor'
import CreateMentor from 'mutations/CreateMentor'
import {View, Button, IconTextContainer, IconText} from 'styled'
import EditMentorBio from 'components/EditMentorBio'
// import EditMentorWork from 'containers/EditMentorWork'
// import EditMentorServices from 'containers/EditMentorServices'
import {Panel} from 'components/Panel'
import {Header, HeaderOptions} from 'styled/list'
import {EditView} from 'styled/MentorProfile'
import {mapUserInfo} from 'utils/mapUserInfo'



class EditMentorProfile extends Component {
// TODO: look up cascading qualificaitons BtTagList
// TODO: embed preview
  constructor(props) {
    super(props)
    this.user = this.props.viewer.user
    let mentorAccount = this.user.mentorAccount || {}
    // this.state = {
    //   handleError: '',
    //   summaryError: '',
    //   mediaUrls: mentorAccount.mediaUrls || ['','',''],
    //   summary: mentorAccount.summary,
    //   videoUrl: mentorAccount.videoUrl,
    //   occupation: mentorAccount.occupation,
    //   qualifications: mentorAccount.qualifications,
    //   website: mentorAccount.website,
    //   id: mentorAccount.id,
    //   handle: mentorAccount.handle || this.user.handle,
    // }
    this.state = {
      summaryError: '',
      summary: mentorAccount.summary,
      videoUrl: mentorAccount.videoUrl,
      occupation: mentorAccount.occupation,
      qualifications: mentorAccount.qualifications,
      firstName: mentorAccount.firstName,
      lastName: mentorAccount.lastName,
      specialties: mapUserInfo(mentorAccount).specialties
    }
    if (!this.user.mentorAccount) {
      this.becomeMentor()
    }
  }

  becomeMentor = () => {
    Relay.Store.commitUpdate(
      new CreateMentor({user: this.props.viewer.user}), {
        onSuccess: (response) => {
          console.log('createMentor response', response)
          this.setState({id: response.createMentor.mentor.id})
        },
        onFailure: (response) => {
          console.log('CreateMentor error', response)
          debugger
        }
      }
    )
  }

  sendUpdate = () => {
    let updateObj = Object.assign(this.state, {
      mentorId: (this.user.mentorAccount || {}).id,
      specialtiesIds: this.state.specialties.map(s=>s.value || s)
    })
    console.log('updating', updateObj);
    Relay.Store.commitUpdate(
      new UpdateMentor(updateObj), {
        onSuccess: (success) =>
          this.props.router.push(`/mentor/${this.props.params.userHandle}`),
        onFailure: (failure) => console.log('updatementor fail', failure)
      }
    )
    // for (var i = 0; i < this.state.mediaUrls.length; i++) {
    //   if (this.state.mediaUrls[i].url!==this.oldmediaUrls[i].url)
    //     this.updateMediaLink()
    // }
  }

  getContent = (tab) => {
    const tabs = {
      bio: () => <EditMentorBio
        update={this.sendUpdate}
        setState={(obj)=>this.setState(obj)}
        firstName={this.state.firstName}
        lastName={this.state.lastName}
        occupation={this.state.occupation}
        qualifications={this.state.qualifications}
        videoUrl={this.state.videoUrl}
        summary={this.state.summary}
        specialties={this.state.specialties}
      />
    }

    return tabs[tab]()
  }

  setTab = (tab, handle) => {
    this.props.router.push(`/mentor/editprofile/${handle}/${tab}`)
    this.setState({ tab })
  }

  render() {
    // let {handleError, summaryError, id} = this.state
    console.log('em render', this)
    let tab = this.props.params.tab || 'bio'
    let top = (
      <Header>
        <IconTextContainer to={`/mentor/${this.props.params.userHandle}`} >
          {/* <TribeIcon fill={purple} /> */}
          <IconText>{'My Mentor Profile'}</IconText>
        </IconTextContainer>
        <HeaderOptions>
          <Button
            style={{marginRight: '20px'}}
            onClick={this.sendUpdate}
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
        <Panel
          hideBorder
          tab={tab}
          topBar={top}
          tabChange={(tab)=>this.setTab(tab, this.props.userHandle)}
          labels={['mentor bio', 'my work', 'services']}
          values={[null, null, null]}
          locks={[false, false, false]}
          content={this.getContent(tab)}
        />
        {/* {id ? this.textFields() :
          <FlatButton label="View My Profile" onClick={this.becomeMentor} />
        }
        <FlatButton label="Cancel" onClick={()=>          this.props.router.push(`/mentor/${this.state.handle}`)
        } />
        <FlatButton
          label="Save Mentor Info"
          primary
          disabled={!!handleError || !!summaryError || !id}
          onClick={()=>this.sendUpdate()}
        /> */}
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
            }
          }
        }
      `,
    },
  }
)
