import styled from 'styled-components'
import React, {Component} from 'react'
import {Item2, Left, Right, Column} from 'styled/list'
import {BtLink, BtFlatButton, Button} from 'styled'
import {purple, white, grey500, grey400, grey700} from 'theme'
import AddFriend from 'icons/AddFriend'
import Bolt from 'icons/Bolt'

const MediumPicImg = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 100px;
  object-fit: cover;
`

const SearchUserContainer = styled(Item2)`
  align-items: center;
`

export const Handle = styled(BtLink)`
  font-weight: 400;
`

export const Location = styled.span`
  font-size: 14px;
  margin: 10px 0;
  color: ${grey700};
`


export const Pair = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const Value = styled.span`
  display: flex;
  margin-left: 5px;
  font-weight: 400;
`

const Score = ({score}) => (
  <Pair>
    <Bolt/>
    <Value>
      {score}
    </Value>
  </Pair>
)

export class SearchUser extends Component {
  state = { invited: false, }

  render () {
    let {user, createFriendRequest} = this.props
    let {invited} = this.state
    return (
      <SearchUserContainer>
        <Left>
          <MediumPicImg src={user.portrait ? user.portrait.url : '/logo.png'} />
          <Column>
            <Handle to={`/${user.handle}`} >
              {user.handle}
            </Handle>
            <Location>
              {user.placename}
            </Location>
            <Score score={user.score} />
          </Column>
        </Left>

        <Right>
          <BtFlatButton
            label={(invited) ? 'Request Sent' : 'Add to Tribe'}
            onClick={()=>{
              this.setState({ invited: true, })
              createFriendRequest()
            }}
            backgroundColor={(invited) ? purple : white}
            labelStyle={{ color: (invited) ? white : purple }}
            icon={ <AddFriend fill={(invited) ? white : purple} /> }
            style={{
              border: `1px solid ${grey400}`,
              borderRadius: '5px',
            }}
            disabled={invited}
          />
        </Right>
      </SearchUserContainer>
    )
  }
}

const Dismiss = styled(BtLink)`
  color: ${grey500};
  font-size: 12px;
  margin-top: 15px;
`

const RequestColumn = styled(Column)`
  align-items: center;
`

export const RequestUser = ({user, accept, ignore}) => {
  return (
    <SearchUserContainer>
      <Left>
        <MediumPicImg src={user.portrait ? user.portrait.url : '/logo.png'} />
        <Column>
          <Handle to={`/${user.handle}`} >
            {user.handle}
          </Handle>
          <Location>
            {user.placename}
          </Location>
          <Score score={user.score} />
        </Column>
      </Left>

      <Right>
        <RequestColumn>
          <BtFlatButton
            label={'Accept'}
            onClick={accept}
            backgroundColor={white}
            labelStyle={{ color: purple }}
            icon={ <AddFriend fill={purple} /> }
            style={{ border: `1px solid ${grey400}` }}
          />
          <Dismiss onClick={ignore} >
            Dismiss Request
          </Dismiss>
        </RequestColumn>
      </Right>
    </SearchUserContainer>
  )
}

export const Name = styled(BtLink)`
  display: inline-flex;
  font-weight: 600;
  font-size: 14px;
  color: ${grey700};
  &:hover {
    color: ${purple};
  }
`

export const TableScore = styled.span`
  display: inline-flex;
  font-weight: 600;
  font-size: 18px;
  color: ${grey700};
`

export const FindH3 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 400;
  color: ${purple};
  box-sizing: border-box;
  width: 100%;
  padding: 60px 30px 10px 30px;
  font-size: 20px;
`

export const Projects = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${purple};
  border-radius: 5px;
  color: ${white};
  padding: 10px;
  width: 40px;
  font-weight: 400;
`

export const GenreChip = styled.span`
  background-color: ${grey500};
  color: ${white};
  border-radius: 15px;
  padding: 3px 10px;
`

const NoTribeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const NoTribeMessage = styled.span`
  display: flex;
  font-size: 36px;
  margin: 100px 0 20px 0;
  color: ${grey400};
`

export const NoTribe = ({handle, user}) => {
  return (
    <NoTribeContainer>
      <NoTribeMessage>Add Members to Your Tribe</NoTribeMessage>
      <Button
        to={{
          pathname: `/${handle}/tribe/find/`,
          query: {
            ownId: user.id
          },
        }}
        icon={ <AddFriend fill={white} /> }
        label={'Add Members'}
        primary
      />
    </NoTribeContainer>
  )
}
