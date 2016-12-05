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

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query',
  fields: ()=> ({
    viewer: {
      description: 'The person who is currently using the site.',
      type: ViewerType,
      resolve: async (source, args, context) => {
        console.log(chalk.cyan('viewerRoot is resolving'))
        const instance = await Person.findById(context.personID)
        const viewer = instance.dataValues
        return viewer
      },
    },
    node: nodeField,
  })
})



const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  description: 'The root mutation',
  fields: ()=> ({
    createPerson: personMutation,
    editPerson: editPerson,
  })
})

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})

export default Schema
