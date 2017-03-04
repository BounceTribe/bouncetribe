import React, {Component} from 'react'
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import {grey200, purple, blue} from 'theme'
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


  nestedItems = () => {
    let recentIds = this.props.recentCommenters.map(recent=>recent.node.author.id)
    let recents = this.props.recentCommenters.map(recent => {
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
            color: (selections.includes(author.handle)) ? purple : '',
          }}
          innerDivStyle={{
            marginLeft: '0px',
            fontSize: '14px',
            fontWeight: '400'
          }}
          onClick={()=>{this.toggleSelection(author.handle)}}
        />
      )
    })
    let all = this.props.tribe.map(friend => {
      let {handle, id, portrait} = friend.node
      let {selections} = this.state
      if (recentIds.includes(id)) {
        return null
      } else {
        return (
          <ListItem
            key={`tribe${id}`}
            style={{
              color: (selections.includes(handle)) ? purple : '',
            }}
            innerDivStyle={{
              marginLeft: '0px',
              fontSize: '14px',
              fontWeight: '400'

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
      }
    })
    return [...recents, ...all]
  }

  render() {
    return (
      <List
        style={{
          width: '100%',
          border: `.5px solid ${grey200}`,
          borderRadius: `6px`
        }}
      >
        <ListItem
          primaryText={'Show / Hide all'}
          rightToggle={<Toggle/>}
        />
        <Divider/>
        <ListItem
          primaryText={'Tribe Members'}
          style={{
            fontSize: '16px',
            color: purple
          }}
          initiallyOpen={true}
          nestedItems={this.nestedItems()}
        />
        <Divider/>
        <ListItem
          primaryText={'Session Feedback'}
          style={{
            fontSize: '16px',
            color: blue
          }}
          initiallyOpen={false}
        />
      </List>
    )
  }
}

export default ProjectTribeList
