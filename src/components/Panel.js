import React from 'react'
import styled from 'styled-components'
import {Tabs, Tab} from 'material-ui'
import {grey600, grey200, grey222, purple} from 'theme'
import Lock from 'icons/Lock'


const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: white;
  min-height: 50vh;
  border: solid ${grey222} 1px;
  border-radius: 10px;
  padding: 0 20px;
  ${'' /* margin-left: 15px; */}
  padding: 0;
  width: 100%;
`

const TabLabel = ({text, locked}) => (
  <span>
    {text}
    {locked && <Lock style={{display: 'inline-flex'}} /> }
  </span>
)

export const Panel = ({topBar, content, tab, tabChange, labels, locks}) => {
  let buttonStyle = {fontSize: '15px', fontWeight: '500', color: `${grey600}`}
  console.log('panel content', content);
  console.log('panel tab', tab);
  return (
    <Container>
      {topBar}
      <Tabs
        style={{ margin: '6px 0 25px 1px' }}
        tabItemContainerStyle={{ borderBottom: `2px solid ${grey200}` }}
        inkBarStyle={{ backgroundColor: purple }}
        onChange={tabValue=>tabChange(tabValue)}
        value={tab} >
        <Tab
          icon={( <TabLabel text={labels[0] + ' '} locked={locks[0]} /> )}
          value={labels[0]}
          buttonStyle={buttonStyle}
          style={{ cursor: locks[0] ? 'not-allowed' : 'pointer' }}
          disabled={locks[0]} />
        <Tab
          icon={( <TabLabel text={labels[1] + ' '} locked={locks[1]} /> )}
          value={labels[1]}
          buttonStyle={buttonStyle}
          style={{ cursor: locks[1] ? 'not-allowed' : 'pointer' }}
          disabled={locks[1]} />
        <Tab
          icon={( <TabLabel text={labels[2] + ' '} locked={locks[2]} /> )}
          value={labels[2]}
          buttonStyle={buttonStyle}
          style={{ cursor: locks[2] ? 'not-allowed' : 'pointer' }}
          disabled={locks[2]} />
      </Tabs>
      {content}
    </Container>
  )
}
