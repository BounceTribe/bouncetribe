import {file} from 'config'

const uploadImageFromUrl = (imageUrl) => {
  return new Promise((resolve,reject)=>{
    let xhr = new XMLHttpRequest()
    xhr.open('GET', imageUrl, true)
    xhr.responseType = 'blob'
    xhr.onload = function (e) {
      if (this.status === 200) {
        let myBlob = this.response
        console.log('myBlob', myBlob)
        let formData = new FormData()
        formData.append('data', myBlob, 'portrait.jpg')
        console.log('formData', formData)
        fetch(file, {
          method: 'POST',
          body: formData
        }).then(resp=>resp.json()).then(data=>{
          resolve(data.id)
        })
      }
    }
    xhr.send()
  })
}

export default uploadImageFromUrl
