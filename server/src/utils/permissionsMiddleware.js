import jwt from 'express-jwt'
import Person from '../database/models/Person'
import {secret, clientID} from '../config/auth0'
import cors from 'cors'


const corsOptions = {
  origin: true,
  //credentials: true
}

const jwtCheck = jwt({
  secret: new Buffer(secret, 'base64'),
  audience: clientID,
  credentialsRequired: false,
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token
    }
    return null;
  }
})


async function permissionsChecker(req, res, next) {
  if (!req.user) {
    try {
      const anonymous = await Person.findById('0048768e-5379-46c4-838f-7fbf49bf5fa1')
      req.user = anonymous
      next()
    } catch (error) {
      console.log('permissions error', error)
    }
  } else {
    try {
      const user = await Person.findOne({
        where: {
          auth0id: req.user.sub.split('|')[1],
        },
      })
      req.user = {...user.dataValues}
      next()
    } catch (error) {
      console.log('permissions error', error)
    }
  }
}

const permissionsMiddleware = [cors(corsOptions), jwtCheck, permissionsChecker]

export default permissionsMiddleware
