import React from 'react'
import {purple, grey400, white} from 'theme'

const Notifications = ({style, fill, height, width, viewBox, notifications}) => {
  return (

  <svg
    style={{
      position: 'absolute',
      marginLeft: '-54px'
    }}
    width={width || 20} height={height || 20} viewBox={viewBox ||"104 0 20 20"} version="1.1" xmlns="http://www.w3.org/2000/svg" >
      <circle id="notification-circle" stroke="none" fill={(notifications > 0) ? purple : grey400} fillRule="evenodd" cx="114" cy="10" r="10"></circle>
      <text id="2" stroke="none" fill="none" fontFamily="HelveticaNeue-Bold, Helvetica Neue" fontSize="12" fontWeight="bold">
          <tspan x="111" y="14" fill={white}>{notifications || 0}</tspan>
      </text>
  </svg>
  )
}

export default Notifications
