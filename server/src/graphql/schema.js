import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay'

import ViewerType from './types/ViewerType'
import PersonType from './types/PersonType'
import {Person} from '../database/models'
import {nodeInterface, nodeField} from './connections/nodeDefinitions'
import personMutation from './mutations/personMutation'
import editPerson from './mutations/editPerson'

import chalk from 'chalk'
import {b} from '../utils/logging'

const Query = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query',
  fields: ()=> ({
    viewer: {
      description: 'The person who is currently using the site.',
      type: ViewerType,
      args: {
        personID: {
          type: GraphQLID
        },
      },
      resolve: async (_, args, context) => {
        b('Root: ViewerResolve', '', args, context)
        const instance = await Person.findById(context.personID)
        const viewer = instance.dataValues
        return viewer
      },
    },
    node: nodeField,
  })
})



const Mutation = new GraphQLObjectType({
  name: 'RootMutation',
  description: 'The root mutation',
  fields: ()=> ({
    createPerson: personMutation,
    editPerson: editPerson,
  })
})

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})

export default Schema
