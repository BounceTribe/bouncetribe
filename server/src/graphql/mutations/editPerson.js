import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import chalk from 'chalk'

import {Person} from '../../database/models'
import PersonType from '../types/PersonType'
import {connectionType, personConnection} from '../connections/personConnection'

const editPerson = mutationWithClientMutationId({
  name: 'EditPerson',
  inputFields: {
    personID: {
      type: GraphQLID,
    },
    handle: {
      type: GraphQLString
    },
  },
  outputFields: {
    person: {
      type: PersonType,
      resolve: async (payload) => {
        try {
          console.log(chalk.green('payload'), payload.modifiedPerson)
          return payload.modifiedPerson
        } catch (error) {
          console.log(chalk.red('error'))
          console.log(error)
        }

      },
    },
    self: {
      type: personConnection,
      resolve: async (payload) => {
        return payload.modifiedPerson
      }
    }
  },
  mutateAndGetPayload: async ({personID, handle}) => {
    try {
      console.log(chalk.cyan('mutateAndGetPayload'))
      const person = await Person.findById(personID)
      console.log(person.dataValues)
      const modifiedPerson = await person.update({
        handle
      })
      console.log(modifiedPerson.dataValues)
      return {
        modifiedPerson: modifiedPerson.dataValues
      }
    } catch (error) {
      console.log(chalk.red('error'))
      console.log(error)
    }
  }
})



export default editPerson
