import React from 'react';
import { shallow } from 'enzyme';
import UserProfile from '../../src/component/userprofile/UserProfile';
import Adapter from 'enzyme-adapter-react-15';
import { configure } from 'enzyme';
configure({ adapter: new Adapter() });

test("it should render the users name", () => {
    const wrapper = shallow(<UserProfile name="brent" email="brentgammon94@gmail.com" />);
    expect(wrapper.find('p').first().text()).toEqual('brent');
})


test("it should render the users email address", () => {
    const wrapper = shallow(<UserProfile name="brent" email="brentgammon94@gmail.com" />);
    expect(wrapper.find('p').last().text()).toEqual('brentgammon94@gmail.com');
})
