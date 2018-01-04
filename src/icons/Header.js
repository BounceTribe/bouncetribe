import React from 'react'
import {white} from 'theme'

const Header = ({style, width, height, viewBox, fill}) => {
  return (
    <svg
      style={style}
      width={width || '150px'} height={height || '19px'} viewBox={viewBox || "0 0 150 19"} version="1.1" xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" fontWeight="normal" fontFamily=".SFNSDisplay, .SF NS Display" letterSpacing="-0.899999976" fontSize="24">
          <g id="Web-Top-Nav" transform="translate(-136.000000, -16.000000)" fill={white || fill}>
              <g id="Top-Nav">
                  <text id="BOUNCETRIBE">
                      <tspan x="135" y="33.5">BOUNCETRIB</tspan>
                      <tspan x="273.785156" y="33.5">E</tspan>

                  </text>
              </g>
          </g>
      </g>
    </svg>
  )
}

export default Header
