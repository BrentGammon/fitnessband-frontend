import React from 'react';
import { shallow } from 'enzyme';
import UserInputItem from '../../src/component/form/UserInputItem';
import Adapter from 'enzyme-adapter-react-15';
import { configure } from 'enzyme';
configure({ adapter: new Adapter() });
test("The div class name should be userinputitem__error when error prop is passed in", () => {
    const wrapper = shallow(<UserInputItem error={true} />);
    expect(wrapper.find('.userinputitem__error').length).toEqual(1);
})

test("The div class name shouldn't be userinputitem when error prop is passed in", () => {
    const wrapper = shallow(<UserInputItem error={true} />);
    expect(wrapper.find('.userinputitem').length).toEqual(0);
})

test("The div class name should be userinputitem when  error prop is passed in", () => {
    const wrapper = shallow(<UserInputItem error={true} />);
    expect(wrapper.find('.userinputitem').length).toEqual(0);
})

test("The div class name shouldn't be userinputitem__error when error prop is passed in", () => {
    const wrapper = shallow(<UserInputItem error={false} />);
    expect(wrapper.find('.userinputitem').length).toEqual(1);
})

test("The value prop should be rendered", () => {
    const wrapper = shallow(<UserInputItem value={"value"} error={false} />);
    expect(wrapper.text()).toEqual("value");
    //console.log(wrapper.debug());
})

test("The title prop should be rendered", () => {
    const wrapper = shallow(<UserInputItem title={"title"} error={false} />);
})


test("The value prop should be rendered", () => {
    const wrapper = shallow(<UserInputItem subTitle={"subtitle"} error={false} />);
    expect(wrapper.text()).toEqual("subtitle");
})