import React from 'react'
import {purple} from 'theme'
const Headphones = ({style, fill, height}) => {
  return (
    <svg
      style={style}
      width="30px" height={height || 16} viewBox="812 17 19 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Session" stroke="none" fill="none" transform="translate(812.000000, 18.500000)">
          <path d="M2.73490579,7.42864917 C2.83721401,-2.01798976 16.0169189,-2.85355314 16.2308969,7.3721831" id="Shape" stroke="#9075F3" strokeWidth="1.8184"></path>
          <path d="M3.3440743,7.20076825 L1.67237149,7.20076825 C0.752266264,7.20076825 0,7.95701024 0,8.88197823 L0,12.1509603 C0,13.0752561 0.752266264,13.8314981 1.67237149,13.8314981 L3.3440743,13.8314981 L3.3440743,7.20076825 L3.3440743,7.20076825 Z" id="Shape" fill={purple || fill} fillRule="evenodd"></path>
          <path d="M15.6244031,7.34395006 L17.2967746,7.34395006 C18.2162112,7.34395006 18.9691461,8.10019206 18.9691461,9.02448784 L18.9691461,12.2934699 C18.9691461,13.2177657 18.2168798,13.9740077 17.2967746,13.9740077 L15.6244031,13.9740077 L15.6244031,7.34395006 Z" id="Shape" fill={purple || fill} fillRule="evenodd"></path>
      </g>
    </svg>
  )
}

export default Headphones
