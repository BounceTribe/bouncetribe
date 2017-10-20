import React, {Component} from 'react'
import Relay from 'react-relay'
import TextField from 'material-ui/TextField'
import CreateMessage from 'mutations/CreateMessage'
import {SubscriptionClient} from 'subscriptions-transport-ws'
import {BtMessages} from 'components/BtMessages'
import * as moment from 'moment'
import getMessages from 'utils/graphql'
// import CreateSession from 'mutations/CreateSession'


export class DirectMessages extends Component {

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
      message: '',
      sessionId: ''
    }

  //   this.feedSub.subscribe(
  //     {
  //       query: /* GraphQL */`subscription createMessage {
  //         Message (
  //           filter: {
  //             mutation_in: [CREATED]
  //             # node: {
  //             #   directId:  "${this.props.viewer.user.id + this.props.viewer.User.id}"
  //             # }
  //           }
  //         ) {
  //           node {
  //             sender {
  //               id
  //               handle
  //               portrait { url }
  //             }
  //             text
  //             id
  //           }
  //         }
  //       }`
  //     }, (error, result) => {
  //       if (result) {
  //         let newMessage = result.Message
  //         this.setState( (prevState) => {
  //           let {messages} = prevState
  //           messages.push(newMessage)
  //           return { messages }
  //         } )
  //       }
  //     }
  //   )
  }

  msgs = async() => {

    console.log('async start', this.props);
    let messages = await getMessages(this.props.userHandle, this.props.theirHandle)
    this.setState({messages})

  }

  // createSession = () => {
  //   let userIds = [this.props.viewer.user.id, this.props.viewer.User.id]
  //   this.props.relay.commitUpdate(
  //     new CreateSession({projectsIds: userIds}),{
  //       onSuccess: (success) => {
  //         let {id: sessionId} = success.createSession.session
  //         this.setState({sessionId})
  //       }
  //     }
  //   )
  // }

  currentTime = (time) => this.setState({ time })

  componentDidMount(){
    this.msgs()
  }
  //   let viewer = this.props.viewer
  //   let received = viewer.user.receivedMessages.edges
  //   let sent = viewer.User.receivedMessages.edges
  //   let messages = received.concat(sent).sort((a, b) => a.node.id - b.node.id)
  //   this.setState({ messages })
  //   console.log('DM Mount', this);
  //   this.props.relay.setVariables({
  //     directId: viewer.user.id + viewer.User.id
  //   })
  //   // console.log('btmnessages', <DirectMessages />);
  // }

  formatMessages = () => {
    console.log('format', this.state);
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
      msg.isSender = (msg.sender.handle===this.props.userHandle)
      return msg
    })
    return msgList
  }

  render() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
      {/* <QueryData user={this.props.viewer.User.handle}/> */}
        <BtMessages msgList={this.formatMessages()} />
        {/* <TextField
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
        /> */}
      </div>
    )
  }
}
// "cj8t2om7r05z101993ejxxsxzcj5jwswj4cjyx0161fik5z7pv"
// #  handle: "${DirectMessages.props.router.params.userHandle}"
//
// handle: "lyricandthewhoopingcranes"
// //
// export default Relay.createContainer( DirectMessages, {
//    initialVariables: { userHandle: '', directId: '' },
//    fragments: { viewer: () => Relay.QL`
//        fragment on Viewer {
//          user {
//            id
//            handle
//            score
//            portrait { url }
//            receivedMessages (
//              first: 20
//              orderBy: id_ASC
//              filter: {
//                sender: {
//                  handle: "lyricandthewhoopingcranes"
//                }
//              }
//            ) {
//              edges {
//                node {
//                  id
//                  text
//                  createdAt
//                  sender {
//                    id
//                    handle
//                    portrait { url }
//                  }
//                }
//              }
//            }
//          }
//          User (handle: $userHandle) {
//            id
//            handle
//            portrait { url }
//            receivedMessages (
//              first: 20
//              orderBy: id_ASC
//              filter: {
//                sender: {
//                  handle: "subliminal_lime"
//                }
//              }
//            ) {
//              edges {
//                node {
//                  id
//                  text
//                  createdAt
//                  sender {
//                    id
//                    handle
//                    portrait { url }
//                  }
//                }
//              }
//            }
//          }
//        }
//      `,
//    },
//  }
// )
