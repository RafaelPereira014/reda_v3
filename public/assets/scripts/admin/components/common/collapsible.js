'use strict';

import React from 'react';
import { Component, Fragment } from 'react';

// Components
import Collapse from 'react-bootstrap/lib/Collapse';


export default class Collapsible extends Component {
	_isMounted = true;
	constructor(props) {
		super(props);

		this.state = {
			open: false
		};
	}

	componentDidMount(){
		this._isMounted = true;
		this.setState({
			open: this.props.isOpen || false
		})
	}

	
	componentWillUnmount() {
		this._isMounted=false;
	}
	

	render(){

		const { BtnText } = this.props;

		return(	
            <Fragment>
				{
					BtnText ? 
						<BtnText onClick={() => this.setState({open: !this.state.open})}>
							<button type="button" onClick={() => this.setState({open: !this.state.open})} className="btn__collapse">
								{
									!this.state.open ? <i className="fas fa-chevron-down"></i> : <i className="fas fa-chevron-up"></i>
								}
								
							</button>
						</BtnText>
					:
						<button type="button" onClick={() => this.setState({open: !this.state.open})} className="btn__collapse">
							{
								!this.state.open ? <i className="fas fa-chevron-down"></i> : <i className="fas fa-chevron-up"></i>
							}
							
						</button>
				}                
				<Collapse in={this.state.open} className="collapse-content">
                    {this.props.children}
				</Collapse>
            </Fragment>
		);
	}
}