import React from 'react';
import { shallow } from 'enzyme';
import Accordion from '../../src/component/shared/Accordion';
import Adapter from 'enzyme-adapter-react-15';
import { configure } from 'enzyme';
configure({ adapter: new Adapter() });



test("display children whe Accordion is open", () => {
    const wrapper = shallow(<Accordion><p>1</p><p>2</p></Accordion>);
    wrapper.setState({ expanded: true });
    expect(wrapper.find('p').length).toEqual(2);

})



test("should notdisplay children whe Accordion is closed", () => {
    const wrapper = shallow(<Accordion><p>1</p><p>2</p></Accordion>);
    wrapper.setState({ expanded: false });
    expect(wrapper.find('p').length).toEqual(0);

})