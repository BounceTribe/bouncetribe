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
import chalk from 'chalk'

const ViewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: ()=>({
    id: globalIdField('Viewer'),
    self: {
      description: 'The person who is currently using the site.',
      type: PersonType,
      resolve: async (viewer, args, context) => {
        console.log(chalk.cyan('viewerType is resolving'), viewer)
        const self = viewer
        return self
      }
    },
  }),
  interfaces: ()=> [nodeInterface]
})

export default ViewerType
