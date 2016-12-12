import React, { Component } from 'react'
import cat from 'styling/burritocat.png'
import styled from 'styled-components'
import BTButton from 'reusables/BTButton'

const TribeListItemDisplay = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  max-height: 100px;
  margin: 10px 0px;
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

class TribeListItem extends Component {

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

        <BTButton
          text={'Invite'}
          onClick={()=>{
            let fields = {
              otherId: this.props.user.id
            }
            this.props.makeTribeRequest(fields)
          }}
        />

      </TribeListItemDisplay>
    )
  }

}

export default TribeListItem
