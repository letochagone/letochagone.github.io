
let renderVS=`
  attribute vec2 dataLocation;
  attribute float a_vertexId;

  uniform sampler2D physicsData;
  uniform float NBREdePARTICULES;
  uniform float time;

uniform vec2 bounds;



  float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }


/*
              <-----------------dataA------------------------------><----------dataB--------------------------->
                            POSITION_SLOT                          ||       VELOCITY_SLOT                      ||
           
              |  x1                |  y1               | z1  | w1  ||  vx2         | vy2        | z2     | w2  ||
       
 */
// une ligne de la texture 
// <-----dataA---------><------dataB----------->
// x1 , y1 ,  0>1 ,     0  | -1>+1 , -1>1 , 0 , 0 || x1 , y1 , 0>1 , 0  | -1>+1 , -1>1 , 1 , 0 || ......... || x1 , y1 , 0>1 , 0  | -1>+1 , -1>1 , dedede-1 , 0 || 

  void main() {

    vec4 dataA = texture2D(physicsData, dataLocation                                );
    vec4 dataB = texture2D(physicsData, dataLocation + vec2( 1.0/bounds.x , 0.0 )   );

    vec2  xiyi      = dataA.xy ;
    float sizeParam = dataA.z  ;
    float i         = dataB.z  ;

    gl_Position = vec4(xiyi,0.0, 1.0);

    gl_PointSize = min(
      64.0,
      50.0*pow(sizeParam,i) 

    );
  }
`;

let renderFS=`
  uniform sampler2D particleTexture;
  void main() {
    gl_FragColor = texture2D(particleTexture, gl_PointCoord);
  }`;

let physicsVS=`
attribute vec2 vertexPosition;
void main() {
  gl_Position = vec4(vertexPosition, 0, 1);
}`;

let physicsFS=`
precision mediump float;
uniform sampler2D physicsData;
uniform vec2 bounds;
const int POSITION_SLOT = 0;
const int VELOCITY_SLOT = 1;


// <-----dataA-----------------><------dataB-------------->
//   xiyi    alea0to1                vitesse
// x1 , y1 ,  0>1     ,     0  | -1>+1 , -1>1 , 0 , 0 || x1 , y1 , 0>1 , 0  | -1>+1 , -1>1 , 1 , 0 || ......... || x1 , y1 , 0>1 , 0  | -1>+1 , -1>1 , dedede-1 , 0 || 



           // <-----dataA---------><------dataB----------->
           //  POSITION_SLOT            VELOCITY_SLOT
           // x   y      z     w      x       y     z   w    x   y   z     w
           // * , * ,    *   , *  |   *   ,   *   , * , * || * , * , *   , *  |  *    ,  *   , * , * || ......... || * , * , *   , *  |   *   , *    , *        , * ||
           // * , * ,    *   , *  |   *   ,   *   , * , * || * , * , *   , *  |  *    ,  *   , * , * || ......... || * , * , *   , *  |   *   , *    , *        , * ||
           // * , * ,    *   , *  |   *   ,   *   , * , * || * , * , *   , *  |  *    ,  *   , * , * || ......... || * , * , *   , *  |   *   , *    , *        , * ||
           // x , y ,  alea1 , 0  | alea2 , alea3 , 0 , 0 || x , y , 0>1 , 0  | -1>+1 , -1>1 , 1 , 0 || ......... || x , y , 0>1 , 0  | -1>+1 , -1>1 , dedede-1 , 0 || 
           // * , * ,    *   , *  |   *   ,   *   , * , * || * , * , *   , *  |  *    ,  *   , * , * || ......... || * , * , *   , *  |   *   , *    , *        , * ||
           // * , * ,    *   , *  |   *   ,   *   , * , * || * , * , *   , *  |  *    ,  *   , * , * || ......... || * , * , *   , *  |   *   , *    , *        , * ||
  
/*


pour toutes les lignes : 

            <-----------------dataA------------------------------><----------dataB--------------------------->
                          POSITION_SLOT                          ||       VELOCITY_SLOT                      ||
           
 avant      |  x1                |  y1               | z1  | w1  ||  x2         | y2          | z2     | w2  ||
       
 après      |  x1 + x2 * 0.005   |  y1 + y2 * 0.005  | z1  | 0   ||  x2 * 0.991 | y2 * 0.991  | z2 + 1 | 0   ||

*/
void main() {
  int slot = int(mod(gl_FragCoord.x, 2.0)); // 0 1 0 1 0 1 ...

  if (slot == POSITION_SLOT) {
    vec4 dataA =  texture2D(physicsData,  gl_FragCoord.xy                  / bounds) ;
    vec4 dataB =  texture2D(physicsData, (gl_FragCoord.xy + vec2(1.0,0.0)) / bounds)  ;

    vec2 xiyi      = dataA.xy  ;
    vec2 vit       = dataB.xy  ;
    float alea0to1 = dataA.z   ;

    xiyi += vit * 0.005;
  
    gl_FragColor = vec4(xiyi, alea0to1, 0.0);


  } else if (slot == VELOCITY_SLOT) {

    vec4 dataB   = texture2D(physicsData, gl_FragCoord.xy / bounds) ;
    vec2 vit     = dataB.xy                                         ;
    float i      = dataB.z                                          ;

    vit *= 0.991;

    i++;
    gl_FragColor = vec4(vit, i, 0);

  }
}`;

let debug=false;

//enlever remettre 256
let dedede = 256;
if (debug) dedede=2;
//const dedede = 256;

const PARTICLE_COUNT = dedede * dedede;
const PARTICLE_DATA_SLOTS = 2;
const PARTICLE_DATA_WIDTH = dedede * PARTICLE_DATA_SLOTS;
const PARTICLE_DATA_HEIGHT = dedede;

let physicsInputTexture;
let physicsOutputTexture;
let particleTexture;

let physicsProgram;
let renderProgram;

let frameBuffer;
let container;
let millis;
let height;
let width;
let scale;

let dataLocationBuffer;
let viewportQuadBuffer;
let idBuffer;

let ygrec=0;

let myReq;






  const el = document.getElementById("canvas");


  width = 500;
  height = 500;
 
  const gl = el.getContext('webgl') ;
 gl.canvas.width = width;
  gl.canvas.height = height ;
  gl.canvas.style.width = width + 'px';
  gl.canvas.style.height = height + 'px';

  const ext= gl.getExtension('OES_texture_float');

  




const createShader = (source, type) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }
  return shader;
};

const createProgram = (vSource, fSource) => {
  const vs = createShader(vSource, gl.VERTEX_SHADER);
  const fs = createShader(fSource, gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }
  return program;
};




function touch(event) {
    const x = (event.clientX / width) * 2 - 1;
    const y = (event.clientY / height) * -2 + 1;
    //remettre
    if (!debug) emitParticles(x, y);

}




const random = (min, max) => {
  if (typeof min !== 'number') min = 1;
  if (typeof max !== 'number') max = min, min = 0;
  return min + Math.random() * (max - min);
  /*
  si je lance random(10) alors min est défini mais pas max ( son typeof n'est pas un 'number')
  donc random(10) : max=10 min=0
    return Math.random() * 10
    return 0..10
  */
};


/*
je cherche à remplacer random(-0.01,+0.01)
par une fonction en glsl

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

la fonction ci dessus retourne un nombre entre 0 et 1

*/
function emitParticles(x,y)  {
  


  gl.bindTexture(gl.TEXTURE_2D, physicsInputTexture);


  let force = 1.0;
  let data = [];
  for (let j = 0; j < dedede; j++) {

    let alea1 = random(0,1) ;
    let alea2 = random(-1, 1);
    let alea3 = random(-1, 1);

    data.push(
      x     , y     , random(0,1) , 0 ,
      random(-1, 1) , random(-1, 1) , j     , 0
    );
  }

  gl.texSubImage2D(
    gl.TEXTURE_2D, 0,
    0,ygrec,
    2*dedede, 1,  //tailleX,tailleY
    gl.RGBA, gl.FLOAT, 
    new Float32Array(data) // ce tableau doit faire tailleX*tailleY*4
                           // calculons sa taille :
                           // j=0...PARTICLE_EMIT_RATE data.push(8éléments)
                           // à la fin: data contient PARTICLE_EMIT_RATE*8
                           // comparons avec tailleX*tailleY*4
                           //  PARTICLE_EMIT_RATE * PARTICLE_DATA_SLOTS *1*4
                           //  PARTICLE_EMIT_RATE * 8 OK !!!
  );


/*
|| POSITION_SLOT       |       VELOCITY_SLOT         || POSITION_SLOT       |       VELOCITY_SLOT         || POSITION_SLOT       |       VELOCITY_SLOT         ||..... POSITION_SLOT       |       VELOCITY_SLOT         ||
|| x1 | y1 | alea  | 0 | aleaVx | aleaVy     | j | 0 || x1 | y1 | alea  | 0 | aleaVx | aleaVy     | j | 0 || x1 | y1 | alea  | 0 | aleaVx | aleaVy     | j | 0 ||..... x1 | y1 | alea  | 0 | aleaVx | aleaVy     | j | 0 ||
|| x2 | y2 | alea  | 0 | aleaVx | aleaVy     | j | 0 || x2 | y2 | alea  | 0 | aleaVx | aleaVy     | j | 0 || x2 | y2 | alea  | 0 | aleaVx | aleaVy     | j | 0 ||..... x2 | y2 | alea  | 0 | aleaVx | aleaVy     | j | 0 ||


 ligne ygrec    || x  | y  | 0>1   | 0 | -1>+1   | -1>+1    | j=0 | 0 || x | y | 0>1 | 0 | -1>+1 | -1>+1  | j=1 | 0 || x | y | 0>1 | 0 | -1>+1 | -1>+1  | j=2 | 0 || x | y | 0>1 | 0 || -1>+1 | -1>+1  | j=3 | 0 ||
   







                 || POSITION_SLOT   |       VELOCITY_SLOT      ||   POSITION_SLOT |       VELOCITY_SLOT      ||   POSITION_SLOT |       VELOCITY_SLOT      ||   POSITION_SLOT ||       VELOCITY_SLOT      ||
 ligne ygrec     || x | y | 0>1 | 0 | -1>+1 | -1>+1  | j=0 | 0 || x | y | 0>1 | 0 | -1>+1 | -1>+1  | j=1 | 0 || x | y | 0>1 | 0 | -1>+1 | -1>+1  | j=2 | 0 || x | y | 0>1 | 0 || -1>+1 | -1>+1  | j=3 | 0 ||
       

*/

  ygrec ++;
  if (ygrec>( dedede - 1 )) ygrec=0;
  //ygrec %= PARTICLE_EMIT_RATE;
  


}




// ——————————————————————————————————————————————————
// Main
// ——————————————————————————————————————————————————




  dataLocationBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, dataLocationBuffer);

  const d=[];
  for (let j=0; j < dedede; j++)
    for (let i=0; i < dedede; i++)
      d.push(
        i / dedede,
        j / dedede
      );
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(d), gl.STATIC_DRAW);
  //taille de d : per*per*2
  
  viewportQuadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, viewportQuadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(
    [-1,-1,   -1,1,   1,-1,   1,-1,  -1,1,   1,1]),
    gl.STATIC_DRAW);

  //buffer qui numérote les particules : 1...PARTICLE_COUNT
  if (false) {
    let NBREdePARTICULES = PARTICLE_COUNT ;
    const vertexIds = new Float32Array([...Array(NBREdePARTICULES)].map((_, i) => i + 1));
    //vertexIds.forEach((v, i) => {vertexIds[i] = i;});
    //console.log(vertexIds);
    idBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,idBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertexIds,gl.STATIC_DRAW);
  }

  //container = document.getElementById('container');
  millis = 0;
  canvas.addEventListener('touchmove', touch);
  canvas.addEventListener('mousemove', touch);
  //window.addEventListener('resize', resize);
  //container.appendChild(gl.canvas);

  physicsOutputTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, physicsOutputTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2*dedede, dedede, 0, gl.RGBA, gl.FLOAT, null);

  physicsInputTexture= gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, physicsInputTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2*dedede, dedede, 0, gl.RGBA, gl.FLOAT, null);

  const loaded = () => {
      gl.bindTexture(gl.TEXTURE_2D, particleTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
  };
  const image = new Image();
  image.src=  './textures/particle.png';
  image.addEventListener("load", loaded); 

  particleTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, particleTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  physicsProgram = createProgram(physicsVS, physicsFS);
  physicsProgram.vertexPosition = gl.getAttribLocation(physicsProgram, 'vertexPosition');
  physicsProgram.physicsData =   gl.getUniformLocation(physicsProgram, 'physicsData');
  physicsProgram.bounds =        gl.getUniformLocation(physicsProgram, 'bounds');

  renderProgram = createProgram(renderVS, renderFS);
  renderProgram.dataLocation =     gl.getAttribLocation(renderProgram, 'dataLocation');
  renderProgram.particleTexture = gl.getUniformLocation(renderProgram, 'particleTexture');
  renderProgram.physicsData =     gl.getUniformLocation(renderProgram, 'physicsData');
  renderProgram.bounds =          gl.getUniformLocation(renderProgram, 'bounds');

  frameBuffer = gl.createFramebuffer();


  //remettre
  if (!debug) update();




function update(maMillis) {
  //remettre
  if (!debug) {myReq=requestAnimationFrame(update);}

  millis = maMillis;


  /////////
  //PHYSICS
  ///////
  gl.useProgram(physicsProgram);
  gl.viewport(0, 0, PARTICLE_DATA_WIDTH, PARTICLE_DATA_HEIGHT);

  gl.bindBuffer(gl.ARRAY_BUFFER, viewportQuadBuffer);
  //    [-1,-1,   -1,1,   1,-1,   1,-1,  -1,1,   1,1]),

  //ARRAY_BUFFER_BINDING : viewportQuadBuffer
  gl.enableVertexAttribArray(physicsProgram.vertexPosition);
  /*
  global state
  ============
  ----------------------------------------------
  | ARRAY_BUFFER_BINDING | viewportQuadBuffer  |
  ----------------------------------------------
  | VERTEX_ARRAY_BINDING | null (default VAO)  |
  ----------------------------------------------
  |....                                        |


  vertex array[*default*]
  =======================
  ---------------------------     ----------
  | enabled | size | type |  .... | buffer |
  ---------------------------     ----------
  |  true   |                     |        |
  |---------|---------------- ... ----------
  */
  gl.vertexAttribPointer(physicsProgram.vertexPosition, 2, gl.FLOAT, gl.FALSE, 0, 0);
  /*
  vertex array[*default*]
  =======================
  ---------------------------     ----------------------
  | enabled | size | type |  .... | buffer             |
  ---------------------------     ---------------------
  |  true   |  2   | FLOAT|       | viewportQuadBuffer |
  |---------|---------------- ... ----------------------
  | .....                                              |
  */

  gl.uniform2f(physicsProgram.bounds, 2*dedede, dedede);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, physicsInputTexture);
  gl.uniform1i(physicsProgram.physicsData, 0);

  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, physicsOutputTexture, 0);
  
  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.ONE, gl.ONE);

  //gl.enable(gl.BLEND);
//gl.blendFuncSeparate(gl.SRC_COLOR, gl.DST_COLOR, gl.ONE, gl.ZERO);


  gl.drawArrays(gl.TRIANGLES, 0, 6);
   // gl.disable(gl.BLEND);


//remettre enlever
  if (debug) {
    let lx=dedede*2;
    let ly=dedede;
    let pixels = new Float32Array(lx*ly*4);
    gl.readPixels(0,0,lx,ly,gl.RGBA,gl.FLOAT,pixels);
    console.log("consolelog : ",pixels);
    log(pixels);
}


  ////////
  // RENDER
  ////////
  gl.useProgram(renderProgram);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, dataLocationBuffer);
  //taille du buffer : PARTICLE_EMIT_RATE*PARTICLE_EMIT_RATE*2
  gl.enableVertexAttribArray(renderProgram.dataLocation);
  gl.vertexAttribPointer(renderProgram.dataLocation, 2, gl.FLOAT, gl.FALSE, 0, 0);

  if (false) {
    gl.bindBuffer(gl.ARRAY_BUFFER,idBuffer);
    const vertexIdLoc =    gl.getAttribLocation(renderProgram, "a_vertexId");
    gl.enableVertexAttribArray(vertexIdLoc);
    // Tell the attribute how to get data out of idBuffer (ARRAY_BUFFER)
    const size = 1;          // 1 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(vertexIdLoc, size, type, normalize, stride, offset);
  

  let nbre = gl.getUniformLocation(renderProgram, 'NBREdePARTICULES');
  gl.uniform1f(nbre,PARTICLE_COUNT)

  let timeLoc = gl.getUniformLocation(renderProgram, "time");
  gl.uniform1f(timeLoc,maMillis);
}

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, physicsOutputTexture);
  gl.uniform1i(renderProgram.physicsData, 0);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, particleTexture);
  gl.uniform1i(renderProgram.particleTexture, 1);


  gl.enable(gl.BLEND);


  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.uniform2f(renderProgram.bounds, 2*dedede, dedede);


  gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
  gl.disable(gl.BLEND);



  [physicsOutputTexture,physicsInputTexture] = [physicsInputTexture,physicsOutputTexture];




}

if (debug) {


update();
update();

emitParticles(0.3,0.3);
update();
emitParticles(0.4,0.4);
update();


/*
// le shader physics augmente la valeur dataB.z à chaque animationFrame

0.00 0.00 0.00 0.00 ** 0.00 0.00 1.00 0.00 ** 0.00 0.00 0.00 0.00 ** 0.00 0.00 1.00 0.00
0.00 0.00 0.00 0.00 ** 0.00 0.00 1.00 0.00 ** 0.00 0.00 0.00 0.00 ** 0.00 0.00 1.00 0.00

0.00 0.00 0.00 0.00 ** 0.00 0.00 2.00 0.00 ** 0.00 0.00 0.00 0.00 ** 0.00 0.00 2.00 0.00
0.00 0.00 0.00 0.00 ** 0.00 0.00 2.00 0.00 ** 0.00 0.00 0.00 0.00 ** 0.00 0.00 2.00 0.00

un clique à un endroit x,y = (0.3,0.3)
position      alea1         vitesse         i
========      =====         =======        ===
<0.300 0.300> 0.565 0.00 ** -0.633 -0.238  1.00 0.00 ** <0.300 0.300> 0.673 0.00 ** 0.490 -0.453 2.00 0.00
0.00  0.00    0.00  0.00 **  0.00   0.00   3.00 0.00 **   0.00  0.00  0.00  0.00 ** 0.00   0.00  3.00 0.00

un clique à un endroit x,y=(0.4,0.4)
position      alea1         vitesse         i
========      =====         =======        ===
0.300 0.300   0.565 0.00 ** -0.627 -0.235 2.00 0.00 ** 0.300 0.300 0.673 0.00 **  0.486 -0.449 3.00 0.00
<0.400 0.400> 0.973 0.00 **  0.137 -0.886 1.00 0.00 ** <0.400 0.400> 0.782 0.00 ** -0.557 -0.602 2.00 0.00
*/
}

function log(...args) {
  const elem = document.createElement("pre");
  const elem2 = document.createElement("pre");

  //elem.textContent = [...args].join(' ');

  let lx=dedede*2;
  let ly=dedede;

  let pixels = new Float32Array(lx*ly*4);
  gl.readPixels(0,0,lx,ly,gl.RGBA,gl.FLOAT,pixels);
  //console.log(pixels);

  let array = Array.from(pixels);
  let narray=array.map(x=>x.toPrecision(3)) ;
  console.log(narray);

let i=1;
let a=narray.slice(i-1,i+3);
i=i+4;
let b=narray.slice(i-1,i+3);
i=i+4;
let c=narray.slice(i-1,i+3);
i=i+4;
let d=narray.slice(i-1,i+3);
i=i+4;
elem.textContent = [...a].join(' ') + " ** "+ [...b].join(' ') + " ** "+ [...c].join(' ') + " ** "+ [...d].join(' ')   ;

let e=narray.slice(i-1,i+3);
i=i+4;
let f=narray.slice(i-1,i+3);
i=i+4;
let g=narray.slice(i-1,i+3);
i=i+4;
let h=narray.slice(i-1,i+3);
i=i+4;
elem2.textContent = [...e].join(' ') + " ** "+ [...f].join(' ') + " ** "+ [...g].join(' ') + " ** "+ [...h].join(' ')   ;
  document.body.appendChild(elem);
    document.body.appendChild(elem2);

}