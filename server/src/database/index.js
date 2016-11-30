import chalk from 'chalk'

import Sequelize from 'sequelize'
import {host, user, password, name, ssl } from '../config/database'
import populate from './populate'

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




export const initializeDB = () => {

  db.authenticate()
    .then(function(err) {
      console.log(chalk.magenta('Database connection established.'))
    })
    .catch(function (err) {
      console.log('Unable to connect to the database:', err)
  })

  db.sync()
    .then(function(err) {
      console.log(chalk.magenta('Table sync succesful!'))

      console.log(chalk.yellow('Beginnig to populate db'))
      populate()

    }, function (err) {
      console.log('An error occurred while creating the table:', err)
    })

}

export default db
