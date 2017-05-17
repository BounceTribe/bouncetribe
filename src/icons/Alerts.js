import React from 'react'
import {purple, transparent, white} from 'theme'

const Notifications = ({style, fill, height, width, viewBox, alerts}) => {
  return (

  <svg
    style={style}
    width={width || 30} height={height || 30} viewBox={viewBox ||"1062 17 26 17"} version="1.1" xmlns="http://www.w3.org/2000/svg" >
    <g id="Notification" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(1063.000000, 17.000000)">
        <g id="Notifications" fill={fill || white}>
            <path d="M8.21184211,13.8181818 L5.77105263,13.8181818 C5.28289474,13.8181818 4.86447368,14.4 5.14342105,14.9090909 C5.56184211,15.5636364 6.25921053,16 7.02631579,16 C7.79342105,16 8.49078947,15.5636364 8.83947368,14.9090909 C9.11842105,14.4 8.76973684,13.8181818 8.21184211,13.8181818 Z" id="Shape"></path>
            <path d="M13.8605263,11.4181818 L13.5815789,11.0545455 C12.4657895,9.52727273 11.9078947,7.70909091 11.9078947,5.81818182 L11.9078947,5.30909091 C11.9078947,2.69090909 10.0947368,0.363636364 7.58421053,0.0727272727 C4.65526316,-0.290909091 2.14473684,2.10909091 2.14473684,5.09090909 L2.14473684,5.81818182 C2.14473684,7.70909091 1.58684211,9.52727273 0.471052632,11.0545455 L0.192105263,11.4181818 C0.0526315789,11.5636364 -0.0171052632,11.8545455 0.0526315789,12 C0.261842105,12.6545455 0.819736842,13.0909091 1.44736842,13.0909091 L12.6052632,13.0909091 C13.2328947,13.0909091 13.7907895,12.6545455 13.9302632,12 C14,11.7818182 13.9302632,11.5636364 13.8605263,11.4181818 Z" id="Shape"></path>
        </g>
        <circle id="Notification-Circle" fill={(alerts) ? purple : transparent} cx="14.5" cy="2.5" r="6">


        </circle>
        <text
          fill={white}
          fontSize={9}
          fontFamily={"Helvetica"}
          x="12" y="5.5"
        >
          {(alerts) ? alerts : ''}
        </text>
    </g>
  </svg>
  )
}

export default Notifications
