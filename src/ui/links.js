import React from 'react'
import {Link as RouterLink} from 'react-router-dom'
import styled from 'styled-components'
import {H1, H2, H3, H4, H5, H6, H7} from './headers'

const Link = styled(RouterLink)`
  text-decoration: none;
  cursor: pointer;
`
export default Link

export function H1Link({color, weight, to, title, children}) {
  return (
    <H1
      color={color}
      weight={weight}
    >
      <Link
        to={to}
        title={title}
      >
        {children}
      </Link>
    </H1>
  )
}

export function H2Link({color, weight, to, title, children}) {
  return (
    <H2
      color={color}
      weight={weight}
    >
      <Link
        to={to}
        title={title}
      >
        {children}
      </Link>
    </H2>
  )
}

export function H3Link({color, weight, to, title, children}) {
  return (
    <H3
      color={color}
      weight={weight}
    >
      <Link
        to={to}
        title={title}
      >
        {children}
      </Link>
    </H3>
  )
}

export function H4Link({color, weight, to, title, children}) {
  return (
    <H4
      color={color}
      weight={weight}
    >
      <Link
        to={to}
        title={title}
      >
        {children}
      </Link>
    </H4>
  )
}


export function H5Link({color, weight, to, title, children}) {
  return (
    <H5
      color={color}
      weight={weight}
    >
      <Link
        to={to}
        title={title}
      >
        {children}
      </Link>
    </H5>
  )
}

export function H6Link({color, weight, to, title, children}) {
  return (
    <H6
      color={color}
      weight={weight}
    >
      <Link
        to={to}
        title={title}
      >
        {children}
      </Link>
    </H6>
  )
}

export function H7Link({color, weight, to, title, children}) {
  return (
    <H7
      color={color}
      weight={weight}
    >
      <Link
        to={to}
        title={title}
      >
        {children}
      </Link>
    </H7>
  )
}
