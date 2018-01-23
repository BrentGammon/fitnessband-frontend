/* eslint react/no-multi-comp:0, no-console:0 */
/* global location */
/* eslint no-restricted-globals: ["off", "location"] */

import React, { Component } from "react";
import Button from "../../shared/button/Button";
import axios from "axios";
import { Redirect } from "react-router";
import "./querypage.scss";

import 'rc-calendar/assets/index.css';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const format = 'YYYY-MM-DD HH:mm:ss';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if(cn){
  now.locale('zh-cn').utcOffset(8);
}else{
  now.locale('en-gb').utcOffset(0);
}

function getFormat(time){
  return time ? format: 'YYYY-MM-DD';
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />;

// function disabledTime(date){
//   console.log('disabledTime', date);
//   if(date && (date.date() === 15)){
//     return{
//       disabledHours(){
//         return [3, 4];
//       },
//     };
//   }
//   return{
//     disabledHours(){
//       return [1, 2];
//     },
//   };
// }

// function disabledDate(current){
//   if(!current){
//     // allow empty select
//     return false;
//   }
//   const date = moment();
//   date.hour(0);
//   date.minute(0);
//   date.second(0);
//   return current.valueOf() == date.valueOf(); // if '<' can not select days before today
// }

class QueryPage extends Component {
  static propTypes = {
    defaultValue: PropTypes.object,
    defaultCalendarValue: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      text: "",
      timePeriod: "",
      startTime: "",
      endTime: "",
      comparision: "",
      mood: "",
      result: null,
      error: null,
      timeOptions1: ["Today", "Last Week", "This Week"],
      timeOptions2: ["Today", "Last Week", "This Week"],
      timeOptions1Current: "Today",
      timeOptions2Current: "Last Week",
      showTime: true,
      showDateInput: true,
      disabled: false,
      value: props.defaultValue,
      query2mood: "",
      query2watch: "",
      query2date: "",
    };
    this.clickHandler = this.clickHandler.bind(this);
    this.resultTag = this.resultTag.bind(this);
    this.timeOptions1 = this.timeOptions1.bind(this);
    this.timeOptions2 = this.timeOptions2.bind(this);
    this.filterOption1 = this.filterOption1.bind(this);
    this.filterOption2 = this.filterOption2.bind(this);
    this.dateState = this.dateState.bind(this);
  }

  dateState(e){
    console.log("date picker")
    this.setState({
      //query2date: e.target.value
    });
  }

  onChange = (value) => {
    console.log('DatePicker change: ', (value && value.format(format)));
    //const x: (value && value.format(format))
    this.setState({
      value
    });
    this.setState({query2date: value.format(format)});
  }

  onShowTimeChange = (e) => {
    this.setState({
      showTime: e.target.checked,
    });
  }

  onShowDateInputChange = (e) => {
    this.setState({
      showDateInput: e.target.checked,
    });
  }

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  }

  clickHandler(sd, ed, c, m) {
    if (sd !== ed) {
      let object = {
        user: {
          uid: this.props.uid,
          mood: m,
          startTime: sd,
          endTime: ed,
          comparision: c
        }
      };
      axios
        .post("/api/post/fitness/queryPage", object)
        .then(response => {
          console.log(response.data);
          this.setState({ error: null });
          this.setState({ result: response.data });
        })
        .catch(error => {
          this.setState({ result: null });
          this.setState({ error: error.response.data });
        });
    } else {
      this.setState({ error: "Time peroid can't be the same" });
    }
  }

  clickHandlerq2(q2m, q2w, q2d){
    let object = {
      user: {
        uid: this.props.uid,
        query2mood: q2m,
        query2watch: q2w,
        query2date: q2d,
      }
    };
    axios
      .get("/api/get/fitness/queryPage", object)
      .then(response => {
        console.log(response.data);
        this.setState({error: null});
        this.setState({result: response.data});
      })
      .catch(error => {
        this.setState({ result: null });
        this.setState({ error: error.response.data });
      });
  }

  clicked() {
    this.clickHandler(
      this.refs.time1.value,
      this.refs.time2.value,
      this.refs.comparision.value,
      this.refs.mood1.value
    );
  }

  clickedq2() {
    this.clickHandlerq2(
      this.refs.query2mood.value,
      this.refs.query2watch.value,
      this.state.query2date,     
   );
  }  

  resultTag() {
    if (this.state.result !== null) {
      return <p>Result:{this.state.result}</p>;
    }
  }

  timeOptions1(item) {
    let core = ["Today", "Last Week", "This Week"];
    let values = this.state.timeOptions1;
    if (item !== undefined || item !== null) {
      values = values.filter(i => {
        if (i !== this.state.timeOptions2Current) {
          return i;
        }
      });
    }
    return (
      <select ref="time1" onChange={this.filterOption2}>
        {values.map(i => {
          return (
            <option key={i} value={i}>
              {i}
            </option>
          );
        })}
      </select>
    );
  }

  timeOptions2(item) {
    let core = ["Today", "Last Week", "This Week"];
    let values = this.state.timeOptions2;
    if (item === undefined || item === null) {
      values = values.filter(i => {
        if (i !== this.state.timeOptions1Current) {
          return i;
        }
      });
    }
    return (
      <select ref="time2" onChange={this.filterOption1}>
        {values.map(i => {
          return (
            <option key={i} value={i}>
              {i}
            </option>
          );
        })}
      </select>
    );
  }

  filterOption1(event) {
    this.setState({ timeOptions2Current: event.target.value });
    console.log();
  }

  filterOption2(event) {
    this.setState({ timeOptions1Current: event.target.value });
    console.log();
  }
  render() {
    //conditional rendering

    const state = this.state;
    const calendar = (<Calendar
      locale={cn ? zhCN : enUS}
      style={{ zIndex: 1000}}
      dateInputPlaceholder="please input"
      formatter={getFormat(state.showTime)}
      //disabledTime={state.showTime ? disabledTime: null}
      timePicker={state.showTime ? timePickerElement : null}
      defaultValue={this.props.defaultCalendarValue}
      showDateInput={state.showDateInput}
      //disabledDate={disabledDate}
    />);

    return (

      


      <div className="querysection">
        {!this.props.login ? <Redirect to="/" /> : ""}
        <span>I feel</span>

        <select ref="comparision">
          <option value="More">More</option>
          <option value="Less">Less</option>
        </select>

        <select ref="mood1">
          <option value="stress">stress</option>
          <option value="tiredness">tiredness</option>
          <option value="active">active</option>
          <option value="healthy">healthy</option>
          <option value="alert">alert</option>
          <option value="happy">happy</option>
          <option value="energy">energy</option>
          <option value="calm">calm</option>
        </select>

        {this.timeOptions1()}

        <span>compared to</span>

        {this.timeOptions2()}

        <button
          className="btn"
          onClick={e => {
            this.clicked();
          }}
        >
          Submit
        </button>
        {this.state.result !== null ? (
          this.state.result ? (
            <p>Result: True</p>
          ) : (
              <p>Result: False</p>
            )
        ) : (
            ""
          )}

        {this.state.error ? (
          <p className="error_text">{this.state.error}</p>
        ) : (
            ""
          )}

        <h2>Query 2:</h2>
        <span>I would like to see if</span>
        <select ref="query2mood">
          <option value="stress">Stress</option>
          <option value="tiredness">Tiredness</option>
          <option value="active">Activity Level</option>
          <option value="healthy">Health</option>
          <option value="alert">Alertness</option>
          <option value="happy">Happiness</option>
          <option value="energy">Energy Level</option>
          <option value="calm">Calmness</option>
        </select>
        <span>is related to</span>
        <select ref="query2watch">
          <option value="Active">Activity Level</option>
          <option value="DeepSleep">DeepSleep</option>
          <option value="FlightsClimbed">FlightsClimbed</option>
          <option value="HeartRate">HeartRate</option>
          <option value="Sleep">Sleep</option>
          <option value="SleepHeartRate">SleepHeartRate</option>
          <option value="WalkingRunningDistance">WalkingRunningDistance</option>
        </select>
        <span>during</span>
        
        <div style={{ width: 400, margin: 20}}>
        <div style={{ marginBottom: 10}}>
          <label>
            <input
              type="checkbox"
              checked={state.showTime}
              onChange={this.onShowTimeChange}
            />
            showTime
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              checked={state.showDateInput}
              onChange={this.onShowDateInputChange}
            />
            showDateInput
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              checked={state.disabled}
              onChange={this.toggleDisabled}
            />
            disabled
          </label>
        </div>
        <div style={{
          boxSizing: 'border-box',
          position: 'relative',
          display: 'block',
          lineHeight: 1.5,
          marginBottom: 22,
        }}
        >
          <DatePicker
            animation="slide-up"
            disabled={state.disabled}
            calendar={calendar}
            value={state.value}
            onChange={this.onChange}
          >
            {
              ({ value }) => {
                return (
                  <span tabIndex="0">
                    <input ref="query2DateValue" onChange={this.dateState}
                      placeholder="please select"
                      style={{ width: 250}}
                      disabled={state.disabled}
                      readOnly
                      tabIndex="-1"
                      className="ant-calendar-picker-input ant-input"
                      value={value && value.format(getFormat(state.showTime)) || ''}
                    />
                  </span>
                );
              }
            }
          </DatePicker>
        </div>
      </div>

      <button
          className="btn"
          onClick={e => {
            this.clickedq2();
          }}
        >
          Submit
        </button>

      </div>
    );
  }
}

export default QueryPage;
