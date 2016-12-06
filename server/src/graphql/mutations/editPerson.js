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
import {b} from '../../utils/logging'

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
          console.log(chalk.green('outputFields, editPerson, payload:'), payload)

          const person = await Person.findById(payload.modifiedPersonID)

          return person.dataValues
        } catch (error) {
          console.log(chalk.red('error'))
          console.log(error)
        }
      },
    },
    // viewer: {
    //   type: ViewerType,
    //   resolve: async (payload) => {
    //     try {
    //       console.log(chalk.green('outputFields, editPerson, payload:'), payload)
    //
    //       const person = await Person.findById(payload.modifiedPersonID)
    //
    //       return person.dataValues
    //     } catch (error) {
    //       console.log(chalk.red('error'))
    //       console.log(error)
    //     }
    //   },
    // }
  },
  mutateAndGetPayload: async (source, args, context) => {
    try {
      b('Edit Person mutateAndGetPayload', source, args, context)
      const person = await Person.findById(source.personID)
      const modifiedPerson = await person.update({
        handle: source.handle
      })
      return {
        modifiedPersonID: modifiedPerson.dataValues.personID
      }
    } catch (error) {
      console.log(chalk.red('error'))
      console.log(error)
    }
  }
})



export default editPerson
