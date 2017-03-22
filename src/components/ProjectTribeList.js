import React, {Component} from 'react'
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import {grey200, purple, blue} from 'theme'
import Avatar from 'material-ui/Avatar'
import Toggle from 'material-ui/Toggle'


class ProjectTribeList extends Component {

  state = {
    selections: [],
    showAll: true
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
          in: selections,
          showAll: false
        }
      })
      return {
        selections
      }
    })
  }


  nestedItems = () => {
    return this.props.recentCommenters.map(recent => {
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
  }

  componentWillReceiveProps(nextProps) {
    let {query} = nextProps.router.location
    if (query.showAll === 'false') {
      this.setState({
        showAll: false
      })
    } else {
      this.setState({
        showAll: true
      })
    }
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
          primaryText={(this.state.showAll) ? 'Showing all' : 'Hiding all'}
          rightToggle={
            <Toggle
              toggled={this.state.showAll}
              onToggle={(e, value)=>{
                let {title, creator} = this.props.project
                if (value) {
                  this.props.router.replace({
                    pathname: `/${creator.handle}/${title}`,
                  })
                } else {
                  this.props.router.replace({
                    pathname: `/${creator.handle}/${title}/`,
                    query: {
                      in: this.state.selections,
                      showAll: false
                    }
                  })
                }
              }}
            />
          }
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
