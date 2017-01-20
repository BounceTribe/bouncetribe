import styled from 'styled-components'
import {Link} from 'react-router'
import {white, grey40, grey70} from 'theme'

export const Bar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10%;
  height: 50px;
  background-color: ${grey40};
  box-sizing: border-box;
`

export const Logo = styled.span`
  display: flex;
  color: ${white};
`

export const NavList = styled.div`
  display: flex;
  align-items: center;
`

export const NavLink = styled(Link)`
  text-decoration: none;
  color: ${white};
  padding: 0 15px;
  border-right: 1px solid ${grey70};
  cursor: pointer;
`
