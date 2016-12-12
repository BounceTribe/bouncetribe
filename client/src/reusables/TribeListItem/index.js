import React, { Component } from 'react'
import cat from 'styling/burritocat.png'
import styled from 'styled-components'
import BTButton from 'reusables/BTButton'
import {subtleBorder} from 'styling/T'

const TribeListItemDisplay = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  max-height: 100px;
  margin: 10px auto;
  padding: 10px;
  width: 45%;
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

const TribeButtonColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
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
            onClick={()=>{
              let fields = {
                otherId: this.props.user.id
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
          />

        </TribeButtonColumn>
      )
    }
  }

  render() {
    return (
      <TribeListItemDisplay

      >
        <TribeListItemImage
          src={cat}
          alt={'TribeListItem'}
        />

        <TribeListItemInfoColumn>
          <UserName>{this.props.user.name}</UserName>
          <UserLocation>Location</UserLocation>
          <UserScores>
            <UserScore>Rank</UserScore>
            <UserScore>Projects</UserScore>
            <UserScore>Tribe</UserScore>


          </UserScores>

        </TribeListItemInfoColumn>


          {this.showButtons}


      </TribeListItemDisplay>
    )
  }

}

export default TribeListItem
