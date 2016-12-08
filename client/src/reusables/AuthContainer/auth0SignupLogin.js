import {signupRoute, signupOptions, loginRoute, loginOptions} from 'config/auth0'

export async function auth0Signup (email, password) {
  try {
    let options = signupOptions(email, password)

    // eslint-disable-next-line
    const auth0signupResult = await fetch(signupRoute, options).then(
      (response) => response.json()
    ).then((json) => {
        if (json.statusCode) {
          throw json
        } else {
          return json
        }
    })

    return auth0signupResult

  } catch (error) {
    console.log('auth0Signup error: maybe you already have an account?', error)
  }
}


export async function auth0Login (email, password) {
  try {

    let options = loginOptions(email, password)

    const loginResult = await fetch(loginRoute, options).then(
      (response) => response.json()
    ).then((json) => {
        if (json.statusCode) {
          throw json.error
        } else {
          return json
        }
    })


    return loginResult

  } catch (error) {
    console.log('auth0Login error: \n', error)
    throw error.description
  }
}
