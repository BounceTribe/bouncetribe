import sequelize from 'sequelize'
import db from '../index'

const DemoValue = db.define('demoValue', {

  demoValueID: {
    type: sequelize.UUID,
    primaryKey: true,
    default: sequelize.UUID,
  },

  value: {
    type: sequelize.STRING,
    notNull: true,
  },

})

export default DemoValue
