// util component or tool function of this project
// detailed use of each function will be illustrated in front of the function 
import * as React from 'react';

// slice the string which are demostrated on card/list/page 
// the short string will follow a "more", which can be clicked to show more
// the long string will follow a "fold", which can be click to show less
export default function abridgeFilt(article:string){
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