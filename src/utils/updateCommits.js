import UpdateFriendRequest from 'mutations/UpdateFriendRequest'
import AddToFriends from 'mutations/AddToFriends'


export const acceptFriendRequest = (args) => {
  let {requestId, newFriendId, props, successCB, failureCB} = args
  props.relay.commitUpdate(
    new UpdateFriendRequest({
      id: requestId,
      accepted: true
    }), {
      onSuccess: (response) => {
        props.relay.commitUpdate(
          new AddToFriends({
            selfId: props.viewer.user.id,
            newFriendId
          }), {
            onSuccess: (response) => successCB(response),
            onFailure: (response) => failureCB(response)
          }
        )
      },
      onFailure: (response) => failureCB(response)
    }
  )
}
