import React, { Component } from "react";
import Button from "../../shared/button/Button";
import axios from "axios";

class QueryPage extends Component {
    
    constructor(){
        super();
        this.state = {
            text: "Initial Mood",
            timePeriod: "Today"
        };
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(){
        console.log("querfront");
        let object = {
            user: {
                uid:this.props.uid,
                timePeriod: this.state.timePeriod,
                mood: this.state.text
            }
        };
        axios
            .get("http://localhost:3005/user/queryPage", object)
            .then(function(response){
                console.log(response);
            })
            .catch(function(error){
                console.log(error);
            });
    }
    
    clicked(){
    
        this.setState({ text: this.refs.textBox.value});
        this.setState({ timePeriod: this.refs.time.value });
        this.clickHandler();
            
    }

    render(){
        
        return (
        <div>
            { this.props.uid }
            { this.state.timePeriod }
            { this.state.text }

            <p></p>

            <select ref="time">
                <option value="Today">Today</option>
                <option value="Last Week">Last Week</option>
                <option value="This Week">This Week</option>
            </select>
            
            <select ref="textBox">
                <option value="Stressed">Stressed</option>
                <option value="Tired">Tired</option>
                <option value="Active">Active</option>
                <option value="Healthy">Healthy</option>
            </select>
            <button onClick={ (e) => {this.clicked(); } }>Mood</button>
        </div>

        )
    }

}

export default QueryPage;