import styled from 'styled-components'

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
`

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  width: 53%;
`

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  margin-top: 20px;
  width: 38%;
`

export const Sharing = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

export const Choice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
`
