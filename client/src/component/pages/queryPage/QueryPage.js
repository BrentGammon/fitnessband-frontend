/* eslint react/no-multi-comp:0, no-console:0 */
/* global location */
/* eslint no-restricted-globals: ["off", "location"] */

import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import "./querypage.scss";
import 'rc-calendar/assets/index.css';
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

import Accordion from '../../shared/Accordion';
import FurtherInformation from './FutherInformation';
import FurtherInformationMoodWatch from './FutherInformationMoodWatch';


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
const userInputValues = ["stresslevel", "tirednesslevel", "activitylevel", "healthinesslevel"];
const watchInputValues = ["activeenergyburned", "deepsleep", "flightsclimbed", "heartrate", "sleep", "sleepheartrate", "stepcounter", "walkingrunningdistance"];


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
      query1watch: "",
      query1watch2: "",
      query1date: "",
      //query1duration: "",
      image: null,
      extraData: null,
      optionSelection1Values: ["activeenergyburned", "deepsleep", "flightsclimbed", "heartrate", "sleep", "sleepheartrate", "stepcounter", "walkingrunningdistance", "stresslevel", "tirednesslevel", "activitylevel", "healthinesslevel"],
      optionSelection2Values: ["activeenergyburned", "deepsleep", "flightsclimbed", "heartrate", "sleep", "sleepheartrate", "stepcounter", "walkingrunningdistance", "stresslevel", "tirednesslevel", "activitylevel", "healthinesslevel"],
      optionSelection1Current: "activeenergyburned",
      optionSelection2Current: "deepsleep",
      optionSelection1Submitted: null,
      optionSelection2Submitted: null,

    };
    this.clickHandler = this.clickHandler.bind(this);
    this.clickHandlerq1 = this.clickHandlerq1.bind(this);
    this.resultTag = this.resultTag.bind(this);
    this.timeOptions1 = this.timeOptions1.bind(this);
    this.timeOptions2 = this.timeOptions2.bind(this);
    this.filterOption1 = this.filterOption1.bind(this);
    this.filterOption2 = this.filterOption2.bind(this);
    this.dateState = this.dateState.bind(this);
    this.optionSelection1 = this.optionSelection1.bind(this);
    this.optionSelection2 = this.optionSelection2.bind(this);
    this.selectionfilterOption1 = this.selectionfilterOption1.bind(this);
    this.selectionfilterOption2 = this.selectionfilterOption2.bind(this);
    this.clickedq1 = this.clickedq1.bind(this);
    //this.displayImage = this.displayImage.bind(this);
  }

  dateState(e) {
    console.log("date picker")
    this.setState({
      //query1date: e.target.value
    });
  }

  onChange = (value) => {
    if (value) {
      this.setState({
        value
      });
      this.setState({ query1date: value.format(format) });
    }
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
          this.setState({ error: null });
          this.setState({ result: response.data });
        })
        .catch(error => {
          this.setState({ result: null });
          this.setState({ error: error.response.data });
        });
    } else {
      this.setState({ error: "Time period can't be the same" });
    }
  }

  clickHandlerq1(q1w, q1w2, q1d) {
    let data = {
      uid: this.props.uid,
      query1watch: q1w,
      query1watch2: q1w2,
      query1date: q1d.split('+')[0],
    };


    axios
      .get(`/api/get/query1/${data.uid}/${data.query1watch}/${data.query1watch2}/${data.query1date}`)
      .then(response => {
        this.setState({ image: response.data.image });
        this.setState({ extraData: response.data.stats })

      })
      .catch(error => {
        console.log("gkdhgkdhfg")
        this.setState({ result: null });
        this.setState({ error: error.response });
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

  clickedq1() {
    this.setState({ optionSelection1Submitted: this.state.optionSelection1Current })
    this.setState({ optionSelection2Submitted: this.state.optionSelection2Current })
    this.clickHandlerq1(
      this.state.optionSelection1Current,
      this.state.optionSelection2Current,
      this.state.query1date,
    );
  }

  resultTag() {
    if (this.state.result !== null) {
      return <p>Result:{this.state.result}</p>;
    }
  }

  timeOptions1(item) {
    let values = this.state.timeOptions1;
    if (item !== undefined || item !== null) {
      values = values.filter(i => {
        let data;
        if (i !== this.state.timeOptions2Current) {
          data = i;;
        }
        return data;
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
    let values = this.state.timeOptions2;
    if (item === undefined || item === null) {
      values = values.filter(i => {
        let data;
        if (i !== this.state.timeOptions1Current) {
          data = i;
        }
        return data;
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



  optionSelection1(item) {
    let values = this.state.optionSelection1Values;
    if (item === undefined || item === null) {
      values = values.filter(i => {
        let data;
        if (i !== this.state.optionSelection2Current) {
          data = i;
        }
        return data;
      });
    }
    return (
      <select ref="query1watch" onChange={this.selectionfilterOption2}>
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

  optionSelection2(item) {
    let values = this.state.optionSelection2Values;
    if (item === undefined || item === null) {
      values = values.filter(i => {
        let data;
        if (i !== this.state.optionSelection1Current) {
          data = i;
        }
        return data;
      });
    }
    return (
      <select ref="query1watch2" onChange={this.selectionfilterOption1}>
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
  }

  filterOption2(event) {
    this.setState({ timeOptions1Current: event.target.value });
  }


  selectionfilterOption1(event) {
    this.setState({ optionSelection2Current: event.target.value });
  }

  selectionfilterOption2(event) {
    this.setState({ optionSelection1Current: event.target.value });
  }



  render() {
    const state = this.state;
    const calendar = (<Calendar
      locale={cn ? zhCN : enUS}
      style={{ zIndex: 1000 }}
      dateInputPlaceholder="please input"
      formatter={getFormat(state.showTime)}
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

        <h2>Query 1:</h2>
        <span>I would like to see if</span>
        {this.optionSelection1()}
        <span>is related to</span>
        {this.optionSelection2()}
        <span>during</span>

        <div style={{ width: 400, margin: 20 }}>
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
                  let data = (value && value.format(getFormat(state.showTime))) || ''
                  return (
                    <span tabIndex="0">
                      <input ref="query1DateValue" onChange={this.dateState}
                        placeholder="please select"
                        style={{ width: 250 }}
                        disabled={state.disabled}
                        readOnly
                        tabIndex="-1"
                        className="ant-calendar-picker-input ant-input"
                        value={data}
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
            this.clickedq1();
          }}
        >
          Submit
                </button>
        {this.state.image === undefined ? <h1>No data found</h1> : ''}


        {this.state.image ? (
          <img src={`data:image/png;base64, ${this.state.image}`} alt="plot" />
        ) : (
            console.log("there is no image to display")
          )}


        {

          //watch mood                                                                             
          (userInputValues.includes(this.state.optionSelection1Submitted) && watchInputValues.includes(this.state.optionSelection2Submitted)) || (userInputValues.includes(this.state.optionSelection2Submitted) && watchInputValues.includes(this.state.optionSelection1Submitted)) ?
            this.state.extraData && this.state.image !== undefined ?
              <Accordion text="More Information">
                <FurtherInformationMoodWatch extraData={this.state.extraData} optionSelection1Current={this.state.optionSelection1Submitted} optionSelection2Current={this.state.optionSelection2Submitted} />
              </Accordion> : ''

            : ''
        }

        {
          //full mood or full watch 
          (watchInputValues.includes(this.state.optionSelection1Submitted) && watchInputValues.includes(this.state.optionSelection2Submitted)) || (watchInputValues.includes(this.state.optionSelection2Submitted) && watchInputValues.includes(this.state.optionSelection1Submitted)) ||
            (userInputValues.includes(this.state.optionSelection1Submitted) && userInputValues.includes(this.state.optionSelection2Submitted)) || (userInputValues.includes(this.state.optionSelection2Submitted) && userInputValues.includes(this.state.optionSelection1Submitted)) ?
            this.state.extraData && this.state.image !== undefined ?
              <Accordion text="More Information">
                <FurtherInformation extraData={this.state.extraData} optionSelection1Current={this.state.optionSelection1Submitted} optionSelection2Current={this.state.optionSelection2Submitted} />
              </Accordion> : ''
            : ''
        }

      </div>
    );
  }
}

export default QueryPage;
