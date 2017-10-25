import styled from 'styled-components'
import {View} from 'styled'
import {grey200, grey400, grey800, white} from 'theme'

export const ProfileView = styled(View)`
  background-color: transparent;
  border: none;
  padding: 60px;
`

export const Divider = styled.hr`
  border: 1px solid ${grey200};
  background-color: ${grey200};
  height: 1px;
  width: 100%;
`
export const Top = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  background-color: ${white};
  border-radius: 10px;
  border: solid ${grey400} 1px;
  padding-top: 40px;
  box-shadow: 0 1px 2px 0 rgba(83,83,83,0.50);
`

export const TopCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 30px;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width:100%;
  padding: 10px 100px;
  box-sizing: border-box;
`

export const SubRow = styled.div`
  display: flex;
  flex-direction: row;
`

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  padding-right: 50px;
`

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 30%;
  padding-left: 20px;
`

export const Portrait = styled.img`
  height: 150px;
  width: 150px;
  border-radius: 150px;
  object-fit: cover;
  cursor: ${({ownProfile})=>(ownProfile) ? 'pointer' : '' };
`
const inputWidth = (props, multiplier) => {
  let {value, placeholder} = props
  let width = value.length * multiplier
  let placeholderWidth = placeholder.length * multiplier
  if (width < placeholderWidth) {
    return placeholderWidth
  } else {
    return width
  }
}

export const Input = styled.input`
  border: none;
  outline: none;
  font-weight: 200;
  margin-left: 10px;
  margin-bottom: 10px;
  width: ${(props)=>inputWidth(props,8)}px;
`

export const Handle = styled(Input)`
  font-size: 30px;
  width: ${(props)=>inputWidth(props,17)}px;
  margin-left: 0;
`

export const Location = styled(Input)`
  font-size: 15px;
  width: ${(props)=>inputWidth(props,8)}px;
`

export const InputRow = styled.div`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  justify-content: flex-start;
`

export const ExperienceRow = styled(InputRow)`
  margin-top: 5px;
  align-items: center;
`

export const ScoreRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  height: 20px;
  margin-top: 10px;
`

export const Score = styled.span`
  font-size: 20px;
  margin-right: 50px;
  margin-left: 10px;
`

export const Summary = styled.textarea`
  display: ${({value, ownProfile}) => (!value && !ownProfile) ? 'none' : 'flex'};
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;
  font-size: 14px;
  line-height: 20px;
  color: ${grey800};
  min-height: 100px;
  resize: none;
  padding-top: 50px;
`

export const BotRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`

export const BotLeft = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: ${white};
  min-height: 50vh;
  width: 66%;
  border: solid ${grey400} 1px;
  border-radius: 10px;
  margin-right: 15px;
  padding-bottom: 40px;
  box-shadow: 0 1px 2px 0 rgba(83,83,83,0.50);
`

export const BotRight = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: ${white};
  min-height: 50vh;
  width: 33%;
  border: solid ${grey400} 1px;
  border-radius: 10px;
  padding: 0 20px;
  margin-left: 15px;
  padding-bottom: 40px;
  box-shadow: 0 1px 2px 0 rgba(83,83,83,0.50);
`

export const Label = styled.label`
  display: ${({hide}) => (hide) ? 'none' : 'flex'};
  font-size: 15px;
  font-weight: bold;
  margin-top: 40px
  color: ${grey800};
`

export const InputError = styled.span`
  display: flex;
  color: red;
  font-size: 12px;
`

export const Experience = styled(Input)`
  font-size: 14px;
  width: ${(props)=>inputWidth(props,11)}px;
  margin-bottom: 0;
`
