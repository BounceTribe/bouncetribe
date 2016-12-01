import React, {Component} from 'react'


class ProfileCard extends Component {
  // constructor(props) {
  //   super(props)
  // }


  render() {
    return (
      <div>
        <img
          src={this.props.user.picture}
          style={{
            maxWidth: '50px',
            height: 'auto'
          }}
          role="presentation"
        ></img>
        <span>{this.props.user.email}</span>

        <button
          onClick={()=>{this.props.logout()}}
        >logout</button>
      </div>
    )
  }
}

export default ProfileCard
