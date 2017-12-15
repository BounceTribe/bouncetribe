import React, {Component} from 'react'
import Dialog from 'material-ui/Dialog'
import ImageUploader from 'components/ImageUploader'

export default class ImageEditor extends Component {

  // state={waiting: false}

  render() {
    return (
      <Dialog
        title={'Upload Your Image'}
        open={this.props.open}
        onRequestClose={this.props.onRequestClose}
        contentStyle={{
          height: '800px',
          width: '800px',
          minHeight: '600px'
        }}
        style={{minHeight: '600px',}}
        autoScrollBodyContent
      >
        <ImageUploader
          altSizes={this.props.altSizes || []}
          self={this.props.user}
          fileSuccess={this.props.portraitSuccess}
          // waiting={(val)=>this.setState({waiting: val})}
        />
      </Dialog>
    )
  }
}
