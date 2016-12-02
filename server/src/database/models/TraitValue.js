import sequelize from 'sequelize'
import db from '../db'

const TraitValue = db.define('traitValue', {

  traitValueID: {
    type: sequelize.UUID,
    primaryKey: true,
    default: sequelize.UUID,
  },

  value: {
    type: sequelize.STRING,
    notNull: true,
  },

})

export default TraitValue
