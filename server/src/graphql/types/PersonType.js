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
} from 'graphql-relay';

import {nodeInterface, nodeField} from '../connections/nodeDefinitions'
import Person from '../../database/models/Person'


const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: ()=>({
    id: globalIdField('Person'),
    personID: {
      type: GraphQLID
    },
    email: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
  }),
  interfaces: [nodeInterface]
})


export default PersonType
