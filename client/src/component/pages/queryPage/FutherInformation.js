import React, { Component } from 'react';
import './furtherinformation.scss';

class FutherInformation extends Component {
    render() {
        return (
            <div className="furtherInformation">
                <table>
                    <thead>
                        <tr>
                            <th>Summary of {this.props.optionSelection1Current}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['dataset1'][0]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['dataset1'][1]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['dataset1'][2]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['dataset1'][3]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['dataset1'][4]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['dataset1'][5]['Freq'] : ''}</td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <thead>
                        <tr>
                            <th>Summary of {this.props.optionSelection2Current}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['dataset2'][0]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['dataset2'][1]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['dataset2'][2]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['dataset2'][3]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['dataset2'][4]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['dataset2'][5]['Freq'] : ''}</td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <thead>
                        <tr>
                            <th>Correlation Results</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.props.extraData ? '1 Hour' : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['hourCor'][0] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? '1 Day' : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['1dayCor'][0] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? '7 Day' : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['7daysCor'][0] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? '30 Days' : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['30daysCor'][0] : ''}</td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <thead>
                        <tr>
                            <th>T Test Results</th>
                        </tr>
                        <tr>
                            <th>Duration</th>
                            <th>T Value</th>
                            <th>P Value</th>
                            <th>MD</th>
                            <th>confint</th>
                        </tr>

                    </thead>
                    <tbody>
                        <tr>
                            <td>Hour</td>
                            <td>{this.props.extraData ? this.props.extraData['hourTest']['tValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['hourTest']['pValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['hourTest']['MD'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData["hourTest"]['confInt'][0] + '     ' + this.props.extraData["hourTest"]['confInt'][0] : ''}</td>
                        </tr>
                        <tr>
                            <td>1 Day</td>
                            <td>{this.props.extraData ? this.props.extraData['1dayTest']['tValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['1dayTest']['pValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['1dayTest']['MD'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData["1dayTest"]['confInt'][0] + '     ' + this.props.extraData["hourTest"]['confInt'][0] : ''}</td>
                        </tr>
                        <tr>
                            <td>7 Days</td>
                            <td>{this.props.extraData ? this.props.extraData['7daysTest']['tValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['7daysTest']['pValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['7daysTest']['MD'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData["7daysTest"]['confInt'][0] + '     ' + this.props.extraData["hourTest"]['confInt'][0] : ''}</td>
                        </tr>
                        <tr>
                            <td>30 Days</td>
                            <td>{this.props.extraData ? this.props.extraData['30daysTest']['tValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['30daysTest']['pValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['30daysTest']['MD'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData["30daysTest"]['confInt'][0] + '     ' + this.props.extraData["hourTest"]['confInt'][0] : ''}</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        )
    }
}

export default FutherInformation;