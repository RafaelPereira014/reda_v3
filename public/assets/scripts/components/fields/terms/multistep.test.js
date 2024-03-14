'use strict';

import React from 'react';
import {mount} from 'enzyme';
import MultiStep from '#/components/fields/terms/multistep';
import Root from '#/Root';
import { reduxForm } from 'redux-form';

describe('Multistep component', () => {
  let wrapped;
  let props;
  let Proxy;

  beforeEach(() => {
    props = {
      taxonomies: {
        subjects: {
          topRelLevel: 3,
          terms: [
            {
              id: 3,
              title: 'Educação Artística',
              slug: 'educaco-artistica',
              icon: null,
              color: null,
              type: null,
              created_at: '2019-04-23T14:45:28.000Z',
              updated_at: '2019-04-23T14:45:28.000Z',
              deleted_at: null,
              taxonomy_id: 7,
              image_id: null,
              parent_id: null,
              hasResources: 0,
              hasScripts: 0,
              Relationship: [
                {
                  id: 1,
                  terms_relation: {
                    level: 3
                  }
                },
                {
                  id: 2,
                  terms_relation: {
                    level: 3
                  }
                }
              ]
            }
          ]
        },
        macro: {
          topRelLevel: 1,
          terms: [
            {
              id: 1,
              title: 'Artes',
              slug: 'artes-4',
              icon: null,
              color: null,
              type: null,
              created_at: '2019-04-23T14:45:27.000Z',
              updated_at: '2019-04-23T14:45:27.000Z',
              deleted_at: null,
              taxonomy_id: 6,
              image_id: null,
              parent_id: null,
              hasResources: 0,
              hasScripts: 0,
              Relationship: [
                {
                  id: 1,
                  terms_relation: {
                    level: 1
                  }
                },
                {
                  id: 2,
                  terms_relation: {
                    level: 1
                  }
                }
              ]
            }
          ]
        },
        domains: {
          topRelLevel: 4,
          terms: [
            {
              id: 4,
              title: 'Apropriação e reflexão',
              slug: 'apropriaco-e-reflexo',
              icon: null,
              color: null,
              type: null,
              created_at: '2019-02-04T10:38:41.000Z',
              updated_at: '2019-02-04T10:38:41.000Z',
              deleted_at: null,
              taxonomy_id: 8,
              image_id: null,
              parent_id: null,
              hasResources: 0,
              hasScripts: 0,
              Relationship: [
                {
                  id: 1,
                  terms_relation: {
                    level: 4
                  }
                }
              ]
            },
            {
              id: 5,
              title: 'Domínio de teste 1',
              slug: 'dominio-de-teste-1',
              icon: null,
              color: null,
              type: null,
              created_at: '2019-02-04T10:38:41.000Z',
              updated_at: '2019-02-04T10:38:41.000Z',
              deleted_at: null,
              taxonomy_id: 8,
              image_id: null,
              parent_id: null,
              hasResources: 0,
              hasScripts: 0,
              Relationship: [
                {
                  id: 2,
                  terms_relation: {
                    level: 4
                  }
                }
              ]
            }
          ]
        },
        years: {
          topRelLevel: 2,
          terms: [
            {
              id: 2,
              title: '1.º',
              slug: '1-12',
              icon: null,
              color: null,
              type: null,
              created_at: '2019-02-04T10:38:52.000Z',
              updated_at: '2019-02-04T10:38:52.000Z',
              deleted_at: null,
              taxonomy_id: 5,
              image_id: null,
              parent_id: null,
              hasResources: 0,
              hasScripts: 1,
              Relationship: [
                {
                  id: 1,
                  terms_relation: {
                    level: 2
                  }
                },
                {
                  id: 2,
                  terms_relation: {
                    level: 2
                  }
                }
              ]
            }
          ]
        }
      },
      change: jest.fn()
    };

    const spy = jest.fn()
    const Decorated = reduxForm({ 
        form: 'testForm', onSubmit: { spy }
    })(MultiStep);

    Proxy = (options) => (
      <Root>
        <Decorated
          {...options}
        />
      </Root>
    );

    /* wrapped = shallow(<MultiStep {...props}/>); */
    wrapped = mount(<Proxy {...props}/>);
  });

  afterEach(() => {
    wrapped.unmount();
  })

  it('Shows years on macro default', () => {
    const wrappedChild = wrapped.find('MultiStepCheckboxs');

    wrapped.setProps({macro: [1]});

    const firstCheckBox = wrappedChild.find('.macro__selection input[type="checkbox"]').first();

    //  Call the dropdown onChange event with the following data:
    firstCheckBox.simulate('change', { target: {checked: true}});
    
    expect(wrapped.find('.years__selection').length).toEqual(1);
  });

  it('Shows years on macro selection', () => {
    const wrappedChild = wrapped.find('MultiStepCheckboxs');

    wrappedChild.instance().forceUpdate();

    const firstCheckBox = wrappedChild.find('.macro__selection input[type="checkbox"]').first();

    //  Call the dropdown onChange event with the following data:
    firstCheckBox.simulate('change', { target: {checked: true}});
    
    expect(wrapped.find('.years__selection').length).toEqual(1);
  });

  it('Shows subjects on year selection', () => {
    const wrappedChild = wrapped.find('MultiStepCheckboxs');
    
    const firstCheckBox = wrappedChild.find('.macro__selection input[type="checkbox"]').first();
    firstCheckBox.simulate('change', { target: {checked: true}});
    expect(wrapped.find('.years__selection input[type="checkbox"]').length).toBeGreaterThanOrEqual(1);

    wrapped.setProps({macro: [1]});

    const secondCheckBox = wrapped.find('.years__selection input[type="checkbox"]').first();
    secondCheckBox.simulate('change', { target: {checked: true}});
    expect(wrapped.find('.subjects__selection input[type="checkbox"]').length).toBeGreaterThanOrEqual(1);
  });

  it('Shows domains on subjects selection', () => {
    const wrappedChild = wrapped.find('MultiStepCheckboxs');
    
    const firstCheckBox = wrappedChild.find('.macro__selection input[type="checkbox"]').first();
    firstCheckBox.simulate('change', { target: {checked: true}});
    expect(wrapped.find('.years__selection input[type="checkbox"]').length).toBeGreaterThanOrEqual(1);

    wrapped.setProps({macro: [1]});

    const secondCheckBox = wrapped.find('.years__selection input[type="checkbox"]').first();
    secondCheckBox.simulate('change', { target: {checked: true}});
    expect(wrapped.find('.subjects__selection input[type="checkbox"]').length).toBeGreaterThanOrEqual(1);

    wrapped.setProps({years: [2]});

    const thirdCheckBox = wrapped.find('.subjects__selection input[type="checkbox"]').first();
    thirdCheckBox.simulate('change', { target: {checked: true}});
    expect(wrapped.find('.domains__selection input[type="checkbox"]').length).toBeGreaterThanOrEqual(1);
  });
});