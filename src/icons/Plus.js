import React from 'react'
import {grey300} from 'theme'

const Plus = ({style, fill}) => {
  return (
    <svg
      style={style}
      width="11px" height="23px" viewBox="0 3 11 23" version="1.1" xmlns="http://www.w3.org/2000/svg"
    >
      <text id="+" stroke="none" fill="none" fontFamily="HelveticaNeue-Bold, Helvetica Neue" fontSize="18" fontWeight="bold">
          <tspan x="0" y="18.5" fill={fill || grey300}>+</tspan>
      </text>
    </svg>
  )
}

export default Plus
