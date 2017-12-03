import React from 'react'
import styled from 'styled-components'
import {white, grey230, grey215, size, grey800, grey700, purple, blue, btTheme, bigTheme} from 'theme'
import {Link} from 'react-router'
import FacebookCircle from 'icons/FacebookCircle'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FlatButton from 'material-ui/FlatButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Tooltip from 'material-ui-next/Tooltip'
import Avatar from 'material-ui/Avatar'
import Online from 'icons/Online'
import {url} from 'config'
import {isOnline} from 'utils/isOnline'

export const PanelScrollContainer = styled.div`
  padding: 15px 0;
  display: flex;
`

const PurpleBox = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-color: ${purple};
  color: ${white};
  font-weight: 400;
`

const BtTag = (props) => {
  return <PurpleBox
    style={{
      height: `20px`,
      padding: `7px 15px`,
      margin: '5px 0 0 5px',
      borderRadius: '24px',
      fontSize: '14px',
      color: props.grayTag && 'black',
      backgroundColor: props.grayTag && '#D8D8D8',
    }}>{props.text}
  </PurpleBox>
}

export const BtTagList = (props) => {
  return (
    <div style={{padding: '5px 0'}}>
      {props.items.map(item =>
        <BtTag
          key={item.value.spotifyId || item.value}
          text={item.label}
          {...props}/>
        )}
    </div>
  )
}

// Purple box (or circle) with text -
//visible only if value (or alwaysVis) is truthy
export const BtTextMarker = (props) => {
  let {size, height, width, radius, fontHeight, value, alwaysVis} = props;
  return (
    <PurpleBox
      style={{
        height: `${height || size || radius * 2 || 20}px`,
        width: `${width || size || radius * 2 || 20}px`,
        borderRadius: `${radius || 6}px`,
        fontSize: `${fontHeight || 15}px`,
        visibility: `${(alwaysVis || value) ? 'visible' : 'hidden'}`
      }}>
      {value}
    </PurpleBox>
  )
}

export const BtAvatar = ({user, size, hideStatus, onClick, pointer, fbCircle}) => {
  // console.log('url', user.portrait.url);
  size = size || 50
  user = user || {}
  //set the ratio of size between the avatar and the online icon
  const iconSize = size * 18/60
  return  (
    <div
      style={{
        height: `${size}px`,
        cursor: pointer ? 'pointer' : 'auto'
      }}
      onClick={onClick} >
      <Avatar
        src={(user.portrait && !user.disabled) ? user.portrait.url : `${url}/logo.png`}
        style={{border: 0, objectFit: 'cover'}}
        to={`/${user.handle}`}
        size={size}
      />
      {fbCircle ? <FacebookCircle style={{ marginLeft: `-20px` }} />
        : <Online size={iconSize} online={isOnline(user)}
        style={{
          marginLeft: `-${iconSize}px`,
          display: `${hideStatus ? 'none' : 'inline'}`
        }}
      />}
    </div>
  )
}

export const BtLink = styled(Link)`
  display: flex;
  color: ${grey700};
  text-decoration: none;
  cursor:${props => props.to ? 'pointer' : 'auto'};
`

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 110vh;
  ${size.m`
    display: block;
    width: 100%;
  `}
`

export const View = styled.section`
  background-color: ${white};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 40px);
  padding: ${({contentWidth}) => (contentWidth) ? `0 ${(100-contentWidth)/2}%` : '0'};
  border: solid ${grey230} 1px;
  border-radius: 5px;
  min-height: 80vh;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(202, 202, 202, 0.5);
  margin: 70px 0 20px 0;
  ${size.m`
    margin-top: 0;
    width: 100%;
    border-radius: 0;
    border: 0;
  `}
`

export const ProjectNewView = styled(View)`
  min-height: 85vh;
`

export const IconTextContainer = styled(BtLink)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 30px;
`
export const IconText = styled.span`
  margin-left: 12px;
  color: ${grey800};
`

export const ButtonLink = styled(Link)`
  color: none;
  text-decoration: none;
`

export const DropContainer = styled.div`
  display: flex;
  min-width: 30%;
  max-width: 400px;
  height: 200px;
  border-radius: 5px;
  cursor: pointer;
`

export const ImageDropContainer = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
  max-width: 800px;
  max-height: 800px;
  border-radius: 5px;
  cursor: pointer;
  border: ${({image})=>(image) ? `none` : `2px dashed ${grey215}`};
`

export const CroppedImage = styled.img`
  max-height: 600px;
  max-width: 600px;
  margin: auto;
`

export const Button = (props) => {
  return (
    <ButtonLink to={props.to} >
      <RaisedButton
        {...props}
        labelStyle={{ textTransform: 'none', }}
      >
        {props.children}
      </RaisedButton>
    </ButtonLink>
  )
}

export const BtFlatButton = (props) => {
  return (
    <ButtonLink to={props.to} >
      <FlatButton
        {...props}
        labelStyle={{ textTransform: 'none', ...props.labelStyle }} >
        {props.children}
      </FlatButton>
    </ButtonLink>
  )
}

export const RoundButton = (props) => {
  return (
    <MuiThemeProvider muiTheme={ props.big ? bigTheme : btTheme } >
      <Tooltip
        title={props.tooltip}
        placement="bottom"
        disableTriggerFocus={!props.tooltip}
        disableTriggerHover={!props.tooltip}
        disableTriggerTouch={!props.tooltip}
      >
        <FloatingActionButton
          href={props.to}
          style={{ boxShadow: 0, ...props.style }}
          secondary={props.secondary}
          backgroundColor={props.backgroundColor}
          onClick={props.onClick}
          onTouchTap={props.onTouchTap}
        >
          {props.icon}
        </FloatingActionButton>
      </Tooltip>
    </MuiThemeProvider>
  )
}

export const BotNav = styled.div`
  display: none;
  position: fixed;
  width: 100%;
  height: 200px;
  top: 0;
  left: 0;
  z-index: 1000;
  ${size.m`
    display: flex;
  `}
`

export const Bubble = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({secondary}) => (secondary) ? blue : purple}
  height: 30px;
  width: 30px;
  border-radius: 30px;
`

export const MobileOnly = styled.div`
  display: none;
  ${size.m`
    display: block;
  `}
`
