import React, { Component } from 'react';
import axios from 'axios';
import './dashboardplot.scss';

class DashboardPlot extends Component {
    constructor() {
        super();
        this.state = {
            selectedValues: [],
            image: null
        }
        this.displayOptions = this.displayOptions.bind(this);
        this.updateState = this.updateState.bind(this);
        this.getData = this.getData.bind(this);
    }

    displayOptions() {
        let x = this.props.options;
        return (
            x.map(item => {
                let label = item.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
                return (
                    <div className="checkbox" key={item}>  <input className="checkbox" type="checkbox" value={item.toUpperCase()} onChange={() => this.updateState(item.toLowerCase())} /> {label} </div>
                )
            })
        )
    }



    updateState(value) {
        let array = this.state.selectedValues;
        if (array.includes(value)) {
            let index = array.indexOf(value);
            array.splice(index, 1);
        } else {
            array.push(value);
        }
        this.setState({ selectedValues: array })
        this.getData();


    }


    getData() {
        let data = this.state.selectedValues;
        axios.get('/api/get/user/dashboard/plot', {
            params: {
                data,
                uid: this.props.uid
            }
        })
            .then(response => {
                this.setState({ image: response.data.image });
                //console.log(response.data)
            })
            .catch(error => {
                console.log(error);
            })
    }


    render() {
        return (
            <div className="dashboardPlot">
                {this.state.image ?
                    <img src={`data:image/png;base64, ${this.state.image}`} alt="dashboard plot" />
                    :
                    <div className="dashboardPlotBlank"></div>
                }

                {this.displayOptions()}
            </div>
        )
    }

}

export default DashboardPlot;