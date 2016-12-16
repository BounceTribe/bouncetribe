import React, { Component } from 'react'
import styled from 'styled-components'
import ProfileField from 'reusables/ProfileField'
import InfluencesField from 'reusables/InfluencesField'

const ProfileLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  min-width: 66%;
`



class ProfileLeft extends Component {

  render() {
    return (
      <ProfileLeftContainer>

        <ProfileField
          field={'summary'}
          label={'Summary'}
          text={this.props.user.summary}
          submitField={this.props.submitField}
        />

        <InfluencesField
          influences={this.props.user.influences}
          user={this.props.user}
          submitInfluence={this.props.submitInfluence}
          deleteInfluence={this.props.deleteInfluence}
        />

      </ProfileLeftContainer>
    )
  }

}

export default ProfileLeft
