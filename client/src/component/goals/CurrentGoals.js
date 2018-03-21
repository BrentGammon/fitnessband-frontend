import React, { Component } from 'react';
import axios from 'axios';
import './currentgoal.scss';

class CurrentGoals extends Component {
    constructor() {
        super();
        this.renderCurrentGoals = this.renderCurrentGoals.bind(this);
    }

    formatData(key, value) {
        if (key === "deepSleep" || key === "totalSleep") {
            let rounded = Math.round(value / 3600);
            return rounded;
        } else if (key === "walkingRunningDistance") {
            let rounded = Math.round(value / 5280)
            return rounded;
        } else {
            return value;
        }
    }

    renderCurrentGoals() {
        let goals = this.props.data



        if (goals) {
            console.log(goals.length)
            console.log("we have goals")
            return (


                goals.map((item, index) => {

                    return (
                        <tr className="currentGoal" key={item.data.id}>
                            <td>{item.data.variable.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}</td>
                            <td>{Math.round(item.data.goalvalue)}</td>
                            <td className="value">{Math.round(this.formatData(item.data.variable, item.current))}</td>
                            <td>{Math.round((this.formatData(item.data.variable, item.current) / item.data.goalvalue) * 100)}%</td>
                            <td><i className="fa fa-times" aria-hidden="true" onClick={() => this.props.deleteGoal(item.data.id, item.data.userid, index)} /></td>
                        </tr>

                    )

                })

            )

        }
    }



    render() {
        return (
            <div>
                <table className="goalTable">
                    <thead>
                        <tr>
                            <th>Fitness Area</th>
                            <th>Goal Value</th>
                            <th>Current Value</th>
                            <th>Progress</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderCurrentGoals()}
                    </tbody>
                </table>

            </div>
        )
    }
}

export default CurrentGoals;
