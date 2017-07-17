import {css} from 'styled-components'

export const size = {
  m: (...args) => css`
    @media (max-width: 800px) {
      ${ css(...args) }
    }
  `
}
