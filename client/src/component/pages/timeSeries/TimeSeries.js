/* eslint react/no-multi-comp:0, no-console:0 */
/* global location */
/* eslint no-restricted-globals: ["off", "location"] */

import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';
import "./timeseries.scss";
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
//import RangeCalendar from 'rc-calendar/lib/RangeCalendar' //new
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

import DashboardPlot from '../../home/DashboardPlot';


const format = 'YYYY-MM-DD HH:mm:ss';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
    now.locale('zh-cn').utcOffset(8);
} else {
    now.locale('en-gb').utcOffset(0);
}

function getFormat(time) {
    return time ? format : 'YYYY-MM-DD';
}


const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');



const SHOW_TIME = true;

class Picker extends React.Component {
    state = {
        showTime: SHOW_TIME,
        disabled: false,
        timeError: null
    };

    render() {
        const props = this.props;
        const calendar = (<Calendar
            locale={cn ? zhCN : enUS}
            defaultValue={now}
            disabledDate={props.disabledDate}
        />);
        return (<DatePicker
            animation="slide-up"
            disabled={props.disabled}
            calendar={calendar}
            value={props.value}
            onChange={props.onChange}
        >
            {
                ({ value }) => {
                    return (
                        <span>
                            <input
                                placeholder="please select date"
                                style={{ width: 250 }}
                                disabled={props.disabled}
                                readOnly
                                value={(value && value.format(getFormat(props.showTime))) || ''}
                            />
                        </span>
                    );
                }
            }
        </DatePicker>);
    }
}

class TimeSeries extends Component {

    constructor() {
        super();
        this.state = {
            startValue: null,
            endValue: null,
            startDateValue: "",
            endDateValue: "",
            result: null,
            error: null,
            query1date: "",
            image: null,
            aggregationValue: "Day",
        };
        this.clickHandler = this.clickHandler.bind(this);
    }

    /*     state = {
            startValue: null,
            endValue: null,
        }; */

    onChange = (field, value) => {
        if (value) {
            this.setState({
                [field]: value,
            });
            if (field === 'startValue') {
                this.setState({ startDateValue: value.format(format) });
            } else if (field === 'endValue') {
                this.setState({ endDateValue: value.format(format) });
            }
        }
    }


    disabledEndDate = (endValue) => {
        if (!endValue) {
            return false;
        }
        const startValue = this.state.startValue;
        if (!startValue) {
            return false;
        }
        return SHOW_TIME ? startValue.isBefore(endValue) :
            startValue.diff(endValue, 'days') <= 0;
    }

    disabledStartDate = (startValue) => {
        if (!startValue) {
            return false;
        }
        const endValue = this.state.endValue;
        if (!endValue) {
            return false;
        }
        return SHOW_TIME ? startValue.isBefore(endValue) :
            startValue.diff(endValue, 'days') <= 0;
    }

    clicked() {
        if (moment(this.state.endDateValue).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD") || moment(this.state.startDateValue).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")) {
            this.setState({ timeError: "Date/s can't be in the future" });
        } else {
            this.setState({ timeError: null });
            this.clickHandler(
                this.state.startDateValue,
                this.state.endDateValue,
                this.state.aggregationValue,
            );
        }
    }

    clickHandler(sDV, eDV, aggrV) {
        let data = {
            uid: this.props.uid,
            startDate1: sDV.split('+')[0],
            endDate1: eDV.split('+')[0],
            aggregationValue: aggrV,
        };
        axios
            .get(`/api/get/charts/${data.uid}/${data.startDate1}/${data.endDate1}/${data.aggregationValue}`)
            .then(response => {
                this.setState({ image: response.data.image });
            }).catch(error => {
                console.log(error);
            })
    }



    render() {
        if (!this.props.login) {
            return <Redirect to="/" />
        }

        const state = this.state;
        return (<div className="timeSeriesSection">
            <h2>Time Series Display</h2>
            <div className="timeseriesCalendar">
                <p>
                    StartDate:
                <Picker
                        disabledDate={this.disabledEndDate}
                        value={state.endValue}
                        onChange={this.onChange.bind(this, 'endValue')}
                    />
                </p>

                <p>
                    End Date:
                <Picker
                        disabledDate={this.disabledStartDate}
                        value={state.startValue}
                        onChange={this.onChange.bind(this, 'startValue')}
                    />
                </p>
            </div>

            <div className="aggMsg">
                <span>Aggregate data by:</span>
                <select ref="aggregationValue" onChange={(event) => this.setState({ aggregationValue: event.target.value })}>
                    <option value="Day">Day</option>
                    <option value="Hour">Hour</option>
                </select>
            </div>

                <p className="msg">To visualise the independent attribute visualisation, define a date range. </p>
                <p className="msg">By default the aggregation frame is by Day, this can be changed to Hour to aid in viewing the time series of the attributes over a short date range.</p>

            {this.state.timeError ? <h2>{this.state.timeError}</h2> : ''}
            <button
                className="btn"
                onClick={e => {
                    this.clicked();
                }}
            >
                Submit
        </button>

            <div className="dashboardPlotContainer">
                <DashboardPlot uid={this.props.uid} startDateValue={this.state.startDateValue} endDateValue={this.state.endDateValue} options={["activeEnergyBurned", "deepSleep", "flightsClimbed", "heartRate", "sleep", "sleepHeartRate", "stepCounter", "walkingRunningDistance", "stressLevel", "tirednessLevel", "activityLevel", "healthinessLevel"]} />
            </div>

            <h2>Independent Attribute Visualisation</h2>
            {this.state.image ? (
                <img src={`data:image/png;base64, ${this.state.image}`} alt="time series plot" />
            ) : (
                    console.log("there is no image to display")
                )}

        </div>);

    }

}



export default TimeSeries;