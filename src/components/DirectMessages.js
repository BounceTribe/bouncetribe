import React, {Component} from 'react'
// import Relay from 'react-relay'
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
      active: [],
      receivedMessages: [],
      sentMessages: [],
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

  componentWillMount() {
    console.log('DM props', this.props);
    let messages = this.props.viewer.user.receivedMessages
    this.setState({ messages })
    console.log('DM state', this.state);
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

  messages = () => {
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
    console.log('messages', this.messages);
    return (
      <MessageContainer>
        {this.messages()}
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


export default DirectMessages
