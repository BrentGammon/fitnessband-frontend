import React, { Component } from "react";
import Button from "../../shared/button/Button";
import axios from "axios";
import { Redirect } from "react-router";
import "./querypage.scss";

class QueryPage extends Component {
  constructor() {
    super();
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
      timeOptions2Current: "Last Week"
    };
    this.clickHandler = this.clickHandler.bind(this);
    this.resultTag = this.resultTag.bind(this);
    this.timeOptions1 = this.timeOptions1.bind(this);
    this.timeOptions2 = this.timeOptions2.bind(this);
    this.filterOption1 = this.filterOption1.bind(this);
    this.filterOption2 = this.filterOption2.bind(this);
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

  clicked() {
    this.clickHandler(
      this.refs.time1.value,
      this.refs.time2.value,
      this.refs.comparision.value,
      this.refs.mood1.value
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
      </div>
    );
  }
}

export default QueryPage;
