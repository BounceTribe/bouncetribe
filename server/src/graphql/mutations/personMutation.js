import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import fetch from 'isomorphic-fetch'
import uuid from 'uuid'

const auth0id = 'MKVOaCUUjmWDG4q1daTy2GcyGp8yh3I2'
const auth0domain = 'carlpeaslee.auth0.com'

const baseRoute = 'https://'+ auth0domain

const signupRoute = baseRoute + '/dbconnections/signup'

import Person from '../../database/models/Person'
import PersonType from '../types/PersonType'

const signupOptions = (email, password) => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:   JSON.stringify({
      'client_id': auth0id,
      email: email,
      password: password,
      connection: 'Username-Password-Authentication'
    })
  }
}

const { connectionType: personConnection, edgeType: PersonEdge } = connectionDefinitions({ name: 'createPerson', nodeType: PersonType });

const personMutation = mutationWithClientMutationId({
  name: 'CreatePerson',
  inputFields: {

    email: {
      type: new GraphQLNonNull(GraphQLString),
    },

    password: {
      type: GraphQLString
    },

  },
  outputFields: {
    newPersonEdge: {
      type: PersonEdge,
      resolve: async (payload) => {
        const person = await Person.findById(payload.personID)
        const allPeople = await Person.findAll()
        return {
          cursor: cursorForObjectInConnection(
            allPeople,
            person
          ),
          node: person,
        }
      },
    },
  },
  mutateAndGetPayload: async ({email, password,}) => {
    console.log('mutateAndGetPayload')
    try {
      const options = signupOptions(email, password)
      const auth0Person = await fetch(signupRoute, options)
      const data = await auth0Person.json()

      if (data) {
        const newPerson = await Person.build({
          personID: uuid.v4(),
          auth0id: data._id,
          name: data.name,
          email: data.email,
        }).save()
        return {
          newPersonId: newPerson.personID
        }
      }

    } catch (error) {
      console.log('signup error', error)
    }




  }
})



export default personMutation
