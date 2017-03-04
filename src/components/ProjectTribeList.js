import React, {Component} from 'react'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import {grey200} from 'theme'
import Avatar from 'material-ui/Avatar'
import Toggle from 'material-ui/Toggle'

class ProjectTribeList extends Component {

  state = {
    selections: []
  }

  componentWillMount () {
    let {query} = this.props.router.location
    let selections = []
    if (Array.isArray(query.in)) {
      selections.push(...query.in)
    } else if (typeof query.in === 'string') {
      selections.push(query.in)
    }
    this.setState({selections})
  }

  toggleSelection = (handle) => {
    let {title, creator} = this.props.project
    this.setState((prevState) => {
      let {selections} = prevState
      if (selections.includes(handle)) {
        selections = selections.filter((item) => item !== handle )
      } else {
        selections.push(handle)
      }
      this.props.router.replace({
        pathname: `/${creator.handle}/${title}/`,
        query: {
          in: selections
        }
      })
      return {
        selections
      }
    })
  }


  render() {
    return (
      <List
        style={{
          width: '100%',
          border: `.5px solid ${grey200}`,
          borderRadius: `6 px`
        }}
      >
        <ListItem
          primaryText={'Show / Hide all'}
          rightToggle={<Toggle/>}
        />
        <Divider/>
        <ListItem
          primaryText={'TribeMembers'}
          initiallyOpen={true}
          nestedItems={[
            ...this.props.recentCommenters.map(recent => {
              let {author} = recent.node
              let {selections} = this.state
              return (
                <ListItem
                  key={`recent${author.id}`}
                  primaryText={author.handle}
                  leftAvatar={
                    <Avatar
                      src={author.portrait.url}
                    />
                  }
                  style={{
                    backgroundColor: (selections.includes(author.handle)) ? 'lightblue' : ''
                  }}
                  onClick={()=>{this.toggleSelection(author.handle)}}
                />
              )
            }),
            ...this.props.tribe.map(friend => {
              let {handle, id, portrait} = friend.node
              let {selections} = this.state
              return (
                <ListItem
                  key={`tribe${id}`}
                  style={{
                    backgroundColor: (selections.includes(handle)) ? 'lightblue' : ''
                  }}
                  onClick={()=>{this.toggleSelection(handle)}}
                  primaryText={handle}
                  leftAvatar={
                    <Avatar
                      src={portrait.url}
                    />
                  }
                />
              )
            })
          ]}
        />
        <Divider/>
        <Subheader>
          Session Feedback
        </Subheader>
        <Divider/>
      </List>
    )
  }
}

export default ProjectTribeList
