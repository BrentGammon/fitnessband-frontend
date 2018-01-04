import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.scss";
class NavBar extends Component {
  render() {
    return (
      <div className="navbar">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/record">Record</NavLink>
        <NavLink to="/queryPage">Query</NavLink>
        <NavLink to="/rDemo">rDemo</NavLink>
      </div>
    );
  }
}

export default NavBar;
