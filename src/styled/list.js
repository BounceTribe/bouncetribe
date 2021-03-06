import styled from 'styled-components'
import {grey230, grey40, size} from 'theme'
import {Link} from 'react-router'

const xPadding = 30

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: solid ${grey230} 1px;
  padding: 20px ${xPadding}px;
  width: 100%;
  box-sizing: border-box;
  ${size.m`
    display: none;
  `}
`

export const HeaderOptions = styled.span`
  display: flex;
  align-items: center;
  align-self: center;

`

export const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 40px ${xPadding}px;
  width: 100%;
  box-sizing: border-box;
  ${size.m`
    padding: 0;
  `}
`

export const NList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 40px;
`

export const Item = styled.div`
  display: flex;
  justify-content: space-between;
  border: solid ${grey230} 1px;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 15px;
`
export const Item2 = styled(Item)`
  width: 49%;
  height: 164px;
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
export const Left = styled.div`
  display: flex;
  margin-left: 20px;
`
export const Right = styled.div`
  display: flex;
  margin-right: 25px;
`
export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
`
