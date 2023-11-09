"use strict";

let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");

gl.canvas.width = 3;
gl.canvas.height = 3;
gl.canvas.style.width="90px";



let vertex = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;

      uniform vec2 u_resolution;

      varying vec2 v_texCoord;

      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        v_texCoord = a_texCoord;
      }
    `;

let fragment = `
      precision mediump float;
      uniform sampler2D u_image;
      varying vec2 v_texCoord;
      void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
        gl_FragColor.rgb *= gl_FragColor.a;
      }
    `;

let shader = gl.createProgram();
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(vertexShader, vertex);
gl.shaderSource(fragmentShader, fragment);
gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);
gl.attachShader(shader, vertexShader);
gl.attachShader(shader, fragmentShader);
gl.linkProgram(shader);


 let  width=3;
  let height=3;

  let positionLocation = gl.getAttribLocation(shader, "a_position");
  let texcoordLocation = gl.getAttribLocation(shader, "a_texCoord");

  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0,
    width, 0,
    0, height,
    0, height,
    width, 0,
    width, height
  ]), gl.STATIC_DRAW);

  let texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ]), gl.STATIC_DRAW);

  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  /*
  d texImage2D(GLenum target, GLint level, GLint internalformat,
                         GLsizei width, GLsizei height, GLint border, GLenum format,
                         GLenum type, [AllowShared] ArrayBufferView? pixels);
  */


gl.texImage2D(
  gl.TEXTURE_2D, // target
  0, // level
  gl.RGBA, // internalformat
  3, // width
  3, // height
  0, // border
  gl.RGBA, // format
  gl.UNSIGNED_BYTE, // type
  new Uint8Array(
    [
      255, 0, 0, 255,      0, 255, 0, 255,   255, 0,   0, 255, 
      255, 0, 0, 255,    255,   0, 0, 255,   255, 0, 255, 255, 
      255, 0, 0, 255,    255, 255, 0, 255,   255, 0,   0, 255, 

    ]
  )

  );


  let resolutionLocation = gl.getUniformLocation(shader, "u_resolution");


  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


  gl.useProgram(shader);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  let size = 2;
  let type = gl.FLOAT;
  let normalize = false;
  let stride = 0;
  let offset = 0;
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

  gl.enableVertexAttribArray(texcoordLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  size = 2;
  type = gl.FLOAT;
  normalize = false;
  stride = 0;
  offset = 0;
  gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);

  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);



  gl.drawArrays(gl.TRIANGLES, 0, 6);

  f11("buffers1");


  




 vertex = `
      attribute vec2 a_position;
      //attribute vec2 a_texCoord;

      uniform vec2 u_resolution;

      varying vec2 v_texCoord;

      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        //v_texCoord = a_texCoord;
        v_texCoord = gl_Position.xy * 0.5 + 0.5;

      }
    `;

 fragment = `
      precision mediump float;
      uniform sampler2D u_image;
      varying vec2 v_texCoord;
      void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
        gl_FragColor.rgb *= gl_FragColor.a;
      }
    `;

 shader = gl.createProgram();
const vertexShader2 = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(vertexShader2, vertex);
gl.shaderSource(fragmentShader2, fragment);
gl.compileShader(vertexShader2);
gl.compileShader(fragmentShader2);
gl.attachShader(shader, vertexShader2);
gl.attachShader(shader, fragmentShader2);
gl.linkProgram(shader);




   positionLocation = gl.getAttribLocation(shader, "a_position");
   //texcoordLocation = gl.getAttribLocation(shader, "a_texCoord");

   positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0,
    width, 0,
    0, height,
    0, height,
    width, 0,
    width, height
  ]), gl.STATIC_DRAW);

 

   texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

 


gl.texImage2D(
  gl.TEXTURE_2D, // target
  0, // level
  gl.RGBA, // internalformat
  3, // width
  3, // height
  0, // border
  gl.RGBA, // format
  gl.UNSIGNED_BYTE, // type
  new Uint8Array(
    [
      255, 0, 0, 255,      0, 255, 0, 255,   255, 0,   0, 255, 
      255, 0, 0, 255,    255,   0, 0, 255,   255, 0, 255, 255, 
      255, 0, 0, 255,    255, 255, 0, 255,   255, 0,   0, 255, 

    ]
  )

  );


   resolutionLocation = gl.getUniformLocation(shader, "u_resolution");


  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


  gl.useProgram(shader);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
   size = 2;
   type = gl.FLOAT;
   normalize = false;
   stride = 0;
   offset = 0;
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

  

  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);



  gl.drawArrays(gl.TRIANGLES, 0, 6);

  f11("buffers2");





///////////////////// VERSION 3
///////////////////// VERSION 3
///////////////////// VERSION 3
///////////////////// VERSION 3
///////////////////// VERSION 3
///////////////////// VERSION 3
///////////////////// VERSION 3


 vertex = `
      attribute vec2 a_position;

      varying vec2 v_texCoord;

      void main() {
     
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = gl_Position.xy * 0.5 + 0.5;

      }
    `;

 fragment = `
      precision mediump float;
      uniform sampler2D u_image;
      varying vec2 v_texCoord;
      void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
        gl_FragColor.rgb *= gl_FragColor.a;
      }
    `;

 shader = gl.createProgram();
const vertexShader3 = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader3 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(vertexShader3, vertex);
gl.shaderSource(fragmentShader3, fragment);
gl.compileShader(vertexShader3);
gl.compileShader(fragmentShader3);
gl.attachShader(shader, vertexShader3);
gl.attachShader(shader, fragmentShader3);
gl.linkProgram(shader);




   positionLocation = gl.getAttribLocation(shader, "a_position");

   positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1,
    -1,1,
    1,-1,
    1,-1,
    -1,1,
    1,1,

  ]), gl.STATIC_DRAW);


  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

gl.texImage2D(
  gl.TEXTURE_2D, // target
  0, // level
  gl.RGBA, // internalformat
  3, // width
  3, // height
  0, // border
  gl.RGBA, // format
  gl.UNSIGNED_BYTE, // type
  new Uint8Array(
    [
      255, 0, 0, 255,      0, 255, 0, 255,   255, 0,   0, 255, 
      255, 0, 0, 255,    255,   0, 0, 255,   255, 0, 255, 255, 
      255, 0, 0, 255,    255, 255, 0, 255,   255, 0,   0, 255, 

    ]
  )

  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.useProgram(shader);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
   size = 2;
   type = gl.FLOAT;
   normalize = false;
   stride = 0;
   offset = 0;
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  f11("buffers3");




//faire une 4e version avec   gl_FragCoord.xy / resolution;
  /////// VERSION 4
  /////// VERSION 4
  /////// VERSION 4
  /////// VERSION 4
  /////// VERSION 4
  /////// VERSION 4

vertex = `
      attribute vec2 a_position;

      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
    `;

 fragment = `
      precision mediump float;
      uniform sampler2D u_image;
      void main() {
        vec2 coord = gl_FragCoord.xy / vec2(3,3);
        gl_FragColor = texture2D(u_image, coord);

      }
    `;

 shader = gl.createProgram();
const vertexShader4 = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader4 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(vertexShader4, vertex);
gl.shaderSource(fragmentShader4, fragment);
gl.compileShader(vertexShader4);
gl.compileShader(fragmentShader4);
gl.attachShader(shader, vertexShader4);
gl.attachShader(shader, fragmentShader4);
gl.linkProgram(shader);




   positionLocation = gl.getAttribLocation(shader, "a_position");

   positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1,
    -1,1,
    1,-1,
    1,-1,
    -1,1,
    1,1,

  ]), gl.STATIC_DRAW);


  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

gl.texImage2D(
  gl.TEXTURE_2D, // target
  0, // level
  gl.RGBA, // internalformat
  3, // width
  3, // height
  0, // border
  gl.RGBA, // format
  gl.UNSIGNED_BYTE, // type
  new Uint8Array(
    [
      255, 0, 0, 255,      0, 255, 0, 255,   255, 0,   0, 255, 
      255, 0, 0, 255,    255,   0, 0, 255,   255, 0, 255, 255, 
      255, 0, 0, 255,    255, 255, 0, 255,   255, 0,   0, 255, 

    ]
  )

  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.useProgram(shader);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
   size = 2;
   type = gl.FLOAT;
   normalize = false;
   stride = 0;
   offset = 0;
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  f11("buffers4");









  /////// VERSION 5
  /////// VERSION 5
  /////// VERSION 5
  /////// VERSION 5
  /////// VERSION 5
  /////// VERSION 5
  /////// VERSION 5
  /////// VERSION 5
  /////// VERSION 5
  /////// VERSION 5
  /////// VERSION 5
  /////// VERSION 5

/*
https://stackoverflow.com/questions/28604747/understanding-webgl-state
dans cette version je vais utiliser l'extension OES_vertex_array_object
ET JE VAIS ILLUSTRER PAR DU PSEUDO CODE 
*/


/*

gl = function() {
   // internal WebGL state
   let lastError;
   let arrayBuffer = null;
   let vertexArray = {
     elementArrayBuffer: null,
     attributes: [
       { enabled: false, type: gl.FLOAT, size: 3, normalized: false, 
         stride: 0, offset: 0, buffer: null },
       { enabled: false, type: gl.FLOAT, size: 3, normalized: false, 
         stride: 0, offset: 0, buffer: null },
       ...
     ],
   }

*/

vertex = `
      attribute vec2 a_position;

      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
    `;

 fragment = `
      precision mediump float;
      uniform sampler2D u_image;
      void main() {
        vec2 coord = gl_FragCoord.xy / vec2(3,3);
        gl_FragColor = texture2D(u_image, coord);

      }
    `;


/*
Vertex Arrays contain all attribute state.
Attributes define how to pull data out of buffers to supply to a vertex shader.

Normally there is only the 1 default vertex array in WebGL 1.0.
You can create more vertex arrays with the OES_vertex_array_object extension.
*/
const ext = gl.getExtension('OES_vertex_array_object')
const vao = ext.createVertexArrayOES();

//and bind one (make it the current vertex array) with
//ext.bindVertexArrayOES(someVertexArray);
//Passing null to ext.bindVertexArrayOES binds the default vertex array.
//ext.bindVertexArrayOES(null);

ext.bindVertexArrayOES(vao);

// jai plusieurs shaders, peut etre que le createVertexArrayOES permettrait qu'ils partagent le même vao

 shader = gl.createProgram();
const vertexShader5 = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader5 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(vertexShader5, vertex);
gl.shaderSource(fragmentShader5, fragment);
gl.compileShader(vertexShader5);
gl.compileShader(fragmentShader5);
gl.attachShader(shader, vertexShader5);
gl.attachShader(shader, fragmentShader5);
gl.linkProgram(shader);





  {

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    
     // Notice you don't pass in a buffer. You pass in a bindPoint. 
     // The function gets the buffer one of its internal variable you set by
     // previously calling gl.bindBuffer : c'est à dire positionBuffer
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,
      -1,1,
       1,-1,
       1,-1,
      -1,1,
       1,1,

    ]), gl.STATIC_DRAW);
    // on a maintenant un buffer rempli 

    /*
      gl =  {
          ...
         arrayBuffer: positionBuffer;     <<<<<<<<<<
          ...
      }
    */

    let positionLocation = gl.getAttribLocation(shader, "a_position");
    //tells you which attribute the vertex shader will look at to get data out of a buffer.



    gl.enableVertexAttribArray(positionLocation);
    /*
      gl =  {
           arrayBuffer: positionBuffer;
           vertexArray : {
                elementArrayBuffer: null,

                // dans le tableau suivant, attributes, l'indice est donné par positionLocation
                attributes: [
                              { enabled: TRUE, type: gl.FLOAT, size: 3, normalized: false,   <<<<<<< enabled est mis à TRUE
                                  stride: 0, offset: 0, buffer: null },
                              { enabled: false, type: gl.FLOAT, size: 3, normalized: false, 
                                  stride: 0, offset: 0, buffer: null },
                              ...
                            ],
       }
    */


    gl.vertexAttribPointer(
      positionLocation,
      2, // size
      gl.FLOAT, //type
      false, //normalize
      0,  //stride
      0, //stride
      0, //offset
    );
  }


/*

gl = {
    arrayBuffer :positionBuffer;
    vertexArray: {
      elementArrayBuffer: null,

      // dans le tableau suivant, attributes, l'indice de l'élément 
      // qu'on va modifier est donné par positionLocation
      attributes: [
        {  
          enabled: TRUE,
          type: gl.FLOAT,
          size: 2,
          normalized: false,
          stride: 0,
          offset: 0,
          buffer: arrayBuffer   // IMPORTANT!!! Associates whatever buffer is currently *bound*
                                //(positionBuffer) to  this attribute
                                // ceci n'apparait pas dans les parametres de la fonction vertexAttribPointer
        }, 
        {...}, {...} , ...
      ]
    }
}

*/

  

/*
30 c avenue Alex Flemming
bat. des consultations
6e étage
mardi 19 dec
11h docteur Arques
amener courrier de Sabourdy

*/



  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

gl.texImage2D(
  gl.TEXTURE_2D, // target
  0, // level
  gl.RGBA, // internalformat
  3, // width
  3, // height
  0, // border
  gl.RGBA, // format
  gl.UNSIGNED_BYTE, // type
  new Uint8Array(
    [
      255, 0, 0, 255,      0, 255, 0, 255,   255, 0,   0, 255, 
      255, 0, 0, 255,    255,   0, 0, 255,   255, 0, 255, 255, 
      255, 0, 0, 255,    255, 255, 0, 255,   255, 0,   0, 255, 

    ]
  )

  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.useProgram(shader);



  gl.drawArrays(gl.TRIANGLES, 0, 6);

  f11("buffers5");










function f11(e) {
  var image = new Image();
  image.style.width="90px";

    image.onload = function() {
      let div  = document.getElementById(e);
      div.appendChild(image);
    }
    image.src = canvas.toDataURL('image/png');
}



syntaxHighlight("dede");
syntaxHighlight("dede2");



// syntax highlight

function syntaxHighlight(elementId) {





let strMessage1 = document.getElementById(elementId) ;
let strReg1 = /"(.*?)"/g;  // "(fgerrge r re r)"

let  strReg2 = /'(.*?)'/g; // '(fgerrge r re r)'  , . = a caracter  , .* , une suite de caracter , .*? la suite de caracter la plus petite
//let strReg3 = /`(.*?)`/g;  // "(fgerrge r re r)"
let strReg3 = /`([\w|\W|\s]*?)`/g ;


let  specialReg = /\b(new|let|var|if|do|function|while|switch|for|foreach|in|continue|break)(?=[^\w])/g ;
let specialJsGlobReg = /\b(document|window|Array|String|Object|Number|\$)(?=[^\w])/g ;
let    specialJsReg = /\b(getElementsBy(TagName|ClassName|Name)|getElementById|typeof|instanceof)(?=[^\w])/g ;
let    specialMethReg = /\b(indexOf|match|replace|toString|length)(?=[^\w])/g ; 
let    specialCommentReg  = /(\/\*.*\*\/)/g ;
let    inlineCommentReg = /(\/\/.*)/g;
let  htmlTagReg = /(&lt;[^\&]*&gt;)/g;
//let egale = /(=)/g;



let string = strMessage1.innerHTML;


//let parsed = string.replace(egale,'<span class="egale">$1</span>');

 let  parsed = string.replace(strReg1,'<span class="string">"$1"</span>');
     parsed = parsed.replace(strReg2,"<span class=\"string\">'$1'</span>");
    parsed = parsed.replace(strReg3,"<span class=\"string\">`$1`</span>");


    parsed = parsed.replace(specialReg,'<span class="special">$1</span>');
    parsed = parsed.replace(specialJsGlobReg,'<span class="special-js-glob">$1</span>');
    parsed = parsed.replace(specialJsReg,'<span class="special-js">$1</span>');
    parsed = parsed.replace(specialMethReg,'<span class="special-js-meth">$1</span>');
    parsed = parsed.replace(htmlTagReg,'<span class="special-html">$1</span>');
    parsed = parsed.replace(specialCommentReg,'<span class="special-comment">$1</span>');
    parsed = parsed.replace(inlineCommentReg,'<span class="special-comment">$1</span>');

   strMessage1.innerHTML      = parsed;

}
