import React from 'react'
import {purple} from 'theme'

const Experience = ({style, fill, width, height, viewBox}) => {
  return (
    <svg
      style={style}
      width={width || '20px'} height={height || '22px'} viewBox={viewBox || "0 34 20 22"} version="1.1" xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Experience-Icon" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(0.000000, 34.000000)">
          <path d="M10,0 C4.5,0 0,4.76441785 0,10.5875952 C0,16.4107726 4.5,21.1751904 10,21.1751904 C15.5,21.1751904 20,16.4107726 20,10.5875952 C20,4.76441785 15.5,0 10,0 L10,0 Z M10,19.0576714 C5.6,19.0576714 2,15.2461371 2,10.5875952 C2,5.92905332 5.6,2.11751904 10,2.11751904 C14.4,2.11751904 18,5.92905332 18,10.5875952 C18,15.2461371 14.4,19.0576714 10,19.0576714 Z M10.5,5.29379761 L9,5.29379761 L9,11.6463547 L14.2,15.0343852 L15,13.6579978 L10.5,10.7993471 L10.5,5.29379761 Z" id="Shape" fill={purple || fill}></path>
      </g>
    </svg>
  )
}

export default Experience
