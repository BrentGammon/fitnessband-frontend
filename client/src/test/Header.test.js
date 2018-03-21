import React from 'react';
import { shallow } from 'enzyme';
import Header from '../../src/component/menu/Header';
import Adapter from 'enzyme-adapter-react-15';
import { configure } from 'enzyme';
configure({ adapter: new Adapter() });
test("The web app will render the ttile ", () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find('.header').text()).toEqual('Does Wearable Technology Work?');

})

