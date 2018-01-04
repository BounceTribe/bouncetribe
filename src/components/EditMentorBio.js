import React, {Component} from 'react'
import {TextField} from 'material-ui/'
import ReactPlayer from 'react-player'
import {mapNodes} from 'utils/mapNodes'
import {Col, Row} from 'styled'
import {EditCol} from 'styled/MentorProfile'
import {getAllSpecialties} from 'utils/graphql'
import {Async} from 'react-select'


export default class EditMentorBio extends Component {
// TODO: look up cascading qualificaitons BtTagList
// TODO: embed preview
  constructor(props) {
    super(props)
    // this.state = {
    //   summaryError: '',
    //   summary: this.props.summary,
    //   videoUrl: this.props.videoUrl,
    //   occupation: this.props.occupation,
    //   qualifications: this.props.qualifications,
    //   firstName: this.props.firstName,
    //   lastName: this.props.lastName,
    // }
  }

  loadSpecialties = () => new Promise((resolve, reject) =>
    getAllSpecialties().then( allSpecialties => {
      let options = allSpecialties.map(specialty=>(
        {value: specialty.id, label: specialty.name}
      ))
      resolve({options})
    })
  )

  summarySet = (val) => {
    console.log('summary', val, val.length);
    let error = ''
    if (val.split(/\r\n|\r|\n/).length > 15) error='Too many lines'
    if (val.length > 400) error='500 character limit exceeded'
    this.props.setState({summary: val, summaryError: error})
  }

  textFields = () => {
    return (
      <Col>
        {/* <TextField
          floatingLabelText={'Website'}
          value={website || ''}
          onChange={(e)=>this.props.setState({website: e.target.value})}
        />
        <TextField
          floatingLabelText={'YouTube URL'}
          value={mediaUrls[0] || ''}
          onChange={(e)=>{
            let newLinks = [...mediaUrls]
            newLinks[0] = e.target.value
            this.props.setState({mediaUrls: newLinks})
          }}
        />
        <TextField
          floatingLabelText={'SoundCloud URL'}
          value={mediaUrls[1] || ''}
          onChange={(e)=>{
            let newLinks = [...mediaUrls]
            console.log({newLinks});
            newLinks[1] = e.target.value
            this.props.setState({mediaUrls: newLinks})
          }}
        />
        <TextField
          floatingLabelText={'BeatPort URL'}
          value={mediaUrls[2] || ''}
          onChange={(e)=>{
            let newLinks = [...mediaUrls]
            newLinks[2] = e.target.value
            this.props.setState({mediaUrls: newLinks})
          }}
        /> */}

      </Col>
    )
  }

  update = () => {
    this.props.summaryError && this.props.update(this.state)
  }

  render() {
    console.log('rendering bio', this);
    return (
      <Row>
        <EditCol>
          <TextField
            floatingLabelText={'First Name'}
            value={this.props.firstName || ''}
            onChange={(e)=>this.props.setState({firstName: e.target.value})}
            fullWidth
          /><br />
          <TextField
            floatingLabelText={'Last Name (optional)'}
            value={this.props.lastName || ''}
            onChange={(e)=>this.props.setState({lastName: e.target.value})}
            fullWidth
          /><br />
          <TextField
            floatingLabelText={'Current Occupation'}
            value={this.props.occupation || ''}
            onChange={(e)=>this.props.setState({occupation: e.target.value})}
            fullWidth
          />
          <TextField
            floatingLabelText={'Education/Qualifications'}
            value={this.props.qualifications || ''}
            onChange={(e)=>this.props.setState({qualifications: e.target.value})}
            fullWidth
          />
          <TextField
            floatingLabelText={'Summary'}
            errorText={this.props.summaryError}
            value={this.props.summary || ''}
            onChange={(e)=>this.summarySet(e.target.value)}
            multiLine
            rowsMax={5}
            fullWidth
          /><br />
          <TextField
            floatingLabelText={'Video URL'}
            value={this.props.videoUrl || ''}
            onChange={(e)=>this.props.setState({videoUrl: e.target.value})}
            fullWidth
          />
          {/* {this.props.videoUrl && <ReactPlayer url={this.props.videoUrl} />} */}
        </EditCol>
        <EditCol>
          <Async
            loadOptions={this.loadSpecialties}
            value={this.props.specialties}
            onChange={val=>this.props.setState({ specialties: val.map(x=>x.value) })}
            multi
            className={'async'}
            placeholder={'Specialties'}
            style={{margin: '4px 0 8px 0'}}
          />
        </EditCol>
      </Row>
    )
  }
}
