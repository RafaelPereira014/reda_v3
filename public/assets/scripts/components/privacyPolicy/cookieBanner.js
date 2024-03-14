import React, {PureComponent} from 'react';
import { CookieBanner } from '@palmabit/react-cookie-law';

import appConfig from '#/config';

export default class CookieBannerWrapper extends PureComponent{
  constructor(props){
    super(props);

    //  Handlers
    this.onAcceptStatistics = this.onAcceptStatistics.bind(this);

  }

  componentDidMount(){
    window['ga-disable-'+appConfig.analytics] = true;
  }
  
  onAcceptStatistics(){
    window['ga-disable-'+appConfig.analytics] = false;
  }

  styles(){
    return {
      dialog: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 9999,
        paddingTop: '20px',
        paddingBottom: '20px'
      },
      message: {
        color: 'white',
      },
      selectPane: {
        display: "table-cell",
        padding: "10px 0px",
      },
      policy: {
        color: 'white',
        textDecoration: 'underline'
      },
      optionLabel: {
        color: 'white',
        paddingLeft: '20px',
        paddingTop: '4px',
        paddingRight: '20px',
        display: 'inline-block'
      },
      button: {

      }
    }
  }

  render(){
    return(
      <CookieBanner
        message="Este site utiliza cookies para permitir uma melhor experiência por parte do utilizador. Indique se pretende consentir a sua utilização e qual o tipo:"
        showMarketingOption={false}
        showPreferencesOption={false}
        statisticsOptionText="Estatísticos"
        necessaryOptionText="Estritamente necessários"
        privacyPolicyLinkText="Política de privacidade"
        policyLink="/politica-privacidade"
        declineButtonText="Não aceito"
        acceptButtonText="Aceito"
        showDeclineButton={true}
        onAcceptStatistics={this.onAcceptStatistics}
        styles={this.styles()}
      />
    )
  }
}