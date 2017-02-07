import React, {Component} from 'react'
import Relay from 'react-relay'
import {DropContainer} from 'styled'
import Dropzone from 'react-dropzone'
import uploadFile from 'utils/uploadFile'
import createVisualization from 'utils/createVisualization'
import UpdateFile from 'mutations/UpdateFile'

class AudioUploader extends Component {

  onAudioDrop = (files, rejectedFile) => {
    let file = files[0]

    let title = ''

    if (file.name.split('.')[0]) {
      title = file.name.split('.')[0]
    }

    this.props.audioDropped({
      audioProgress: 'GENERATING',
      title
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
                audioProgress: 'UPLOADING',
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


  render () {
    return (
      <DropContainer>
        <Dropzone
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
          }}
          multiple={false}
          accept={'audio/*'}
          maxSize={15000000}
          onDrop={this.onAudioDrop}
        >

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
