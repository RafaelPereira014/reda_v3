'use strict';

import React from 'react';
import PropTypes from 'prop-types';

// Components
import Tags from '#/components/common/tags';

const SearchBar = (props) => {
    return (
      <div className={"input-group single-search " + (props.className || "")}>			
        <Tags setTags={props.onChangeTags} tags={props.tags} className="tags-search" placeholder={props.placeholder || "Palavras-chave"}/>
        {props.showButton && <button className="cta primary" onClick={props.onSubmit}><i className="fa fa-search" aria-hidden="true"></i> {props.searchText || "Pesquisar"}</button>}
      </div>
    );
}

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  onChangeTags: PropTypes.func.isRequired
}

export default SearchBar