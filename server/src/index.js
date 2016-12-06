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
import initializeDB from './database'
import cors from 'cors'

//initialize the database
initializeDB()

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
      context: {
        personID: req.user
      }
    }
  }))

server.listen(config.port, () => console.log(chalk.green(`Server is listening on port ${config.port}`)))
