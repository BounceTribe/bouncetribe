export const base = 'https://'

export const client = (process.env.NODE_ENV === 'production') ? 'https://www.bt-carl.com' : 'http://localhost:3000'

export const api = (process.env.NODE_ENV === 'production') ? 'https://www.bt-carl.info' : 'http://localhost:5000/graphql'

export const auth0 = (process.env.NODE_ENV === 'production') ? 'carlpeaslee.auth0.com' : 'carlpeaslee.auth0.com'

export const graphqlUrl = 'https://api.graph.cool/simple/v1/ciwdr6snu36fj01710o4ssheb'
