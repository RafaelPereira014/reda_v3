'use strict';

import React from 'react';

const others = ["outras","outros","outra","outro","n/a","não se aplica", "outros, legendado em português", "outro utilizador"];
const exclude = ["todos", "todas"];

const renderList = (props) => {
	const { list, name, setRadio, checked, singleCol, reverse, descKey } = props;

	let othersItem = [];
	let colClass = singleCol ? "col-xs-12" : "col-xs-6 col-sm-4";

	// Filter list to exclude Others
	let filteredList = list.filter(item => {
		// Is to hide
		if (exclude.indexOf(item[descKey || "title"].toLowerCase())>=0){
			return false;
		}

		// Is to go last
		if (others.indexOf(item[descKey || "title"].toLowerCase())>=0){
			othersItem.push(item);
			return false;
		}

		return true;
	});

	// Reversed list?
	if (reverse){
		filteredList.reverse();
	}	

	// Map list without Others
	filteredList = filteredList.map((item) => {			
		return(<div className={colClass} key={item.id}>
			<div className="radio">
				<input id={name + "_" + item.id} type="radio" name={name} value={item[descKey || "title"]} onChange={() => setRadio(item)} checked={item.id==checked.id}/>
				<label htmlFor={name + "_" + item.id} >{item[descKey || "title"]}</label>
			</div>
		</div>)
	});

	// Add Others if any
	if (othersItem && othersItem.length>0){	
		othersItem.reverse();
		othersItem.map(item => {
			filteredList.push(
				<div className={colClass} key={item.id}>
					<div className="radio">
						<input id={name + "_" + item.id} type="radio" name={name} value={item[descKey || "title"]} onChange={() => setRadio(item)} checked={item.id==checked.id}/>
						<label htmlFor={name + "_" + item.id} >{item[descKey || "title"]}</label>
					</div>
				</div>
			);	
		})			
	}
	

	return filteredList;


}

export default (props) => {
	return(
		<div className="row">
			{renderList(props)}
		</div>
	);
}