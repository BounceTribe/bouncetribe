import React from 'react'
import {white} from 'theme'

const Heart = ({style, width, height, viewBox, fill}) => {
  return (
    <svg
      style={style}
      width={width || 51} height={height || 43} viewBox={viewBox || "15 22 51 43"} version="1.1" xmlns="http://www.w3.org/2000/svg"
    >

      <path d="M65.5,35.4736131 C65.5,28.2257801 59.5821429,22.3498936 52.2829365,22.3498936 C47.1325397,22.3498936 42.6801587,25.2817297 40.5003968,29.5508392 C38.3190476,25.2817297 33.8678571,22.3506816 28.7170635,22.3506816 C21.4174603,22.3502876 15.5,28.2257801 15.5,35.4736131 C15.5,49.183227 37.6742063,64.1966233 40.5003968,64.1966233 C43.3269841,64.1966233 65.5,49.2490268 65.5,35.4736131 Z" id="Heart" stroke="none" fill={fill ||white} fillRule="evenodd"></path>
    </svg>
  )
}

export default Heart
