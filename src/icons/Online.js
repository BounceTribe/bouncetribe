import React from 'react'
const Online = ({size, style, online}) => {
  const fill = online ? "#21D38B" : "#999999"
  return (
    <svg
      style={style}
      width={`${size}`} height={`${size}`} xmlns="http://www.w3.org/2000/svg" >
      <g>
        <circle id="svg_3" r={`${size*8/18}`} cy={`${size*9/18}`} cx={`${size*9/18}`} strokeWidth="2" stroke="#FFFFFF" fill="#FFFFFF"/>
        <circle id="svg_4" r={`${size*6/18}`} cy={`${size*9/18}`} cx={`${size*9/18}`} strokeWidth="2" stroke={fill} fill={fill} />
      </g>
    </svg>
  )
}

export default Online
