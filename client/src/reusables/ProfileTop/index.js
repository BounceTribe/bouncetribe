import React, { Component } from 'react'
import cat from 'styling/burritocat.png'
import styled from 'styled-components'

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

const UserName = styled.h2`
  font-size: 1.5em;
  font-weight: normal;
`

const UserLocation = styled.h4`
  font-size: 1.2em;
  font-weight: normal;
`

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
          <UserName>{this.props.user.name}</UserName>
          <UserLocation>Location</UserLocation>
          <UserScores>
            <UserScore>Rank</UserScore>
            <UserScore>Projects</UserScore>
            <UserScore>Tribe</UserScore>


          </UserScores>

        </ProfileInfoColumn>

      </ProfileDisplay>
    )
  }

}

export default ProfileTop
