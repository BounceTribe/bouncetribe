import React, {Component} from 'react'
import Relay from 'react-relay'
import TextField from 'material-ui/TextField'
import CreateMessage from 'mutations/CreateMessage'
import {SubscriptionClient} from 'subscriptions-transport-ws'
import {BtMessages} from 'components/BtMessages'
import * as moment from 'moment'
// import {isScrolledIntoView} from 'utils/isScrolledIntoView'
import {SeeMore} from 'styled'

class DirectMessages extends Component {

  constructor(props) {
    super(props)
    this.feedSub = new SubscriptionClient(
      'wss://subscriptions.graph.cool/v1/bt-api',
      { reconnect: true, }
    )
    // this.messages = this.props.viewer.allMessages.edges.map(edge=>edge.node)
    let savedText = JSON.parse(sessionStorage.getItem('message')) || {}
    let useSaved =  this.props.params.theirHandle===savedText.forHandle
    // let newLocal = JSON.parse(sessionStorage.getItem('newMessages')) || []
    // let newMessages = newLocal.map(msg=> typeof(msg)==='string' ? JSON.parse(msg) : msg )
      this.state = {
        newMessages: JSON.parse(sessionStorage.getItem('newMessages')) || [],
        message: useSaved ? savedText.text : '',
        new: [],
        loading: false
      }
    console.log('dm mount', this)
    // console.log('unparsed new', sessionStorage.getItem('newMessages'));
    console.log('parsed new', this.state.newMessages);
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
    if (this.props.params.page>1) {
      this.setPage(this.props, 1)
    }
    this.state.newMessages.length && sessionStorage.setItem('newMessages', JSON.stringify(this.state.newMessages))
    this.state.message && sessionStorage.setItem('message', JSON.stringify({
      text: this.state.message,
      forHandle: this.props.viewer.User.handle
    }))
  }

  componentWillReceiveProps(nextProps) {
    let prevNum = this.props.viewer.allMessages.edges.length
    let nextNum = nextProps.viewer.allMessages.edges.length
    if (nextProps.params.theirHandle!==this.props.params.theirHandle) {
      this.setPage(nextProps, 1)
      this.setState({loading: false, message:''})
    }
    if (this.state.loading && nextNum!==prevNum)
      this.setState({loading: false})
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.message==='' && (prevState.newMessages.length!==this.state.newMessages.length)) {
      this.msgsEnd.scrollIntoView({ behaviour: 'smooth', block: 'nearest' })
    }
  }

  setPage = (props, newPage) => {
    let {theirHandle, userHandle, page} = props.params
    if (!newPage) newPage = (parseInt((page || 1), 10) + 1)
    let newPath = `/dash/${theirHandle}/messages/${userHandle}/${newPage}/`
    this.props.router.replace(newPath)
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
      typeof(msg)!=='string' &&
      ((msg.sender.id===userId && msg.recipient.id===theirId) ||
      (msg.sender.id===theirId && msg.recipient.id===userId))
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

  seeMore = () => {
    this.setState({loading: true})
    this.setPage(this.props)
  }

  render() {
    let {allMessages} = this.props.viewer
    let messages = allMessages.edges.map(edge=>edge.node)
      .concat(this.storedMsgsFilter(this.state.newMessages))
    messages = [...new Set(messages)]
    let scrollPlaceholder =
      <div style={{ float:"left", clear: "both" }} ref={el=>this.msgsEnd = el}/>
    let top =
      <div style={{ float:"left", clear: "both", padding: '15px 0 0 0' }} ref={el=>this.top = el}/>
    let hasMore = allMessages.edges.length!==allMessages.count

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
          nextPage={hasMore && <SeeMore onClick={this.seeMore} loading={this.state.loading} />}
          top={top}
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
  initialVariables: { theirHandle: '', userHandle: '', messageFilter: {}, page: 1, num: 10},
  prepareVariables: (urlParams) => {
    return {
      ...urlParams,
      num: parseInt((urlParams.page || 1), 10) * 10,
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
        first: $num
        filter: $messageFilter
        orderBy: createdAt_DESC
      ) {
        count
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
        portraitMini { url }
      }
      User (handle: $theirHandle) {id, handle}
    }
    `,
  },
})
