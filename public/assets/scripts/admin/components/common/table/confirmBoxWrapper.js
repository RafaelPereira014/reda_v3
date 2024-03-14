import React, { PureComponent } from 'react';

//  Components
import ConfirmBox from '#/components/common/confirmBox'; 

export default class ConfirmBoxWrapper extends PureComponent{
    constructor(props) {
        super(props);
        
        //
        //  Handlers
        //
        this.onContinueAction = this.onContinueAction.bind(this);
    }

    onContinueAction(){
        this.props.continueAction(this.props.idx);
    }

    render() {
        return (
            <ConfirmBox 
                {...this.props}
                continueAction={this.onContinueAction}>
            </ConfirmBox>
        );
    }
    
}