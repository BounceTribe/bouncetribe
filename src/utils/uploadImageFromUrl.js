import {fileUrl, url} from 'config'

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
        fetch(fileUrl, {
          method: 'POST',
          body: formData
        }).then(
          resp=>{
            return resp.json()
          }
        ).then(data=>{
          resolve(data.id)
        })
      }
    }
    xhr.onerror = function() {
      let noImage = new XMLHttpRequest()
      noImage.open('GET', `${url}/logo.png`, true)
      noImage.responseType = 'blob'
      noImage.onload = function (e) {
        if (this.status === 200) {
          let myBlob = this.response
          console.log('myBlob', myBlob)
          let formData = new FormData()
          formData.append('data', myBlob, 'placeholder.png')
          console.log('formData', formData)
          fetch(fileUrl, {
            method: 'POST',
            body: formData
          }).then(
            resp=>{
              return resp.json()
            }
          ).then(data=>{
            resolve(data.id)
          })
        }
      }
      noImage.send()
    }
    xhr.send()
  })
}

export default uploadImageFromUrl
