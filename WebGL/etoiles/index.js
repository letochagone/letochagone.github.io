  const elem2 = document.createElement("pre");
  elem2.textContent = 'J'  ;
  document.body.appendChild(elem2);

/*
https://jsgist.org/?src=dd9bea6a850447dde59dc50eeb402c1c
*/
let debug=false;
let dedede = 256;
if (debug) dedede=2;

let ygrec=0;
let myReq;
let millis;

const el = document.getElementById("canvas");
let width = 500;
let height = 500;
const gl = el.getContext('webgl') ;
gl.canvas.width = width;
gl.canvas.height = height ;
const ext= gl.getExtension('OES_texture_float');

let trianglesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, trianglesBuffer);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(
  [-1,-1,   -1,1,   1,-1,   1,-1,  -1,1,   1,1]),
gl.STATIC_DRAW);


let pointsBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
const d=[];
for (let j=0; j < dedede; j++)
  for (let i=0; i < dedede; i++)
    d.push(
      i / dedede,
      j / dedede
    );
//if (debug) console.log("pointsBuffer : ",d);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(d), gl.STATIC_DRAW);
  
function touch(event) {
    const x = (event.clientX / width) * 2 - 1;
    const y = (event.clientY / height) * -2 + 1;
    //remettre
    if (!debug) emitParticles(x, y);
   // console.log(millis);

}

function resize() {
  width = gl.canvas.clientWidth;
  height = gl.canvas.clientHeight;
  gl.canvas.width = width;
  gl.canvas.height = height;

  let scale = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  gl.canvas.width = width * scale;
  gl.canvas.height = height * scale;
  gl.canvas.style.width = width + 'px';
  gl.canvas.style.height = height + 'px';
};


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

function _emitParticles(x,y)  {
  gl.bindTexture(gl.TEXTURE_2D, physicsInputTexture);
  let force = 1.0;
  let data = [];
  for (let j = 0; j < dedede; j++) {
    let alea1 = random(0,1) ;
    let alea2 = random(-1, 1);
    let alea3 = random(-1, 1);
    

    //alea1=0.7;
    //alea2=-0.6;
    //alea3=+0.5;
    function fract(x) { return x - Math.floor(x); }
    //alea1 = fract(Math.sin(t*65445.0)*100000);
    //console.log(t);

    data.push(
      x     , y     , alea1 , 0 ,
      alea2 , alea3 , j     , 0
    );
  }
  //console.log("data= ",data)
  gl.texSubImage2D(
    gl.TEXTURE_2D, 0,
    0,ygrec,
    2*dedede, 1,  //tailleX,tailleY
    gl.RGBA, gl.FLOAT, 
    new Float32Array(data)
  );
  /*
  || POSITION_SLOT       |       VELOCITY_SLOT         || POSITION_SLOT       |       VELOCITY_SLOT         || POSITION_SLOT       |       VELOCITY_SLOT         ||..... POSITION_SLOT       |       VELOCITY_SLOT         ||
  || x1 | y1 | alea  | 0 | aleaVx | aleaVy     | j | 0 || x1 | y1 | alea  | 0 | aleaVx | aleaVy     | j | 0 || x1 | y1 | alea  | 0 | aleaVx | aleaVy     | j | 0 ||..... x1 | y1 | alea  | 0 | aleaVx | aleaVy     | j | 0 ||
     x2 | y2 | alea  | 0 | aleaVx | aleaVy     | j | 0 || x2 | y2 | alea  | 0 | aleaVx | aleaVy     | j | 0 || x2 | y2 | alea  | 0 | aleaVx | aleaVy     | j | 0 ||..... x2 | y2 | alea  | 0 | aleaVx | aleaVy     | j | 0 ||
     ligne ygrec    || x  | y  | 0>1   | 0 | -1>+1   | -1>+1    | j=0 | 0 || x | y | 0>1 | 0 | -1>+1 | -1>+1  | j=1 | 0 || x | y | 0>1 | 0 | -1>+1 | -1>+1  | j=2 | 0 || x | y | 0>1 | 0 || -1>+1 | -1>+1  | j=3 | 0 ||
     || POSITION_SLOT   |       VELOCITY_SLOT      ||   POSITION_SLOT |       VELOCITY_SLOT      ||   POSITION_SLOT |       VELOCITY_SLOT      ||   POSITION_SLOT ||       VELOCITY_SLOT      ||
        ligne ygrec     || x | y | 0>1 | 0 | -1>+1 | -1>+1  | j=0 | 0 || x | y | 0>1 | 0 | -1>+1 | -1>+1  | j=1 | 0 || x | y | 0>1 | 0 | -1>+1 | -1>+1  | j=2 | 0 || x | y | 0>1 | 0 || -1>+1 | -1>+1  | j=3 | 0 ||
  */
  ygrec ++;
  if (ygrec>( dedede - 1 )) ygrec=0;
  //ygrec %= PARTICLE_EMIT_RATE;
}

function emitParticles(x,y) {

  

  gl.useProgram(emitProgram);
  gl.viewport(0, 0, dedede*2, dedede);

  gl.bindBuffer(gl.ARRAY_BUFFER, trianglesBuffer);
  let aVertexPosition = gl.getAttribLocation(emitProgram,"vertexPosition");
  gl.enableVertexAttribArray(aVertexPosition);
  gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, gl.FALSE, 0, 0);



  let frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  let textureTemp= gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureTemp);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2*dedede, dedede, 0, gl.RGBA, gl.FLOAT, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureTemp, 0);


  let textureLoc = gl.getUniformLocation(emitProgram,"texture");
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, physicsInputTexture);
  gl.uniform1i(textureLoc, 0);

  let unifX = gl.getUniformLocation(emitProgram,"x");
  let unifY = gl.getUniformLocation(emitProgram,"y");

  let uYgrec = gl.getUniformLocation(emitProgram,"ygrec");

  gl.uniform1f(uYgrec,ygrec);

  ygrec ++;
  if (ygrec>( dedede - 1 )) ygrec=0;

  gl.uniform1f(unifX,x);
  gl.uniform1f(unifY,y);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  physicsInputTexture = textureTemp;
}




//buffer qui numérote les particules : 1...PARTICLE_COUNT
if (false) {
    let NBREdePARTICULES = dedede*dedede ;
    const vertexIds = new Float32Array([...Array(NBREdePARTICULES)].map((_, i) => i + 1));
    //vertexIds.forEach((v, i) => {vertexIds[i] = i;});
    //console.log(vertexIds);
    let idBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,idBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertexIds,gl.STATIC_DRAW);
}

//container = document.getElementById('container');
//canvas.addEventListener('touchmove', touch);
//canvas.addEventListener('mousemove', touch);
//window.addEventListener('resize', resize);

el.onpointermove = touch;

//container.appendChild(gl.canvas);

let physicsOutputTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, physicsOutputTexture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2*dedede, dedede, 0, gl.RGBA, gl.FLOAT, null);

let physicsInputTexture= gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, physicsInputTexture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2*dedede, dedede, 0, gl.RGBA, gl.FLOAT, null);

if (!debug) {
  let data=[];
  for (let i=0; i < dedede ; i++) {
    for (let j = 0; j < dedede; j++) {
      let x=0;
      let y=0;
      let alea1 = random(0,1) ;
      let alea2 = random(-1, 1);
      let alea3 = random(-1, 1);
      data.push(
        x     , y     , random(0,1) , 0 ,
        random(-1, 1) , random(-1, 1) , j     , 0
      );
    }
  }
  gl.bindTexture(gl.TEXTURE_2D, physicsInputTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2*dedede, dedede, 0, gl.RGBA, gl.FLOAT, new Float32Array(data));
}

if (debug) {
  let data=[];
  for (let i=0; i < dedede ; i++) {
    for (let j = 0; j < dedede; j++) {
      data.push(11,22,33,44,  55,66,77,88);
    }
  }
  console.log("data inital de physicsInputTexture :",data);
  /*
     11, 22, 33, 44,   55, 66, 77, 88,    11, 22, 33, 44,    55,66, 77, 88,    
     11, 22, 33, 44,   55, 66, 77, 88,    11, 22, 33, 44,    55, 66, 77, 88
  */
  gl.bindTexture(gl.TEXTURE_2D, physicsInputTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2*dedede, dedede, 0, gl.RGBA, gl.FLOAT, new Float32Array(data));
}

const loaded = () => {
  gl.bindTexture(gl.TEXTURE_2D, particleTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
};
const image = new Image();
image.src=  './textures/particle.png';
image.addEventListener("load", loaded); 

let particleTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, particleTexture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 5, 5, 0, gl.RGBA, gl.UNSIGNED_BYTE,
  new Uint8Array(
    [ 255, 0, 0, 255,     255, 0, 0, 255,   255, 0, 0, 255,     255, 0, 0, 255,    255, 0, 0, 255,
      255, 0, 0, 255,     255, 0, 0, 255,   255, 0, 0, 255,     255, 0, 0, 255,    255, 0, 0, 255,
      255, 0, 0, 255,     255, 0, 0, 255,   255, 0, 0, 255,     255, 0, 0, 255,    255, 0, 0, 255,
      255, 0, 0, 255,     255, 0, 0, 255,   255, 0, 0, 255,     255, 0, 0, 255,    255, 0, 0, 255,
      255, 0, 0, 255,     255, 0, 0, 255,   255, 0, 0, 255,     255, 0, 0, 255,    255, 0, 0, 255]
  ));

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
  }
`;

let physicsVS=`
  attribute vec2 vertexPosition;
  void main() {
    gl_Position = vec4(vertexPosition, 0, 1);
  }
`;

let physicsFS=`
  precision mediump float;
  uniform sampler2D physicsData;
  uniform vec2 bounds;
  const int POSITION_SLOT = 0;
  const int VELOCITY_SLOT = 1;
  uniform bool debug;

  void main() {
    int slot = int(mod(gl_FragCoord.x, 2.0)); // 0 1 0 1 0 1 ...
    vec4 dataCourante =  texture2D(physicsData,  gl_FragCoord.xy  / bounds) ;

    if (slot == POSITION_SLOT) {
      vec4 dataB =  texture2D(physicsData, (gl_FragCoord.xy + vec2(1.0,0.0)) / bounds)  ;
      vec2 xiyi      = dataCourante.xy  ;
      vec2 vit       = dataB.xy  ;
      float alea0to1 = dataCourante.z   ; 

      if (!debug) xiyi += vit * 0.005;
      if (debug) xiyi += vit;

      gl_FragColor = vec4(xiyi, alea0to1, 0.0);
    } 
    else if (slot == VELOCITY_SLOT) {
      vec2 vit     = dataCourante.xy;
      float i      = dataCourante.z;

      if (!debug) { 
        vit *= 0.991; 
      } else { 
        vit *= 10.0;
      }

      i++;

      gl_FragColor = vec4(vit, i, 0);
    }
  }
`;



let physicsProgram = gl.createProgram();
{
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, physicsVS);
  gl.shaderSource(fragmentShader, physicsFS);
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);
  gl.attachShader(physicsProgram, vertexShader);
  gl.attachShader(physicsProgram, fragmentShader);
}
gl.linkProgram(physicsProgram);

physicsProgram.vertexPosition = gl.getAttribLocation( physicsProgram, 'vertexPosition');
physicsProgram.physicsData    = gl.getUniformLocation(physicsProgram, 'physicsData'   );
physicsProgram.bounds         = gl.getUniformLocation(physicsProgram, "bounds"        );
physicsProgram.debug          = gl.getUniformLocation(physicsProgram, "debug"         );      

let renderProgram = gl.createProgram();
{
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, renderVS);
  gl.shaderSource(fragmentShader, renderFS);
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);
  gl.attachShader(renderProgram, vertexShader);
  gl.attachShader(renderProgram, fragmentShader);
}
gl.linkProgram(renderProgram);

renderProgram.dataLocation =     gl.getAttribLocation(renderProgram, 'dataLocation');
renderProgram.particleTexture = gl.getUniformLocation(renderProgram, 'particleTexture');
renderProgram.physicsData =     gl.getUniformLocation(renderProgram, 'physicsData');
renderProgram.bounds =          gl.getUniformLocation(renderProgram, 'bounds');


let emitVS=`
  attribute vec2 vertexPosition;
  varying vec2 coord;
  void main() {
    coord = (vertexPosition + 1.0) / 2.0;
    gl_Position = vec4(vertexPosition, 1, 1);
  }`;

  let emitFS=`
  precision mediump float;
  uniform sampler2D texture;
  varying vec2 coord;

  uniform float x;
  uniform float y;
  uniform float ygrec;

  float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }
  //https://stackoverflow.com/questions/68991114/glsl-pseudo-random-in-range

  highp float rand2(vec2 co, float a, float b) {
    return mix( a , b , rand(co));
    // a + (b-a) * x or mix(a, b, x)
  }
  void main() {
    vec4 color;

    int slot = int(mod(gl_FragCoord.x, 2.0)); // 0 1 0 1 0 1 ...
    int sloty = int(mod(gl_FragCoord.y, 2.0)); // 0 1 0 1 0 1 ...

    float whichLine= floor(gl_FragCoord.y);

    float colonneVitesseCourante = floor(floor(gl_FragCoord.x)/2.0);
    //float ancienneValeurZcolonneVitesse =  texture2D(texture, coord).z;

    // gl_FragCoord.x          0.5 1.5 2.5 3.5 4.5 ....
    // floor(gl_FragCoord.x)   0   1   2   3   4 
    // floor(gl_FragCoord.x)/2 0   0.5 1   1.5 2
    // floor(...)              0   0   1   1

    gl_FragColor = texture2D(texture, coord);

    //if ((slot==1) && (ygrec==1.0)) {gl_FragColor=vec4(1);} //else gl_FragColor = texture2D(texture, coord);

    float alea1= rand(vec2(x+5.0,y-5.0)) ; //random 0..1;
    float alea2 = rand2(vec2(y,x),-1.0,+1.0); //random -1..+1;
    float alea3 = rand2(vec2(x*2.0,y*2.0), -1.0, +1.0); //random -1..+1;

    alea1 = rand(gl_FragCoord.xy);
    alea2 = rand2(coord*vec2(65.90,-765.9),-1.0,+1.0);
    alea3 = rand2(coord*vec2(265.90,765.9),-1.0,+1.0);

    //alea3 = rand2(  gl_FragCoord.yx * cos(gl_FragCoord.y*654.6)     ,-1.0,+1.0);
    //alea1=0.7;
    //alea2=-0.6;
    //alea3=+0.5;

    vec4 position_slot  = vec4( x     , y     , alea1 ,0.0);
    vec4 vitesse_slot   = vec4( alea2 , alea3 , colonneVitesseCourante   ,0.0);

    if ((slot==1) && (whichLine==ygrec)) {gl_FragColor=vitesse_slot;}
    if ((slot==0) && (whichLine==ygrec)) {gl_FragColor=position_slot;}

  
  }`;

  let emitProgram = gl.createProgram();
  {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader, emitVS);
    gl.shaderSource(fragmentShader, emitFS);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    gl.attachShader(emitProgram, vertexShader);
    gl.attachShader(emitProgram, fragmentShader);  
  }

  gl.linkProgram(emitProgram);



//resize();


//remettre
if (!debug) update();




//////////////////////////////////////////////////
/////////////////////////////////////////////////
////////////////////////////////////////////////

function update(maMillis) {
  if (!debug) {myReq=requestAnimationFrame(update);}
  millis = maMillis;
  /*
  if (debug) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, physicsInputTexture, 0);
    let lx=dedede*2;
    let ly=dedede;
    let pixels = new Float32Array(lx*ly*4);
    gl.readPixels(0,0,lx,ly,gl.RGBA,gl.FLOAT,pixels);
    //console.log("consolelog : ",pixels);
    log(pixels);
  }
  */

  /////////
  //PHYSICS
  ///////
  gl.useProgram(physicsProgram);
  gl.viewport(0, 0, dedede*2, dedede);

  gl.bindBuffer(gl.ARRAY_BUFFER, trianglesBuffer);
  gl.enableVertexAttribArray(physicsProgram.vertexPosition);
  gl.vertexAttribPointer(physicsProgram.vertexPosition, 2, gl.FLOAT, gl.FALSE, 0, 0);

  gl.uniform2f(physicsProgram.bounds, 2*dedede, dedede);

  gl.uniform1i(physicsProgram.debug,debug);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, physicsInputTexture);
  gl.uniform1i(physicsProgram.physicsData, 0);

  let frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, physicsOutputTexture, 0);
  
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  if (debug) {
    let lx=dedede*2;
    let ly=dedede;
    let pixels = new Float32Array(lx*ly*4);
    gl.readPixels(0,0,lx,ly,gl.RGBA,gl.FLOAT,pixels);
    //console.log("consolelog : ",pixels);
    log(pixels);
  }



  gl.useProgram(renderProgram);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
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
    gl.uniform1f(nbre,dedede*dedede);
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

  gl.drawArrays(gl.POINTS, 0, dedede*dedede);
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
