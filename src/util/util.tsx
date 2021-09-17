// util component or tool function of this project
// detailed use of each function will be illustrated in front of the function 
import * as React from 'react';

// slice the string which are demostrated on card/list/page 
// the short string will follow a "more", which can be clicked to show more
// the long string will follow a "fold", which can be click to show less
export function stringFilter(article:string){
    let fold = true;
    const filtCharNum = 400;
    const stringFilt = article.slice(0,filtCharNum)+'...';

    if(article.length > filtCharNum ){
        return(
            <span>
                <span id="string_demo">{stringFilt} </span>
                <u id="handle_href" onClick= { handleMore }>more</u>
            </span>
        );
    }else{
        return(
            <span>{article}</span>
        )
    }

    function handleMore(){
        const spanDom = document.getElementById('string_demo');
        const indexDom = document.getElementById('handle_href');
        fold = !fold;
        if (spanDom){
            spanDom.innerHTML = fold ? stringFilt:article;
        }
        if (indexDom) {
            indexDom.innerHTML = fold ? 'more':'fold';
        }
    }
}

/* merge the request url for http request
   @params  prams    [the request params]        
            baseUrl  [the base url before the params of request url]
*/
export function reqUrl(params:object,baseUrl:string,domain:string){
    // let url = `http://localhost:${domain}/${baseUrl}?`;
    let url = `http://119.91.111.143:${domain}/${baseUrl}?`;
    for ( const key of Object.keys(params)) {
        if ( params[key] !== null) {
            // Keyword 'type' of queryPar is to distinguish query type for the web, it's unnecessary to
            // transmit this redundant information to the backstage.
            if( key !== 'type'){
                url += `${key}=${params[key]}&`;
            }
        }
    }
    url = url.substring(0,url.length-1);
    return url;
}

// delete the empty key of object
export function delEmptyKey(obj:object){
    for (const key of Object.keys(obj)) {
        if( obj[key].length === 0 ) {
            delete obj[key];
        }
    }
    return obj
}

// scroll to the top
export function smoothscroll(){
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
         window.requestAnimationFrame(smoothscroll);
         window.scrollTo (0,currentScroll - (currentScroll/5));
    }
}

// push the value of an object in an array
export function pushKeyValueToArr(arr:object[]){
    const result = new Array();
    arr.map((item:any)=>{
        result.push(item['name']);
    })
    return result;
}