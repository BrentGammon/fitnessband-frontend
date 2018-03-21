import React, { Component } from 'react';
import './goalInput.scss';
class GoalInput extends Component {
    constructor() {
        super();
        this.state = {
            variable: "heartRate",
            goalValue: null
        }
        this.setVariable = this.setVariable.bind(this);
        this.setGoalValue = this.setGoalValue.bind(this);
        this.submit = this.submit.bind(this);
    }

    setVariable(event) {
        this.setState({ variable: event.target.value });
    }

    setGoalValue(event) {
        this.setState({ goalValue: event.target.value });
    }

    submit(uid, variable, goalValue) {
        if (uid && variable && goalValue && goalValue > 0) {
            this.props.addGoal(uid, variable, goalValue)
        } else {
            console.log("error");
        }


    }

    render() {
        return (
            <div className="goalInput">
                <h1>Current Goals</h1>
                <label htmlFor="var">Item</label>
                <select id="var" onChange={this.setVariable}>
                    <option value="heartRate">Heart Rate</option>
                    <option value="deepSlepp">Deep Sleep</option>
                    <option value="totalSleep">Total Sleep</option>
                    <option value="sleepHeartRate">Sleep Heart Rate</option>
                    <option value="activeEnergyBurned">Active Energy Burned</option>
                    <option value="flightsClimbed">Flights Climbed</option>
                    <option value="steps">Steps</option>
                    <option value="flightsClimbed">Flights Climbed</option>
                    <option value="walkingRunningDistance">Walking Running Distance</option>
                </select>

                <label htmlFor="goalValue">Goal Value</label>
                <input id="goalValue" type="number" min="0" onChange={this.setGoalValue} />
                <button onClick={() => this.submit(this.props.uid, this.state.variable, this.state.goalValue)}>Add</button>
            </div>
        )
    }

}

export default GoalInput;