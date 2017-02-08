import styled from 'styled-components'
import React from 'react'
import {Item2, Left, Right, Column} from 'styled/list'
import {BtLink, Button} from 'styled'

const SmallPicImg = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 40px;
  margin: 5px;
`

const MediumPicImg = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 100px;
`

const SearchUserContainer = styled(Item2)`
  align-items: center;
`

export const SmallPic = (props) => {
  return (
    <SmallPicImg
      {...props}
    />
  )
}


export const Handle = styled(BtLink)`
  font-weight: 400;
`

export const SearchUser = ({user}) => {
  return (
    <SearchUserContainer>
      <Left>
        <MediumPicImg
          src={(user.portrait) ? user.portrait.url : '/logo.png'}
        />
        <Column>
          <Handle
            to={`/${user.handle}`}
          >
            {user.handle}
          </Handle>
        </Column>
      </Left>

      <Right>
        <Button
          label={'Add to Tribe'}
        />
      </Right>
    </SearchUserContainer>
  )
}

export const RequestUser = ({user}) => {
  return (
    <SearchUserContainer>
      <Left>
        <MediumPicImg
          src={(user.portrait) ? user.portrait.url : '/logo.png'}
        />
        <Column>
          <Handle
            to={`/${user.handle}`}
          >
            {user.handle}
          </Handle>
        </Column>
      </Left>

      <Right>
        <Button
          label={'Add to Tribe'}
        />
      </Right>
    </SearchUserContainer>
  )
}
