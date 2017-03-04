import React from 'react'
import {white} from 'theme'

const Comment = ({style, width, height, viewBox, fill}) => {
  return (
    <svg
      style={style}
      width={width || 50} height={height || 42} viewBox={viewBox || "16 18 50 43"} version="1.1" xmlns="http://www.w3.org/2000/svg"
    >

      <path d="M65.1740042,37.8743131 C65.1740042,26.9016539 54.1713208,18 40.5870021,18 C27.0067813,18 16,26.9016539 16,37.8743131 C16,43.6001537 19.0098588,48.7430144 23.8063732,52.3652354 C22.9048498,54.682886 21.3763578,57.7078584 18.7906247,60.8062129 C23.6998295,60.8062129 30.0248358,60.1661581 34.8951111,57.1839919 C36.7288917,57.5427487 38.6261887,57.7445495 40.5870021,57.7445495 C54.1672229,57.7445495 65.1740042,48.8469724 65.1740042,37.8743131 Z" id="Comment-Bubble" stroke="none" fill={fill || white} fillRule="evenodd"></path>
    </svg>
  )
}

export default Comment
