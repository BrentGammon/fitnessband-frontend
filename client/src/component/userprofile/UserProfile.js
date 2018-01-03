import React, { Component } from "react";
import "./userprofile.scss";

class UserProfile extends Component {
  render() {
    return (
      <div className="userprofile">
        <img src={this.props.profileImage} alt="user-profile" />
        <p>
          Welcome {this.props.name} ({this.props.email}), you are able to
          analyse data from your Apple Watch using our IOS Application. Above
          are the different features that are available
        </p>
      </div>
    );
  }
}

export default UserProfile;
