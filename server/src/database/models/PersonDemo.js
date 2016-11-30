import sequelize from 'sequelize'
import db from '../index'

import DemoKey from './DemoKey'
import DemoValue from './DemoValue'
import Person from './Person'

const PersonDemo = db.define('personDemo',
  {
    personDemoId: {
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

    demoKeyID: {
      type: sequelize.UUID,
      default: sequelize.UUID,
      references: {
        model: 'demoKey',
        key: 'demoKeyID'
      }
    },

    demoValueID: {
      type: sequelize.UUID,
      default: sequelize.UUID,
      references: {
        model: 'demoValue',
        key: 'demoValueID'
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
        fields: ['demoKeyID']
      },
      {
        unique: false,
        fields: ['demoValueID']
      }
    ]
  }
)

export default PersonDemo
