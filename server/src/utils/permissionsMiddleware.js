import jwt from 'express-jwt'
import {Person} from '../database/models'
import {secret, clientID} from '../config/auth0'

const jwtCheck = jwt({
  secret: new Buffer(secret, 'base64'),
  isRevoked: (req, payload, done) => {
    console.log('req', req, 'payload', payload)
    return done()
  },
  // audience: clientID,
  credentialsRequired: false,
  // getToken: (req) => {
  //   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
  //       return req.headers.authorization.split(' ')[1];
  //   } else if (req.query && req.query.token) {
  //     return req.query.token
  //   }
  //   return null;
  // }
})


async function permissionsChecker(req, res, next) {
  console.log(req.user)
  // if (!req.user) {
  //   try {
  //     console.log('permissionsChecker: you need to login', req.user)
  //     req.user = {
  //       personID: false
  //     }
  //     next()
  //   } catch (error) {
  //     console.log('permissions error', error)
  //   }
  // } else {
  //   try {
  //     const user = await Person.findOne({
  //       where: {
  //         auth0id: req.user.sub.split('|')[1],
  //       },
  //     })
  //     req.user = {...user.dataValues}
  //     next()
  //   } catch (error) {
  //     console.log('permissions error', error)
  //   }
  // }
}

const permissionsMiddleware = [ jwtCheck, permissionsChecker]

export default permissionsMiddleware
