import {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList
} from 'graphql'


import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  cursorForObjectInConnection,
  connectionFromPromisedArray
} from 'graphql-relay'

import {nodeInterface, nodeField} from '../connections/nodeDefinitions'
import {Person} from '../../database/models'
import PersonType from '../types/PersonType'
import {connectionType, personConnection} from '../connections/personConnection'


const ViewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: ()=>({
    id: globalIdField('Viewer'),
    personID: {
      type: GraphQLID
    },
    email: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    self: {
      description: 'The person who is currently using the site.',
      type: personConnection,
      args: connectionArgs,
      resolve: async (viewer, args, context) => {
        viewer.self =[]
        const self = await Person.findById(context.user.personID)
        viewer.self.push(self)
        return connectionFromArray(
          viewer.self,
          args
        )
      }
    },
    persons: {
      description: 'A person who has an account with the site.',
      type: personConnection,
      args: connectionArgs,
      resolve: async (viewer, args, context) => {
        const personResult =  await Person.findAll()
        viewer.persons = []
        personResult.forEach(
          (instance) => {
            viewer.persons.push({
              ...instance.dataValues,
              id: instance.dataValues.personID
            })
          }
        )
        return connectionFromArray(
          viewer.persons,
          args
        )
      }
    },
  }),
  interfaces: ()=> [nodeInterface]
})

export default ViewerType
