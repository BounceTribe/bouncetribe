import React from 'react'

const AddFriend = ({style, fill}) => {
  return (
    <svg
      style={style}
      width="23px" height="16px" viewBox="10 11 23 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Add-Icon" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(11.000000, 11.000000)">
          <circle id="Oval" fill={fill} cx="14" cy="4" r="4"></circle>
          <path d="M14,10 C7.9,10 6,14 6,14 L6,16 L22,16 L22,14 C22,14 20.1,10 14,10 Z" id="Shape" fill={fill}></path>
          <path d="M4,3 L4,11" id="Shape" stroke={fill} strokeWidth="2"></path>
          <path d="M8,7 L0,7" id="Shape" stroke={fill} strokeWidth="2"></path>
      </g>
    </svg>
  )
}

export default AddFriend
