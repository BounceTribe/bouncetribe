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
import {b} from '../../utils/logging'

const ViewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: ()=>({
    id: globalIdField('Viewer'),
    self: {
      description: 'The person who is currently using the site.',
      type: personConnection,
      args: connectionArgs,
      resolve: async (source, args, context) => {
        b('ViewerTypeResolve', source, args, context)
        const self = []
        self.push(source)
        return connectionFromArray(
          self,
          args
        )
      }
    },
  }),
  interfaces: ()=> [nodeInterface]
})

export default ViewerType
