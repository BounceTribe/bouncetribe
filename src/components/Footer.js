import React, {Component} from 'react'
import styled from 'styled-components'
import {grey500} from 'theme'

const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 60px 10% 30px 10%;
  width: 100%;
  box-sizing: border-box;
  font-size: 13px;
`

const Link = styled.a`
  color: ${grey500};
  margin-right: 5px;
  text-decoration: none;
`

const LinkRow = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  font-size: 12px;
`

export default class Footer extends Component {
  render() {
    return (
      <Col>
        <Link>&#xA9; BounceTribe {new Date(Date.now()).toLocaleDateString('en-US', {year: 'numeric'})}</Link>
        <LinkRow>
          <Link
            href={"http://bouncetribe.com/about/"}
          >About | </Link>
          <Link
            href={"http://bouncetribe.com/support/"}

          >Press | </Link>
          <Link
            href={"http://bouncetribe.com/blog/"}
          >Blog | </Link>
          <Link
            href={"http://bouncetribe.com/support/"}
          >Support | </Link>
          <Link
            href={"http://bouncetribe.com/terms-of-service/"}
          >Terms of Use | </Link>
          <Link
            href={"http://bouncetribe.com/privacy-policy/"}
          >Privacy Policy </Link>


        </LinkRow>

      </Col>
    )
  }
}
