import sequelize from 'sequelize'
import db from '../db'

const TraitKey = db.define('traitKey', {

  traitKeyID: {
    type: sequelize.UUID,
    primaryKey: true,
    default: sequelize.UUID,
  },

  key: {
    type: sequelize.STRING,
    notNull: true,
  },

})

export default TraitKey
