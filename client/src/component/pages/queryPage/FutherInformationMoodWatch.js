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
                            {this.props.extraData['hourT'] ? <td>Hour</td> : <td></td>}
                            {this.props.extraData['hourT'] ? <td>{this.props.extraData['hourT']['tValue'][0]}</td> : <td></td>}
                            {this.props.extraData['hourT'] ? <td>{this.props.extraData['hourT']['pValue'][0]}</td> : <td></td>}
                            {this.props.extraData['hourT'] ? <td>{this.props.extraData['hourT']['MD'][0]}</td> : <td></td>}
                            {this.props.extraData['hourT'] ? <td>{this.props.extraData["hourT"]['confInt'][0] + '     ' + this.props.extraData["hourT"]['confInt'][1]}</td> : <td></td>}
                        </tr>
                        <tr>
                            {this.props.extraData['threehourT'] ? <td>3 Hour</td> : <td></td>}
                            {this.props.extraData['threehourT'] ? <td>{this.props.extraData['threehourT']['tValue'][0]}</td> : <td></td>}
                            {this.props.extraData['threehourT'] ? <td>{this.props.extraData['threehourT']['pValue'][0]}</td> : <td></td>}
                            {this.props.extraData['threehourT'] ? <td>{this.props.extraData['threehourT']['MD'][0]}</td> : <td></td>}
                            {this.props.extraData['threehourT'] ? <td>{this.props.extraData["threehourT"]['confInt'][0] + '     ' + this.props.extraData["threehourT"]['confInt'][1]}</td> : <td></td>}
                        </tr>
                        <tr>
                            {this.props.extraData['sixhourT'] ? <td>6 Hour</td> : <td></td>}
                            {this.props.extraData['sixhourT'] ? <td>{this.props.extraData['sixhourT']['tValue'][0]}</td> : <td></td>}
                            {this.props.extraData['sixhourT'] ? <td>{this.props.extraData['sixhourT']['pValue'][0]}</td> : <td></td>}
                            {this.props.extraData['sixhourT'] ? <td>{this.props.extraData['sixhourT']['MD'][0]}</td> : <td></td>}
                            {this.props.extraData['sixhourT'] ? <td>{this.props.extraData["sixhourT"]['confInt'][0] + '     ' + this.props.extraData["sixhourT"]['confInt'][1]}</td> : <td></td>}
                        </tr>
                        <tr>
                            {this.props.extraData['twelvehourT'] ? <td>12 Hour</td> : <td></td>}
                            {this.props.extraData['twelvehourT'] ? <td>{this.props.extraData['twelvehourT']['tValue'][0]}</td> : <td></td>}
                            {this.props.extraData['twelvehourT'] ? <td>{this.props.extraData['twelvehourT']['pValue'][0]}</td> : <td></td>}
                            {this.props.extraData['twelvehourT'] ? <td>{this.props.extraData['twelvehourT']['MD'][0]}</td> : <td></td>}
                            {this.props.extraData['twelvehourT'] ? <td>{this.props.extraData["twelvehourT"]['confInt'][0] + '     ' + this.props.extraData["twelvehourT"]['confInt'][1]}</td> : <td></td>}
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
                            {this.props.extraData['hourCor'] ? <td>{'1 Hour'}</td> : <td></td>}
                            {this.props.extraData['hourCor'] ? <td>{this.props.extraData['hourCor'][0]}</td> : <td></td>}
                        </tr>
                        <tr>
                            {this.props.extraData['threehourCor'] ? <td>{'3 Hours'}</td> : <td></td>}
                            {this.props.extraData['threehourCor'] ? <td>{this.props.extraData['threehourCor'][0]}</td> : <td></td>}
                        </tr>
                        <tr>
                            {this.props.extraData['sixhourCor'] ? <td>{'6 Hours'}</td> : <td></td>}
                            {this.props.extraData['sixhourCor'] ? <td>{this.props.extraData['sixhourCor'][0]}</td> : <td></td>}
                        </tr>
                        <tr>
                            {this.props.extraData['twelvehourCor'] ? <td>{'12 Hours'}</td> : <td></td>}
                            {this.props.extraData['twelvehourCor'] ? <td>{this.props.extraData['twelvehourCor'][0]}</td> : <td></td>}
                        </tr>
                    </tbody>
                </table>

                <table>
                    <thead>
                        <tr>
                            <th>Summary of Watch Data</th>
                        </tr>
                        <tr>
                            {this.props.extraData['watchSummaryHour'] ? <th>Hour</th> : <td></td>}
                            {this.props.extraData['watchSummaryThreeHour'] ? <th>3 Hours</th> : <td></td>}
                            {this.props.extraData['watchSummarySixHour'] ? <th>6 Hours</th> : <td></td>}
                            {this.props.extraData['watchSummaryTwelveHour'] ? <th>12 Hours</th> : <td></td>}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {this.props.extraData['watchSummaryHour'] ? <td>{this.props.extraData['watchSummaryHour'][0]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummaryThreeHour'] ? <td>{this.props.extraData['watchSummaryThreeHour'][0]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummarySixHour'] ? <td>{this.props.extraData['watchSummarySixHour'][0]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummaryTwelveHour'] ? <td>{this.props.extraData['watchSummaryTwelveHour'][0]['Freq']}</td> : <td></td>}
                        </tr>
                        <tr>
                            {this.props.extraData['watchSummaryHour'] ? <td>{this.props.extraData['watchSummaryHour'][1]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummaryThreeHour'] ? <td>{this.props.extraData['watchSummaryThreeHour'][1]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummarySixHour'] ? <td>{this.props.extraData['watchSummarySixHour'][1]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummaryTwelveHour'] ? <td>{this.props.extraData['watchSummaryTwelveHour'][1]['Freq']}</td> : <td></td>}
                        </tr>
                        <tr>
                            {this.props.extraData['watchSummaryHour'] ? <td>{this.props.extraData['watchSummaryHour'][2]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummaryThreeHour'] ? <td>{this.props.extraData['watchSummaryThreeHour'][2]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummarySixHour'] ? <td>{this.props.extraData['watchSummarySixHour'][2]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummaryTwelveHour'] ? <td>{this.props.extraData['watchSummaryTwelveHour'][2]['Freq']}</td> : <td></td>}
                        </tr>
                        <tr>
                            {this.props.extraData['watchSummaryHour'] ? <td>{this.props.extraData['watchSummaryHour'][3]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummaryThreeHour'] ? <td>{this.props.extraData['watchSummaryThreeHour'][3]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummarySixHour'] ? <td>{this.props.extraData['watchSummarySixHour'][3]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummaryTwelveHour'] ? <td>{this.props.extraData['watchSummaryTwelveHour'][3]['Freq']}</td> : <td></td>}
                        </tr>
                        <tr>
                            {this.props.extraData['watchSummaryHour'] ? <td>{this.props.extraData['watchSummaryHour'][4]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummaryThreeHour'] ? <td>{this.props.extraData['watchSummaryThreeHour'][4]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummarySixHour'] ? <td>{this.props.extraData['watchSummarySixHour'][4]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummaryTwelveHour'] ? <td>{this.props.extraData['watchSummaryTwelveHour'][4]['Freq']}</td> : <td></td>}
                        </tr>
                        <tr>
                            {this.props.extraData['watchSummaryHour'] ? <td>{this.props.extraData['watchSummaryHour'][5]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummaryThreeHour'] ? <td>{this.props.extraData['watchSummaryThreeHour'][5]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummarySixHour'] ? <td>{this.props.extraData['watchSummarySixHour'][5]['Freq']}</td> : <td></td>}
                            {this.props.extraData['watchSummaryTwelveHour'] ? <td>{this.props.extraData['watchSummaryTwelveHour'][5]['Freq']}</td> : <td></td>}
                        </tr>
                    </tbody>
                </table>


            </div>
        )
    }
}

export default FutherInformationMoodWatch;