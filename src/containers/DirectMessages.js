import React, {Component} from 'react'
import Relay from 'react-relay'
import TextField from 'material-ui/TextField'
import CreateMessage from 'mutations/CreateMessage'
import {SubscriptionClient} from 'subscriptions-transport-ws'
import {BtMessage, MsgsContainer} from 'styled'
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
  }

  formatMessages = () => {
    let msgList = this.state.messages.map(msg => {
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
    })
    return msgList
  }

  render() {
    console.log(this.state.messages, this.props.viewer.user.id)
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        <BtMessages msgList={this.formatMessages()} />
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
             first: 20
             orderBy: id_ASC
             filter: {
               sender: {
                 handle: "lyricandthewhoopingcranes"
               }
             }
           ) {
             edges {
               node {
                 id
                 text
                 createdAt
                 sender {
                   id
                   handle
                   portrait { url }
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
             first: 20
             orderBy: id_ASC
             filter: {
               sender: {
                 handle: "subliminal_lime"
               }
             }
           ) {
             edges {
               node {
                 id
                 text
                 createdAt
                 sender {
                   id
                   handle
                   portrait { url }
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
