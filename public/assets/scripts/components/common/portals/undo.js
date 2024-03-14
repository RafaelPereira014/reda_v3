import React from 'react';
import ReactDOM from 'react-dom';

export default ({onUndo, close, open}) => 
    open
        ? ReactDOM.createPortal(
            <div className="undo__modal">
                Moderação submetida com sucesso. <button type="button" onClick={onUndo}>Anular</button> <button type="button" onClick={close}>Fechar</button>
            </div>,
            document.body
        )
    :
    null;