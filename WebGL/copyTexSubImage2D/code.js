
let canvas= document.getElementById("c");
canvas.width=7;
canvas.height=7;
let gl = canvas.getContext("webgl", {antialias: false});


const vs = `
  attribute vec2 aPosition;
  varying vec2 vTexcoord;
  void main() {
    gl_Position = vec4(aPosition,0.0,1.0);
    vTexcoord = aPosition * 0.5 + 0.5;
  }
`;

const fs = `
  precision mediump float;
  uniform sampler2D u_texture;
  varying vec2 vTexcoord;

  void main() {
    gl_FragColor = texture2D(u_texture, vTexcoord);
  }
`;



let program = gl.createProgram();
{
let vertex = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertex, vs);
  gl.compileShader(vertex);
  let successCompileVertex = gl.getShaderParameter(vertex, gl.COMPILE_STATUS);
  console.log("COMPILE_STATUS du vertex :" + successCompileVertex);
  if (!successCompileVertex) console.log("erreur compilation du vertex : "+gl.getShaderInfoLog(vertex));

  let fragment = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragment, fs);
  gl.compileShader(fragment);
  let successCompileFragment = gl.getShaderParameter(fragment, gl.COMPILE_STATUS);
  console.log("COMPILE_STATUS du fragment :" + successCompileFragment);
  if (!successCompileFragment) console.log("erreur compilation du fragment : "+gl.getShaderInfoLog(fragment));

gl.attachShader(program,vertex);
gl.attachShader(program,fragment);
gl.linkProgram(program);
let successLink = gl.getProgramParameter(program, gl.LINK_STATUS);
console.log("LINK_STATUS du Program : "+successLink);
if (!successLink)  console.log(gl.getProgramInfoLog(program));

}

  gl.useProgram(program);


function f11(e) {

  var image = new Image();
    image.onload = function() {
      let div  = document.getElementById(e);
      div.appendChild(image);

    }
    image.src = canvas.toDataURL('image/png');
}

function go() {
  const vertexPositionAttributeLocation = gl.getAttribLocation( program,"aPosition");

  let vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 
    new Float32Array([
    -1, -1,  
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]),
 
  gl.STATIC_DRAW);

  gl.enableVertexAttribArray(vertexPositionAttributeLocation);
  gl.vertexAttribPointer(vertexPositionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const atexcoordLocation = gl.getAttribLocation( program,"aColor");

  // make a texture for a framebuffer
  var fbtex = gl.createTexture();
  // la couleur de cette texture est T cette texture sera devant
  gl.bindTexture(gl.TEXTURE_2D, fbtex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 7, 7, 0, gl.RGBA, gl.UNSIGNED_BYTE,
  	new Uint8Array([
  		/* premiere ligne à partir du bas*/


0,0,255,255,       192,192,192,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   
192,192,192,255,   255,0  ,255,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   
192,192,192,255,   192,192,192,255,   0,255,255,255,     192,192,192,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   
192,192,192,255,   192,192,192,255,   192,192,192,255,   255,0  ,0  ,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   
192,192,192,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   0,255,0,255,       192,192,192,255,   192,192,192,255,   
192,192,192,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   255,255,0  ,255,   192,192,192,255,   
192,192,192,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   192,192,192,255,   128,0,0,255,   



    
  	])
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  // create a framebuffer and attach the texture
  let fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbtex, 0);




  // now make a texture

  var tex = gl.createTexture();
  // coueur de cette texture = Verte , elle sera derriere
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 7, 7, 0, gl.RGBA, gl.UNSIGNED_BYTE,
  	new Uint8Array([
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
  
 	
  		]));
  /*   

  cette texture recevra une portion de la fbtexture (portion spécifiée par les parametre de copyTexSubImage)
  

  */ 
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  // copy part of the fbtexture to it
  // target, level, xoffset, yoffset, x, y, width, height

  /*
  texture initiale

  - - - - - - 7
  - - - - - 6 -
  - - - - 5 - -
  - - - 4 - - - 
  - - 3 - - - -
  - 2 - - - - -
  1 - - - - - -



   */
 gl.copyTexSubImage2D(gl.TEXTURE_2D, 0,    2,   2,    3, 3,    3, 3);

 //gl.copyTexSubImage2D(gl.TEXTURE_2D, 0,    0,   0,    0, 0,    7, 7);
/*

- - - - - - -
- - - - - - -
- - - - 6 - -
- - - 5 - - -
- - 4 - - - -
- - - - - - -
- - - - - - -
*/

  
  /*
  // target, level, xoffset, yoffset, x, y, width, height

   The screen-aligned pixel rectangle with lower left corner at x y and with width width and height height
    replaces the portion of the texture array 
    with x indices xoffset through xoffset + width - 1 , inclusive, 
    and y indices yoffset through yoffset + height - 1 , inclusive,
     at the mipmap level specified by level. 
  */
  //gl.copyTexSubImage2D(gl.TEXTURE_2D, 0,    1, 1,    1, 1,    6, 6);




  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  // now clear to red
  gl.clearColor(1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Now render with the texture
  gl.drawArrays(gl.TRIANGLES,0,6);




f11("un");


gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 7, 7, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
  
  
      ]));
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);


 gl.copyTexSubImage2D(gl.TEXTURE_2D, 0,    0,   0,    0, 0,    7, 7);
/*

- - - - - - -
- - - - - - -
- - - - 6 - -
- - - 5 - - -
- - 4 - - - -
- - - - - - -
- - - - - - -
*/


  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.clearColor(1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Now render with the texture
  gl.drawArrays(gl.TRIANGLES,0,6);


f11("zero");






gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 7, 7, 0, gl.RGBA, gl.UNSIGNED_BYTE,
  new Uint8Array([
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
  
  
]));
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.copyTexSubImage2D(gl.TEXTURE_2D, 0,    0,   0,    0, 0,    5, 5);

gl.bindFramebuffer(gl.FRAMEBUFFER, null);

gl.clearColor(1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES,0,6);
f11("deux");



gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 7, 7, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
]));
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.copyTexSubImage2D(gl.TEXTURE_2D, 0,    0,   0,    2, 3,    7, 7);

gl.bindFramebuffer(gl.FRAMEBUFFER, null);
gl.clearColor(1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES,0,6);
f11("trois");






gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 7, 7, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
      0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255, 0,153,153,255,  
]));
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.copyTexSubImage2D(gl.TEXTURE_2D, 0,    1,   2,    0, 0,    5, 5);
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
gl.clearColor(1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES,0,6);
f11("quatre");




gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
let tex5 = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D,tex5);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

gl.copyTexImage2D(gl.TEXTURE_2D, 0,  gl.RGBA, 2, 1,   7, 7,   0);
// copyTexImaged2D est une 'read operation'
// https://registry.khronos.org/webgl/specs/latest/1.0/  
// 5.14.12 Read Operations

//copyTexImage2D copies from the current framebuffer or canvas into the given target of the current texture unit
/*
ici le framebuffer courant c'est fb.
*/

//copyTexImage2D(target,  level,  internalformat,  x,  y,  width,  height,  border) 
//https://registry.khronos.org/webgl/specs/latest/1.0/#5.14.8
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
gl.clearColor(1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES,0,6);
f11("cinq");



}
go();


