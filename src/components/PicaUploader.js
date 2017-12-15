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
import pica from 'pica/dist/pica'
// import FileUploadThumbnail from 'file-upload-thumbnail'

export default class ImageUploader extends Component {
  constructor(props){
    super()
    this.state = {
      image: false,
      croppedImage: false,
      correctAspect: false,
      imageName: '',
      pixel: null,
      files: [],
      sizesRemaining: props.altSizes,
      crop: { aspect: 1/1, x: 0, y: 0, width: 100 }
    }
    console.log('pica,', pica);
  }

  componentDidMount() {console.log('altSizes', this.props.altSizes)}

  onImageDrop = (files, rejectedFile) =>
    this.setState({ image: files[0].preview, imageName: files[0].name })

    // Resize fro


    ref={(input) => { this.textInput = input }}
    src={this.state.image}
    crop={this.state.crop}
    onImageLoaded={(image)=>{
      let el = this.textInput
        console.log({el});
        if (el.fireEvent) {
          el.fireEvent('onclick');
          console.log('hasclick');
        } else {
          var evObj = document.createEvent('Events');
          evObj.initEvent('click', true, false);
          el.dispatchEvent(evObj);
        }

    }}




















    m Canvas/Image to another Canvas
    pica.resize(from, to, {
      unsharpAmount: 80,
      unsharpRadius: 0.6,
      unsharpThreshold: 2
    })
    .then(result => console.log('resize done!'));

    // Resize & convert to blob
    pica.resize(from, to)
      .then(result => pica.toBlob(result, 'image/jpeg', 90))
      .then(blob => console.log('resized to canvas & created blob!'));

  uploadImage = (pxSize) => {
    let imageName = this.state.imageName
    let {image, pixel} = this.state
    let htmlImage = new Image()
    htmlImage.onload = () => {
      console.log({pixel, htmlImage})
      let width = pixel ? pixel.width : htmlImage.width
      let height = pixel ? pixel.height : htmlImage.height
      let x = pixel ? pixel.x : 0
      let y = pixel ? pixel.y : 0
      window.createImageBitmap(htmlImage, 0, 0, width, height).then(result=>{
        let canvas = document.createElement('canvas')
        canvas.width = pxSize
        canvas.height = pxSize
        let c = canvas.getContext('2d')
        c.drawImage(htmlImage, x, y, width, height, 0, 0, pxSize, pxSize)
        // console.log({canvas});
        canvas.toBlob(blob=>{
          uploadFile(blob, imageName).then(fileId => {
            Relay.Store.commitUpdate(
              new UpdateFile({self: this.props.self, fileId: fileId}), {
                onSuccess: transaction => {
                  let file = transaction.updateFile.file
                  file.pxSize = pxSize
                  this.setState({
                    croppedImage: file.url,
                    files: this.state.files.concat(file),
                    sizesRemaining: this.state.sizesRemaining.filter(s=>s!==pxSize)
                  })
                  if (this.state.sizesRemaining.length) {
                    this.uploadImage(this.state.sizesRemaining[0])
                  } else {
                    let sortedFiles = this.state.files.sort((a,b)=>b.pxSize-a.pxSize)
                    // console.log({sortedFiles});
                    this.props.fileSuccess(sortedFiles)
                  }
                },
                onFailure: res => console.log('updateFile fail', res)
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
      return <CroppedImage src={this.state.croppedImage} alt={'project art'} />
    } else if (this.state.image) {
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <ReactCrop
            src={this.state.image}
            crop={this.state.crop}
            onImageLoaded={(image)=>{
              (image.height===image.width) && this.setState({correctAspect:image.width})
            }}
            keepSelection={true}
            onComplete={(crop, pixel)=>{
              this.setState({ crop, pixel })
              console.log('complete state', this.state);
            }}
          />
          <Button
            label="Save"
            onClick={()=>{
              this.props.hide()
              this.uploadImage(this.state.correctAspect || this.state.pixel.width)}}
            primary
            style={{alignSelf: 'center', margin: '10px'}}
            disabled={!(this.state.pixel || this.state.correctAspect)}
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
