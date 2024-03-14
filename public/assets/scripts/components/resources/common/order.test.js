'use strict';

import React from 'react';
import {shallow} from 'enzyme';
import Order from '#/components/resources/common/order';

describe('Resources order', () => {
  let orderComp;

  beforeEach(() => {
    orderComp = shallow(<Order onChange={() => {}} order="recent"/>);
  });

  it('should render a dropdown list with order options', () => {  
    expect(orderComp.find('select').first().prop('value')).toEqual('recent');
  });

  it('should change the dropdown value to rating', () => {
    const select = orderComp.find('select').first();

    //  Create custom event handler to pass as props for onChange
    const myEventHandler = jest.fn();
    orderComp.setProps({ onChange: myEventHandler});

    //  Call the dropdown onChange event with the following data:
    select.simulate('change', {
      target:{
        value: ['rating--desc']
      }
    });

    //  Expects that the callback function is called with a argument of value 'rating--desc'
    expect(myEventHandler).toHaveBeenCalledWith(['rating--desc']);
  });
});