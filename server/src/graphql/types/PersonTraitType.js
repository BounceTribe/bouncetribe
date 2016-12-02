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
import {PersonTrait, TraitKey, TraitValue} from '../../database/models'


const PersonTraitType = new GraphQLObjectType({
  name: 'PersonTrait',
  fields: ()=>({
    id: globalIdField('PersonTrait'),
    personTraitID: {
      type: GraphQLID
    },
    personID: {
      type: GraphQLID
    },
    traitKeyID: {
      type: GraphQLID
    },
    traitValueID: {
      type: GraphQLID
    },
    key: {
      type: GraphQLString,
      resolve: async (personTrait, args, context) => {
        const traitKeyID =  personTrait.traitKeyID
        const instance = await TraitKey.findById(traitKeyID)
        console.log(instance)
        return instance.key
      }
    },
    value: {
      type: GraphQLString,
      resolve: async (personTrait, args, context) => {
        const traitValueID =  personTrait.traitValueID
        const instance = await TraitValue.findById(traitValueID)
        console.log(instance)
        return instance.value
      }
    },
  }),
  interfaces: [nodeInterface]
})


export default PersonTraitType
