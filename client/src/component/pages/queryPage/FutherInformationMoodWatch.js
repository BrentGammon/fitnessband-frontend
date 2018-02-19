import React, { Component } from 'react';
import './furtherinformation.scss';

class FutherInformationMoodWatch extends Component {
    render() {
        return (
            <div className="furtherInformation">
                {console.log(this.props.extraData)}

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
                            <td>{this.props.extraData ? this.props.extraData['hourT']['tValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['hourT']['pValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['hourT']['MD'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData["hourT"]['confInt'][0] + '     ' + this.props.extraData["hourT"]['confInt'][1] : ''}</td>
                        </tr>
                        <tr>
                            <td>3 Hour</td>
                            <td>{this.props.extraData ? this.props.extraData['threehourT']['tValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['threehourT']['pValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['threehourT']['MD'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData["threehourT"]['confInt'][0] + '     ' + this.props.extraData["threehourT"]['confInt'][1] : ''}</td>
                        </tr>
                        <tr>
                            <td>6 Hour</td>
                            <td>{this.props.extraData ? this.props.extraData['sixhourT']['tValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['sixhourT']['pValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['sixhourT']['MD'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData["sixhourT"]['confInt'][0] + '     ' + this.props.extraData["sixhourT"]['confInt'][1] : ''}</td>
                        </tr>
                        <tr>
                            <td>12 Hour</td>
                            <td>{this.props.extraData ? this.props.extraData['twelvehourT']['tValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['twelvehourT']['pValue'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['twelvehourT']['MD'][0] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData["twelvehourT"]['confInt'][0] + '     ' + this.props.extraData["twelvehourT"]['confInt'][1] : ''}</td>
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
                            <td>{this.props.extraData ? '3 Hours' : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['threehourCor'][0] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? '6 Hours' : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['sixhourCor'][0] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? '12 Hours' : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['twelvehourCor'][0] : ''}</td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <thead>
                        <tr>
                            <th>Summary of Watch Data</th>
                        </tr>
                        <tr>
                            <th>Hour</th>
                            <th>3 Hours</th>
                            <th>6 Hours</th>
                            <th>12 Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryHour'][0]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryThreeHour'][0]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummarySixHour'][0]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryTwelveHour'][0]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryHour'][1]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryThreeHour'][1]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummarySixHour'][1]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryTwelveHour'][1]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryHour'][2]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryThreeHour'][2]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummarySixHour'][2]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryTwelveHour'][2]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryHour'][3]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryThreeHour'][3]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummarySixHour'][3]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryTwelveHour'][3]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryHour'][4]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryThreeHour'][4]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummarySixHour'][4]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryTwelveHour'][4]['Freq'] : ''}</td>
                        </tr>
                        <tr>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryHour'][5]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryThreeHour'][5]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummarySixHour'][5]['Freq'] : ''}</td>
                            <td>{this.props.extraData ? this.props.extraData['watchSummaryTwelveHour'][5]['Freq'] : ''}</td>
                        </tr>
                    </tbody>
                </table>


            </div>
        )
    }
}

export default FutherInformationMoodWatch;