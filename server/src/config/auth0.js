export const allUsersUrl = 'https://carlpeaslee.auth0.com/api/v2/users?per_page=100&page=0&include_totals=true&sort=created_at%3A1&search_engine=v2'

export const secret = 'OPbYWGu2smrPs3cB0MqheUJn82F65b9ShZMs26a8UivxTp62tcHGuKqknr7KJ3Hl'

export const clientID= 'wMoUQb2Kb9XViLB6Wek2fLYPlMxJV5hg'

export const carl = 'auth0|585593d067555d4285bdc249'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJkajdDOVFCZkV3cG45bVBTSE1FUU04YnduNU9lNHZ0bSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImRlbGV0ZSIsInJlYWQiXX0sInVzZXJfaWRwX3Rva2VucyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0ODIwMDI5MzksImp0aSI6ImQ2YjJmYTA1ZDNmNTA5OWM4Y2E3MDA5YmNkYjRjNzI3In0.IwbRjcE7v1aicILbDzLYmeVCLKOCJClLl1pPK33NNf4'

export const options = () => {
  return {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    },
  }
}

export const auth0users = async () => {
  try {
    console.log('fetching users from auth0')
    const result = await fetch(allUsersUrl, options()).then(r=>r.json()).then(json=>json)
    console.log('result', result)
  } catch (error) {
    console.log('error', error)
  }
}

export const deleteOptions = (userId) => {
  return [
    `https://carlpeaslee.auth0.com/api/v2/users/${userId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
    },
  }]
}
