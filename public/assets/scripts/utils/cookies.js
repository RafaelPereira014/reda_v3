// Utils
import { isNode } from '#/utils';

export const getCookie = (name) =>{
  if(!isNode){
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }
  return null;
}

export const setCookie = (name, value, days) => {
  if(!isNode){
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
  }
}

export const deleteCookie = (name) => {
  if(!isNode){
    setCookie(name, '', -1);
  }
}