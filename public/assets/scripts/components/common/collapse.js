'use strict';

import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import Collapse from 'react-bootstrap/lib/Collapse';
import ConfirmBox from '#/components/common/confirmBox';


export default class Collapsible extends Component {
	constructor(props) {
		super(props);

		this.state = {open: null};

		//
		//	Renders
		//
		this.renderDeleteAction = this.renderDeleteAction.bind(this);
	}

	componentDidMount(){
		this.setState({
			open: this.props.isOpen || false
		})
	}

	componentDidUpdate(prevProps){

		if(prevProps.isOpen!==this.props.isOpen){
			this.setState({
				open: this.props.isOpen || false
			})
		}		
	}

	/* shouldComponentUpdate(nextProps, nextState){
		return nextProps.isOpen!= this.props.isOpen || nextState.open!=this.state.open;
	} */

	renderDeleteAction(){
		if (this.props.continueAction){
			return (
				<ConfirmBox continueAction={this.props.continueAction}>
					<i className={this.props.deleteIcon} title="Eliminar"></i>
				</ConfirmBox> 
			)
		}

		return null;
	}

	render(){
		const RenderTitle = this.props.RenderTitle || null;
		return(
			<div className="collapse-container">				
				<div className={"buttons " + (this.props.className || '') + (this.state.open ? " open" : "")}>

					{/*(() => {
						if (this.props.deleteEl){
							return <i className={this.props.deleteIcon || null} onClick={() => this.props.deleteEl()} title={deleteTitle}></i>
						}
					})()*/}
					{this.renderDeleteAction()}
					<button onClick={ ()=> this.setState({ open: !this.state.open })} type="button" title={this.state.open ? 'Fechar zona colapsável' : 'Abrir zona colapsável'}>
						{
							RenderTitle ? <RenderTitle/>
							:
							<span>
								{this.props.title}
							</span> 
						}
						
						<i className={(this.state.open) ? this.props.iconOpen : this.props.iconClosed}></i>
					</button>
				</div>
				<Collapse in={this.state.open} className="collapse-content">
					<div>
						{this.props.children}
					</div>
				</Collapse>
			</div>
		);
	}
}

Collapsible.propTypes = {
	title: PropTypes.string.isRequired,
	className: PropTypes.string,
	iconOpen: PropTypes.string.isRequired,
	iconClosed: PropTypes.string.isRequired,
	deleteEl: PropTypes.func,
	deleteIcon: PropTypes.string,
	isOpen: PropTypes.bool,
	continueAction: PropTypes.func
}