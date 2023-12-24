
//ceci c'est mon premier module !
// https://fr.javascript.info/modules-intro

/*
debut du code javascript
 import {syntaxHighlightAll} from 'colorizeur.js';

syntaxHighlightAll("lecode");


<pre><code class="lecode">
  blablabla...
  let c=efe...
  ..blablabla
</code></pre>

*/

export function syntaxHighlightAll(elementsClass) {
/*
  for (const dzdz of document.getElementsByClassName(elementsClass)) {
const code =dzdz.parentElement;
    code.style.backgroundColor = "black";
    code.style.color = "red";
  }

*/

  let lesElements = document.getElementsByClassName(elementsClass);
  for (let i = 0; i < lesElements.length; i++) {
    syntaxHighlight(lesElements.item(i));
  }
}



function syntaxHighlight(elementId) {

  let strMessage1=elementId;

  let strReg1 = /"(.*?)"/g;
  let strReg2 = /'(.*?)'/g; 

  // '(fgerrge r re r)'  , . = a caracter  , .* , une suite de caracter , .*? la suite de caracter la plus petite

  let strReg3 = /`([\w|\W|\s]*?)`/g ;

  // \w matches any word caracter : a..z ou A...Z ou _
  // \W matches any no word caracater : sauf de ligne, tabulation, espace,
  /*
  le ? dans  va éviter de récupérer la chaine "A...F"  "ArjgrejgegjeB"CgjgrD"EgrgrF"
  mais va récupérer "A..B" et "E..F"
  /<(\w+?)>/g   va récupérer fjeejfe dans <fjeejfe>
  /<\\(\w+?)>/g va récupérer fjeejfe dans <\fjeejfe>
  */

  //let maReg = /(<\\(\w+?)>|<(\w+?)>)/g ;
  let maReg = /(&lt;\\(\w+?)&gt;|&lt;(\w+?)&gt;)/g ;
  let maReg2 = /(gl[\.|\s])/g ;

  let specialReg = /\b(const|new|let|var|if|do|function|while|switch|for|foreach|in|continue|break)(?=[^\w])/g ;
  let specialJsGlobReg = /\b(document|window|Array|String|Object|Number|\$)(?=[^\w])/g ;
  let specialJsReg = /\b(getElementsBy(TagName|ClassName|Name)|getElementById|typeof|instanceof)(?=[^\w])/g ;
  let specialMethReg = /\b(indexOf|match|replace|toString|length)(?=[^\w])/g ;
  let specialCommentReg  = /(\/\*.*\*\/)/g ;
  let inlineCommentReg = /(\/\/.*)/g;
  let htmlTagReg = /(&lt;[^\&]*&gt;)/g;

  let string = strMessage1.innerHTML;

/*
  let parsed = string.replace(strReg1,'<span class="string">"$1"</span>');
  parsed = parsed.replace(maReg,'<span class="htmlWord">$1</span>');
  parsed = parsed.replace(maReg2,'<span class="glWord">$1</span>');
  parsed = parsed.replace(strReg2,"<span class=\"string\">'$1'</span>");
  parsed = parsed.replace(strReg3,"<span class=\"string\">`$1`</span>");
  parsed = parsed.replace(specialReg,'<span class="special">$1</span>');
  parsed = parsed.replace(specialJsGlobReg,'<span class="special-js-glob">$1</span>');
  parsed = parsed.replace(specialJsReg,'<span class="special-js">$1</span>');
  parsed = parsed.replace(specialMethReg,'<span class="special-js-meth">$1</span>');
  //parsed = parsed.replace(htmlTagReg,'<span class="special-html">$1</span>');
  parsed = parsed.replace(specialCommentReg,'<span class="special-comment">$1</span>');
  parsed = parsed.replace(inlineCommentReg,'<span class="special-comment">$1</span>');

*/
  let  parsed ;
  {
    let reg = /\b(const|new|let|var|if|do|function|while|switch|for|foreach|in|continue|break)(?=[^\w])/g ;
    parsed = string.replace(reg,'<span class="special">$1</span>');
  }


  {
    let reg = /(gl[\.|\s])/g ;
    parsed = parsed.replace(reg,'<span class="glWord">$1</span>');
  }

  {
    let reg = /`([\w|\W|\s]*?)`/g ;
    parsed = parsed.replace(reg,"<span class=\"string\">`$1`</span>");
  }

  {
    let reg = /\b(document|window|Array|String|Object|Number|\$)(?=[^\w])/g ;
    parsed = parsed.replace(reg,'<span class="special-js-glob">$1</span>');
  }

  {
    let reg = /'(.*?)'/g;
    parsed = parsed.replace(reg,"<span class=\"singleQuote\">'$1'</span>");


  }

  strMessage1.innerHTML  = parsed;



  const a = document.getElementsByClassName('singleQuote');
  for (const glWord of a) {
    glWord.style.color = '#98c379';

  }
  

    for (const dzdz of document.getElementsByClassName("lecode")) {
const code =dzdz.parentElement;
    code.style.backgroundColor = "black";
    code.style.color = "white";
    code.style.padding="2vw";
  }


  const AllSpecials = document.getElementsByClassName('special');
  for (const special of AllSpecials) {
    special.style.color = '#D6665D';
  }

  const AllglWords = document.getElementsByClassName('glWord');
  for (const glWord of AllglWords) {
    glWord.style.color = 'aqua';
  }

  const AllStrings = document.getElementsByClassName('string');
  for (const string of AllStrings) {
    string.style.color = '#98c379';

  }

  const fefe = document.getElementsByClassName('special-js-glob');
  for (const special of fefe) {
    special.style.color = '#61aeee';
  }
  /*

  const allParas = document.getElementsByTagName("pre");
  for (const para of allParas) {
    para.style.backgroundColor = "black";
    para.style.color = "white";
  }

  const AllStrings = document.getElementsByClassName('string');
  for (const string of AllStrings) {
    string.style.color = '#A1E46D';
  }

  const AllSpecials = document.getElementsByClassName('special');
  for (const special of AllSpecials) {
    special.style.color = '#D6665D';
  }

  const AllHtmlWords = document.getElementsByClassName('htmlWord');
  for (const htmlWord of AllHtmlWords) {
    htmlWord.style.color = 'yellow';
  }
  const AllglWords = document.getElementsByClassName('glWord');
  for (const glWord of AllglWords) {
    glWord.style.color = 'aqua';
  }


*/

}
