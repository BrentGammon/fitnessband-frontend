import React, { Component } from "react";
import "./home.scss";
import "./loginbuttons.scss";
import UserProfile from "../userprofile/UserProfile";
import Summary from "./Summary";
import './dashboard.scss';
import DashboardPlot from './DashboardPlot';
import Goals from '../goals/Goals';
import axios from 'axios';

class Dashboard extends Component {
  constructor() {
    super();
    this.renderLogIn = this.renderLogIn.bind(this);

  }



  clicked() {
    this.clickHandler();
  }

  clickHandler() {
    let data = {
      uid: this.props.uid
    };
    axios
      .get(`/api/deleteRecords/delete/${data.uid}`)
      .then(response => {
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
            <div className="goalContainer">
              <Goals uid={this.props.user.uid} />
            </div>
            <div className="dashboardPlotContainer">
              <DashboardPlot uid={this.props.user.uid} options={["activeEnergyBurned", "deepSleep", "flightsClimbed", "heartRate", "sleep", "sleepHeartRate", "stepCounter", "walkingRunningDistance"]} />
              <DashboardPlot uid={this.props.user.uid} options={["stressLevel", "tirednessLevel", "activityLevel", "healthinessLevel"]} />
            </div>

            {/*         <button
          className="btn"
          onClick={e => {
            this.clicked();
          }}
        >
          Delete All Records (Demo Purposes)
        </button> */}
          </div>
        ) : (
            ""
          )}
      </div>
    );
  }
}

export default Dashboard;
