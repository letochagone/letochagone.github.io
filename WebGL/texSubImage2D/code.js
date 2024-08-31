"use strict";

let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");

gl.canvas.width = 4;
gl.canvas.height = 4;


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
        
        gl_Position=vec4(a_position,0.0,1.0);
        v_texCoord = a_texCoord;
      }
    `;

let fragment = `
      precision mediump float;
      uniform sampler2D u_image;
      varying vec2 v_texCoord;
      void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
        
        
      //  gl_FragColor=vec4(0,0,0,1);
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




  let width = 4;
  let height = 4;

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
  
  
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1,1,
    1,1,
    1,-1
    /*
    -0.75, 0.75,
    0.75, 0.75,
    0.75, -0.75
    */
  ]), gl.STATIC_DRAW);
  

  let texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
  ]), gl.STATIC_DRAW);

  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);






  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    4,
    4,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([
      255,255,0,255,  255,255,0,255,  255,255,0,255, 127,64,0,255,
      255,255,0,255,  255,255,0,255,  255,255,0,255, 255,255,0,255,
      255,255,0,255,  255,255,0,255,  255,255,0,255, 255,255,0,255,
      255,255,0,255,  255,255,0,255,  255,255,0,255, 255,255,0,255,
      
      ]));



  gl.texSubImage2D(
    gl.TEXTURE_2D,
    0,//mip level
    1,//destX
    1,//destY
    3,//width
    1,//heiht
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([
     255,0,0,255,    0,255,0,255,  0,0,255,255
     // 255,0,0,255,    0,255,0,255, 

      //la taille de ce tableau NE peut PAS etre inférieure au parametre width
      ])
  );


  let resolutionLocation = gl.getUniformLocation(shader, "u_resolution");


  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clear(gl.COLOR_BUFFER_BIT);

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
  
    gl.texSubImage2D(
    gl.TEXTURE_2D,
    0,//mip level
    0,//destX
    0,//destY
    1,//width
    2,//heiht
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([
     127,127,127,255,  127,0,127,255, 
     // 255,0,0,255,    0,255,0,255, 

      //la taille de ce tableau NE peut PAS etre inférieure au parametre width
      ])
  );

  gl.drawArrays(gl.TRIANGLES, 0, 6);



  let pixels = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  console.log(pixels);


  let pixelsArray = new Array(width * height * 4);
  for(let i=0 ; i < width*height*4; i++) {
    pixelsArray[i]=Math.round((pixels[i] + Number.EPSILON) * 100) / 100;
  }
  for (let i=0 ; i<width*height; i++) {
    console.log(pixelsArray.slice(i*4,i*4+4));
  }




