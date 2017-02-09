import React from 'react'
import {purple} from 'theme'

const Bolt = ({style, fill, height}) => {
  return (
    <svg
      style={style}
      width="13px" height={height || 21} viewBox="0 0 13 21" version="1.1" xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Bolt" stroke="none" fill="none" transform="translate(0.000000, 2.000000)" fillRule="evenodd">
          <polyline id="bolt" fill={fill || purple} points="0 11.3904897 11.6157201 -1.55027506e-13 8.65157708 8.60145282 12.7826376 8.60145282 1.13983584 20 4.13169298 11.4351725"></polyline>
      </g>
    </svg>
  )
}

export default Bolt
