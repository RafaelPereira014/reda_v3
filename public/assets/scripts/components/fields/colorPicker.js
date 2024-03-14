import React, { Component } from 'react';
import { ChromePicker } from 'react-color'

export default class ColorPickerField extends Component{
    constructor(props) {
        super(props);

        this.state = {
            displayColorPicker: false
        };

        //
        //  Handler
        //
        this.onInputClick = this.onInputClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
    }

    onInputClick(evt){
        evt.preventDefault();

        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    }

    handleClose(){
        this.setState({ displayColorPicker: false })
    };

    handleChange(color){        
        this.props.changeField("color", color.hex);
    };

    render() {
        const {    
            input, 
            meta: { 
                touched, 
                error, 
                invalid 
            }, 
            formGroupClassName, 
            childPos,
            children,
            changeField,
            ...rest
        } = this.props;

        const popover = {
            position: 'absolute',
            zIndex: '2',
        };

        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }

        const swatch = {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
        }

        const color = {
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: `${ input.value}`,
        }

        return(
            <div className={`${formGroupClassName || ''} ${touched && (invalid) ? 'has-error' : ''}`}>
                {childPos && childPos == "top" && children ? children : null}
                
                <input type="text"
                {...input}
                {...rest}
                onClick={ this.onInputClick }
                autoComplete="off"/>

                {/* <div>
                    <div style={ swatch } onClick={ this.onInputClick }>
                        <div style={ color } />
                    </div>
                </div> */}

                { this.state.displayColorPicker ? 
                    <div style={ popover }>
                        <div style={ cover } onClick={ this.handleClose }/>
                        <ChromePicker
                        color={ input.value }
                        onChange={ this.handleChange }
                        disableAlpha={true}/>
                    </div>
                : 
                    null
                }
        
                {childPos && childPos == "middle" && children ? children : null}
                {touched && error && <div className="text-danger">{error}</div>}
                {childPos && childPos == "bottom" && children ? children : null}
            </div>
        );
    }
};