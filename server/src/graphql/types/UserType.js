import {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList
} from 'graphql'

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: ()=>({
    auth0id: {
      type: GraphQLID
    },
    email: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
  }),
})

export default UserType
