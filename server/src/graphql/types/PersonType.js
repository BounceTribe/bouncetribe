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
import {Person, PersonTrait, TraitValue} from '../../database/models'
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
    influences: {
      type: new GraphQLList(GraphQLString),
      resolve: async (person, args, context) => {
        const results = await PersonTrait.findAll({
          where: {
            personID: person.personID,
            traitKeyID: '609a027f-b40f-4c64-b1cb-57e2509dbd5c'
          }
        })
        const influences = []
        results.forEach((influence) => {
          influences.push({
            traitValueID: influence.dataValues.traitValueID
          })
        })
        const influenceValues = await TraitValue.findAll({
          where: influences
        })

        person.influences = []
        influenceValues.forEach((value)=> {
          person.influences.push(value.dataValues.value)
        })

        return person.influences
      }
    },
    // traits: {
    //   type: personTraitConnection,
    //   args: connectionArgs,
    //   resolve: async (person, args, context) => {
    //     person.traits = await PersonTrait.findAll({
    //       where: {
    //         personID: person.personID
    //       }
    //     })
    //     return connectionFromArray(
    //       person.traits,
    //       args
    //     )
    //   }
    // }
  }),
  interfaces: [nodeInterface]
})


export default PersonType
