import styled from 'styled-components'
import {grey500, grey600, white} from 'theme'

export const Background = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top:0;
  left: 0;
  background-image: linear-gradient(-180deg, #9075F3 0%, #5F48B4 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const Container = styled.div`
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${white};
  padding: 35px 75px;
`

export const Header = styled.img`
  display: flex;
  margin: 20px;
`

export const Lock = styled.div`
  display: flex;
  min-height: 380px;
  min-width: 200px;
`

export const Legal = styled.span`
  margin-top: 10px;
  font-size: 12px;
  color: ${grey500};
`

export const LegalLink = styled.a`
  color: ${grey600};
`

export const LogoImg = styled.img`
  height: 100px;
  width: 100px;
  object-fit: cover;
`
