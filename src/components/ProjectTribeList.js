import React, {Component} from 'react'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'

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


  render() {
    return (
      <List>
        <ListItem
          primaryText={'Show all'}
        />
        <ListItem
          primaryText={'Hide all'}
        />
        <Divider/>
        <Subheader>
          Trime Members
        </Subheader>
        <ListItem
          primaryText={'Recent'}
          open={true}
          nestedItems={
            this.props.recentCommenters.map(recent => (
              <ListItem
                key={recent.node.author.id}
                primaryText={recent.node.author.handle}
              />
            ))
          }
        />
        <ListItem
          primaryText={'All'}
          open={true}
          nestedItems={
            this.props.tribe.map(friend => {
              let {handle, id} = friend.node
              let {selections} = this.state
              return (
                <ListItem
                  key={id}
                  style={{
                    backgroundColor: (selections.includes(handle)) ? 'lightblue' : ''
                  }}
                  onClick={()=> {
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
                  }}
                  primaryText={handle}
                />
              )
            })
          }
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
