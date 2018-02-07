import React, { Component } from 'react';
import './accordion.scss';
import Button from '../shared/button/Button';


class Accordion extends Component {
    constructor() {
        super()
        this.state = {
            expanded: false,
        }
    }

    render() {
        return (
            <div>
                <Button text={this.state.expanded ? "Close" : "More Information"} clickEvent={() => { this.setState({ expanded: !this.state.expanded }) }} />
                {this.state.expanded ?
                    <div>
                        {this.props.children}
                    </div>
                    : ''}
            </div>
        )
    }
}

export default Accordion;