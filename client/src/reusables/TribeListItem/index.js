import React, { Component } from 'react'
import styled from 'styled-components'
import BTButton from 'reusables/BTButton'
import {subtleBorder} from 'styling/T'
import {Link} from 'react-router'

const TribeListItemDisplay = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-content: flex-start;
  justify-content: space-between;
  align-items: center;
  max-height: 100px;
  margin: 10px 1%;
  padding: 10px;
  max-width: 45.6%;
  min-width: 40%;
  ${subtleBorder}
`

const TribeListItemImage = styled.img`
  display: flex;
  height: 100px;
  border-radius: 50%;
`

const TribeListItemInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 10px;
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
`

const UserLocation = styled.h4`
  font-size: 1em;
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
  font-size: .8em;
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
            danger
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
      handle
    } = this.props.user
    return (
      <TribeListItemDisplay

      >
        <TribeListItemRow>
          <TribeListItemImage
            src={this.props.profilePicUrl}
            alt={'TribeListItem'}
          />

          <TribeListItemInfoColumn>
            <UserName>
              <Link
                to={`/${handle}`}
              >
                {handle}
              </Link>
            </UserName>
            <UserLocation>Location</UserLocation>
            <UserScores>
              <UserScore>Rank</UserScore>
              <UserScore>Projects</UserScore>
              <UserScore>Tribe</UserScore>


            </UserScores>

          </TribeListItemInfoColumn>
        </TribeListItemRow>

        {this.showButtons}

      </TribeListItemDisplay>
    )
  }

}

export default TribeListItem
