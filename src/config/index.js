let graphCool, auth0, facebook, url

const setUrls = () => {
  switch (process.env.REACT_APP_CONFIG) {
    case 'local': {
      url = 'http://localhost:3000'
      graphCool = {
        relay: 'https://api.graph.cool/relay/v1/bt-api',
        simple: 'https://api.graph.cool/simple/v1/bt-api',
        file: 'https://api.graph.cool/file/v1/bt-api'
      }
      auth0 = {
        domain: 'bouncetribe.auth0.com',
        clientId: 'lwYEzcUQzxG91Zy9rbsPSq4SGyQocznv'
      }
      facebook = {
        id: '294667917634394'
      }
      break
    }
    case 'carl': {
      url = 'https://bt-carl.com'
      graphCool = {
        relay: 'https://api.graph.cool/relay/v1/bt-carl',
        simple: 'https://api.graph.cool/simple/v1/bt-carl',
        file: 'https://api.graph.cool/file/v1/bt-carl'
      }
      auth0 = {
        domain: 'bouncetribe.auth0.com',
        clientId: 'lwYEzcUQzxG91Zy9rbsPSq4SGyQocznv'
      }
      facebook = {
        id: '294667670967752'
      }
      break
    }
    default:
    case 'test': {
      url = 'https://test.bouncetribe.com'
      graphCool = {
        relay: 'https://api.graph.cool/relay/v1/bt-api',
        simple: 'https://api.graph.cool/simple/v1/bt-api',
        file: 'https://api.graph.cool/file/v1/bt-api'
      }
      auth0 = {
        domain: 'bouncetribe.auth0.com',
        clientId: 'lwYEzcUQzxG91Zy9rbsPSq4SGyQocznv'
      }
      facebook = {
        id: '232942193806967'
      }
      break
    }
  }
}
 setUrls()

 export {graphCool, auth0, facebook, url}
