import React, {Component} from 'react'
import Relay from 'react-relay'
import {ImageDropContainer, CroppedImage} from 'styled'
import Dropzone from 'react-dropzone'
import uploadFile from 'utils/uploadFile'
import UpdateFile from 'mutations/UpdateFile'
import ReactCrop from 'react-image-crop'
import {Button} from 'styled'
import 'react-image-crop/dist/ReactCrop.css'
import Camera from 'icons/Camera'

export default class ImageUploader extends Component {

  state = {
    image: false,
    crop: {
      aspect: 1/1,
      x: 0,
      y: 0,
      width: 100,
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
    console.log(this.state)
    let htmlImage = new Image()


    htmlImage.onload = ()=>{
      window.createImageBitmap(htmlImage, 0, 0 ,pixel.width, pixel.height).then(result=>{
        let canvas = document.createElement('canvas')
        canvas.width = pixel.width
        canvas.height = pixel.height

        let c = canvas.getContext('2d')


        c.drawImage(htmlImage, pixel.x, pixel.y, pixel.width, pixel.height, 0, 0,pixel.width, pixel.height )

        canvas.toBlob((blob)=>{
          uploadFile(blob, imageName)
          .then( fileId => {
            Relay.Store.commitUpdate(
              new UpdateFile({
                self: this.props.self,
                fileId: fileId,
              }), {
                onSuccess: (transaction) => {
                  let file = transaction.updateFile.file
                  this.setState({
                    croppedImage: file.url
                  })
                  this.props.fileSuccess(file)
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
    if (this.state.croppedImage) {
      return (
        <CroppedImage
          src={this.state.croppedImage}
          alt={'project art'}
        />
      )
    } else if (this.state.image) {
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
            label="Save"
            onClick={this.uploadImage}
            primary
            disabled={!this.state.pixel}
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
            justifyContent: 'center',
            alignItems: 'center'
          }}
          multiple={false}
          accept={'image/*'}
          maxSize={10000000}
          onDrop={this.onImageDrop}
        >
          <Camera/>
        </Dropzone>
      )
    }
  }


  render () {
    return (
      <ImageDropContainer
        image={this.state.image}
      >


        {this.dropzoneOrCropper}

      </ImageDropContainer>
    )
  }
}
