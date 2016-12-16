import React, { Component } from 'react'
import cat from 'styling/burritocat.png'
import styled from 'styled-components'
import ProfileField from 'reusables/ProfileField'
import location from 'imgs/icons/location'

import Bolt from 'imgs/icons/bolt'
import Notes from 'imgs/icons/notes'
import Tribe from 'imgs/icons/tribe'
import {btMedium} from 'styling/T'


const ProfileDisplay = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  max-height: 150px;
`

const ProfileImage = styled.img`
  display: flex;
  height: 150px;
  border-radius: 50%;
`

const ProfileInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 20px;
`

// const UserName = styled.h2`
//   font-size: 1.5em;
//   font-weight: normal;
// `
//
// const UserLocation = styled.h4`
//   font-size: 1.2em;
//   font-weight: normal;
// `

const UserScores = styled.ul`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
`

const UserScore = styled.li`
  font-size: 1em;
`

class ProfileTop extends Component {

  render() {
    return (
      <ProfileDisplay

      >
        <ProfileImage
          src={cat}
          alt={'Profile'}
        />

        <ProfileInfoColumn>
          <ProfileField
            field={'name'}
            label={'Name'}
            text={this.props.user.name}
            submitField={this.props.submitField}
            fontSize={1.5}
          />
          <ProfileField
            field={'location'}
            label={'Location'}
            text={this.props.user.location}
            submitField={this.props.submitField}
            fontSize={.9}
            icon={location}
            fill={btMedium}
          />
          <UserScores>
            <UserScore>
              <Bolt
                height={'1em'}
                width={'1em'}
              />
              Score
            </UserScore>
            <UserScore>
              <Notes
                height={'1em'}
                width={'1em'}
              />
              Projects
            </UserScore>
            <UserScore>
              <Tribe
                height={'1em'}
                width={'1em'}
              />
              Tribe
            </UserScore>


          </UserScores>

        </ProfileInfoColumn>

      </ProfileDisplay>
    )
  }

}

export default ProfileTop
