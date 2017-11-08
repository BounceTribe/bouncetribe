import React from 'react'
import styled from 'styled-components'
import {purple, white} from 'theme'
import Tribe from 'icons/Tribe'
import {BtFlatButton} from 'styled'


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: '20px'
`

export const NoTribe = ({invite}) => {
  return (
    <Container>
      <Tribe height={93} fill={"#D3D3D3"} />
      <div style={{fontSize: '23px', fontWeight: '400', margin: '20px 0 0 0'}}>
        It's a little quiet here...
      </div>
      <div style={{
        fontSize: '15px',
        fontWeight: '300',
        color: '#999999',
        margin: '8px 0 22px 0'
      }}>
        Invite your friends to begin building your tribe
      </div>

      <BtFlatButton
        onClick={()=>invite()}
        label={'Invite Friends'}
        labelStyle={{ color: purple, fontSize: '13px', fontWeight: '500', }}
        backgroundColor={white}
        // to={`projects/${handle}/new`}
        // icon={<Plus/>}
        style={{
          border: `2px solid ${purple}`,
          borderRadius: '5px',
          width: '168px',
          height: '50px'
        }}
      />
    </Container>
  )
}
