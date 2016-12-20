import React, { Component } from 'react'
import styled from 'styled-components'
import ProfileField from 'reusables/ProfileField'
import location from 'imgs/icons/location'
import {handleValidator} from 'utils/validators'
import {placenameOptions} from 'apis/google'

import Bolt from 'imgs/icons/bolt'
import Notes from 'imgs/icons/notes'
import Tribe from 'imgs/icons/tribe'
import {btMedium} from 'styling/T'
import BTButton from 'reusables/BTButton'

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


  get showLocation () {
    let {
      user,
      submitField,
      ownProfile
    } = this.props
    if (user.longitude && user.latitude) {
      return (
        <ProfileField
          field={'placename'}
          label={'Location'}
          text={user.placename}
          submitField={submitField}
          fontSize={.9}
          icon={location}
          fill={btMedium}
          ownProfile={ownProfile}
        />
      )
    } else if (("geolocation" in navigator) && !user.placename && ownProfile) {
      const success = async (position) => {
        let longitude = position.coords.longitude
        let latitude = position.coords.latitude
        try {
          let options = placenameOptions(latitude, longitude)
          const mapResult = await fetch(...options).then(resp=>resp.json()).then(json=>json)
          console.log('mapResult', mapResult)
          let placename = mapResult.results[0]['formatted_address']
          console.log('placename', placename)
          let submission = {
            longitude,
            latitude,
            placename
          }
          submitField(submission)
        } catch (error) {
          console.log('map error', error)
        }
      }
      const error = () => {
        console.log('error')
      }
      return (
        <BTButton
          text={'Share your location'}
          onClick={()=>{
            navigator.geolocation.getCurrentPosition(success, error)
          }}
        />
      )
    } else {
      return (
        <ProfileField
          field={'placename'}
          label={'Location'}
          text={user.placename}
          submitField={submitField}
          fontSize={.9}
          icon={location}
          fill={btMedium}
          ownProfile={ownProfile}
        />
      )
    }
  }


  render() {
    let {
      user,
      submitField,
      ownProfile
    } = this.props
    return (
      <ProfileDisplay

      >
        <ProfileImage
          src={user.profilePicUrl}
          alt={'Profile'}
        />

        <ProfileInfoColumn>
          <ProfileField
            field={'handle'}
            label={'Handle'}
            text={user.handle}
            submitField={submitField}
            fontSize={1.5}
            validate={handleValidator}
            ownProfile={ownProfile}
          />
          <ProfileField
            field={'name'}
            label={'Name'}
            text={user.name}
            submitField={submitField}
            fontSize={1.2}
            ownProfile={ownProfile}
          />

          {this.showLocation}

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
