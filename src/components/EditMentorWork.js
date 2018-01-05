import React, {Component} from 'react'
import {TextField, Checkbox} from 'material-ui/'
import {Row} from 'styled'
import {EditCol, EditWorkText} from 'styled/MentorProfile'

export default class EditMentorWork extends Component {

  getProjectCheckboxes = () => (
    this.props.userProjects.map((project, index) => {
      return <Checkbox
        key={index}
        label={project.title}
        checked={this.props.projectsIds.includes(project.id)}
        style={{padding: '5px 0', fontWeight: '300'}}
        labelStyle={{color:'#777777', fontSize: '17px'}}
        onCheck={ (e, isChecked) => {
          let projectsIds = isChecked ?
          this.props.projectsIds.concat(project.id)
          : this.props.projectsIds.filter(id => id!==project.id)
          this.props.setState({ projectsIds })
        }}
      />
    }
    )
  )

  render() {
    return (
      <Row>
        <EditCol>
          <TextField
            floatingLabelText={'SoundCloud Page URL'}
            value={this.props.mediaUrls[0] || ''}
            onChange={(e)=>{
              let newLinks = [...this.props.mediaUrls]
              console.log({newLinks});
              newLinks[0] = e.target.value
              this.props.setState({mediaUrls: newLinks})
            }}
          />
          <TextField
            floatingLabelText={'YouTube Channel URL'}
            value={this.props.mediaUrls[1] || ''}
            onChange={(e)=>{
              let newLinks = [...this.props.mediaUrls]
              newLinks[1] = e.target.value
              this.props.setState({mediaUrls: newLinks})
            }}
          />
          <TextField
            floatingLabelText={'BeatPort Page URL'}
            value={this.props.mediaUrls[2] || ''}
            onChange={(e)=>{
              let newLinks = [...this.props.mediaUrls]
              newLinks[2] = e.target.value
              this.props.setState({mediaUrls: newLinks})
            }}
          />
        </EditCol>
        <EditCol>
          <EditWorkText>My BounceTribe Projects</EditWorkText>
          {this.getProjectCheckboxes()}
        </EditCol>
      </Row>
    )
  }
}
