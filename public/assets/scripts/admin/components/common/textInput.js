import React, { Fragment } from 'react';

export default (props) => {
    const children = <Fragment>
        <input type="text" value={props.value} onChange={props.handleChange} name="new_word" id="new_word_input" className="padding__topbottom--5 padding__leftright--15 margin__right--15 form-control" placeholder={props.placeholder || "Nova palavra..."}/>
        {
            props.showButton==null || props.showButton===true ?
            <button type="submit" className="cta primary">
                {props.buttonText ?
                    props.buttonText
                :
                    <Fragment>
                        <i className="fas fa-plus"></i> Adicionar
                    </Fragment>
                }
            </button>
            :
            null
        }
        
        {props.onCancel ? 
            <button type="button" className="cta no-bg" onClick={props.onCancel}>Cancelar</button>
        :
            null
        }
    </Fragment>

    return(
        props.showButton==null || props.showButton===true ?
            <form className={"form-group new_word_form" + (props.className ? " "+props.className : "")} onSubmit={props.onSubmit}>
                {children}
            </form>
        :
            <div className={"form-group new_word_form" + (props.className ? " "+props.className : "")}>
                {children}
            </div>
        
    )
}