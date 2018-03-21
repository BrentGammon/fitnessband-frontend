import React from 'react';
import { shallow } from 'enzyme';
import Navbar from '../../src/component/menu/Navbar';
import Adapter from 'enzyme-adapter-react-15';
import { configure } from 'enzyme';
configure({ adapter: new Adapter() });


test("should render the nav bar", () => {
    const wrapper = shallow(<Navbar />);
    expect(wrapper.find('NavLink').length).toEqual(4);
})