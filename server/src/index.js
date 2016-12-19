require("babel-core/register");
require("babel-polyfill");
/* eslint-disable no-console, no-shadow */
import path from 'path'
import express from 'express'
import graphQLHTTP from 'express-graphql'
import historyApiFallback from 'connect-history-api-fallback'
import permissionsMiddleware from './utils/permissionsMiddleware'
import chalk from 'chalk'
import config from './config/environment'
import schema from './graphql/schema'
// import initializeDB from './database'
import cors from 'cors'
import fetch from 'isomorphic-fetch'

//initialize the database
// initializeDB()

const server = express()

const corsOptions = {
  origin: [
    'https://www.bt-carl.com',
    'http://localhost:3000'
  ]
}

server.options('*', cors())

server.use(cors())

server.use('/graphql', permissionsMiddleware, graphQLHTTP((req)=>{
    return {
      graphiql: true,
      pretty: true,
      schema,
      // context: {
      //   personID: req.user.personID
      // }
    }
  }))

server.listen(config.port, () => console.log(chalk.green(`Server is listening on port ${config.port}`)))




export const newLoginOptions = (email, password) => {
  return [
    `https://carlpeaslee.auth0.com/oauth/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:   JSON.stringify({
        'grant_type': 'password',
        'client_id': '6jfxOKSqF51fNxmPXqkvPLZFNXHqHWJY',
        'audience': 'https://carlpeaslee.auth0.com/api/v2/',
        username: email,
        password: password,
        scope: 'openid profile',
      })
    }
  ]
}

export const newSignupOptions = (email, password) => {
  return [
    `https://carlpeaslee.auth0.com/dbconnections/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:   JSON.stringify({
        'client_id': '6jfxOKSqF51fNxmPXqkvPLZFNXHqHWJY',
        email: email,
        password: password,
        connection: 'Username-Password-Authentication'
      })
    }
  ]
}

const login = async () => {
  try {
    console.log("hello")
    let options = newLoginOptions('cpeaslee@gmail.com', 'G0rg0n9f0x')
    const result = await fetch(...options).then(r=>r.json()).then(json=>json)
    console.log(chalk.cyan('login result'), result)
  } catch (error) {
    console.log('error')
  }
}

const signup = async () => {
  try {
    console.log("hello")
    let options = newSignupOptions('cpeaslee@gmail.com', 'G0rg0n9f0x')
    const result = await fetch(...options).then(r=>r.json()).then(json=>json)
    console.log(chalk.cyan('signup result'), result)
  } catch (error) {
    console.log('error')
  }
}

login()

// signup()
