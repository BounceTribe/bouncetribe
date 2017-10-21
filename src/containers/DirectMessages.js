import React, {Component} from 'react'
import Relay from 'react-relay'

import TextField from 'material-ui/TextField'
import CreateMessage from 'mutations/CreateMessage'
import {SubscriptionClient} from 'subscriptions-transport-ws'
import {BtMessages} from 'components/BtMessages'
import * as moment from 'moment'

class DirectMessages extends Component {

  constructor(props) {
    super(props)
    this.feedSub = new SubscriptionClient(
      'wss://subscriptions.graph.cool/v1/bt-api',
      { reconnect: true, }
    )
    this.state = {
      active: [],
      received: [],
      sent: [],
      newMessages: [],
      message: '',
      new: []
    }

    this.feedSub.subscribe(
      {
        query: /* GraphQL */`subscription createMessage {
          Message (
            filter: { mutation_in: [CREATED] }
          ) {
            node {
              sender {
                id
                handle
                portrait { url }
              }
              recipient {
                id
                handle
              }
              text
              id
              createdAt
            }
          }
        }`
      }, (error, result) => {
        if (result) {
          let newMessage = result.Message
          this.setState( (prevState) => {
            let {newMessages} = prevState
            newMessages.unshift(newMessage)
            return { newMessages }
          } )
        }
      }
    )
  }

  prepMessages = (list) => {
    return this.temporaryFilter(list).sort((a, b) => {
      let dateA = new Date(a.node.createdAt)
      let dateB = new Date(b.node.createdAt)
      return dateB - dateA
    })
  }
  // componentDidMount(){
  //   console.log('MOUNTED, user - ', this.props.viewer.User.handle);
  // }

  componentDidUpdate () {
    if (this.state.message==='') {
      this.msgsEnd.scrollIntoView({ behaviour: 'smooth' })
    }
  }

  temporaryFilter = (msgList) => {
    let userId = this.props.viewer.user.id
    let theirId = this.props.viewer.User.id
    return msgList.filter(msg =>
      (msg.node.sender.id===userId && msg.node.recipient.id===theirId) ||
      (msg.node.sender.id===theirId && msg.node.recipient.id===userId)
    )
  }

  formatMessages = (list) => {
    let msgList = this.prepMessages(list)
    msgList = msgList.map(msg => {
      msg = msg.node
      let time
      let created = moment.default(msg.createdAt)
      if (created.add(1, 'days') > moment.now()) {
        time = created.subtract(1, 'days').format('h:mm a')
      } else {
        time = created.subtract(1, 'days').format('MMMM Do h:mm a')
      }
      msg.time = time;
      msg.isSender = (msg.sender.id===this.props.viewer.user.id)
      return msg
    } )
    return msgList
  }

  msgKeyDown = (e) => {
    if (e.keyCode===13 && !e.shiftKey && this.state.message) {
      e.preventDefault()
      let savedText = this.state.message
      this.setState({message: ''})
      this.props.relay.commitUpdate(
        new CreateMessage({
          text: savedText,
          senderId: this.props.viewer.user.id,
          recipientId: this.props.viewer.User.id
        }), {
          onSuccess: (success) => { console.log('send success') },
          onFailure: (failure) => {
            console.log('message send fail', failure);
            this.setState({message: savedText})
          }
          //display error message in snackbar?
        }
      )
    }
  }

  render() {
    let theirMessages = this.props.viewer.User.receivedMessages.edges
    let userMessages = this.props.viewer.user.receivedMessages.edges
    console.log('new', this.state.newMessages);
    let messages = theirMessages.concat(userMessages).concat(this.state.newMessages)
    let scrollPlaceholder =
      <div style={{ float:"left", clear: "both" }}
        ref={(el) => this.msgsEnd = el} />
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'flex-end'
      }}>
        <BtMessages
          msgList={this.formatMessages(messages)}
          lastEl={scrollPlaceholder}
        />
        <TextField
          fullWidth
          multiLine
          name="message"
          style={{display: 'flex', padding: '0 15px 0 15px'}}
          underlineShow={false}
          hintText={'Your message...'}
          value={this.state.message}
          onChange={(e)=>this.setState({message: e.target.value})}
          onKeyDown={(e)=>{this.msgKeyDown(e)}}
        />
      </div>
    )
  }
}

export default Relay.createContainer( DirectMessages, {
   initialVariables: { userHandle: '' },
   fragments: { viewer: () => Relay.QL`
       fragment on Viewer {
         user {
           id
           handle
           score
           portrait { url }
           receivedMessages (
             first: 999
             orderBy: id_ASC
           ) {
             edges {
               node {
                 id
                 text
                 createdAt
                 sender {
                   id
                   handle
                 }
                 recipient {
                   id
                   handle
                 }
               }
             }
           }
         }
         User (handle: $userHandle) {
           id
           handle
           portrait { url }
           receivedMessages (
             first: 999
             orderBy: id_ASC
           ) {
             edges {
               node {
                 id
                 text
                 createdAt
                 sender {
                   id
                   handle
                 }
                 recipient {
                   id
                   handle
                 }
               }
             }
           }
         }
       }
     `,
   },
 }
)
