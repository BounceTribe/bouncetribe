import React, {Component} from 'react'
import BTButton from 'reusables/BTButton'

class ProfileCard extends Component {
  // constructor(props) {
  //   super(props)
  // }


  render() {
    return (
      <div>
        <BTButton
          onClick={()=>{this.props.logout()}}
          text={'Logout'}
        />
      </div>
    )
  }
}

export default ProfileCard
