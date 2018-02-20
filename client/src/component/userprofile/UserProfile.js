import React, { Component } from "react";
import "./userprofile.scss";

class UserProfile extends Component {
  render() {
    return (
      <div className="userprofile">
        <img src={this.props.profileImage} alt="user-profile" />
        <p>{this.props.name}</p>
        <p>{this.props.email}</p>
      </div>
    );
  }
}

export default UserProfile;
