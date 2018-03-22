import React from 'react';
import { shallow } from 'enzyme';
import DashboardPlot from '../../src/component/home/DashboardPlot';
import Adapter from 'enzyme-adapter-react-15';
import { configure } from 'enzyme';
configure({ adapter: new Adapter() });



test("should have the options in the dropdown list", () => {
    const wrapper = shallow(<DashboardPlot uid={"1234567"} options={["activeEnergyBurned", "deepSleep", "flightsClimbed", "heartRate", "sleep", "sleepHeartRate", "stepCounter", "walkingRunningDistance"]} />);
    expect(wrapper.find('input').length).toEqual(8);
})

test("the option text should be formated from camelcase", () => {
    const wrapper = shallow(<DashboardPlot uid={"1234567"} options={["activeEnergyBurned", "deepSleep", "flightsClimbed", "heartRate", "sleep", "sleepHeartRate", "stepCounter", "walkingRunningDistance"]} />);
    expect(wrapper.find('.checkbox').first().text()).toEqual('Active Energy Burned');
})

test("shouldnt display an image tag if no image is set in state", () => {
    const wrapper = shallow(<DashboardPlot uid={"1234567"} options={["activeEnergyBurned", "deepSleep", "flightsClimbed", "heartRate", "sleep", "sleepHeartRate", "stepCounter", "walkingRunningDistance"]} />);
    expect(wrapper.find('.dashboardPlotBlank').length).toEqual(1);
})

test("should display an image tag if image is set in state", () => {
    const wrapper = shallow(<DashboardPlot uid={"1234567"} options={["activeEnergyBurned", "deepSleep", "flightsClimbed", "heartRate", "sleep", "sleepHeartRate", "stepCounter", "walkingRunningDistance"]} />);
    console.log(wrapper.find('img'))
    wrapper.setState({ image: "2wfef4" })
    expect(wrapper.find('img').length).toEqual(1);
})

