import React, { Component } from "react";
import "./summary.scss";

class Summary extends Component {
    render() {
        return (
            <div className="summary">
                <p className="value">{this.props.value}</p>
                <p className="label">{this.props.label}</p>
            </div>
        )
    }
}

export default Summary;