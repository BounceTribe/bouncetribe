import React, {Component} from 'react'
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import {grey200, purple, grey700, blue} from 'theme'
import Avatar from 'material-ui/Avatar'
// import Toggle from 'material-ui/Toggle'


class ProjectTribeList extends Component {

  state = {
    selections: [],
    showAll: true,
  }



  toggleSelection = (handle) => {
    if (this.props.selection === handle) {

      this.setState({
        selections: []
      })
      this.props.handleSelection(false)
    } else {

      this.props.handleSelection(handle)
    }


  }


  componentWillReceiveProps (newProps) {
      if (!newProps.router.location.query.in) {
        this.setState({
          selections: []
        })
      }
  }

  nestedItems = () => {
    let uniqueAuthorIds = []
    let uniqueAuthors = []


    let comments = this.props.project.comments.edges.map((edge) => {
      return edge.node
    })


    comments.forEach( (comment) => {
      if (!uniqueAuthorIds.includes(comment.author.id) && !comment.session){
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
          leftAvatar={
            <Avatar
              src={author.portrait.url}
              style={{
                objectFit: 'cover'
              }}
            />
          }
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


  sessionCommentAuthors = () => {
    let uniqueAuthorIds = []
    let uniqueAuthors = []


    let comments = this.props.project.comments.edges.map((edge) => {
      return edge.node
    })


    comments.forEach( (comment) => {
      if (!uniqueAuthorIds.includes(comment.author.id) && comment.session){
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
          leftAvatar={
            <Avatar
              src={author.portrait.url}
              style={{
                objectFit: 'cover'
              }}
            />
          }
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
    let sessionCommentAuthors = this.sessionCommentAuthors()
    return (
      <List
        style={{
          width: '100%',
          border: `.5px solid ${grey200}`,
          borderRadius: `6px`,
          display: (this.props.recentCommenters.length > 0) ? '' : 'none'
        }}
      >
        {/* <ListItem
          primaryText={(this.state.showAll) ? 'Showing all' : 'Hiding all'}
          rightToggle={
            <Toggle
              toggled={this.state.showAll}
              onToggle={(e, value)=>{
                let {title, creator} = this.props.project
                if (value) {
                  this.props.router.replace({
                    pathname: `/${creator.handle}/${title}/view`,
                  })
                } else {
                  this.props.router.replace({
                    pathname: `/${creator.handle}/${title}/view`,
                  })
                }
              }}
            />
          }
        />
        <Divider/> */}
        <ListItem
          primaryText={'Tribe Members'}
          style={{
            fontSize: '16px',
            color: purple,
            display: (nestedItems.length > 0) ? '' : 'none'
          }}
          initiallyOpen={true}
          nestedItems={nestedItems}
        />


        <Divider
          style={{
            display: (this.props.self.id === this.props.project.creator.id && nestedItems.length > 0) ? '' : 'none'
          }}
        />
        <ListItem
          primaryText={'Session Feedback'}
          style={{
            fontSize: '16px',
            color: blue,
            display: (this.props.self.id === this.props.project.creator.id && sessionCommentAuthors.length > 0) ? '' : 'none'
          }}
          initiallyOpen={true}
          nestedItems={sessionCommentAuthors}
        />
      </List>
    )
  }
}

export default ProjectTribeList
