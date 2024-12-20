
"use strict";

let width = 800;
let height= 500;
let ygrec=0;
let requestId;
let millis=0;

let showConsole=false;

function loadImage(url, callback) {
  let image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}
function loadImages(urls, callback) {
  let images = [];
  let imagesToLoad = urls.length;
  // Called each time an image finished loading.
  let onImageLoad = function() {
    --imagesToLoad;
    // If all the images are loaded call the callback.
    if (imagesToLoad == 0) {
      callback(images);
    }
  };
  for (let ii = 0; ii < imagesToLoad; ++ii) {
    let image = loadImage(urls[ii], onImageLoad);
    images.push(image);
  }
}

function main() {
  loadImages([
    "textures/casino2.png",  //imageDeFond   images[0]
    "textures/particle.png",  //image        images[1]
    "textures/casino.png",   //image2        images[2]
  ], imagesChargees);         
}

main();

function imagesChargees(images) {

  const canvas2D =  document.createElement('canvas');
  canvas2D.width = width;
  canvas2D.height  = height;
  const ctx = canvas2D.getContext('2d');
  ctx.drawImage(images[0], 0, 0, width, height);

  function getPixels() {
    let pixels= [];
    for (let x=0; x < width; x++)
      for (let y=0; y< height; y++) {
        let data=ctx.getImageData(x,y,1,1).data;
        if (data[0]>20) pixels.push(
          {  x: x ,  y: (height-y-1)  }  );
      }
    return pixels;
  }

  let nbreConsole=0;
  let mespixels = getPixels();
  let debug=false;
  let dedede = 8;


  document.querySelector("#start").addEventListener(
    'click',
    function() { 
      start();
    }
  );
  document.querySelector("#emit").addEventListener(
    'click',
    function() {

      emitParticles(0.2,0.2);
    }
  );
  document.querySelector("#stop").addEventListener(
    'click',
    function() {
      stop();
    }  
  );


  /*
  https://jsgist.org/?src=dd9bea6a850447dde59dc50eeb402c1c
  */


  const el = document.getElementById("canvas");
  const gl = el.getContext('webgl',{premultipliedAlpha: true}) ;
  gl.canvas.width = width;
  gl.canvas.height = height ;
  const extensions= {
    ext1: gl.getExtension('OES_texture_float'),
    ext2: gl.getExtension('WEBGL_color_buffer_float')
  };

  let trianglesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(
    [-1,-1,   -1,1,   1,-1,   1,-1,  -1,1,   1,1]),
  gl.STATIC_DRAW);

  let coordsTexBuff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, coordsTexBuff);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(
    [0,0,  0,1,  1,0,  1,0,  0,1,  1,1]),
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(d), gl.STATIC_DRAW);



  let idBuffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,idBuffer);
  //buffer qui numérote les particules : 1...PARTICLE_COUNT
  {
    let NBREdePARTICULES = dedede*dedede ;
    const vertexIds = new Float32Array([...Array(NBREdePARTICULES)].map((_, i) => i + 1));
    gl.bufferData(gl.ARRAY_BUFFER,vertexIds,gl.STATIC_DRAW);
  }


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

  let particleTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, particleTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[1]);


  let casinoTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, casinoTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[2]);






/*
dataA            dataB
X    Y    Z W    X Y Z W  
posx posy A          B
pour afficher l'étoile , on utilise dataA.xy pour sa position, dataA.z et dataB.z pour sa taille

*/
  let renderVS=`
    attribute vec2 a_position;

    uniform sampler2D physicsData;
    uniform float NBREdePARTICULES;
    uniform float time;

    varying float vtime;
    uniform vec2 bounds;
    varying float dataBz;

    varying float luminosite;

    float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }
    
    float random(float x,float y) { 
      return  fract(sin(x)*(100000.0+y));  
    }

    void main() {

      vtime=time;

      vec4 dataA = texture2D(physicsData, a_position                                );
      vec4 dataB = texture2D(physicsData, a_position + vec2( 1.0/bounds.x , 0.0 )   );

      dataBz = dataB.z;

      luminosite = dataA.w;

      gl_Position = vec4( dataA.xy, 0.0, 1.0 );

      gl_PointSize = min(
        64.0,
        50.0*pow( dataA.z ,dataB.z) 
        );

      // gl_PointSize=64.0;
    }
  `;

  let renderFS=`
    precision highp float;
    
    varying float dataBz;

    uniform float NBREdePARTICULES;
    uniform sampler2D particleTexture;
    uniform vec2 bounds;

    //uniform sampler2D imageCasino;

    varying float vtime;

    varying float luminosite;

    
    void main() {

      vec4 color = texture2D(particleTexture, gl_PointCoord);

      // dataBz vaut de 0 à dedede-1

      if (false)
       {
        // fonction qui vaut 1 entre 0 et a puis entre a et b elle descend linéairement vers 0
        // float( x < a) + float( x>=a) * ( -x+b)/(b-a)
         float a=50.0;
        float b= 100.0;
        float transparence = float( dataBz < a) + float( dataBz>=a) * ( -dataBz+b)/(b-a);

        vec4 orangeRed  = vec4( 255.0/255.0 ,   69.0 /255.0   ,    0.0/255.0 , 255.0/255.0);
        vec4 gold       = vec4( 255.0/255.0 ,   215.0/255.0   ,    0.0/255.0 , 255.0/255.0);
        vec4 violet     = vec4( 138./255.   ,     43./255.    ,   226./255.  ,   1.       );
        
        float alpha=  dataBz/50.0;

        vec4 dada;
        //if (z<0.5)  dada =  orangeRed + (1.0-alpha)* gold;  else  dada =  violet + (1.0-alpha)* gold;


       //gl_FragColor = color * dada ;//* transparence;
       //gl_FragColor.a = transparence;

       //if (dataBz > 90.) gl_FragColor = color* 0.5;

      } 

      //color.a = color.a * v_vertexId / NBREdePARTICULES;

      color = color * luminosite ; 
      


      if   (    ( dataBz + bounds.y) > (2.0*bounds.y + 10.0)   ) color=color * vec4(1,0,0,1);
     // if   (    ( dataBz + bounds.y) > (2.0*bounds.y + 50.0)   ) discard;

      gl_FragColor=color  ;

     if (luminosite == 0.0) discard;
 
    }
  `;

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

  renderProgram.a_position =     gl.getAttribLocation(renderProgram, 'a_position');
  renderProgram.particleTexture = gl.getUniformLocation(renderProgram, 'particleTexture');
  renderProgram.physicsData =     gl.getUniformLocation(renderProgram, 'physicsData');
  renderProgram.bounds =          gl.getUniformLocation(renderProgram, 'bounds');




/*
dataA            dataB
X    Y    Z W    X Y Z W  
posx posy A          B


dataA
X'   Y'  
*/
  let physicsVS=`
    precision highp float;

    attribute vec2 vertexPosition;
    void main() {
      gl_Position = vec4(vertexPosition, 0, 1);
    }
  `;

  let physicsFS=`
    precision highp float;
    uniform sampler2D physicsData;
    uniform vec2 bounds;
    uniform float time;

    const int POSITION_SLOT = 0;
    const int VELOCITY_SLOT = 1;

    void main() {

      // | x | y | a | x |    | a | a | 0 | x |

      int slot = int(mod(gl_FragCoord.x, 2.0)); // 0 1 0 1 0 1 ...

      vec4 dataA =  texture2D(physicsData,    gl_FragCoord.xy                   / bounds) ;
      vec4 dataB =  texture2D(physicsData,  ( gl_FragCoord.xy + vec2(1.0,0.0))  / bounds) ;

      /*
slot  0     1     0     1
      dataA dataB dataA dataB ...
      xyzw  xyzw  xyzw  xyzw
      */

      if (slot == POSITION_SLOT) {

        vec2 position   = dataA.xy  ;
        float alea0to1  = dataA.z   ;
        float luminosite     = dataA.w   ;
        vec2 vitesse    = dataB.xy  ;
        float timeDebut = dataB.w   ;
        float i         = dataB.z   ;


        // fonction qui vaut 1 entre 0 et a puis entre a et b elle descend linéairement vers 0
        // float( x < a) + float( x>=a) * ( -x+b)/(b-a)
         float a=(250.0 );

        float b= 1500.0 ;
        float dataBz = (time-timeDebut);
        float transparence = float( dataBz < a) + float( dataBz>=a) * ( -dataBz+b)/(b-a);
        luminosite = transparence ;




       // if (   (time - timeDebut) > 200.0 ) luminosite=0.0;



        gl_FragColor = vec4(
          position + vitesse * 0.005,
          alea0to1,
          luminosite
        );

      } 
      else if (slot == VELOCITY_SLOT) {

        vec2 vitesse       = dataA.xy  ;
        float i            = dataA.z   ;
        float onTouchePas  = dataA.w   ;

 
        gl_FragColor = vec4(
          vitesse * 0.991,
          i + 1.0,
          onTouchePas
        );

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




  let emitVS=`
    attribute vec2 vertexPosition;
    attribute vec2 aCoordsTexBuff;
    varying vec2 coord;

    void main() {
      //coord = (vertexPosition + 1.0) / 2.0;
      coord = aCoordsTexBuff;
      gl_Position = vec4(vertexPosition, 0, 1);
    }
  `;

  let emitFS=`
    precision highp float;
    uniform sampler2D texture;
    varying vec2 coord;

    uniform float x;
    uniform float y;
    uniform float ygrec;
    uniform float time;
    uniform vec2 uResolution;
    uniform float dedede;


    //vec2 st = gl_FragCoord.xy;
    //y=fract(sin(dot(st,vec2(12.9898,78.233)))*12356.5453123);

    float random(float x,float y) { return  fract(sin(x)*(100000.0+y));  }
    //retourne nombre entre 0 et 1

    float randomLarge(float x, float y, float a, float b) {
      return mix( a , b , random(x,y));
      // a + (b-a) * x or mix(a, b, x)
    }
    float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    float randB (vec2 st) {
      return fract(sin(dot(st.xy,vec2(22.9898,178.233)))*73758.5453123);
    }

    float randC (vec2 st) {
      return fract(sin(dot(st.xy,vec2(82.9898,38.233)))*33758.5453123);
    }

    //entre 0 et 1
    float randD (vec2 st) {
      return fract(sin(dot(st.xy,vec2(382.9898,28.233)))*13758.5453123);
    }

    //https://stackoverflow.com/questions/68991114/glsl-pseudo-random-in-range

    highp float rand2(vec2 co, float a, float b) {
      return mix( a , b , rand(co));
      // a + (b-a) * x or mix(a, b, x)
    }
    highp float rand2b(vec2 co, float a, float b) {
      return mix( a , b , randB(co));
      // a + (b-a) * x or mix(a, b, x)
    }
    highp float rand2c(vec2 co, float a, float b) {
      return mix( a , b , randC(co));
      // a + (b-a) * x or mix(a, b, x)
    }

    void main() {
      int slot = int(mod(gl_FragCoord.x, 2.0)); // 0 1 0 1 0 1 ...
      //int sloty = int(mod(gl_FragCoord.y, 2.0)); // 0 1 0 1 0 1 ...

      float whichLine= floor(gl_FragCoord.y);

      float colonneVitesseCourante = floor(floor(gl_FragCoord.x)/2.0);
      float ligneCourante = floor(gl_FragCoord.y);

      // gl_FragCoord.x          0.5 1.5 2.5 3.5 4.5 ....
      // floor(gl_FragCoord.x)   0   1   2   3   4 
      // floor(gl_FragCoord.x)/2 0   0.5 1   1.5 2
      // floor(...)              0   0   1   1

      if (whichLine==ygrec || whichLine==(ygrec+1.0)) {

        vec2 st = gl_FragCoord.xy;
   
        if (slot==1) {

          float alea2 = rand2b(colonneVitesseCourante*time*coord,-1.0,+1.0);
          alea2 = randomLarge(time,coord.x*coord.y,-1.0,+1.0);
          float alea3 = rand2c(colonneVitesseCourante+time+coord+ygrec,-1.0,+1.0);
          
          //float hasard_x_0_1 = random(gl_FragCoord.x + time , 0.0);
          //float hasard_y_0_1 = random(gl_FragCoord.x + time , 5436.0);     
          float hasard_x_0_1 = random(gl_FragCoord.x + time          , gl_FragCoord.y    + time              );
          float hasard_y_0_1 = random(gl_FragCoord.x + time + 5355.5430 , gl_FragCoord.y + time + 6765.876   ); 

          float hasard_x = hasard_x_0_1 * 2.0 - 1.0;
          float hasard_y = hasard_y_0_1 * 2.0 - 1.0;
           //hasard_x = rand2(coord*vec2(65.90,-765.9),-1.0,+1.0);
           //hasard_y = rand2(coord*vec2(265.90,765.9),-1.0,+1.0);
          //k =0..1
          //k*2=0..2
          //k*2-1 =-1..1

          gl_FragColor = vec4(
            hasard_x ,
            hasard_y ,
            colonneVitesseCourante  +  ((whichLine==(ygrec+1.0))?dedede:0.0) ,
            time

          );
        
        } else {

          float alea1 = rand(   vec2(gl_FragCoord.x*time,gl_FragCoord.y+time)    );
          alea1=time;

          vec2 st = gl_FragCoord.xy;
          float z = randD(st);
          z= randD(vec2(gl_FragCoord.x*time,gl_FragCoord.y*time) );
          
          gl_FragColor=vec4(
            x ,
            y ,
            z ,
            1.0
          );
        }
      } else {
        gl_FragColor = texture2D(texture, coord);
      }
    }
  `;



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

  //remettre
  //if (!debug) requestAnimationFrame(update);

//setTimeout(function(){emitParticles(0,0);},2000);
  function touch(event) {

    console.log("millis ",millis);
    const x = (event.clientX / width) * 2 - 1;
    const y = (event.clientY / height) * 2 - 1;



   // emitParticles(x,y);

    let l= mespixels.length ;
    let indice = Math.floor( Math.random()*l);
    const cliqueX = ( 2*mespixels[indice].x+1) / width   - 1 ;
    const cliqueY = ( 2*mespixels[indice].y+1) / height  - 1 ;
    //  emitParticles(cliqueX,cliqueY);
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
  }

  document.getElementById("canvas").onpointermove = touch;





  function emitParticles(x,y) {
    gl.useProgram(emitProgram);
    gl.viewport(0, 0, dedede*2, dedede);

    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesBuffer);
    let aVertexPosition = gl.getAttribLocation(emitProgram,"vertexPosition");
    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, gl.FALSE, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, coordsTexBuff);
    let aCoordsTexBuff = gl.getAttribLocation(emitProgram,"aCoordsTexBuff");
    gl.enableVertexAttribArray(aCoordsTexBuff);
    gl.vertexAttribPointer(aCoordsTexBuff, 2, gl.FLOAT, gl.FALSE, 0, 0);

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

    let u_dedede = gl.getUniformLocation(emitProgram,"dedede");
    gl.uniform1f(u_dedede,dedede);

    let unifX = gl.getUniformLocation(emitProgram,"x");
    let unifY = gl.getUniformLocation(emitProgram,"y");
    gl.uniform1f(unifX,x);
    gl.uniform1f(unifY,y);

    let uYgrec = gl.getUniformLocation(emitProgram,"ygrec");
    gl.uniform1f(uYgrec,ygrec);

    {
      let timeLoc = gl.getUniformLocation(emitProgram, "time");
      gl.uniform1f(timeLoc,millis);

    }

    ygrec = ygrec + 2;
    if (ygrec>( dedede - 2 )) ygrec=0;

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    physicsInputTexture = textureTemp;


      consoleLog("apres emit");


  }//FIN EMITPARTICLES

  function consoleLog(a) {

      let logger = document.getElementById('log');
      function consoleLog_(message) {
        if (typeof message == 'object') {
          logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) ;
        } else {
          logger.innerHTML += message + '<br />';
        }
      }

      consoleLog_(a);
      let lx=dedede*2;
      let ly=dedede;
      let pixels = new Float32Array(lx*ly*4);
      gl.readPixels(0,0,lx,ly,gl.RGBA,gl.FLOAT,pixels);
      //nbreConsole++;
      //if (nbreConsole<7) 
      {
        let title="";
        for (let i=0 ; i < dedede ; i++) title = title + "============POSITION===============||=============VITESSE===============||";
        title = title + title;

        //-000.55 +000.98 +000.89 +000.00 || -000.09 -000.75 +000.00 +000.00 || -000.55 +000.98 +000.81 +000.00 || -000.35 -000.59 +001.00 +000.00 || -000.55 +000.98 +000.80 +000.00 || -000.11 +000.35 +002.00 +000.00 || -000.55 +000.98 +000.53 +000.00 || -000.70 +000.91 +003.00 +000.00 || -000.55 +000.98 +000.07 +000.00 || +000.71 -000.17 +004.00 +000.00 || -000.55 +000.98 +000.61 +000.00 || -000.43 -000.95 +005.00 +000.00 || -000.55 +000.98 +000.72 +000.00 || -000.42 -000.42 +006.00 +000.00 || -000.55 +000.98 +000.33 +000.00 || +000.37 -000.22 +007.00 +000.00 ||
        //====== POSITION ================|| ========== VITESSE =============||====== POSITION ================|| ========== VITESSE =============||====== POSITION ================|| ========== VITESSE =============||====== POSITION ================|| ========== VITESSE =============||
        consoleLog_(title);
        let fN=function(number) {
          // return Intl.NumberFormat("nu", { style: "decimal",  signDisplay: 'always', useGrouping:false, minimumIntegerDigits:4 , minimumFractionDigits:1 }).format(number).replace(",",".");
          let output=Intl.NumberFormat("decimal", { signDisplay: 'always',useGrouping:false,minimumIntegerDigits: 4,minimumFractionDigits:2,maximumFractionDigits:2,}).format(number).replace(",",".");
          if (output=="+0000.00") output="&nbsp;&nbsp;&nbsp;&nbsp;0.0&nbsp;";
          if (output=="-0000.00") output="&nbsp;&nbsp;&nbsp;&nbsp;0.0&nbsp;";

          return output;
        }
        let d=0;
        
        for ( let j=0 ; j < ly ; j++ ) {
          let ligne="";
          for ( let i=0 ; i < lx ; i++) {
            // ligne = ligne + fN(pixels[d]) + "   " + fN(pixels[d+1]) + " | " ;
            //ligne = ligne + data[d] + "   " + data[d+1] + "   "  + data[d+2] + " || "     ;
            //ligne =   ligne + data[d] + "   " + data[d+1] + "   " + data[d+2] + "   " + data[d+3] + " || " ;
            ligne =   ligne + fN(pixels[d]) + " " + fN(pixels[d+1]) + " " + fN(pixels[d+2]) + " " + fN(pixels[d+3]) + "||" ;
            d=d+4;


          }
          consoleLog_(ligne);
        }
      }
    
  }
  //////////////////////////////////////////////////
  /////////////////////////////////////////////////
  ////////////////////////////////////////////////

  
  function loop(time) {

    requestId = undefined;

    doStuff(time);


    start();
  
  }

  function start() {

    if (!requestId) requestId=requestAnimationFrame(loop);
  }

  function stop() {
    if (requestId) {
      cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  }

  function doStuff(time) {

    //console.log(time);
    // 12565.1....12578.... une série d'entiers différenciés de 16, à peu près

    //console.log('maMillis ',time);
    millis = time;
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

    {
      let timeLoc = gl.getUniformLocation(physicsProgram, "time");
      gl.uniform1f(timeLoc,time);
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, physicsInputTexture);
    gl.uniform1i(physicsProgram.physicsData, 0);

    let frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, physicsOutputTexture, 0);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);


   // if (showConsole) consoleLog("physics");

    ////////////////
    /// RENDER ////
    //////////////

    gl.useProgram(renderProgram);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);//    (i,j)/(dedede,dedede) , ce buffer pour accéder aux colonnes paires des textures physicsXXXTexture
    gl.enableVertexAttribArray(renderProgram.a_position);
    gl.vertexAttribPointer(renderProgram.a_position, 2, gl.FLOAT, gl.FALSE, 0, 0);

/*
    if (true) {
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
     
    }
    */

    let timeLoc = gl.getUniformLocation(renderProgram, "time");
    gl.uniform1f(timeLoc,time);

    gl.uniform2f(renderProgram.bounds, 2*dedede, dedede);



    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let la3eTexture= gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, la3eTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, la3eTexture, 0);


    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, physicsOutputTexture);
    gl.uniform1i(renderProgram.physicsData, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, particleTexture);
    gl.uniform1i(renderProgram.particleTexture, 1);
    
    gl.drawArrays(gl.POINTS, 0, dedede*dedede);
    gl.disable(gl.BLEND);


    // programme qui mélange la3eTexture et une texture chargée d'une image

    {
      let vs=`
        attribute vec2 position;
        varying vec2 texPos;
        void main() {
          texPos = (position + 1.0)/2.0;
          gl_Position = vec4(position * vec2(1,-1),0,1);
        }
      `;
      let fs=`
        precision highp float;
        varying vec2 texPos;

        uniform sampler2D image1;
        uniform sampler2D image2;

        void main() {
          vec4 color1 = texture2D(image1, texPos);
          vec4 color2 = texture2D(image2, texPos);

          gl_FragColor = (color1+color2)/2.0;
          gl_FragColor = (color1*color2);
          gl_FragColor=color1*color2;//les etoiles
          gl_FragColor=color1;
    
        }
      `;

      let mixProg = gl.createProgram();
      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(vertexShader, vs);
      gl.shaderSource(fragmentShader, fs);
      gl.compileShader(vertexShader);
      gl.compileShader(fragmentShader);
      gl.attachShader(mixProg, vertexShader);
      gl.attachShader(mixProg, fragmentShader);
      gl.linkProgram(mixProg);
      gl.useProgram(mixProg);

      let texImage1Loc = gl.getUniformLocation(mixProg,"image1");
      gl.uniform1i(texImage1Loc, 0);  // texture unit 0
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, la3eTexture);

      let texImage2Loc = gl.getUniformLocation(mixProg,"image2");
      gl.uniform1i(texImage2Loc, 1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, casinoTexture);

      let buffer= gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,  -1,1,   1,-1,  1,-1,   -1,1,  1,1]),gl.STATIC_DRAW);

      let aPosition = gl.getAttribLocation(mixProg,"position");
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, gl.FALSE, 0, 0);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0,0,width,height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

    }

    [physicsOutputTexture,physicsInputTexture] = [physicsInputTexture,physicsOutputTexture];
  }

  /*
  if (debug) {textures/particle.png'
    requestAnimationFrame(update);
    requestAnimationFrame(update);
    emitParticles(0.3,0.3);
    requestAnimationFrame(update);
    emitParticles(0.4,0.4);
    emitParticles(0.4,0.4);
    emitParticles(0.4,0.4);
    emitParticles(0.4,0.4);
    emitParticles(0.4,0.4);

  }
  */

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

}

