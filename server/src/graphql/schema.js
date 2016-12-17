import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString
} from 'graphql'
import fetch from 'isomorphic-fetch'
import {allUsersUrl, options, auth0users, deleteOptions} from '../config/auth0'
import chalk from 'chalk'
import UserType from './types/UserType'

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'The root query',
  fields: ()=> ({
    allUsers: {
      type: new GraphQLList(UserType),
      resolve: async (source, args, context) =>{
        const result = await fetch(allUsersUrl, options()).then(r=>r.json()).then(json=>json)

        let allUsers = result.users.map((user)=>{
          return {
            email: user.email,
            auth0id: user['user_id'],
            name: user.name
          }
        })

        console.log(chalk.cyan('all users'))


        return allUsers
      }
    }
  })
})



const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root mutation',
  fields: ()=> ({
    deleteAllUsers: {
      type: GraphQLString,
      resolve: async (source, args, context) => {
        const result = await fetch(allUsersUrl, options()).then(r=>r.json()).then(json=>json)

        let allUsers = result.users.map((user)=>{
          return user['user_id']
        })

        allUsers.forEach((user)=>{
          let options = deleteOptions(user)
          fetch(...options).then(r=>r.json()).then(json=>console.log(json))
        })

        console.log(chalk.red('deleteAllUsers'))


        return 'all done'
      }
    }
  })
})

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})

export default Schema
