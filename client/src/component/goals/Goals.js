import React, { Component } from 'react';
import axios from 'axios';
import CurrentGoals from './CurrentGoals';
import GoalInput from './GoalInput';
import './goal.scss';

class Goals extends Component {
    constructor() {
        super();
        this.state = {
            goals: null
        }
        this.getGoals = this.getGoals.bind(this);
        this.deleteGoal = this.deleteGoal.bind(this);
        this.addGoal = this.addGoal.bind(this);
    }

    componentWillMount() {
        this.setState({ uid: this.props.uid })
        this.getGoals();
    }

    addGoal(uid, variable, goalValue) {
        axios.post(`/api/goals`, {
            uid,
            variable,
            goalValue
        })
            .then(response => {
                if (response.data.rowCount && response.status === 200) {
                    this.getGoals();
                }

            })
            .catch(error => {
                console.log(error)
            })
    }

    deleteGoal(id, uid, index) {
        axios.delete(`/api/goals/${uid}/${id}`)
            .then(response => {
                if (response.data.length === 0 && response.status === 200) {
                    this.getGoals();
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    getGoals() {
        const userid = this.props.uid;
        axios.get(`/api/goals/${userid}`)
            .then(response => {
                this.setState({ goals: response.data })
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        return (
            <div className="goalArea">
                <GoalInput uid={this.props.uid} addGoal={this.addGoal} />
                <CurrentGoals data={this.state.goals} deleteGoal={this.deleteGoal} />
            </div>
        )
    }
}

export default Goals;