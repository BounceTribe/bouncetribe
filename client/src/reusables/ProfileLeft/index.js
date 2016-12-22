import React, { Component } from 'react'
import styled from 'styled-components'
import ProfileField from 'reusables/ProfileField'
import InfluencesField3 from 'reusables/InfluencesField3'

const ProfileLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  min-width: 66%;
  margin-top: 60px;
`



class ProfileLeft extends Component {


  get showSummary () {
    if (this.props.user.summary  || this.props.ownProfile) {
      return (
        <ProfileField
          field={'summary'}
          label={'summary'}
          text={this.props.user.summary}
          submitField={this.props.submitField}
          ownProfile={this.props.ownProfile}
        />
      )
    } else {
      return (
        null
      )
    }
  }

  get showInfluences () {
    if (this.props.user.influences.edges.length > 0  || this.props.ownProfile) {
      return (
        <InfluencesField3
          influences={this.props.user.influences}
          user={this.props.user}
          submitInfluence={this.props.submitInfluence}
          deleteInfluence={this.props.deleteInfluence}
          ownProfile={this.props.ownProfile}
        />
      )
    } else {
      return (
        null
      )
    }
  }

  render() {
    console.log(this.props.user)
    return (
      <ProfileLeftContainer>

        {this.showSummary}

        {this.showInfluences}



      </ProfileLeftContainer>
    )
  }

}

export default ProfileLeft
