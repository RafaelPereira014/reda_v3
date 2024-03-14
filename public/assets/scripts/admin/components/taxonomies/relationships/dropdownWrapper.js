import React, { PureComponent } from 'react';

//  Components
import Dropdown from '#/components/common/dropdown';

export default class RelsListComp extends PureComponent{
    constructor(props) {
        super(props);
        
        //
        //  Handlers
        //
        this.onChange = this.onChange.bind(this);
    }

    onChange(evt){
       this.props.onChange(evt, this.props.level, this.props.relIdx, this.props.meta);
    }

    render(){
        return(
            <Dropdown
                {...this.props}
                onChange={this.onChange}
            />
        )
    }
}