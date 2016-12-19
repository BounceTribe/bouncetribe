import store from 'store'
import {api} from 'config/urls'

export const allUsers = () => {
  return [
    url,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${store.getState().auth['id_token']}`
      },
      body: JSON.stringify({
        query: `{
          allUsers {
            email
            auth0id
            name
          }
        }`
      }),
    }
  ]
}

export const deleteAllUsers = () => {
  return [
    url,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${store.getState().auth['id_token']}`
      },
      body: JSON.stringify({
        query: `
          mutation {
            deleteAllUsers
          }
        `
      }),
    }
  ]
}
