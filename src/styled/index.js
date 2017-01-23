import React from 'react'
import styled from 'styled-components'
import {white, grey230, grey215} from 'theme'
import {Link} from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'


export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const View = styled.section`
  background-color: ${white};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin-top: 50px;
  border: solid ${grey230} .5px;
`
export const FeedView = styled(View)`
  width: 65%;
`

export const ProjectNewView = styled(View)`
  width: 800px;
  padding: 80px;
`

export const IconTextContainer = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: baseline;
`
export const IconText = styled.span`
  margin-left: 3px;
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
  border: 2px dashed ${grey215};
  cursor: pointer;
`

export const ImageDropContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 200px;
  max-width: 400px;
  min-height: 200px;
  max-height: 400px;
  border-radius: 10px;
  border: 2px dashed ${grey215};
  cursor: pointer;
`

export const CroppedImage = styled.img`
  max-width: 100%;
`

export const Button = (props) => {
  return (
    <ButtonLink
      to={props.to}
    >
      <RaisedButton
        {...props}
      >
        {props.children}
      </RaisedButton>

    </ButtonLink>
  )
}

export const RoundButton = (props) => {
  return (
    <ButtonLink
      to={props.to}
    >
      <FloatingActionButton
        {...props}
      >
        {props.icon}
      </FloatingActionButton>

    </ButtonLink>
  )
}
