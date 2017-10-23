import React from 'react'

const Bounce = ({width, fill}) => {
  return (
  <svg width={`${width}px`} height={`${width*17/21}px`} viewBox="0 0 21 17" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Bounce-Icon" fillRule="nonzero" fill={fill}>
              <g transform="translate(0.500000, 0.000000)" id="Shape">
                  <path d="M0,11.25 C0,12.6307113 1.11928875,13.75 2.5,13.75 L8.4375,13.75 L5.3125,11.25 L2.5,11.25 L2.5,2.5 L15,2.5 L15,5 L17.5,7 L17.5,2.5 C17.5,1.11928875 16.3807112,0 15,0 L2.5,0 C1.11928875,0 0,1.11928875 0,2.5 L0,11.25 L0,11.25 Z M20,11.25 L13.75,6.25 L13.75,8.73963875 C9.58421625,8.889985 7.07632625,7.033855 4.9585725,4.97116125 C4.9585725,9.8740475 9.32554125,13.7357925 13.75,13.7790075 L13.75,16.25 L20,11.25 L20,11.25 Z"></path>
              </g>
          </g>
      </g>
  </svg>
  )
}

export default Bounce

// xmlns:xlink="http://www.w3.org/1999/xlink">
