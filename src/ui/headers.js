import styled from 'styled-components'
import fonts from './fonts'
import {
  grey100,
  grey200,
  grey300,
  grey400,
  grey500,
  grey600,
  grey700,
  grey800,
  grey900,
} from './colors'

export const headerDefaults = `
  ${fonts}
  margin: 0;
  padding: 0;
  font-weight: ${({weight}) => (weight) ? weight : 400};
  color: ${({color}) => (color) ? color : ''}
`

export const H1 = styled.h1`
  color: ${grey800};
  ${headerDefaults}
  font-size: 32px;
`

export const H2 = styled.h2`
  color: ${grey700};
  ${headerDefaults}
  font-size: 28px;
`

export const H3 = styled.h3`
  color: ${grey700};
  ${headerDefaults}
  font-size: 24px;
`

export const H4 = styled.h4`
  color: ${grey600};
  ${headerDefaults}
  font-size: 20px;
`

export const H5 = styled.h5`
  color: ${grey500};
  ${headerDefaults}
  font-size: 16px;
`

export const H6 = styled.h6`
  color: ${grey500};
  ${headerDefaults}
  font-size: 12px;
`

export const H7 = styled.h7`
  color: ${grey500};
  ${headerDefaults}
  font-size: 8px;
`
