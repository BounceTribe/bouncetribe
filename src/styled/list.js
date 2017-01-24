import styled from 'styled-components'
import {grey230, grey40} from 'theme'
import {Link} from 'react-router'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
const xPadding = 30

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: solid ${grey230} .5px;
  padding: 5px ${xPadding}px;
  width: 100%;
  box-sizing: border-box;
`

export const HeaderOptions = styled.span`
  display: flex;
`

export const List = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 40px ${xPadding}px;
  width: 100%;
  box-sizing: border-box;
`

export const Item = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: solid ${grey230} .5px;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 15px;
`

export const Item2 = styled(Item)`
  width: 48%;
`

export const Item3 = styled(Item)`
  width: 31%;
`
export const Title = styled(Link)`
  text-decoration: none;
  color: ${grey40};
  cursor: pointer;
  font-size: 25px;
  font-weight: 200;
`
