import React, { Component } from "react";
import "./home.scss";
import "./loginbuttons.scss";
import UserProfile from "../userprofile/UserProfile";
import Summary from "./Summary";
import './dashboard.scss';
import DashboardPlot from './DashboardPlot';

class Dashboard extends Component {
  constructor() {
    super();
    this.renderLogIn = this.renderLogIn.bind(this);

  }

  componentWillMount() {

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
          </div>
        ) : (
            ""
          )}
      </div>
    );
  }
}

export default Dashboard;
