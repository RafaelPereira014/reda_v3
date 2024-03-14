'use strict';

import React from 'react';

// Components
import { CheckboxGroup, Checkbox } from 'react-checkbox-group';

// Utils
import { getBreaker } from '#/utils/list';

const others = [
  'outras',
  'outros',
  'outra',
  'outro',
  'n/a',
  'outros, legendado em português',
  'todos'
];

let colsList = {
  lg: 3,
  md: 3,
  sm: 4
};

const renderList = (props, list) => {
  const toHide = props.hide || [];

  const { name, colClass, cols, extraClass, descKey } = props;

  if (cols) {
    colsList = cols;
  }

  let othersItem = [];

  // Filter list to exclude Others
  let filteredList = list.filter(item => {
    if (toHide.indexOf(item[descKey || 'title'].toLowerCase()) >= 0) {
      return false;
    }

    if (others.indexOf(item[descKey || 'title'].toLowerCase()) >= 0) {
      othersItem.push(item);
      return false;
    }
    return true;
  });

  //	Set columns classes
  let colsClasses = '';
  const colsKeys = Object.keys(colsList);

  if (colsKeys.indexOf('xs') < 0) {
    colsClasses += `col-xs-6`;
  }

  colsKeys.map(key => {
    if (colsClasses.length > 0) {
      colsClasses += ' ';
    }

    colsClasses += `col-${key}-${colsList[key]}`;
  });

  // Map list without Others
  filteredList = filteredList.map((item, index) => {
    return (
      <div
        key={item.id}
        className={
          colClass ||
          '' ||
          (extraClass || '') + colsClasses + getBreaker(index, colsList)
        }
      >
        <Checkbox value={item.id} id={name + '-' + item.id} />
        <label htmlFor={name + '-' + item.id}>
          {item[descKey || 'title']}
        </label>
      </div>
    );
  });

  // Add Others if any
  if (othersItem && othersItem.length > 0) {
    othersItem.map(item => {
      filteredList.push(
        <div key={item.id} className={colClass || extraClass + ' col-xs-6'}>
          <Checkbox value={item.id} id={name + '-' + item.id} />
          <label htmlFor={name + '-' + item.id}>
            {item[descKey || 'title']}
          </label>
        </div>
      );
    });
  }

  return filteredList;
};

export default props => {
  const { value, onChange, name, data } = props;

  return (
    <CheckboxGroup name={name} value={value} onChange={onChange}>
      <div className="row">{renderList(props, data)}</div>
    </CheckboxGroup>
  );
};
