import React from 'react';
import { shallow } from 'enzyme';
import GoalInput from '../../src/component/goals/GoalInput';
import Adapter from 'enzyme-adapter-react-15';
import { configure } from 'enzyme';
configure({ adapter: new Adapter() });




test("It should render all options for the fitness data", () => {
    const wrapper = shallow(<GoalInput />);
    expect(wrapper.find('option').length).toEqual(9);
})


test("the default state should match the first item", () => {
    const wrapper = shallow(<GoalInput />);
    expect(wrapper.state().variable).toEqual("heartRate");
    const option = wrapper.find('option').first().text();
    expect(option).toEqual("Heart Rate")
})

