import React, { PureComponent } from 'react';
import { withRouter } from "react-router-dom";


class BackButton extends PureComponent {
  render() {
    const { history } = this.props;

    return (
      <div>
        <button onClick={history.goBack} className="cta primary outline"><i className="fa fa-chevron-left"></i>Voltar</button>
      </div>
    )
  }
}

export default withRouter(BackButton);
