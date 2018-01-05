import React, {Component} from 'react'
import {Row} from 'styled'
import {EditCol} from 'styled/MentorProfile'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
// import 'react-select/dist/react-select.css'


export default class EditMentorWork extends Component {

  handleChange = (updatedFieldObj) => {
    let updatedPackage = Object.assign({
      ...this.props.package1
    }, {
      ...updatedFieldObj
    })
    console.log({updatedPackage});
    this.props.setState(updatedPackage)
  }
  render() {
    console.log('rendering work', this);
    return (
      <Row>
        <EditCol>
          <SelectField
            fullWidth
            floatingLabelText={'Average Response Time'}
            value={this.props.package1.responseHours}
            onChange={(e,i,val) => this.handleChange({responseHours: val})}
            placeholder={''}
          >
            <MenuItem value={24} primaryText={'Less than 24 hours' } />
            <MenuItem value={48} primaryText={'2-3 days' } />
            <MenuItem value={96} primaryText={'4-7 days' } />
          </SelectField>

          <SelectField
            fullWidth
            floatingLabelText={'# of Project Reviews per month'}
            value={this.props.package1.reviewsPerMonth}
            onChange={(e,i,val) => this.handleChange({reviewsPerMonth: val})}
          >
            <MenuItem value={1} primaryText={1} />
            <MenuItem value={2} primaryText={2} />
            <MenuItem value={3} primaryText={3} />
            <MenuItem value={4} primaryText={4} />
            <MenuItem value={5} primaryText={5} />
            <MenuItem value={6} primaryText={6} />
          </SelectField>
          <SelectField
            fullWidth
            floatingLabelText={'# of 30 Minute Video Chat Sessions per month'}
            value={this.props.package1.videoChatsPerMonth}
            onChange={(e,i,val) => this.handleChange({videoChatsPerMonth: val})}
          >
            <MenuItem value={1} primaryText={1} />
            <MenuItem value={2} primaryText={2} />
            <MenuItem value={3} primaryText={3} />
            <MenuItem value={4} primaryText={4} />
            <MenuItem value={5} primaryText={5} />
          </SelectField>

          <Checkbox
            label={'Career Strategizing'}
            checked={this.props.package1.careerStrategizing}
            style={{padding: '10px 0'}}
            onCheck={ (e, isChecked) =>
              this.handleChange({careerStrategizing: isChecked})}
          />
          <Checkbox
            label={'Help Mixing/Mastering'}
            checked={this.props.package1.mixingMasteringHelp}
            style={{padding: '10px 0'}}
            onCheck={ (e, isChecked) =>
              this.handleChange({mixingMasteringHelp: isChecked})}
          />
          <Checkbox
            label={'Introductions to Personal Network'}
            checked={this.props.package1.introductionsToNetwork}
            style={{padding: '10px 0'}}
            onCheck={ (e, isChecked) =>
              this.handleChange({introductionsToNetwork: isChecked})}
          />

          <SelectField
            fullWidth
            floatingLabelText={'My Monthly Rate'}
            value={this.props.package1.monthlyRate}
            onChange={(e,i,val) => this.handleChange({monthlyRate: val})}
          >
            <MenuItem value={30} primaryText={'$29.99'} />
            <MenuItem value={50} primaryText={'$49.99'} />
            <MenuItem value={80} primaryText={'$79.99'} />
            <MenuItem value={100} primaryText={'$99.99'} />
            <MenuItem value={120} primaryText={'$119.99'} />
            <MenuItem value={150} primaryText={'$149.99'} />
            <MenuItem value={200} primaryText={'$199.99'} />
            <MenuItem value={300} primaryText={'$299.99'} />
          </SelectField>
        </EditCol>
        <EditCol>
        </EditCol>
      </Row>
    )
  }
}
