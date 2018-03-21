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
                            <td>{this.props.extraData ? this.props.extraData[1][0]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData[1][1]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData[1][2]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData[1][3]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData[1][4]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData[1][5]['Freq'] : ''}</td>
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
                            <td>{this.props.extraData ? this.props.extraData[2][0]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData[2][1]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData[2][2]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData[2][3]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData[2][4]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData[2][5]['Freq'] : ''}</td>
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
                            <td>{this.props.extraData ? this.props.extraData[3][0][0] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? '1 Day' : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData[4][0][0] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? '7 Day' : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData[5][0][0] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? '30 Days' : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData[6][0][0] : ''}</td>
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
                        {this.props.extraData['hourTest'] ?
                            <tr>
                                <td>Hour</td>
                                <td>{this.props.extraData ? this.props.extraData['hourTest']['tValue'][0] : ''}</td>
                                <td>{this.props.extraData ? this.props.extraData['hourTest']['pValue'][0] : ''}</td>
                                <td>{this.props.extraData ? this.props.extraData['hourTest']['MD'][0] : ''}</td>
                                <td>{this.props.extraData ? this.props.extraData["hourTest"]['confInt'][0] + '     ' + this.props.extraData["hourTest"]['confInt'][0] : ''}</td>
                            </tr>
                            :
                            <tr>
                                <td>Hour</td>
                                <td>NA</td>
                            </tr>
                        }
                        {this.props.extraData['1dayTest'] ?
                            <tr>
                                <td>1 Day</td>
                                <td>{this.props.extraData ? this.props.extraData['1dayTest']['tValue'][0] : ''}</td>
                                <td>{this.props.extraData ? this.props.extraData['1dayTest']['pValue'][0] : ''}</td>
                                <td>{this.props.extraData ? this.props.extraData['1dayTest']['MD'][0] : ''}</td>
                                <td>{this.props.extraData ? this.props.extraData["1dayTest"]['confInt'][0] + '     ' + this.props.extraData["hourTest"]['confInt'][0] : ''}</td>
                            </tr>
                            :
                            <tr>
                                <td>1 Day</td>
                                <td>NA</td>
                            </tr>
                        }

                        {this.props.extraData['7daysTest'] ?
                            <tr>
                                <td>7 Days</td>
                                <td>{this.props.extraData ? this.props.extraData['7daysTest']['tValue'][0] : ''}</td>
                                <td>{this.props.extraData ? this.props.extraData['7daysTest']['pValue'][0] : ''}</td>
                                <td>{this.props.extraData ? this.props.extraData['7daysTest']['MD'][0] : ''}</td>
                                <td>{this.props.extraData ? this.props.extraData["7daysTest"]['confInt'][0] + '     ' + this.props.extraData["hourTest"]['confInt'][0] : ''}</td>
                            </tr>
                            :
                            <tr>
                                <td>7 Days</td>
                                <td>NA</td>
                            </tr>
                        }

                        {this.props.extraData['30daysTest'] ?
                            <tr>
                                <td>30 Days</td>
                                <td>{this.props.extraData['30daysTest'] ? this.props.extraData['30daysTest']['tValue'][0] : ''}</td>
                                <td>{this.props.extraData['30daysTest'] ? this.props.extraData['30daysTest']['pValue'][0] : ''}</td>
                                <td>{this.props.extraData['30daysTest'] ? this.props.extraData['30daysTest']['MD'][0] : ''}</td>
                                <td>{this.props.extraData['30daysTest'] ? this.props.extraData["30daysTest"]['confInt'][0] + '     ' + this.props.extraData["hourTest"]['confInt'][0] : ''}</td>
                            </tr>
                            :
                            <tr>
                                <td>30 Days</td>
                                <td>NA</td>
                            </tr>
                        }

                    </tbody>
                </table>
                <div className="description">
                    <span>The t-value measures the size of the difference relative to the variation in your sample data.</span>
                    <br></br>
                    <span>The p-value, or calculated probability, is the probability of finding the observed, or more extreme, results when the null hypothesis of the study question is true.</span>
                    <br></br>
                    <span>The mean difference, or the difference in means, measures the absolute difference between the mean value in two different groups.</span>
                    <br></br>
                    <span>The confidence interval is half of the distance between the upper bound of the confidence interval and the lower bound of the confidence level.</span>
                </div>
            </div>
        )
    }
}

export default FutherInformation;