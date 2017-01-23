import React, {Component} from 'react'
import Relay from 'react-relay'
import {ImageDropContainer} from 'styled'
import Dropzone from 'react-dropzone'
import uploadFile from 'utils/uploadFile'
import UpdateFile from 'mutations/UpdateFile'
import ReactCrop from 'react-image-crop'
import {Button} from 'styled'
import 'react-image-crop/dist/ReactCrop.css'

class ImageUploader extends Component {

  state = {
    image: false,
    crop: {
      aspect: 1/1
    }
  }

  onImageDrop = (files, rejectedFile) => {
    let file = files[0]

    console.log(file)
    this.setState({
      image: file.preview,
      imageName: file.name
    })

  }

  uploadImage = () => {
    let imageName = this.state.imageName

    let {image, pixel} = this.state

    let htmlImage = new Image()


    htmlImage.onload = ()=>{
      window.createImageBitmap(htmlImage, 0, 0 ,pixel.width, pixel.height).then(result=>{
        let canvas = document.createElement('canvas')
        canvas.width = pixel.width
        canvas.height = pixel.height
        document.body.appendChild(canvas)

        let c = canvas.getContext('2d')


        c.drawImage(htmlImage, pixel.x, pixel.y, pixel.width, pixel.height, 0, 0,pixel.width, pixel.height )

        canvas.toBlob((blob)=>{
          uploadFile(blob, imageName)
          .then( fileId => {
            this.props.relay.commitUpdate(
              new UpdateFile({
                self: this.props.self,
                fileId: fileId,
              }), {
                onSuccess: (transaction) => {

                },
                onFailure: (response) => {
                  console.log('updateFile failure', response)
                }
              }
            )
          })

        })

      })

    }

    htmlImage.src = image
  }


  get dropzoneOrCropper () {
    if (this.state.image) {
      return (
        <div>
          <ReactCrop
            src={this.state.image}
            crop={this.state.crop}
            keepSelection={true}
            onComplete={(crop, pixel)=>{
              this.setState({
                crop,
                pixel
              })
            }}

          />
          <Button
            label="Done"
            onClick={this.uploadImage}
          />
        </div>
      )
    } else {
      return (
        <Dropzone
          style={{
            display: 'flex',
            width: '100%',
            height: '200px',
          }}
          multiple={false}
          accept={'image/*'}
          maxSize={10000000}
          onDrop={this.onImageDrop}
        >

        </Dropzone>
      )
    }
  }


  render () {
    return (
      <ImageDropContainer>


        {this.dropzoneOrCropper}

      </ImageDropContainer>
    )
  }
}


export default Relay.createContainer(
  ImageUploader, {
    fragments: {
      self: () => Relay.QL`
        fragment on User {
          id
        }
      `,
    },
  }
)
