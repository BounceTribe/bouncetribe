import {css} from 'styled-components'


export const size = {
  m: (...args) => css`
    @media (max-width: 800px) {
      ${ css(...args) }
    }
  `
}

export const purple = 'rgb(128,89,239)'
export const grey40 = 'rgb(40,40,40)'
export const grey70 = 'rgb(70,70,70)'
export const grey215 = 'rgb(215,215,215)'
export const grey230 = 'rgb(230,230,230)'
export const grey250 = 'rgb(250,250,250)'
export const white = 'rgb(255,255,255)'
