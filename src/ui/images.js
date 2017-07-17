import styled from 'styled-components'
import React from 'react'
import Link from './Links'

const Image = styled.img`
  object-fit: cover;
  height: ${({size}) => (size) ? size : '150px'};
  width: ${({size}) => (size) ? size : '150px'};
  border-radius: ${({circle, size}) => (circle) ? size : 0};
`

export default function Img ({to, title, size, circle, src, alt}) {
  return (
    <Link
      to={to}
      title={title}
    >
      <Img
        size={size}
        circle={circle}
        src={src}
        alt={alt}
      />
    </Link>
  )
}
