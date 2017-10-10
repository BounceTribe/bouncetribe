import React, {Component, PropTypes} from 'react'
import Relay from 'react-relay'
import { MessageContainer, Messages, MessageText, SenderHandle, MessagePortrait, MessageNamePortraitRow, MessageDivider} from 'styled/Sessions'
import TextField from 'material-ui/TextField'
import CreateMessage from 'mutations/CreateMessage'
import {SubscriptionClient} from 'subscriptions-transport-ws'

class DirectMessages extends Component {

  constructor(props) {
    super(props)
    this.feedSub = new SubscriptionClient(
      'wss://subscriptions.graph.cool/v1/bt-api',
      { reconnect: true, }
    )

    this.state = {
      duration: 0,
      active: [],
      messages: []
    }

    this.feedSub.subscribe(
      {
        query: /* GraphQL */`subscription createMessage {
          Message (
            filter: {
              mutation_in: [CREATED]
            }
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



  static childContextTypes = {
    duration: PropTypes.number,
    time: PropTypes.number
  }

  componentWillMount() {
    console.log('DM props', this.props);
    let {edges: messages} = this.props.viewer.user.receivedMessages
    this.setState({ messages })
  }

  getChildContext() {
    return {
      duration: this.state.duration,
      time: this.state.time
    }
  }

  currentTime = (time) => this.setState({ time })

  activate = (index) => {
    this.setState( (prevState) => {
      let {active} = prevState
      active.push(index)
      return {active}
    })
  }
  deactivate = (index) => {
    this.setState( (prevState) => {
      let {active} = prevState
      active.splice(active.indexOf(index),1)
      return {active}
    })
  }

  componentDidMount(){
    console.log('DM props', this.props);
    if (this.props.router.params.tab === 'messages') {
      window.scrollTo(0, document.body.scrollHeight)
    }
  }

  get messages() {
    let messages = []
    this.state.messages.forEach( (message, index) =>{
      if (index === 0) {
        messages.push(
          <MessageNamePortraitRow key={`portrait${message.node.id}`} >
            <MessagePortrait src={message.node.sender.portrait.url} />
            <SenderHandle key={`handle${message.node.id}`} >
              {message.node.sender.handle}
            </SenderHandle>
          </MessageNamePortraitRow>
        )
      } else if (message.node.sender.id !== this.state.messages[index - 1].node.sender.id) {
        messages.push(<MessageDivider key={`portrait${message.node.id}`}/>)
        messages.push(
          <MessageNamePortraitRow key={`portrait${message.node.id}`} >
            <MessagePortrait src={message.node.sender.portrait.url} />
            <SenderHandle key={`handle${message.node.id}`} >
              {message.node.sender.handle}
            </SenderHandle>
          </MessageNamePortraitRow>
        )
      }
      messages.push(
        <MessageText key={`text${message.node.id}`} >
          {message.node.text}
        </MessageText>
      )
    })

    return (<Messages id={'messages'}>{messages}</Messages>)
  }

  render() {
    console.log('DM props', this.props);

    return (
      <MessageContainer>
        {this.messages}
        <TextField
          multiLine
          name="message"
          style={{ width: '95%', margin: '15px 0' }}
          hintText={"Your direct message..."}
          value={this.state.message}
          onChange={(e)=>{ this.setState({message: e.target.value}) }}
          onKeyDown={(e)=>{
            if (e.keyCode === 13) {
              this.props.relay.commitUpdate(
                new CreateMessage({
                  text: this.state.message,
                  senderId: this.props.viewer.user.id,
                  recipientId: this.props.viewer.User.id,
                  sessionParentId: null
                }), {
                  onSuccess: (success) => { this.setState({message: ''}) }
                }
              )
            }
          } }
        />
      </MessageContainer>
    )
  }
}


export default Relay.createContainer(
  DirectMessages, {
    initialVariables: {
      userHandle: ''
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          user {
            id
            handle
          }
          User (handle: $userHandle) {
            receivedMessages (
              first: 20
            ) {
              edges {
                node {
                  text
                  createdAt
                  updatedAt
                }
              }
            }
      		}
        }
      `
    }
  }
)
