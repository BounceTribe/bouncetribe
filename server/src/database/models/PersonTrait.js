import sequelize from 'sequelize'
import db from '../db'

const PersonTrait = db.define('personTrait',
  {
    personTraitID: {
      type: sequelize.UUID,
      default: sequelize.UUID,
      primaryKey: true
    },

    personID: {
      type: sequelize.UUID,
      default: sequelize.UUID,
      references: {
        model:'person',
        key: 'personID'
      }
    },

    traitKeyID: {
      type: sequelize.UUID,
      default: sequelize.UUID,
      references: {
        model: 'traitKey',
        key: 'traitKeyID'
      }
    },

    traitValueID: {
      type: sequelize.UUID,
      default: sequelize.UUID,
      references: {
        model: 'traitValue',
        key: 'traitValueID'
      }
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ['personID']
      },
      {
        unique: false,
        fields: ['traitKeyID']
      },
      {
        unique: false,
        fields: ['traitValueID']
      }
    ]
  }
)

export default PersonTrait
