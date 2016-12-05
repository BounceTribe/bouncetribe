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
import {Person, PersonTrait} from '../../database/models'
import {connectionType, personTraitConnection} from '../connections/personTraitConnection'


const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: ()=>({
    id: globalIdField('Person'),
    personID: {
      type: GraphQLID
    },
    profilePicUrl: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    handle: {
      type: GraphQLString
    },
    traits: {
      type: personTraitConnection,
      args: connectionArgs,
      resolve: async (person, args, context) => {
        person.traits = await PersonTrait.findAll({
          where: {
            personID: person.personID
          }
        })
        return connectionFromArray(
          person.traits,
          args
        )
      }
    }
  }),
  interfaces: [nodeInterface]
})


export default PersonType
