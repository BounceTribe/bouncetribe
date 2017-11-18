import React from 'react'
import styled from 'styled-components'
import {purple, white} from 'theme'
import {BtFlatButton} from 'styled'


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: '20px'
`
//{icon, headline, note, btnLabel, onClick }

const Headline = styled.div`
  font-size: 23px;
  font-weight: 400;
  margin: 20px 0 0 0;
`

const Note = styled.div`
  font-size: 15px;
  font-weight: 300;
  color: #999999;
  margin: 8px 0 22px 0;
`

export const EmptyPanel = ({icon, headline, note, btnLabel, btnClick }) => {
  return (
    <Container>
      {icon}
      <Headline>{headline}</Headline>
      <Note>{note}</Note>
      <BtFlatButton
        onClick={()=>btnClick()}
        label={btnLabel}
        labelStyle={{ color: purple, fontSize: '13px', fontWeight: '500', }}
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
