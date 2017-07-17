const {
  Environment,
  Network,
  RecordSource,
  Store,
} = require('relay-runtime')

const store = new Store(new RecordSource())

const network = Network.create((operation, variables) => {
  let token = localStorage.getItem("token")
  let authorization = (token) ? {"Authorization": `Bearer ${token}`} : {}
  return fetch('https://api.graph.cool/relay/v1/bt-api', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...authorization
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json()
  })
})

const environment = new Environment({
  network,
  store,
})

export default environment
