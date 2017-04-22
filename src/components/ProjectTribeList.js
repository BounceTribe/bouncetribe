import React, {Component} from 'react'
import {List, ListItem} from 'material-ui/List'
// import Divider from 'material-ui/Divider'
import {grey200, purple, grey700} from 'theme'
import Avatar from 'material-ui/Avatar'
// import Toggle from 'material-ui/Toggle'


class ProjectTribeList extends Component {

  state = {
    selections: [],
    showAll: true
  }

  componentWillMount () {
    // let {query} = this.props.router.location
    // let selections = []
    // if (Array.isArray(query.in)) {
    //   selections.push(...query.in)
    // } else if (typeof query.in === 'string') {
    //   selections.push(query.in)
    // }
    // this.setState({selections})
    if (this.props.router.location.query.in) {
      this.setState({selections: [this.props.router.location.query.in]})
    }
  }

  toggleSelection = (handle) => {
    // let {title, creator} = this.props.project
    if (this.state.selections.includes(handle)) {
      // this.props.router.replace({
      //   pathname: `/${creator.handle}/${title}/view`
      // })
      this.setState({
        selections: []
      })
    } else {
      // this.props.router.replace({
      //   pathname: `/${creator.handle}/${title}/view`,
      //   query: {
      //     in: handle
      //   }
      // })
      this.setState({
        selections: [handle]
      })
    }


    // this.setState((prevState) => {
    //   let {selections} = prevState
    //   if (selections.includes(handle)) {
    //     selections = selections.filter((item) => item !== handle )
    //   } else {
    //     selections.push(handle)
    //   }
    //   this.props.router.replace({
    //     pathname: `/${creator.handle}/${title}/`,
    //     query: {
    //       in: selections,
    //       showAll: false
    //     }
    //   })
    //   return {
    //     selections
    //   }
    // })
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

    

    this.props.recentCommenters.forEach( (recent) => {
      if (!uniqueAuthorIds.includes(recent.node.author.id)){
        uniqueAuthorIds.push(recent.node.author.id)
        uniqueAuthors.push(recent)
      }
    })

    return uniqueAuthors.map((recent, index) => {
      let {author} = recent.node
      let {selections} = this.state
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
            color: (selections.includes(author.handle)) ? purple : grey700,
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

  // componentWillReceiveProps(nextProps) {
  //   let {query} = nextProps.router.location
  //   if (query.showAll === 'false') {
  //     this.setState({
  //       showAll: false
  //     })
  //   } else {
  //     this.setState({
  //       showAll: true
  //     })
  //   }
  // }

  render() {
    return (
      <List
        style={{
          width: '100%',
          border: `.5px solid ${grey200}`,
          borderRadius: `6px`
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
            color: purple
          }}
          initiallyOpen={true}
          nestedItems={this.nestedItems()}
        />

        {/*
        <Divider/>
        <ListItem
          primaryText={'Session Feedback'}
          style={{
            fontSize: '16px',
            color: blue
          }}
          initiallyOpen={false}
        /> */}
      </List>
    )
  }
}

export default ProjectTribeList
