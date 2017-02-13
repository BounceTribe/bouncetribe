import styled from 'styled-components'
import React, {Component} from 'react'
import {Item2, Left, Right, Column} from 'styled/list'
import {BtLink, BtFlatButton} from 'styled'
import {purple, white, grey500, grey400} from 'theme'
import AddFriend from 'icons/AddFriend'

const SmallPicImg = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 40px;
  margin: 5px;
  object-fit: cover;
`

const MediumPicImg = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 100px;
  object-fit: cover;
`

const SearchUserContainer = styled(Item2)`
  align-items: center;
`

export const SmallPic = (props) => {
  return (
    <BtLink
      {...props}
    >
      <SmallPicImg
        {...props}
      />
    </BtLink>
  )
}


export const Handle = styled(BtLink)`
  font-weight: 400;
`

export class SearchUser extends Component {
  state = {
    invited: false,
  }

  render () {
    let {user, createFriendRequest} = this.props
    let {invited} = this.state
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
          <BtFlatButton
            label={(invited) ? 'Invited Sent' : 'Add to Tribe'}
            onClick={()=>{
              this.setState({
                invited: true,
              })
              createFriendRequest()
            }}
            backgroundColor={(invited) ? purple : white}
            labelStyle={{
              color: (invited) ? white : purple
            }}
            icon={
              <AddFriend
                fill={(invited) ? white : purple}
              />
            }
            style={{
              border: `1px solid ${grey400}`
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
        <RequestColumn>
          <BtFlatButton
            label={'Accept'}
            onClick={accept}
            backgroundColor={white}
            labelStyle={{
              color: purple
            }}
            icon={
              <AddFriend
                fill={purple}
              />
            }
            style={{
              border: `1px solid ${grey400}`
            }}
          />

          <Dismiss
            onClick={ignore}
          >
            Dismiss Request
          </Dismiss>
        </RequestColumn>

      </Right>
    </SearchUserContainer>
  )
}

export const Name = styled(BtLink)`
  font-weight: 600;
  &:hover {
    color: ${purple};
  }
`

export const FindH3 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 400;
  color: ${purple};
  box-sizing: border-box;
  width: 100%;
  padding: 60px 30px 40px 30px;
`

export const Projects = styled.div`
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
