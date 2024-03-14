'use strict';

import React from 'react';

// Boostrap
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

// Utils

let yearsMapping = [
    {
        years: [
            'Pré-escolar',
        ],
        name: 'Pré-escolar',
        icon: 'P',
        color: '#7d7d7d'
    },
    {
        years: [
            '1.º',
            '2.º',
            '3.º',
            '4.º'
        ],
        name: '1.º Ciclo',
        icon: '1',
        color: '#b39f23'
    },
    {
        years: [
            '5.º',
            '6.º'
        ],
        name: '2.º Ciclo',
        icon: '2',
        color: '#845439'
    },
    {
        years: [
            '7.º',
            '8.º',
            '9.º'
        ],
        name: '3.º Ciclo',
        icon: '3',
        color: '#4c69b7'
    },
    {
        years: [
            '10.º',
            '11.º',
            '12.º'
        ],
        name: 'Secundário',
        icon: 'S',
        color: '#1b8a1d'
    },
    {
        years: [
            'Nível A1',
            'Nível A2',
            'Nível B1'
        ],
        name: 'Níveis de proficiência linguística',
        icon: 'N',
        color: '#AA7539'
    }
];

export default (props) => {
    const { list, className } = props;
    if(!list){
        return null;
    }

    let elsToPost =  yearsMapping.filter( row => {
        let showYear = false;
        let color = row.color || null;

        row.years.map( yearToCheck => {
            showYear = showYear === false ? list.some(el => el.title === yearToCheck) : showYear;
            if(showYear && !color){
                
                let oneEl = list.filter(el => el.title === yearToCheck);
                
                color = oneEl && oneEl.length>0 ? oneEl[0].color : color;
            }
        });

        row.color = color;

        return showYear;
    });

    return(
        <ul className={"years__preview" + (className ? ' '+className : '')}>
            {
                elsToPost.map( row => {
                    return <OverlayTrigger placement="top" key={"year_" + row.icon} overlay={<Tooltip id={"year_tooltip_" + row.icon}>{row.name}</Tooltip>}>
                        <li  style={{backgroundColor: row.color}} className={!row.color ? 'no-color' : ''}>
                            <span>
                                {row.icon}
                            </span>   
                        </li>
                    </OverlayTrigger>
                })
            }
        </ul>
    )
}