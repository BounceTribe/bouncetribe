import React from 'react'
import {grey400} from 'theme'



const Edit = ({style, fill}) => {
  return (
    <svg
      style={style}
      width="20px" height="20px" viewBox="330 28 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">

        <g id="Edit-Pencil" stroke="none" fill="none" transform="translate(330.000000, 28.000000)" fillRule="evenodd">
            <path d="M12.8000215,16.0019315 L12.8003711,3.20193148 L12.8003711,3.20193148 L7.20108308,3.20193148 L7.20006308,16.0019315 L12.8000215,16.0019315 Z M12.7986487,16.8019315 L10.0013375,20.8000003 L7.20135188,16.8019315 L12.7986487,16.8019315 Z M12.8003935,2.40193148 L12.8004591,0.00193148284 C12.8004591,-0.799999717 11.9985279,-0.799999717 11.9985279,-0.799999717 L8.00326868,-0.799999717 C8.00326868,-0.799999717 7.20133748,-0.799999717 7.20133748,0.00193148284 L7.20114628,2.40193148 L12.8003935,2.40193148 L12.8003935,2.40193148 Z" id="editor-pencil-pen-edit-write-glyph" fill={fill || grey400} transform="translate(10.000261, 10.000000) rotate(45.000000) translate(-10.000261, -10.000000) "></path>
        </g>
    </svg>
  )
}

export default Edit
