export const base = 'https://'

export const client = (process.env.PRODUCTION) ? 'https://www.bt-carl.com' : 'http://localhost:3000'

export const api = (process.env.PRODUCTION) ? 'https://www.bt-carl.info' : 'http://localhost:5000/graphql'

export const auth0 = (process.env.PRODUCTION) ? 'carlpeaslee.auth0.com' : 'carlpeaslee.auth0.com'

export const graphqlUrl = 'https://api.graph.cool/simple/v1/ciwdr6snu36fj01710o4ssheb'
