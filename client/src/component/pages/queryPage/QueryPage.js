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

//debugging
import ReactJson from 'react-json-view';

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

const timePickerElement = <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />;

const userInputValues = ["stresslevel", "tirednesslevel", "activitylevel", "healthinesslevel"];
const watchInputValues = ["activeenergyburned", "deepsleep", "flightsclimbed", "heartrate", "sleep", "sleepheartrate", "stepcounter", "walkingrunningdistance"];

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
    //this.displayImage = this.displayImage.bind(this);
  }

  dateState(e) {
    console.log("date picker")
    this.setState({
      //query1date: e.target.value
    });
  }

  onChange = (value) => {
    console.log('DatePicker change: ', (value && value.format(format)));
    //const x: (value && value.format(format))
    this.setState({
      value
    });
    this.setState({ query1date: value.format(format) });
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


  //DONT DELETE
  // componentWillMount() {
  //   let provider = new firebase.auth.FacebookAuthProvider();
  //   firebase.auth().currentUser.getIdToken(true).then(function (idToken) {
  //     console.log(idToken);
  //     axios.get('/api/get/test/' + idToken).then(response => {
  //       console.log(response)
  //     }).catch(error => {
  //       console.log(error);
  //     })
  //   }).catch(function (error) {
  //     console.log(error);
  //   })


  // .signInWithPopup(provider)
  // .then(result => {
  //   // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  //   const token = result.credential.accessToken;

  // }).catch(function (error) {
  //   console.log(error);
  // });
  // axios.get('/api/get/test')
  //   .then(response => {
  //     console.log(response);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
  //}

  componentWillMount() {
    axios
      .get(`/api/get/charts/${this.props.uid}`)
      .then(response => {
        console.log(response);
        this.setState({ image: response.data.image });
        //console.log(this.props.uid);
        console.log("blank");
      }).catch(error => {
        console.log(error);
      })
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
      this.setState({ error: "Time period can't be the same" });
    }
  }

  clickHandlerq1(q1w, q1w2, q1d) {
    let data = {
      uid: this.props.uid,
      query1watch: q1w,
      query1watch2: q1w2,
      query1date: q1d.split('+')[0],
      //query1duration: q1du,
    };


    axios
      .get(`/api/get/query1/${data.uid}/${data.query1watch}/${data.query1watch2}/${data.query1date}`)
      .then(response => {
        console.log("1234567876543")
        this.setState({ image: response.data.image });
        this.setState({ extraData: response.data.stats })
        console.log(response.data.stats);

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
    this.clickHandlerq1(
      this.state.optionSelection1Current,
      this.state.optionSelection2Current,
      this.state.query1date,
      //this.refs.query1duration.value,
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



  optionSelection1(item) {
    console.log(item)
    let core = ["activeenergyburned", "deepsleep", "flightsclimbed", "heartrate", "sleep", "sleepheartrate", "stepcounter", "walkingrunningdistance", "stresslevel", "tirednesslevel", "activitylevel", "healthinesslevel"];
    let values = this.state.optionSelection1Values;
    if (item === undefined || item === null) {
      values = values.filter(i => {
        if (i !== this.state.optionSelection2Current) {
          console.log("================================")
          console.log(i)
          console.log("================================")
          return i;
        }
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
    let core = ["activeenergyburned", "deepsleep", "flightsclimbed", "heartrate", "sleep", "sleepheartrate", "stepcounter", "walkingrunningdistance", "stresslevel", "tirednesslevel", "activitylevel", "healthinesslevel"];
    let values = this.state.optionSelection2Values;
    if (item === undefined || item === null) {
      values = values.filter(i => {
        if (i !== this.state.optionSelection1Current) {
          return i;
        }
      });
    }
    console.log(values)
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
    console.log();
  }

  filterOption2(event) {
    this.setState({ timeOptions1Current: event.target.value });
    console.log();
  }


  selectionfilterOption1(event) {
    this.setState({ optionSelection2Current: event.target.value });
    console.log();
  }

  selectionfilterOption2(event) {
    this.setState({ optionSelection1Current: event.target.value });
    console.log(event.target.value);
  }



  render() {
    //conditional rendering

    const parameter1 = this.state.optionSelection1Current;
    const parameter2 = this.state.optionSelection2Current;


    const state = this.state;
    const calendar = (<Calendar
      locale={cn ? zhCN : enUS}
      style={{ zIndex: 1000 }}
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

        <h2>Query 1:</h2>
        <span>I would like to see if</span>
        {this.optionSelection1()}
        <span>is related to</span>
        {this.optionSelection2()}
        <span>during</span>

        <div style={{ width: 400, margin: 20 }}>
          <div style={{ marginBottom: 10 }}>
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
                      <input ref="query1DateValue" onChange={this.dateState}
                        placeholder="please select"
                        style={{ width: 250 }}
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
            this.clickedq1();
          }}
        >
          Submit
                </button>


        {this.state.image ? (
          <img src={`data:image/png;base64, ${this.state.image}`} />
        ) : (
            console.log("there is no image to display")
          )}


        {console.log()}
        {console.log(userInputValues.includes(this.state.optionSelection2Current) && watchInputValues.includes(this.state.optionSelection1Current))}

        {
          userInputValues.includes(this.state.optionSelection1Current) && watchInputValues.includes(this.state.optionSelection2Current) || userInputValues.includes(this.state.optionSelection2Current) && watchInputValues.includes(this.state.optionSelection1Current) ?
            this.state.extraData ?
              <Accordion text="More Information">
                <FurtherInformationMoodWatch extraData={this.state.extraData} optionSelection1Current={this.state.optionSelection1Current} optionSelection2Current={this.state.optionSelection2Current} />
              </Accordion> : ''

            :
            this.state.extraData ?
              <Accordion text="More Information">
                <FurtherInformation extraData={this.state.extraData} optionSelection1Current={this.state.optionSelection1Current} optionSelection2Current={this.state.optionSelection2Current} />
              </Accordion> : ''}

      </div>
    );
  }
}

export default QueryPage;
