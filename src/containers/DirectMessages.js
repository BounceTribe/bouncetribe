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
    // let savedText = JSON.parse(localStorage.getItem('message')) || {}
    // let useSaved =  this.props.params.userHandle===savedText.forHandle
      this.state = {
        active: [],
        received: [],
        sent: [],
        // newMessages: JSON.parse(localStorage.getItem('newMessages')) || [],
        newMessages: [],
        message: '',
        // message: useSaved ? savedText.text : '',
        new: []
      }
    console.log('dm mount', this.props.viewer)

    this.feedSub.subscribe(
      {
        query: /* GraphQL */`subscription createMessage {
          Message (
            filter: {
              OR: [ {
                mutation_in: [CREATED]
                node: {
                  recipient: {id: "${this.props.viewer.User.id}"}
                  sender: { id: "${this.props.viewer.user.id}"}
                }
              },{
                mutation_in: [CREATED]
                node: {
                  recipient: { id: "${this.props.viewer.user.id}"}
                  sender: {id: "${this.props.viewer.User.id}"}
                }
              }
            ]
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
          let newMessage = result.Message
          let isSender = newMessage.node.sender.id===this.props.viewer.user.id
          this.setState({
            newMessages: this.state.newMessages.concat([newMessage]),
            message: isSender ? '' : this.state.message
          })
        }
      }
    )
  }

  componentWillUnmount() {
    console.log('unmounting', this.props)
    // this.props.viewer.User.handle
    let otherNew = localStorage.getItem('newMessages') || []
    this.state.newMessages.length && localStorage.setItem('newMessages', JSON.stringify(this.state.newMessages.concat(otherNew)))
    this.state.message && localStorage.setItem('message', JSON.stringify({
      text: this.state.message,
      forHandle: this.props.viewer.User.handle
    }))
  }

  // componentWillUpdate(nextProps) {
  //   if (nextProps.params.userHandle!==this.props.params.userHandle) {
  //     this.setState({message: ''})
  //   }
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.params.userHandle!==this.props.params.userHandle) {
      this.setState({message: ''})
    }
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

  prepMessages = (list) => {
    return this.temporaryFilter(list).sort((a, b) => {
      let dateA = new Date(a.node.createdAt)
      let dateB = new Date(b.node.createdAt)
      return dateB - dateA
    })
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
    let theirMessages = this.props.viewer.User.receivedMessages.edges
    let userMessages = this.props.viewer.user.receivedMessages.edges
    let messages = theirMessages.concat(userMessages).concat(this.state.newMessages)
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

export default Relay.createContainer( DirectMessages, {
  initialVariables: {
    userHandle: '',
    projectTitle: '',
    messageFilter: {},
    thisUserHandle: ''
  },
  prepareVariables: (urlParams) => {
    return {
      ...urlParams,
      messageFilter: { OR:
        [ {
          sender: { handle: urlParams.userHandle },
          recipient: { handle: 'subliminal_limee' },
        }, {
          recipient: { handle: urlParams.userHandle },
          sender: { handle: 'subliminal_limee' },
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
})
