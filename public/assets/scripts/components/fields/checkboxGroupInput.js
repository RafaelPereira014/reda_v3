import React from 'react';
import _ from 'lodash';

import {CheckboxGroup, Checkbox} from 'react-checkbox-group';
import CheckGroup from '#/components/common/checkboxGroup';

// Utils
import { getBreaker } from '#/utils/list';

//  Get object with years seperated by each section, based on mapping
const seperateYears = (list) => {
  let yearsMapping = [
    {
        years: [
            'Pré-escolar',
        ],
        title: 'Pré-escolar',
        key:'pre_escolar'
    },
    {
        years: [
            '1.º',
            '2.º',
            '3.º',
            '4.º'
        ],
        title: '1.º Ciclo',
        key:'1_ciclo'
    },
    {
        years: [
            '5.º',
            '6.º'
        ],
        title: '2.º Ciclo',
        key:'2_ciclo'
    },
    {
        years: [
            '7.º',
            '8.º',
            '9.º'
        ],
        title: '3.º Ciclo',
        key:'3_ciclo'
    },
    {
        years: [
            '10.º',
            '11.º',
            '12.º'
        ],
        title: 'Secundário',
        key:'secundario'
    },
    {
        years: [
            'Nível A1',
            'Nível A2',
            'Nível B1'
        ],
        title: 'Níveis de proficiência linguística',
        key:'niveis'
    }
  ];

  let finalObj = {};

  let foundObjs = [];

  //  Build object
  yearsMapping.map(year => {
    let thisList = list.filter(el => year.years.indexOf(el.title)>=0);
    foundObjs = foundObjs.concat(thisList.reduce((acc, cur) => [...acc, cur.id], []));
    if(thisList && thisList.length>0){
      if(!finalObj.hasOwnProperty(year.key)){
        finalObj[year.key] = {
          title: year.title,
          list: []
        }
      }
  
      finalObj[year.key].list = thisList;
    }
  });

  let hasOthers = list.filter(el => foundObjs.indexOf(el.id)<0);

  if(hasOthers && hasOthers.length>0){
    finalObj['others'] = {
      title: 'Outros',
      list: hasOthers
    }
  }

  return finalObj;
  
}

export default ({
	input, 
	meta: { 
		touched, 
		error, 
		invalid 
	}, 
	formGroupClassName, 
  className,
	handleOnChange,
	list,
	orderBy,
	textIndex,
  valueKey,
  customCheckbox,
  cols,
  elIndex,
  extraClass,
  colClass,
  isYears
}) => {

  const checkboxCols = cols || { lg:3, md:3, sm:4 };
  let colsClasses = '';
  const colsKeys = Object.keys(checkboxCols);

  if(colsKeys.indexOf('xs')<0){
    colsClasses+=`col-xs-6`;
  }


  colsKeys.map(key => {
    if(colsClasses.length>0){
      colsClasses+=' ';
    }

    colsClasses+=`col-${key}-${checkboxCols[key]}`;
  })

  //const val = (typeof input.value == 'string') ? [] : input.value;

  let val = []
  if(input.value && input.value.id){
  val = (typeof input.value == 'string') ? [] : [input.value.id];
  }else{
    val = (typeof input.value == 'string') ? [] : input.value;
  }

  let finalYears = _.cloneDeep(list);
  
  //  If is to show years, get them seperated by a specific mapping inside the function
  if(isYears){
    finalYears = seperateYears(finalYears);
  }

  return(
    <div className={`${formGroupClassName || ''} ${touched && (invalid) ? 'has-error' : ''}`}>
      {(!customCheckbox) ?
        <CheckboxGroup
          name={input.name}
          value={val}
          onChange={handleOnChange}
          >

            {
              //  If is years, show seperated by the mapping
              isYears ?
                <div className="flex-container flex-row margin__top--10">
                  {
                    Object.keys(finalYears).map((itemKey) => {
                      return (
                        <div className="flex-col-xs-6 flex-col-sm-4 flex-col-md-3 flex-col-lg-2 margin__bottom--15" key={itemKey}>
                          <em>{finalYears[itemKey].title}</em>
                          {
                            finalYears[itemKey].list.map((curYear,index) => 
                              <div key={curYear.id || index} className={(extraClass || '')}>
                                <Checkbox value={(valueKey && curYear[valueKey]) || curYear.id} id={input.name+"-"+(curYear.id || index)}/> 
                                <label htmlFor={input.name+"-"+(curYear.id || index)}>{curYear[textIndex || 'title']}</label>
                              </div>
                            )
                          }                      
                        </div>
                      )
                    })
                  }
                </div>
              :
              //  If is not years, show normal
              <div className="row">
                {_.sortBy(list, orderBy).map((item,index) => {
                  return (
                    <div key={item.id || index} className={(colClass || '') || ((extraClass || '') + colsClasses + getBreaker(index, checkboxCols))}>
                      <Checkbox value={(valueKey && item[valueKey]) || item.id} id={input.name+"-"+(item.id || index)}/> 
                      <label htmlFor={input.name+"-"+(item.id || index)}>{item[textIndex || 'title']}</label>
                    </div>
                  )
                })}
              </div>
            }
        </CheckboxGroup>

        :

        <CheckGroup 
          name={input.name}
          value={val} 
          cols={checkboxCols}
          index={elIndex}
          onChange={handleOnChange} 
          data={list}
          extraClass={className}/>
      }
      {touched && error && <div className="text-danger">{error}</div>}
      </div>
  );
};