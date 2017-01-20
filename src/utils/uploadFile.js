import {fileUrl} from 'config'

const uploadFile = (file) => {
  return new Promise ((resolve, reject) => {

    console.log(file)

    let formData = new FormData()

    formData.append('data', file)

    console.log(formData)

    fetch(fileUrl, {
      method: 'POST',
      body: formData
    })
    .then(resp=>resp.json())
    .then(data=>{
      resolve(data.id)
    })

  })
}

export default uploadFile
