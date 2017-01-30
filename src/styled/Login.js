import styled from 'styled-components'

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
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 35px 75px;
`

export const Header = styled.div`
  display: flex;
  font-family: 'Montserrat-Bold', 'Helvetica Neue', sans-serif;
  font-size: 48px;
  color: #333333;
  letter-spacing: -1.61px;
  text-transform: uppercase;
`

export const Lock = styled.div`
  display: flex;
`
