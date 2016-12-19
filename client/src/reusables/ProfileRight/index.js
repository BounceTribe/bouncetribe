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
  min-width: 200px;
`



class ProfileRight extends Component {

  render() {
    return (
      <ProfileRightContainer>

        <ProfileField
          field={'experience'}
          label={'Experience'}
          text={this.props.user.experience}
          submitField={this.props.submitField}
          fontSize={1.3}
          icon={Clock}
          ownProfile={this.props.ownProfile}
        />

        <br/>

        <ProfileField
          field={'email'}
          label={'Email'}
          text={this.props.user.email}
          submitField={this.props.submitField}
          fontSize={1.1}
          icon={Email}
          ownProfile={this.props.ownProfile}
        />

        <ProfileField
          field={'website'}
          label={'Website'}
          text={this.props.user.website}
          submitField={this.props.submitField}
          fontSize={1.1}
          icon={Link}
          ownProfile={this.props.ownProfile}
        />

      </ProfileRightContainer>
    )
  }

}

export default ProfileRight
