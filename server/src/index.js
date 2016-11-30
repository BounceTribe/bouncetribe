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
import db, {initializeDB} from './database'


//initialize the database
initializeDB()

const server = express()

server.use('/', permissionsMiddleware, graphQLHTTP((req)=>{
    return {
      graphiql: true,
      pretty: true,
      schema,
      context: {
        user: req.user
      }
    }
  }))

server.listen(config.port, () => console.log(chalk.green(`Server is listening on port ${config.port}`)))
