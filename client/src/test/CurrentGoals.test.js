import React from 'react';
import { shallow } from 'enzyme';
import CurrentGoals from '../../src/component/goals/CurrentGoals';
import Adapter from 'enzyme-adapter-react-15';
import { configure } from 'enzyme';
configure({ adapter: new Adapter() });

const data = [{
    current: "594.723",
    data: {
        goalValue: 5000,
        id: 16,
        userid: "dfhdhgdfhd",
        variable: "activeEnergyBurned"
    }
}];

test("It shouldnt render any tables rows if no data is passed", () => {
    const wrapper = shallow(<CurrentGoals />);
    expect(wrapper.find('.currentGoal').length).toEqual(0);
    //console.log(wrapper.debug());
})


test("It should render tables rows if data is passed in", () => {
    const wrapper = shallow(<CurrentGoals data={data} />);
    expect(wrapper.find('.currentGoal').length).toEqual(1);
    //console.log(wrapper.debug());
})

test("formatData should have been called", () => {
    const wrapper = shallow(<CurrentGoals data={data} />);
    expect(wrapper.find('.currentGoal > .value').text()).toEqual("595");
})