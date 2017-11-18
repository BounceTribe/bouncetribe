import React from 'react'
import styled from 'styled-components'
import {purple} from 'theme'
import {BtFlatButton} from 'styled'
import Tribe from 'icons/Tribe'
import Music from 'icons/Music'
import Bounce from 'icons/Bounce'



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

export const EmptyTribe = ({btnClick}) => (
  <EmptyPanel
    icon={<Tribe height={93} fill={"#D3D3D3"} />}
    headline={`It's a little quiet here...`}
    note={`Invite your friends to begin building your tribe`}
    btnLabel={`Invite Friends`}
    btnClick={()=>btnClick()}
  />
)
export const EmptyOwnProjects = ({btnClick}) => (
  <EmptyPanel
    icon={<Music height={93} fill={"#D3D3D3"} />}
    headline={`Everyone wants to hear it`}
    note={`Upload your first project!`}
    btnLabel={`Invite Friends`}
    btnClick={()=>btnClick()}
  />
)
export const EmptyOwnBounces = () => (
  <EmptyPanel
    icon={<Bounce height={93} fill={"#D3D3D3"} />}
    headline={`Do you love someone’s project?`}
    note={`Bounce it to share with your tribe`}
  />
)
