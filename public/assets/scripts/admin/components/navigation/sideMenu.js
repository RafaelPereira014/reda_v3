import React from 'react';
import { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';

//  Components
import CollapsibleMenu from '%/components/common/collapsible';

export default class SideMenu extends Component {
	constructor(props){
        super(props);

        this.isActive = this.isActive.bind(this);

        this.options = [
            {
                link: '/dashboard',
                title: 'Dashboard',
                icon: 'fas fa-tachometer-alt',
                id: 'dashboard'
            },
            {
                title: 'Recursos',
                icon: 'far fa-list-alt',
                id: 'resources',
                children: [
                    {
                        link: '/dashboard/recursos/pendentes',
                        title: 'Pendentes',
                        id: 'resources-pending',
                    },
                    {
                        link: '/dashboard/recursos/po/pendentes',
                        title: 'Operacionalizações pendentes',
                        id: 'resources-prop-pending',
                    },
                    {
                        link: '/dashboard/recursos/ocultos',
                        title: 'Ocultos',
                        id: 'resources-hidden',
                    },
                ]
            },
            {
                link: '/dashboard/aplicacoes',
                title: 'Aplicações',
                icon: 'fas fa-mobile-alt',
                id: 'apps',
                children: [
                    {
                        link: '/dashboard/aplicacoes/pendentes',
                        title: 'Pendentes',
                        id: 'apps-pending',
                    }
                ]
            },
            {
                link: '/dashboard/ferramentas',
                title: 'Ferramentas',
                icon: 'fas fa-toolbox',
                id: 'tools',
                children: [
                    {
                        link: '/dashboard/ferramentas/pendentes',
                        title: 'Pendentes',
                        id: 'tools-pending',
                    }
                ]
            },
            {
                title: 'Comentários',
                icon: 'fas fa-comments',
                id: 'comments',
                children: [
                    {
                        link: '/dashboard/comentarios/pendentes',
                        title: 'Pendentes',
                        id: 'comments-pending',
                    },
                    {
                        link: '/dashboard/comentarios/palavras',
                        title: 'Palavras proibidas',
                        id: 'comments-forbidden-words',
                    }
                ]
            },
            {
                link: '/dashboard/taxonomias',
                title: 'Taxonomias',
                icon: 'fas fa-bars',
                id: 'taxonomies',
                children: [
                    {
                        link: '/dashboard/taxonomias/relacoes',
                        title: 'Relações',
                        id: 'taxonomies-relationships',
                    }
                ]
            },
            {
                link: '/dashboard/utilizadores',
                title: 'Utilizadores',
                icon: 'fas fa-users',
                id: 'users'
            },
            {
                link: '/dashboard/mensagens',
                title: 'Mensagens de contacto',
                icon: 'fas fa-comments',
                id: 'contact-messages'
            },
            {
                link: '/dashboard/artigos',
                title: 'Artigos',
                icon: 'fas fa-newspaper',
                id: 'news-articles'
            },
        ]
    }

    isActive(path, exact = false){
        if(exact && this.props.match.path === path){
            return true;
        }
        if(!exact && this.props.match.path.indexOf(path)>=0){
            return true;
        }

        return false;
    }
    
    //
    //  Print children recursively
    //
    printChildren(children, id = null){
        if(children && children.length>0){
            return(
                <ul className="collapsed" id={id || null}>
                    {children.map(child => 
                        <li className={(this.isActive(child.link, true) || (child.children && child.children.filter(this.isActive(child.link, true)).length>0) ? 'active' : '') + (child.children && child.children.length>0 ? ' collapsible' : '')} key={child.id}>

                            {
                                child.link ? 
                                    <Link to={child.link}>{child.icon && <i className={child.icon}></i>} {child.title}</Link>
                                :
                                    null
                            }

                            {child.children && child.children.length>0 ?
                                <CollapsibleMenu
                                    isOpen={child.children.filter(el => this.props.match.path === el.link).length>0}
                                    {...(!child.link && {
                                        BtnText: (props) =>                                             
                                            <Fragment>
                                                <span onClick={props.onClick}>{child.icon && <i className={child.icon}></i>} {child.title}</span>           
                                                {props.children}
                                            </Fragment>                                            
                                    })}
                                >
                                    {this.printChildren(child.children, child.id)}
                                </CollapsibleMenu>
                            :
                                null
                            }
                        </li>
                    )}                                        
                </ul>
            )
        }

        return null;
    }

    render(){
        if(!this.props.auth.isAuthenticated){
            return null;
        }
        
        return(
            <aside className="side-menu">
                <header>
                    <a href="/">
                        <img src="/assets/graphics/REDA_logo.png" alt="Recursos Educativos Digitais e Abertos (REDA) é uma plataforma dedicada à disponibilização de conteúdos educativos para a comunidade escolar." title="Recursos Educativos Digitais e Abertos (REDA) é uma plataforma dedicada à disponibilização de conteúdos educativos para a comunidade escolar." className="img-responsive"/>
                    </a>
                </header>
                <nav>
                    <ul>
                        {this.options.map((opt, idx) => 
                            <li className={(this.isActive(opt.link, idx==0) || (opt.children && opt.children.filter(el => this.isActive(el.link)).length>0) ? 'active' : '') + (opt.children && opt.children.length>0 ? ' collapsible' : '')} key={opt.id}>
                                {
                                    opt.link ? 
                                        <Link to={opt.link}>{opt.icon && <i className={opt.icon}></i>} {opt.title}</Link>
                                    :
                                        null
                                }
                                

                                {opt.children && opt.children.length>0 ? 
                                    <CollapsibleMenu
                                        isOpen={opt.children.filter(el => this.isActive(el.link)).length>0 || this.isActive(opt.link)}
                                        {...(!opt.link && {
                                            BtnText: (props) =>                                             
                                                <Fragment>
                                                    <span onClick={props.onClick}>{opt.icon && <i className={opt.icon}></i>} {opt.title}</span>                                              
                                                    {props.children}
                                                </Fragment>                                            
                                        })}
                                        
                                    >
                                        {this.printChildren(opt.children, opt.id)}
                                    </CollapsibleMenu>                                    
                                    :
                                    null
                                }
                            </li>
                        )}
                    </ul>
                </nav>
            </aside>
        )
    }
}