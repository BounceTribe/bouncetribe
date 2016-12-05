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
import ViewerType from '../types/ViewerType'

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
    viewer: {
      type: ViewerType,
      resolve: async (payload) => {
        try {
          console.log(chalk.green('payload'), payload)
          return payload
        } catch (error) {
          console.log(chalk.red('error'))
          console.log(error)
        }

      },
    }
  },
  mutateAndGetPayload: async ({personID, handle}) => {
    try {
      console.log(chalk.cyan('mutateAndGetPayload'))
      const person = await Person.findById(personID)
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
