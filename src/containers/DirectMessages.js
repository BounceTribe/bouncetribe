import React, {Component} from 'react'
import Relay from 'react-relay'
import ReactDOM from 'react-dom'

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
      messages: [],
      message: ''
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
            }
          }
        }`
      }, (error, result) => {
        if (result) {
          let newMessage = result.Message
          this.setState( (prevState) => {
            let {messages} = prevState
            messages.push(newMessage)
            return { messages }
          } )
        }
      }
    )
  }

  currentTime = (time) => this.setState({ time })

  componentDidMount(){
    let received = this.props.viewer.user.receivedMessages.edges
    let sent = this.props.viewer.User.receivedMessages.edges
    let messages = received.concat(sent).sort((a, b) => a.node.id - b.node.id)
    this.setState({ messages })
    console.log('DM Mount', this)
    // console.log('btmnessages', <DirectMessages />);
  }

  formatMessages = () => {
    let userId = this.props.viewer.user.id
    let theirId = this.props.viewer.User.id
    let msgList = this.state.messages.filter(msg => {
      return (msg.node.sender.id===userId && msg.node.recipient.id===theirId) ||
      (msg.node.sender.id===theirId && msg.node.recipient.id===userId)}
    )
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
      msg.isSender = (msg.sender.id===userId)
      return msg
    })
    return msgList
  }

  componentDidUpdate () {
    var el = this.refs.wrap;
    el.msgsEnd.scrollIntoView({ behaviour: 'smooth' });
  }


  render() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        <BtMessages ref='wrap' msgList={this.formatMessages()} />
        <TextField
          multiLine
          name="message"
          style={{padding: '0 15px 0 15px'}}
          underlineShow={false}
          hintText={'Your message...'}
          value={this.state.message}
          onChange={(e)=>{ this.setState({message: e.target.value}) }}
          onKeyDown={(e)=>{
            if (e.keyCode === 13 && e.shiftKey!==true) {
              let savedText = this.state.message
              this.setState({message: ''})
              this.props.relay.commitUpdate(
                new CreateMessage({
                  text: savedText,
                  senderId: this.props.viewer.user.id,
                  recipientId: this.props.viewer.User.id
                }), {
                  onSuccess: (success) => { this.setState({message: ''}) },
                  onFailure: (failure) => { this.setState({message: savedText})
                    console.log('message send fail', failure);
                    this.setState({message: savedText})
                  }
                  //display error message in snackbar?
                }
              )
            }
          } }
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
