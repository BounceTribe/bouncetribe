import sequelize from 'sequelize'
import db from '../index'

import PersonDemo from './PersonDemo'

const Person = db.define('person', {

  personID: {
    type: sequelize.UUID,
    primaryKey: true,
    default: sequelize.UUIDV4,
  },

  auth0id: {
    type: sequelize.STRING,
    notNull: true,
  },

  profilePicUrl: {
    type: sequelize.STRING,
    validate: {
      isUrl: true
    }
  },

  email: {
    type: sequelize.STRING,
    validate: {
      isEmail: true,
    },
    notNull: true,
  },

  name: {
    type: sequelize.STRING,
  },

})


export default Person
