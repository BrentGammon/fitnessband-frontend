import React, { Component } from "react";
import "./summary.scss";
import axios from 'axios';

class Summary extends Component {
    constructor() {
        super();
        this.state = {
            data: null
        }
        this.renderElements = this.renderElements.bind(this);
        this.formatData = this.formatData.bind(this);

    }

    componentDidMount() {
        axios.get(`/api/get/user/summary/${this.props.uid}`)
            .then(response => {
                this.setState({
                    data: response.data
                });
            }).catch(error => {
                console.log(error)
            })
    }

    formatData(key, value) {
        console.log("format data");

        if(key === "deepSleep" || key === "totalSleep") {
            let rounded = Math.round(value / 3600);
            return rounded + " hours";
        } else if (key === "walkingRunningDistance") {
            let rounded = Math.round(value / 5280)
            return rounded + " miles";
        } else {
            console.log("other");
            return Math.round(value);
        }
    }

    renderElements() {
        let data = this.state.data;
        let array = [];
        if (data !== null) {
            let keys = Object.keys(data)
            for (let item in keys) {
                let x = keys[item]
                let xkey = x//key 
                let xvalue = data[x][0][Object.keys(data[x][0])] //value
                array.push([xkey, xvalue])
            }

            return (
                array.map(item => {
                    //https://stackoverflow.com/questions/4149276/javascript-camelcase-to-regular-form
                    let v = this.formatData(item[0], item[1]);
                    let label = item[0].replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
                    return (
                        <div key={item} id={item[0]} className="summary">
                            <p className="value">{v}</p>
                            <p className="label">{label}</p>
                        </div>
                    )
                })
            )

        }

    }

    render() {
        return (
            <div className="summaryContainer">
                {this.renderElements()}
            </div>
        )
    }
}

export default Summary;