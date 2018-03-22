import React from 'react';
import { shallow } from 'enzyme';
import Button from '../../src/component/shared/button/Button';
import Adapter from 'enzyme-adapter-react-15';
import { configure } from 'enzyme';
configure({ adapter: new Adapter() });


test("Button will display text", () => {
    const wrapper = shallow(<Button text={"click"} />);
    expect(wrapper.find('button').text()).toEqual("click");
})
