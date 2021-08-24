import React, { Component, useState } from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Navigation from './Navigation'
import Profile from '../Profile'
import Organization from '../Organization'
import * as routes from '../constants/routes'

const App = () => {
  const [organizationName, setOrganizationName] = useState(
    'the-road-to-learn-react'
  )

  const onOrganizationSearch = (value) => {
    console.log(value)
    setOrganizationName(value)
  }
  return (
    <div>
      <Router>
        <div className="App">
          <Navigation
            organizationName={organizationName}
            onOrganizationSearch={onOrganizationSearch}
          />
          <div className="App-main">
            <Route
              exact
              path={routes.ORGANIZATION}
              component={() => (
                <div className="App-content_large-header">
                  <Organization organizationName={organizationName} />
                </div>
              )}
            />
            <Route
              exact
              path={routes.PROFILE}
              component={() => (
                <div className="App-content_small-header">
                  <Profile />
                </div>
              )}
            />
          </div>
        </div>
      </Router>

      <Profile />
    </div>
  )
}

export default App
