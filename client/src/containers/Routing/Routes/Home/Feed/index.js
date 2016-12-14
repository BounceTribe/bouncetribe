import React from 'react'
import BTButton from 'reusables/BTButton'

const Feed = (props) => {
  return (
    <section>
      <h1>Feed</h1>
      <h4>Woah cool check out your feed</h4>
      <BTButton
        onClick={props.logout}
        text={'Logout'}
      />
    </section>
  )
}

export default Feed
