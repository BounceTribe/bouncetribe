import React, {Component} from 'react'
import Dialog from 'material-ui/Dialog'
import ImageUploader from 'components/ImageUploader'

export default class ImageEditor extends Component {
  state={hide: false}

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
        style={{
          minHeight: '600px',
          // display: this.state.hide ? 'none' : ''
        }}
        autoScrollBodyContent
      >
        <ImageUploader
          altSizes={this.props.altSizes || []}
          self={this.props.user}
          hide={()=>this.setState({hide: true})}
          fileSuccess={this.props.portraitSuccess}
        />
      </Dialog>
    )
  }
}
