'use strict';

import moment from 'moment';
import he from 'he';

//
//  Set date and time localization
//
moment.locale('pt', {
    months : "janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),
    monthsShort : "jan._fev._mar_abr._mai_jun_jul._ago_set._out._nov._dez.".split("_"),
    weekdays : "domingo_segunda_terça_quarta_quinta_sexta_sábado".split("_"),
    weekdaysShort : "dom._seg._ter._qua._qui._sex._sab.".split("_"),
    weekdaysMin : "Do_Se_Te_Qua_Qui_Se_Sab".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        LTS : "HH:mm:ss",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Hoje às] LT",
        nextDay: '[Amanhã às] LT',
        nextWeek: 'dddd [às] LT',
        lastDay: '[Ontem às] LT',
        lastWeek: '[a última] dddd LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "em %s",
        past : "%s atrás",
        s : "segundos",
        m : "um minuto",
        mm : "%d minutos",
        h : "uma hora",
        hh : "%d horas",
        d : "um dia",
        dd : "%d dias",
        M : "um mês",
        MM : "%d meses",
        y : "um ano",
        yy : "%d anos"
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

// Check if app is runing in node
export const isNode = typeof localStorage === 'undefined' || typeof window === 'undefined';


//
//  Convert date format
//
export const setDateFormat = (date, formatDate) => {
	moment.locale('pt');
	return moment(date).format(formatDate);
}

//
//  Set string to url if no HTTP exists
//
export const setUrl = (content) => {
    if (content.indexOf("http://") == -1 && content.indexOf("https://")==-1){
        return "http://"+content;
    }
    return content;
}

//
//  Sort with locale the TITLE property
//
export const sortByTitle = function(s1, s2){
    return s1.title.localeCompare(s2.title);
}

//
//  Build query string to get data
//
export const toQueryString = function(data){
    let finalString = "";

    if (data){
        let keys = Object.keys(data);


        for(let key of keys){ 
            let customKey = key=="access" ? "modes" : key;

            if (data[key] instanceof Array){
                for (let value of data[key]){             

                    finalString = finalString.length>0 && keys.length>0 ? finalString+"&" : finalString;
                    finalString += customKey+"[]="+value;
                }
            }else if(data[key]){
                finalString = finalString.length>0 && keys.length>0 ? finalString+"&" : finalString;
                finalString += customKey+"[]="+data[key];
            }
        }
    }
    return finalString;
}

//
//  Build query string from complex structure
//
export const complexToQueryString = function(data){
    let finalString = "";

    if (data){
        let keys = Object.keys(data);

        for(let key of keys){ 
            let customKey = key=="access" ? "modes" : key;

            if (data[key] instanceof Array){
                for (let value of data[key]){             

                    finalString = finalString.length>0 && keys.length>0 ? finalString+"&" : finalString;
                    finalString += customKey+"[]="+value;
                }
            }

            // If nested 1 level
            else if(data[key] instanceof Object){
                let thisKeyObjs = Object.keys(data[key]);

                // Go for all keys
                for (let thisKey of thisKeyObjs){   
                    let customKey = thisKey=="access" ? "modes" : thisKey;  

                    // If is an array
                    if (data[key][thisKey] instanceof Array){
                       // For each key, get value
                        for (let value of data[key][thisKey]){             

                            finalString = finalString.length>0 && keys.length>0 ? finalString+"&" : finalString;
                            finalString += customKey+"[]="+value;
                        } 
                    // If it is just a plain value
                    }else if(data[key][thisKey]){
                        finalString = finalString.length>0 && keys.length>0 ? finalString+"&" : finalString;
                        finalString += customKey+"[]="+data[key][thisKey];
                    }                       
                }
            }
            else if(data[key]){
                finalString = finalString.length>0 && keys.length>0 ? finalString+"&" : finalString;
                finalString += data[key] instanceof Array ? customKey+"[]="+data[key] : customKey+"="+data[key];
            }
        }
    }

    return finalString;
}

//
//  Return average
//

export const getAvg = (ratings) => {
    let total = ratings.length;
    let sum = 0;

    for (let rating of ratings){
        sum = sum + parseInt(rating.value);
    }

    return sum/total;
}

//
//  Truncate text
//
export const truncate = (str,num) => {
  var words = str.split(/\s/g);
  words = words.splice(0,num);

  var final = words.join(' ');
  return final.length>=str.length ? words.join(' ') : words.join(' ')+" ...";
}

//
//  Toggle class
//
export const toggleClass = (targetClass,el) => {
    let rule = new RegExp(" "+targetClass, 'g');

    if (el && el.className.indexOf(targetClass)<0){
        el.className = el.className+' ' + targetClass;
    }else if (el){
        el.className = el.className.replace( rule , '' );
    }
}

//
//  Remove class
//
export const removeClass = (targetClass,el) => {
    let rule = new RegExp(" "+targetClass, 'g');

    if (el){
        if (el instanceof Array && el.length>0){
            for(let element of el){            
                element.className = element.className.replace( rule , '' );
            }
        }else if(el instanceof Array && el.length==1 || el.constructor != Array){
            el.className = el.className.replace( rule , '' );            
        } 
    }       
}

//
//  Scroll
//
export const scrollToTop = () => {
    window && window.scrollTo(0, 0);
}

export const scrollToBottom = () => {
    window && window.scrollTo(0, document.body.scrollHeight);
}


//
//  Get property by string
//
export const byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

//
//  Add script async to head
//
export const getScript = function(source, callback) {
    var script = document.createElement('script');
    var prior = document.getElementsByTagName('script')[0];
    script.async = 1;
    prior.parentNode.insertBefore(script, prior);

    script.onload = script.onreadystatechange = function( _, isAbort ) {
        if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
            script.onload = script.onreadystatechange = null;
            script = undefined;

            if(!isAbort) { 
                if(callback) callback(); 
            }else if(isAbort || !script.readyState){
                if(callback) callback('Error getting script');
            }
        }
    };

    script.src = source;
}

//
//  Substring with html tags
//
export const html_substr = function( str, start ,count ) {

    var div = document.createElement('div');
    div.innerHTML = str;

    walk( div, track );

    function track( el ) {
        if( count > 0 ) {
            var len = el.data.length;
            if(start<=len){
                el.data = el.substringData(start,len);
                start=0;
            } else{
                start-=len;
                el.data = '';
            }
            len = el.data.length;
            count -= len;
            if( count <= 0 ) {
                el.data = el.substringData( 0, el.data.length + count );
            }

        } else {
            el.data = '';
        }
    }

    function walk( el, fn ) {
        var node = el.firstChild;
        do {
            if( node.nodeType === 3 ) {
                fn(node);
            } else if( node.nodeType === 1 && node.childNodes && node.childNodes[0] ) {
                walk( node, fn );
            }
        } while( node = node.nextSibling );
    }
    return div.innerHTML;
}

/**
 * Serialize to querystring
 */
export const serializeQs = function(obj) {
  var str = [];
  for(var p in obj)
    
    if (obj.hasOwnProperty(p) && typeof obj[p] !== "undefined" && ((Array.isArray(obj[p]) && obj[p].length>0) || (typeof obj[p] !== 'object' && !Array.isArray(obj[p]) && obj[p]!==''))) {
        if(Array.isArray(obj[p]) && obj[p].length>0){

            for(var el in obj[p]){
                str.push(encodeURIComponent(p) + "[]=" + encodeURIComponent(obj[p][el]));
            }
            
        }else{
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      
    }
  return str.join("&");
}

// Show size
export const showFileSize = (bytes) => {
    if(bytes>=1024 && bytes < Math.pow(1024, 2)){
        return Math.trunc((bytes/1024))+"KB";
    }

    if(bytes>=Math.pow(1024, 2) && bytes < Math.pow(1024, 3)){
        return Math.trunc(bytes/Math.pow(1024, 2))+"MB";
    }

    if(bytes>=(1024*3) && bytes < Math.pow(1024, 4)){
        return Math.trunc(bytes/Math.pow(1024, 3))+"GB";
    }
}

//
//  Check if is class
//
function isClassComponent(component) {
    return (
        typeof component === 'function' && 
        !!component.prototype.isReactComponent
    ) ? true : false
}

function isFunctionComponent(component) {
    return (
        typeof component === 'function' && 
        String(component).includes('return React.createElement')
    ) ? true : false;
}

export const isReactComponent = function(component) {
    return (
        isClassComponent(component) || 
        isFunctionComponent(component)
    ) ? true : false;
}

//
//  Add or remove element from array
//
export const addOrRemove = function (array, item) {
    const exists = array.includes(item)
  
    if (exists) {
      return array.filter((c) => { return c !== item })
    } else {
      const result = array
      result.push(item)
      return result
    }
}

//
//  Print plural
//
export const withPlural = (data, singular, plural) => data!==null && typeof data!=="undefined" && (data>1 || data==0) ? plural : singular;

//
//  Strip html tags, entities and linebreaks
//
export const stripAllTags = (str) => {
    let finalStr = str;
    
    finalStr = finalStr.replace(/(<([^>]+)>)/ig,"");    
    finalStr = he.decode(finalStr);
    finalStr = finalStr.replace(/\n|\r/g, '');

    return finalStr;
  }
// remove - and _ from string
export const removeSpecialChars = (str) => {
    let finalStr = str;
    finalStr = finalStr.replace(/-|_/g, ' ');
  
    return finalStr;
  }

