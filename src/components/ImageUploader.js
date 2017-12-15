import React, {Component} from 'react'
import Relay from 'react-relay'
import {ImageDropContainer} from 'styled'
// import {ImageDropContainer, CroppedImage} from 'styled'
import Dropzone from 'react-dropzone'
import uploadFile from 'utils/uploadFile'
import UpdateFile from 'mutations/UpdateFile'
import ReactCrop from 'react-image-crop'
import {Button} from 'styled'
import 'react-image-crop/dist/ReactCrop.css'
import Camera from 'icons/Camera'
import {Loading} from 'styled/Spinner'

// import pica from 'pica/dist/pica'
// import FileUploadThumbnail from 'file-upload-thumbnail'
const pica = require('pica')({ features: [ 'js', 'wasm', 'ww', 'cib' ] })

export default class ImageUploader extends Component {
  constructor(props){
    super()
    this.state = {
      image: false,
      croppedImage: false,
      imageName: '',
      pixel: null,
      waiting: false,
      files: [],
      sizesRemaining: props.altSizes,
      crop: { aspect: 1/1, x: 10, y: 10, width: 80 }
    }
    console.log('pica,', pica);
  }

  onImageDrop = (files, rejectedFile) =>
    this.setState({ image: files[0].preview, imageName: files[0].name })

  sendUpload = (canvas, blob, pxSize) => {
    uploadFile(blob, this.state.imageName).then(fileId => {
      Relay.Store.commitUpdate(
        new UpdateFile({self: this.props.self, fileId}), {
          onSuccess: transaction => {
            let file = transaction.updateFile.file
            file.pxSize = pxSize
            this.setState({
              croppedImage: this.state.croppedImage || file.url,
              files: this.state.files.concat(file),
              sizesRemaining: this.state.sizesRemaining.filter(s=>s!==pxSize)
            })
            if (this.state.sizesRemaining.length) {
              this.picaResize(canvas, this.state.sizesRemaining[0])
            } else {
              let sortedFiles = this.state.files.sort((a,b)=>b.pxSize-a.pxSize)
              this.props.fileSuccess(sortedFiles)
            }
          },
          onFailure: res => console.log('updateFile fail', res)
        }
      )
    })
  }

  picaResize = (canvas, pxSize) => {
    let picaCanvas = document.createElement('canvas')
    picaCanvas.width = Math.min(pxSize, canvas.height)
    picaCanvas.height = Math.min(pxSize, canvas.height)
    pica.resize(canvas, picaCanvas)
      .then(result => pica.toBlob(result, 'image/jpeg'))
      .then(blob => this.sendUpload(canvas, blob, pxSize))
  }

  uploadFull = (pxSize) => {
    this.setState({waiting: true})
    let {image, pixel} = this.state
    let htmlImage = new Image()
    htmlImage.onload = () => {
      console.log({pixel, htmlImage})
      !pixel && console.log('no pixel!', this.state);
      let width = (pixel || {}).width || htmlImage.width
      let height = (pixel || {}).height || htmlImage.height
      let x = (pixel || {}).x || 0
      let y = (pixel || {}).y || 0
      let canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      let c = canvas.getContext('2d')
      c.drawImage(htmlImage, x, y, width, height, 0, 0, width, height)
      canvas.toBlob(blob=>this.sendUpload(canvas, blob, width))
    }
    htmlImage.src = image
  }

  get dropzoneOrCropper () {
    let style = this.state.waiting ? {zValue: -10, opacity: '0', pointer: 'default'} : {}
    // if (this.state.croppedImage) {
      //could createbitmap here to show crop before upload
      // return null
      // return <CroppedImage src={this.state.croppedImage} alt={'project art'} />
    // } else if (this.state.image) {
    if (this.state.image) {
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={style}>
            <ReactCrop
              ref={rCrop => this.internal = rCrop }
              src={this.state.image}
              crop={this.state.crop}
              keepSelection={true}
              onImageLoaded={(image)=>{
                //incorrect img size sometimes
                // let pixel = this.internal.getPixelCrop(this.state.crop)
                // console.log({pixel});
                // pixel.height = pixel.width
                // this.setState({pixel})
              }}
              onComplete={(crop, pixel)=>{
                this.setState({ crop, pixel })
                console.log('complete state', this.state);
              }}
            />
          </div>
          {this.state.waiting && <Loading hideBg/>}
          <Button
            label="Save"
            onClick={this.uploadFull}
            primary
            disabled={!this.state.pixel || this.state.waiting}
            style={{alignSelf: 'center', margin: '10px'}}
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
      <ImageDropContainer image={this.state.image} >
        {this.dropzoneOrCropper}
      </ImageDropContainer>
    )
  }
}
