import React, { Component } from 'react'
import styled from 'styled-components'
import ProfileField from 'reusables/ProfileField'
import Clock from 'imgs/icons/clock'
import Email from 'imgs/icons/email'
import Link from 'imgs/icons/link'

const ProfileRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: center;
  max-height: 150px;
  min-width: 33%;
  margin-top: 60px;
`



class ProfileRight extends Component {

  get showEmail () {
    if (this.props.ownProfile) {
      return (
        <ProfileField
          field={'email'}
          label={'email'}
          text={this.props.user.email}
          submitField={this.props.submitField}
          fontSize={.9}
          icon={Email}
          ownProfile={this.props.ownProfile}
        />
      )
    } else {
      return (
        null
      )
    }
  }

  get showExperience () {
    if (this.props.user.experience || this.props.ownProfile) {
      return (
        <ProfileField
          field={'experience'}
          label={'experience'}
          text={this.props.user.experience}
          submitField={this.props.submitField}
          fontSize={.9}
          icon={Clock}
          ownProfile={this.props.ownProfile}
          options={['PROFESSIONAL', 'NOVICE']}
        />
      )
    } else {
      return (
        null
      )
    }
  }

  get showWebsite () {
    if (this.props.user.website  || this.props.ownProfile) {
      return (
        <ProfileField
          field={'website'}
          label={'website'}
          text={this.props.user.website}
          submitField={this.props.submitField}
          fontSize={.9}
          icon={Link}
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
    return (
      <ProfileRightContainer>

        {this.showExperience}

        {this.showEmail}

        {this.showWebsite}

      </ProfileRightContainer>
    )
  }

}

export default ProfileRight
