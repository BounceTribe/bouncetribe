import React from 'react'
import styled from 'styled-components'
import {white, grey230, grey215, size, grey800, grey700, purple, blue, btTheme, bigTheme} from 'theme'
import {Link} from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FlatButton from 'material-ui/FlatButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import IconButton from 'material-ui/IconButton'
import Avatar from 'material-ui/Avatar'
import Online from 'icons/Online'
import {url} from 'config'

const PurpleBox = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center
  font-weight: bold;
  background-color: ${purple};
  color: ${white};
  font-weight: 400;
`

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

export const BtAvatar = ({user, size, hideStatus}) => {
  size = size || 50
  user = user || {}
  const iconSize = size * 18/60
  return  (
    <div>
      <Avatar
        src={(user.portrait) ? user.portrait.url : `${url}/logo.png`}
        style={{border: 0, objectFit: 'cover'}}
        to={`/${user.handle}`}
        size={size}
      />
      <Online size={iconSize} online={user.isOnline}
        style={{
          marginLeft: `-${iconSize}px`,
          display: `${(!hideStatus && user.isOnline) ? 'inline' : 'none'}`
        }}
      />
    </div>
  )
}


export const BtLink = styled(Link)`
  display: flex;
  color: ${grey700};
  text-decoration: none;
  cursor: pointer;
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
  width: 80%;
  margin-top: 50px;
  border: solid ${grey230} .5px;
  border-radius: 10px;
  min-height: 80vh;
  margin-bottom: 50px;
  ${size.m`
    margin-top: 0;
    width: 100%;
    border-radius: 0;
    border: 0;
  `}
`
export const FeedView = styled(View)`
  width: 65%;
`

export const ProjectNewView = styled(View)`
  min-height: 85vh;
`

export const IconTextContainer = styled(BtLink)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: baseline;
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
  border-radius: 10px;
  cursor: pointer;
`

export const ImageDropContainer = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
  max-width: 800px;
  max-height: 800px;
  border-radius: 10px;
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
        labelStyle={{
          textTransform: 'none',
          ...props.labelStyle
        }}
      >
        {props.children}
      </FlatButton>
    </ButtonLink>
  )
}

export const RoundButton = (props) => {

  let tooltipLength = 0
  if (props.tooltip) {
    tooltipLength = props.tooltip.length
  }


  return (
    <ButtonLink
      to={props.to}
      title={props.title}
    >
      <IconButton
        tooltip={props.tooltip}
        style={{
          height: '60px',
          width: '60px',
          padding: '0px'
        }}
        tooltipStyles={{
          marginTop: "18px",
          left: "0",
          right: "0",
          fontSize: (tooltipLength > 10) ? "9px" : "10px",
          paddingLeft: (tooltipLength > 10) ? "2px" : "8px",
        }}
      >
      <MuiThemeProvider
        muiTheme={
          (props.big) ? bigTheme : btTheme
        }
      >
        <FloatingActionButton
          style={{
            boxShadow: 0,
            ...props.style
          }}
          secondary={props.secondary}
          backgroundColor={props.backgroundColor}
          onClick={props.onClick}
          onTouchTap={props.onTouchTap}
        >
          {props.icon}
        </FloatingActionButton>
      </MuiThemeProvider>
    </IconButton>
    </ButtonLink>
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
