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
import Spinner from 'reusables/Spinner'

const ProfileDisplay = styled.div`
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
`

const ProfileImage = styled.img`
  display: flex;
  height: 150px;
  border-radius: 50%;
`

const ProfileInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 20px;
  min-width: 500px;
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
  align-items: baseline;
`

const UserScore = styled.li`
  font-size: 1em;
  margin-right: 15px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: baseline;
`

const IconContainer = styled.div`
  display: flex;
  margin-right: 5px;
  height: 1em;
  width: 1em;
`


class ProfileTop extends Component {

  state = {
    locationMessage: '  add your location'
  }

  get showLocation () {
    let {
      user,
      submitField,
      ownProfile
    } = this.props
    if (user.placename) {
      return (
        <ProfileField
          field={'placename'}
          label={'location'}
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
          let placeResult = mapResult.results[0]['formatted_address']

          let placename = placeResult.split(',')[0].concat(placeResult.split(',')[1])
          console.log('placename', placename)
          this.setState({
            locationMessage: placename
          })
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
        <div
          onClick={()=>{
            navigator.geolocation.getCurrentPosition(success, error)
            this.setState({
              fetchingLocation: true
            })
          }}
          style={{
            marginLeft: '6px'
          }}
        >
          {(this.state.fetchingLocation) ? this.showSpinner() : this.state.locationMessage}
        </div>
      )
    } else {
      return (
        null
      )
    }
  }

  showSpinner() {
    return (
      <Spinner/>
    )
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
          src={user.profilePicUrl || user.profilePicThumb}
          alt={'Profile'}
        />

        <ProfileInfoColumn>
          <ProfileField
            field={'handle'}
            label={'handle'}
            text={user.handle}
            submitField={submitField}
            fontSize={1.5}
            validate={handleValidator}
            ownProfile={ownProfile}
          />

          {this.showLocation}

          <UserScores>
            <UserScore>
              <IconContainer>
                <Bolt/>
              </IconContainer>
              <span>0</span>
            </UserScore>
            <UserScore>
              <IconContainer>
                <Notes/>
              </IconContainer>
              <span>{user.projects.edges.length}</span>
            </UserScore>
            <UserScore>
              <IconContainer>
                <Tribe/>
              </IconContainer>
              <span>{user.friends.edges.length}</span>
            </UserScore>


          </UserScores>


        </ProfileInfoColumn>

      </ProfileDisplay>
    )
  }

}

export default ProfileTop
