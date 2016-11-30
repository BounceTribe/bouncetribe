import sequelize from 'sequelize'
import db from '../index'

const DemoKey = db.define('demoKey', {

  demoKeyID: {
    type: sequelize.UUID,
    primaryKey: true,
    default: sequelize.UUID,
  },

  key: {
    type: sequelize.STRING,
    notNull: true,
  },

})

export default DemoKey
