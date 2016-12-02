import Sequelize from 'sequelize'
import {host, user, password, name, ssl } from '../config/database'

const db = new Sequelize(name, user, password, {
  host: host,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
    freezeTableName: true,
  }
})

export default db
