import React, {Component} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Feed from 'Feed'
import Template from 'Template'

injectTapEventPlugin()


export default class Router extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <MuiThemeProvider>
            <Template/>

            <Switch>
              <Route
                exact
                path="/"
                render={(router)=>(
                  <Feed
                    router={router}
                  />
                )}
              />

            </Switch>
          </MuiThemeProvider>
        </div>
      </BrowserRouter>
    )
  }
}
