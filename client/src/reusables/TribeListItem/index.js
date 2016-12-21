import React, { Component } from 'react'
import styled from 'styled-components'
import BTButton from 'reusables/BTButton'
import {Link} from 'react-router'
import {btMedium, btLight, btPurple} from 'styling/T'
import Bolt from 'imgs/icons/bolt'
import Notes from 'imgs/icons/notes'
import Tribe from 'imgs/icons/tribe'
import Location from 'imgs/icons/location'


const TribeListItemDisplay = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-content: flex-start;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  margin: 10px 1%;
  padding: 10px;
  max-width: 45.6%;
  min-width: 40%;
  border: solid ${btLight} .5px;
`

const TribeListItemImage = styled.img`
  display: flex;
  height: 100px;
  border-radius: 50%;
`

const TribeListItemInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-between;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 10px;
  height: 100px;
`

const TribeColumnTop = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: auto;
`

const TribeListItemRow = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: flex-start;
`

const UserName = styled.h2`
  font-size: 1.2em;
  font-weight: normal;
  color: ${btPurple}
`

const UserLocation = styled.div`
  font-size: .9em;
  font-weight: normal;
  color: ${btMedium};
  display: flex;
  flex-direction: row;
  align-items: baseline;
`

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
`

const IconContainer = styled.div`
  display: flex;
  margin-right: 5px;
  height: 1em;
  width: 1em;
`

const TribeButtonColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  min-width: 100px;
`

class TribeListItem extends Component {

  get showButtons () {

    if (this.props.myTribe) {
      return null
    } else if (this.props.pending) {
      return (
        <TribeButtonColumn>

          <BTButton
            text={'Accept'}
            teal
            flex
            onClick={()=>{
              let fields = {
                id: this.props.id,
                accepted: true,
                ignored: false,
                newFriendId: this.props.user.id
              }
              this.props.makeTribeRequest(fields)
            }}
          />
          <BTButton
            text={'Ignore'}
            grey
            flex
            onClick={()=>{
              let fields = {
                id: this.props.id,
                accepted: false,
                ignored: true,
                newFriendId:this.props.user.id
              }
              this.props.makeTribeRequest(fields)
            }}
          />

        </TribeButtonColumn>
      )
    } else {
      return (
        <TribeButtonColumn>

          <BTButton
            text={'Invite'}
            onClick={()=>{
              let fields = {
                otherId: this.props.user.id
              }
              this.props.makeTribeRequest(fields)
            }}
            flex
          />

        </TribeButtonColumn>
      )
    }
  }

  render() {
    let {
      handle,
      profilePicUrl,
      profilePicThumb,
      placename
    } = this.props.user
    return (
      <TribeListItemDisplay

      >
        <TribeListItemRow>
          <TribeListItemImage
            src={profilePicThumb || profilePicUrl}
            alt={'TribeListItem'}
          />

          <TribeListItemInfoColumn>
            <TribeColumnTop>
              <UserName>
                <Link
                  to={`/${handle}`}
                >
                  {handle}
                </Link>
              </UserName>
              <UserLocation>
                {(placename) ? (
                  <IconContainer>
                    <Location/>
                  </IconContainer>
                ) : null}

                {placename}
              </UserLocation>
            </TribeColumnTop>
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
                <span>0</span>
              </UserScore>
              <UserScore>
                <IconContainer>
                  <Tribe/>
                </IconContainer>
                <span>{this.props.user.friends.edges.length}</span>
              </UserScore>
            </UserScores>

          </TribeListItemInfoColumn>
        </TribeListItemRow>

        {this.showButtons}

      </TribeListItemDisplay>
    )
  }

}

export default TribeListItem
