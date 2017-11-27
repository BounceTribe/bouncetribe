import React, {Component} from 'react'
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import {grey200, purple, grey700} from 'theme'
import Avatar from 'material-ui/Avatar'
import {url} from 'config'

class ProjectTribeList extends Component {

  state = {
    selections: [],
    showAll: true,
  }

  toggleSelection = (handle) => {
    if (this.props.selection === handle) {
      this.setState({ selections: [] })
      this.props.handleSelection(false)
    } else {
      this.props.handleSelection(handle)
    }
  }

  componentWillReceiveProps (newProps) {
    if (!newProps.router.location.query.in) {
      this.setState({ selections: [] })
    }
  }

  nestedItems = () => {
    let uniqueAuthorIds = []
    let uniqueAuthors = []

    let comments = this.props.project.comments.edges.map(edge => edge.node)
    comments.forEach( (comment) => {
      if (!uniqueAuthorIds.includes(comment.author.id)){
        uniqueAuthorIds.push(comment.author.id)
        uniqueAuthors.push(comment)
      }
    })

    return uniqueAuthors.map((recent, index) => {
      let {author} = recent
      return (
        <ListItem
          key={index}
          primaryText={author.handle}
          leftAvatar={   <Avatar
              src={author.portrait ? author.portrait.url : `${url}/logo.png`}
              style={{ objectFit: 'cover' }}
            /> }
          style={{
            color: (this.props.selection === author.handle) ? purple : grey700,
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

  render() {
    let nestedItems = this.nestedItems()
    if (nestedItems.length===0) {
      return null
    } else return (
      <List
        style={{
          width: '100%',
          border: `1px solid ${grey200}`,
          borderRadius: `6px`,
          marginBottom: '20px',
          display: (this.props.recentCommenters.length > 0) ? '' : 'none'
        }}
      >
        <ListItem
          primaryText={'Feedback Contributors'}
          style={{
            fontSize: '16px',
            color: purple,
            // display: (nestedItems.length > 0) ? '' : 'none'
          }}
          initiallyOpen={true}
          nestedItems={nestedItems}
        />
        <Divider
          style={{
            display: (this.props.self.id === this.props.project.creator.id) ? '' : 'none'
          }}
        />
      </List>
    )
  }
}

export default ProjectTribeList
