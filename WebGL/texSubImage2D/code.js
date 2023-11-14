
"use strict";

let canvas = document.getElementById("canvas");

let gl = canvas.getContext("webgl",{antialias:false});
gl.getExtension('OES_texture_float');


  let width = 6;
  let height = 3;

  canvas.style.width="600px";
  canvas.style.height="300px";
  canvas.style.imageRendering="pixelated";


const PARTICLE_COUNT = 9;
const PARTICLE_COUNT_SQRT = Math.sqrt(PARTICLE_COUNT);
const PARTICLE_DATA_SLOTS = 2;
const PARTICLE_DATA_WIDTH = PARTICLE_COUNT_SQRT * PARTICLE_DATA_SLOTS;
const PARTICLE_DATA_HEIGHT = PARTICLE_COUNT_SQRT;

gl.canvas.width = width;
gl.canvas.height = height;


  gl.viewport(0, 0, width, height);


let vertex = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;

      uniform vec2 u_resolution;

      varying vec2 v_texCoord;

      void main() {

        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = a_texCoord;
      }
    `;

let fragment = `
      precision mediump float;

      uniform sampler2D u_image;

      varying vec2 v_texCoord;

      void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
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






  let positionLocation = gl.getAttribLocation(shader, "a_position");
  let texcoordLocation = gl.getAttribLocation(shader, "a_texCoord");

  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1,    -1,1,  1,-1,    1,-1,   -1,1,  1,1


  ]), gl.STATIC_DRAW);
 


  let texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([

    /* pourquoi ça ne marche pas ?...
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
    */

    0.0, 1.0,
    0.0, 0.0,
    1.0, 1.0,
    1.0, 1.0,
    0.0, 0.0,
    1.0, 0.0
  ]), gl.STATIC_DRAW);




let   texture= gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


const r = [255, 0, 0, 255];
const g = [0, 255, 0, 255];
const b=[0,0,255,255];

const y = [255,255,0,255];
const p = [0,255,255,255];

gl.texImage2D(
     gl.TEXTURE_2D,
     0,        // mip level
     gl.RGBA,  // internal format
     width,        // width
     height,        // height
     0,        // border
     gl.RGBA,  // data format
     gl.UNSIGNED_BYTE,   // data type
     new Uint8Array([    // data
        ...r, ...g, ...r, ...g, ...r, ...g,
        ...g, ...r, ...g, ...r, ...g, ...r,
        ...y, ...g, ...r, ...g, ...r, ...g,


     ]));


  gl.texSubImage2D(
    gl.TEXTURE_2D,0,
    3,
    1,
    2,
    2,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([
        ...b, ...b, 
        ...p, ...b, ])
  );




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


  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  let utexture = gl.getUniformLocation(shader, 'u_image');

  gl.uniform1i(utexture, 0);

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




