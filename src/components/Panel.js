import React from 'react'
import styled from 'styled-components'
import {Tabs, Tab} from 'material-ui'
import {grey600, grey200, grey222, purple, white} from 'theme'
import Lock from 'icons/Lock'
import {BtTextMarker} from 'styled'


const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${white};
  border: solid ${grey222} 1px;
  border-radius: 5px;
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

const buttonStyle = {fontSize: '15px', fontWeight: '500', color: `${grey600}`}

export const Panel = ({topBar, content, tab, tabChange, labels, locks, values, empty}) => {
  return (
    <Container>
      {topBar}
      {!empty && <Tabs
        // style={{ margin: '0 0 10px 0', borderRadius: '5px' }}
        tabItemContainerStyle={{
          borderBottom: `2px solid ${grey200}`,
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px' }}
        inkBarStyle={{ backgroundColor: purple }}
        onChange={ tabValue => tabChange(tabValue) }
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
      </Tabs>}
      {content}
    </Container>
  )
}
