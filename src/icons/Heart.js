import React from 'react'

const Heart = ({style, width, height, viewBox}) => {
  return (
    <svg
      style={style}
      width={width || 80} height={height || 80} viewBox={viewBox || "139 0 80 80"} version="1.1" xmlns="http://www.w3.org/2000/svg"
    >

      <g id="Like-Button" stroke="none" fill="none" transform="translate(139.000000, 0.000000)" fillRule="evenodd">
          <circle id="Oval" fill="#9075F3" cx="40" cy="40" r="40"></circle>
          <path d="M65.5,35.4736131 C65.5,28.2257801 59.5821429,22.3498936 52.2829365,22.3498936 C47.1325397,22.3498936 42.6801587,25.2817297 40.5003968,29.5508392 C38.3190476,25.2817297 33.8678571,22.3506816 28.7170635,22.3506816 C21.4174603,22.3502876 15.5,28.2257801 15.5,35.4736131 C15.5,49.183227 37.6742063,64.1966233 40.5003968,64.1966233 C43.3269841,64.1966233 65.5,49.2490268 65.5,35.4736131 Z" id="Heart" fill="#FFFFFF"></path>
      </g>
    </svg>
  )
}

export default Heart
