import Person from './models/Person'
import fetch from 'isomorphic-fetch'
import uuid from 'uuid'

const allUsersUrl = 'https://carlpeaslee.auth0.com/api/v2/users?per_page=100&page=0&include_totals=true&sort=created_at%3A1&search_engine=v2'

const options = () => {
  return {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + process.env.AUTH_ADMIN
    },
  }
}

const auth0users = async () => {
  try {
    console.log('fetching users from auth0')
    const result = await fetch(allUsersUrl, options())
    const data = await result.json()
    console.log('sync data')
    const users = []
    data.users.forEach((user)=>{
      let email = user.email
      let name = user.name
      let auth0id = user['user_id'].slice(6)
      let profilePicUrl = user.picture
      let personID = uuid.v4()
      users.push({
        email,
        name,
        auth0id,
        profilePicUrl,
        personID
      })
    })
    return users
  } catch (error) {
    console.log('syncing error', error)
  }
}

const populate = async () => {
  try {

    console.log('beginning db sync')

    const users = await auth0users()

    users.forEach( (user, index) => {
      Person.findOrCreate({
        where: {
          auth0id: user.auth0id
        },
        defaults: {
          ...user
        }
      }).spread((user,created)=> {
        console.log(index)
      })
    })

    console.log('sync complete!')

  } catch (error) {
    console.log('syncing error', error)
  }


}


export default populate
