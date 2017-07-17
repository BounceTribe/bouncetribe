import React, {Component} from 'react'
import {QueryRenderer, graphql} from 'react-relay'
import environment from 'environment'
import Router from './Router'

export default class RouterRelay extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query RouterRelayViewerQuery {
            viewer {
              user {
                id
                email
                handle
              }
            }
          }
        `}
        render={
          ({error, props}) => {
            if (error) {
              return <div>{error.message}</div>
            } else if (props) {
              return <Router viewer={props.viewer} />
            }
            return <div>Loading</div>
          }
        }
      />
    )
  }
}
