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
import Person from '../database/models/Person'
import {nodeInterface, nodeField} from './connections/nodeDefinitions'
import personMutation from './mutations/personMutation'


const RootQuery = new GraphQLObjectType({
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
      resolve: async (source, args, context) => {
        const viewer = await Person.findById(context.user.personID)
        return viewer
      },
      node: nodeField,
    },
  })
})



const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  description: 'The root mutation',
  fields: ()=> ({
    createPerson: personMutation,
  })
})

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})

export default Schema
