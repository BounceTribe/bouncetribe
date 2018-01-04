import React, {Component} from 'react'
import {TextField} from 'material-ui/'
import {Row} from 'styled'
import {EditCol} from 'styled/MentorProfile'
import {getAllSpecialties} from 'utils/graphql'
import {Async} from 'react-select'
// import 'react-select/dist/react-select.css'

export default class EditMentorBio extends Component {

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
          />
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
            floatingLabelText={'Education / Qualifications'}
            value={this.props.qualifications || ''}
            onChange={(e)=>this.props.setState({qualifications: e.target.value})}
            fullWidth
          />
          <TextField
            floatingLabelText={'Video URL'}
            value={this.props.videoUrl || ''}
            onChange={(e)=>this.props.setState({videoUrl: e.target.value})}
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
