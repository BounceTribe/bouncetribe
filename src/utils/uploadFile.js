import {graphCool} from 'config'

const uploadFile = (file, name) => {
  return new Promise ((resolve, reject) => {

    console.log(file)
    console.log(file.type)


    let formData = new FormData()

    if (name) {
      formData.append('data', file, name)
    } else {
      formData.append('data', file)
    }

    console.log(formData)

    fetch(graphCool.fileUrl, {
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
