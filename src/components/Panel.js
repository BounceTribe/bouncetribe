import React from 'react'
import styled from 'styled-components'
import {Tabs, Tab} from 'material-ui'
import {grey600, grey200, grey222, purple} from 'theme'
import Lock from 'icons/Lock'
import {BtTextMarker} from 'styled'


const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: white;
  border: solid ${grey222} 1px;
  border-radius: 5px;
  padding: 0 20px;
  padding: 0;
  width: 100%;
  box-shadow: 0 1px 2px 0 rgba(202, 202, 202, 0.5);
`

const TabLabel = ({text, locked, value}) => (
  <span>
    {text}
    {locked && <Lock style={{display: 'inline-flex'}} /> }
    {!locked && !!value && 
      <BtTextMarker size={20} fontHeight={14} value={value} radius={10}/>}
  </span>
)

export const Panel = ({topBar, content, tab, tabChange, labels, locks, values}) => {
  let buttonStyle = {fontSize: '15px', fontWeight: '500', color: `${grey600}`}
  return (
    <Container>
      {topBar}
      <Tabs
        style={{ margin: '6px 0 10px 1px' }}
        tabItemContainerStyle={{ borderBottom: `2px solid ${grey200}` }}
        inkBarStyle={{ backgroundColor: purple }}
        onChange={tabValue=>tabChange(tabValue)}
        value={tab} >
        {labels.map( (label, index) =>
          <Tab
            key={index}
            icon={( <TabLabel text={label + ' '} locked={locks[index]} value={values[index]} /> )}
            value={label}
            buttonStyle={buttonStyle}
            style={{ cursor: locks[index] ? 'not-allowed' : 'pointer' }}
            disabled={locks[index]} />
        )}
      </Tabs>
      {content}
    </Container>
  )
}
