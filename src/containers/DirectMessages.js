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
    // this.messages = this.props.viewer.allMessages.edges.map(edge=>edge.node)
    let savedText = JSON.parse(localStorage.getItem('message')) || {}
    let useSaved =  this.props.params.theirHandle===savedText.forHandle
      this.state = {
        active: [],
        received: [],
        sent: [],
        newMessages: JSON.parse(localStorage.getItem('newMessages')) || [],
        message: useSaved ? savedText.text : '',
        new: []
      }
    console.log('dm mount', this)

    this.feedSub.subscribe( {
        query: /* GraphQL */`subscription createMessage {
          Message (
            filter: {
              # OR: [ {
              #   mutation_in: [CREATED]
              #   node: {
              #     recipient: {id: "${this.props.viewer.User.id}"}
              #     sender: { id: "${this.props.viewer.user.id}"}
              #   }
              # },
              # {
                mutation_in: [CREATED]
                node: {
                  recipient: { id: "${this.props.viewer.user.id}"}
                  sender: {id: "${this.props.viewer.User.id}"}
                }
            #   }
            # ]
           }
          ) {
            node {
              sender { id }
              recipient { id }
              text
              id
              createdAt
            }
          }
        }`
      }, (error, result) => {
        console.log('feedsub error or result', error, result)
        if (result) {
          let newMessage = result.Message.node
          // let isSender = newMessage.sender.id===this.props.viewer.user.id
          this.setState({
            newMessages: this.state.newMessages.concat([newMessage]),
            // message: isSender ? '' : this.state.message
          })
        }
      }
    )
  }

  componentWillUnmount() {
    // console.log('unmounting', this.props)

    let otherNew = localStorage.getItem('newMessages') || []
    this.state.newMessages.length && localStorage.setItem('newMessages', JSON.stringify(this.state.newMessages.concat(otherNew)))
    //TODO make array of message saves
    this.state.message && localStorage.setItem('message', JSON.stringify({
      text: this.state.message,
      forHandle: this.props.viewer.User.handle
    }))
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.theirHandle!==this.props.params.theirHandle) {
      this.setState({message: ''})
    }
    if (this.state.message==='') {
      this.msgsEnd.scrollIntoView({ behaviour: 'smooth', block: 'nearest' })
    }
  }

  sortMessages = (list) => {
    return list.sort((a, b) => {
      let dateA = new Date(a.createdAt)
      let dateB = new Date(b.createdAt)
      return dateB - dateA
    })
  }

  storedMsgsFilter = (msgList) => {
    let userId = this.props.viewer.user.id
    let theirId = this.props.viewer.User.id
    return msgList.filter(msg =>
      (msg.sender.id===userId && msg.recipient.id===theirId) ||
      (msg.sender.id===theirId && msg.recipient.id===userId)
    )
  }


  formatMessages = (list) => {
    let msgList = this.sortMessages(list)
    msgList = msgList.map(msg => {
      let time
      let created = moment.default(msg.createdAt)
      if (created.add(1, 'days') > moment.now()) {
        time = created.subtract(1, 'days').format('h:mm a')
      } else {
        time = created.subtract(1, 'days').format('MMMM Do h:mm a')
      }
      if (!msg) {
        debugger
      }
      msg.time = time;
      msg.receiving = (msg.sender.id!==this.props.viewer.user.id)
      return msg
    } )
    return msgList
  }

  msgKeyDown = (e) => {
    if (e.keyCode===13 && !e.shiftKey) {
      e.preventDefault()
      if (this.state.message) {
        let savedText = this.state.message
        this.setState({message: ''})
        this.props.relay.commitUpdate(
          new CreateMessage({
            text: savedText,
            senderId: this.props.viewer.user.id,
            recipientId: this.props.viewer.User.id
          }), {
            onSuccess: (success) => {
              console.log('send success', success)
              this.setState({
                newMessages: this.state.newMessages.concat(success.createMessage.message),
              })
          },
            onFailure: (failure) => {
              console.log('message send fail', failure);
              this.setState({message: savedText})
            }
          }
        )
      }
    }
  }

  render() {
    let messages = this.props.viewer.allMessages.edges.map(edge=>edge.node)
    .concat(this.storedMsgsFilter(this.state.newMessages))
    messages = [...new Set(messages)]
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
        <div style={{padding: '0 15px'}}>
          <TextField
            fullWidth
            multiLine
            rowsMax={5}
            name="message"
            style={{display: 'flex', flexDirection: 'column-reverse'}}
            underlineShow={false}
            hintText={'Your message...'}
            value={this.state.message}
            onChange={(e)=>this.setState({message: e.target.value})}
            onKeyDown={(e)=>{this.msgKeyDown(e)}}
          />
        </div>
      </div>
    )
  }
}
//look into forceFetch/setVariables instead of localstorage
export default Relay.createContainer( DirectMessages, {
  initialVariables: { theirHandle: '', userHandle: '', messageFilter: {}, },
  prepareVariables: (urlParams) => {
    return {
      ...urlParams,
      messageFilter: { OR:
        [ {
          sender: { handle: urlParams.theirHandle },
          recipient: { handle: urlParams.userHandle },
        }, {
          recipient: { handle: urlParams.theirHandle },
          sender: { handle: urlParams.userHandle },
        }
      ] }
    }
  },
  fragments: { viewer: () => Relay.QL`
    fragment on Viewer {
      allMessages(
        first: 999
        filter: $messageFilter
      ) {
        edges {
          node {
            id
            text
            createdAt
            sender {id,  handle}
            recipient {id, handle}
          }
        }
      }
      user {
        id
        handle
        score
        portrait { url }
      }
      User (handle: $theirHandle) {id, handle}
    }
    `,
  },
})
