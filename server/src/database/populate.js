import {Person, TraitKey, TraitValue, PersonTrait} from './models'
import {traitKeys, traitValues, personTraits} from './initialValues'
import fetch from 'isomorphic-fetch'
import uuid from 'uuid'
import {auth0Admin} from '../config/auth0'


const allUsersUrl = 'https://carlpeaslee.auth0.com/api/v2/users?per_page=100&page=0&include_totals=true&sort=created_at%3A1&search_engine=v2'

const options = () => {
  return {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + auth0Admin
    },
  }
}

const auth0users = async () => {
  try {
    console.log('fetching users from auth0')
    const result = await fetch(allUsersUrl, options())
    const data = await result.json()
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
        personID,
        handle: Math.random().toString().split('.')[1]
      })
    })
    return users
  } catch (error) {
    console.log('syncing error', error)
  }
}

const makeUsers = async () => {
  try {
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
  } catch (error) {
    console.log('makeUsers error', error)
  }
}

const makeTraitKeys = async () => {

  traitKeys.forEach( (traitKey) => {
    TraitKey.findOrCreate({
      where: {
        key: traitKey.key
      },
      defaults: {
        ...traitKey
      }
    })
  })
}

const makeTraitValues = async () => {
  traitValues.forEach( (traitValue) => {
    TraitValue.findOrCreate({
      where: {
        value: traitValue.value
      },
      defaults: {
        ...traitValue
      }
    })
  })
}

const makePersonTraits = async () => {
  try {
    let carl = await Person.find({
      where: {
        email: 'cpeaslee@gmail.com'
      }
    })
    carl = carl.dataValues

    personTraits.forEach( (pt) => {
      PersonTrait.findOrCreate({
        where: {
          personID: carl.personID
        },
        defaults: {
          personTraitID: uuid.v4(),
          personID: carl.personID,
          traitKeyID: pt.traitKeyID,
          traitValueID: pt.traitValueID
        }
      })
    })

  } catch (error) {
    console.log('makePersonTraits error', error)
  }

}


const populate = async () => {
  try {

    console.log('beginning populate')

    await makeUsers()

    await makeTraitValues()
    await makeTraitKeys()

    await makePersonTraits()

    console.log('populate complete!')

  } catch (error) {
    console.log('syncing error', error)
  }


}


export default populate
