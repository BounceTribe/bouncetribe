import React, {Component} from 'react'
import Relay from 'react-relay'
import {DropContainer} from 'styled'
import Dropzone from 'react-dropzone'
import uploadFile from 'utils/uploadFile'
import createVisualization from 'utils/createVisualization'
import UpdateFile from 'mutations/UpdateFile'
import UploadTrack from 'icons/UploadTrack'

class AudioUploader extends Component {

  onAudioDrop = (files, rejectedFile) => {

    if (rejectedFile) {
      window.alert("Your file is too large for us to handle! Files must be less than 15mb.")
    } else {
      let file = files[0]

      let title = ''

      if (file.name.split('.')[0]) {
        title = file.name.split('.')[0]
      }

      this.props.audioDropped({
        audioProgress: 'GENERATING',
        title,
        size: file.size
      })
      createVisualization(file).then(visualization=>{
        this.props.audioDropped({
          audioProgress: 'UPLOADING',
          title: false,
        })
        uploadFile(file).then(fileId=>{
          this.props.relay.commitUpdate(
            new UpdateFile({
              self: this.props.self,
              fileId: fileId,
              visualization: visualization
            }), {
              onSuccess: (transaction) => {
                let {file} = transaction.updateFile
                this.props.audioSuccess(file)
                this.props.audioDropped({
                  audioProgress: 'COMPLETE',
                  title: false,
                })
              },
              onFailure: (response) => {
                console.log('updateFile failure', response)
              }
            }
          )
        })
      })
    }



  }


  render () {
    return (
      <DropContainer>
        <Dropzone
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
          multiple={false}
          accept={'audio/*'}
          maxSize={15000000}
          onDrop={this.onAudioDrop}
        >
          <UploadTrack/>
        </Dropzone>
      </DropContainer>
    )
  }
}


export default Relay.createContainer(
  AudioUploader, {
    fragments: {
      self: () => Relay.QL`
        fragment on User {
          id
        }
      `,
    },
  }
)
