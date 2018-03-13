import React, { Component } from "react";
import firebase from "firebase";
import Header from "../menu/Header";
import "./home.scss";
import "./loginbuttons.scss";
import UserProfile from "../userprofile/UserProfile";
import Summary from "./Summary";
import axios from "axios";
import './dashboard.scss';
import DashboardPlot from './DashboardPlot';

class Dashboard extends Component {
  constructor() {
    super();
    this.renderLogIn = this.renderLogIn.bind(this);

  }

  componentWillMount() {

  }

  clicked(){
    this.clickHandler();
}

clickHandler(){
  let data = {
      uid: this.props.uid
  };
  axios
  .get(`/api/deleteRecords/delete/${data.uid}`)
  .then(response => {
    console.log(response);
    console.log('All data has been cleared successfully');
  }).catch(error => {
    console.log(error);
  })
}

  renderLogIn() {
    return (
      <button
        className="loginBtn loginBtn--facebook"
        onClick={() => this.props.authenticate()}
      >
        facebook login
      </button>
    );
  }

  render() {
    return (
      <div className="App">
        {!this.props.login ? this.renderLogIn() : ""}
        {this.props.user ? (
          <div>
            <div className="dashboardContainer">
              <Summary
                uid={this.props.user.uid}
              />
              <UserProfile
                profileImage={this.props.user.photoURL}
                name={this.props.user.name}
                email={this.props.user.email}

              />

            </div>
            <div className="dashboardPlotContainer">
              <DashboardPlot uid={this.props.user.uid} options={["activeEnergyBurned", "deepSleep", "flightsClimbed", "heartRate", "sleep", "sleepHeartRate", "stepCounter", "walkingRunningDistance"]} />
              <DashboardPlot uid={this.props.user.uid} options={["stressLevel", "tirednessLevel", "activityLevel", "healthinessLevel"]} />
            </div>

        <button
          className="btn"
          onClick={e => {
            this.clicked();
          }}
        >
          Delete All Records (Demo Purposes)
        </button>
          </div>
        ) : (
            ""
          )}
      </div>
    );
  }
}

export default Dashboard;
