import React from 'react'


const Loader = (props) => {
    let title = props.title || 'Carregando...';
    return (
        <div className="loader__container">
          <h2>{title}</h2>
          <div className="loader"></div>
        </div>
      );
}

export default Loader
    
                            
