"use strict";

var loaded=0;
var img;
var imgObstacle;
function htmlok() {

    
//var img  new Image();
//img.src = "moi1280x800.png";
//img.src="trump.png";
//img.onload = start;
    img = new Image();
    img.src = "trump.png";
    img.onload = function() { 
        loaded++;
    };

    imgObstacle = new Image();
    imgObstacle.src = "obstacle.png";
    imgObstacle.onload = function() { 
        loaded++;
    };
    
    
    setTimeout(checkLoaded,100);

}

function checkLoaded()
{
    if (loaded==2)
    {
       start();
    }
    else setTimeout(checkLoaded,100);
}
var pixels;

var compteur = 0;
var shizz = true;

var forceMouse = Number(document.getElementById("ir1").value);
var damping = Number(document.getElementById("ir2").value);
var forceToOrigin = Number(document.getElementById("ir3").value);
var slowdown = Number(document.getElementById("ir4").value);
var vitAtt = Number(document.getElementById("ir5").value);
var seuil = Number(document.getElementById("ir6").value);
var seuilOrigin = Number(document.getElementById("ir7").value);
var dT = Number(document.getElementById("ir8").value);
var SCALE = Number(document.getElementById("ir9").value);
var rayonCercle = Number(document.getElementById("ir10").value);
var nbCercles = Number(document.getElementById("ir11").value);
var deltaCercles = Number(document.getElementById("ir12").value);
var rayon = Number(document.getElementById("ir15").value);

/*
0
1
32,75
0,99
0,008
0,181
0,001
*/


/*

0
1,0
43,43
0,99
1,98
0,087
0,409
0,001


*/

// requestanimation
var req;


var logout = false;
var mousedown = false;

var fond;
fond = {
    r: 0,
    v: 0,
    b: 0
};
//fond = { r:0,v:0,b:0};

var gl;

var NBRE = 0;
var CSW;
var CSH;
var realToCSSPixels = 2;
var PVS;
var GRIDX,GRIDY;

var fbT1, fbT2, fbT3, fbT5, fbT6,fbTx;
var T1,T3;





// ARRAY_BUFFER
var positionGl, positionTex,positionFastCopy,positionAfficheurFullQuadShader ;


var afficheurShader;
var main1Shader;
var main2Shader;
var copieShader;
var gridShader;
var copyShader;
var fastCopyShader;
var afficheurFullQuadShader;

var swap = true;
var click = 1;
var mouseX = 0;
var mouseY = 0;



var ext1, ext2, ext5, ext3, ext4, ext6;


//var img  new Image();
//img.src = "moi1280x800.png";
//img.src="trump.png";
//img.onload = start;


/*
var toHalf = (function() {


 //   var tex = new Uint16Array(4);
   //  tex[0] = toHalf(0.5);
   //  tex[1] = toHalf(1);
   // tex[2] = toHalf(123);
    //tex[3] = toHalf(-13);

   var floatView = new Float32Array(1);
   var int32View = new Int32Array(floatView.buffer);

   return function toHalf(val) {

     floatView[0] = val;
     var x = int32View[0];

     var bits = (x >> 16) & 0x8000;
     var m = (x >> 12) & 0x07ff;
     var e = (x >> 23) & 0xff;

     if (e < 103) {
       return bits;
     }

     if (e > 142) {
       bits |= 0x7c00;
       bits |= ((e == 255) ? 0 : 1) && (x & 0x007fffff);
       return bits;
     }

     if (e < 113) {
       m |= 0x0800;
       bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
       return bits;
     }

     bits |= ((e - 112) << 10) | (m >> 1);
     bits += m & 1;
     return bits;
   };

}());
*/


function hidegui() {
    document.getElementById("gui").style.display = "none";
    document.getElementById("showgui").style.display = "initial";
    document.getElementById("hidegui").style.display = "none";

}

function showgui() {
    document.getElementById("gui").style.display = "initial";
    document.getElementById("showgui").style.display = "none";
    document.getElementById("hidegui").style.display = "initial";

}

function ir1(val) {
    forceMouse = Number(val);
    // cancelAnimationFrame( req );



    document.getElementById("in1").value = val;
}

function in1(val) {
    forceMouse = Number(val);
    document.getElementById("ir1").value = val;
}

function r1() {
    document.getElementById("in1").value = 0;
    document.getElementById("ir1").value = 0;
    forceMouse = 0;
}


function ir2(val) {
    damping = val;
    document.getElementById("in2").value = val;
}

function in2(val) {
    damping = val;
    document.getElementById("ir2").value = val;
}

function r2() {
    document.getElementById("in2").value = 1;
    document.getElementById("ir2").value = 1;
    damping = 1;
}
/////////////////
function ir3(val) {
    forceToOrigin = val;
    document.getElementById("in3").value = val;
}

function in3(val) {
    forceToOrigin = val;
    document.getElementById("ir3").value = val;
}

function r3() {
    document.getElementById("in3").value = 0;
    document.getElementById("ir3").value = 0;
    forceToOrigin = 0;
}
////////////////////////
function ir4(val) {
    slowdown = val;
    document.getElementById("in4").value = val;
}

function in4(val) {
    slowdown = val;
    document.getElementById("ir4").value = val;
}

function r4() {
    document.getElementById("in4").value = 1;
    document.getElementById("ir4").value = 1;
    slowdown = 1;
}
//////////
function ir5(val) {
    vitAtt = val;
    document.getElementById("in5").value = val;
}

function in5(val) {
    vitAtt = val;
    document.getElementById("ir5").value = val;
}

function r5() {
    document.getElementById("in5").value = 2;
    document.getElementById("ir5").value = 2;
    vitAtt = 2;
}

//////////
function ir6(val) {
    seuil = val;
    document.getElementById("in6").value = val;
}

function in6(val) {
    seuil = val;
    document.getElementById("ir6").value = val;
}

function r6() {
    document.getElementById("in6").value = 0.01;
    document.getElementById("ir6").value = 0.01;
    seuil = 0.01;
}
//////////
function ir7(val) {
    seuilOrigin = val;
    document.getElementById("in7").value = val;
}

function in7(val) {
    seuilOrigin = val;
    document.getElementById("ir7").value = val;
}

function r7() {
    document.getElementById("in7").value = 0.01;
    document.getElementById("ir7").value = 0.01;
    seuilOrigin = 0.01;
}

//////////
function ir8(val) {
    dT = val;
    document.getElementById("in8").value = val;
}

function in8(val) {
    dT = val;
    document.getElementById("ir8").value = val;
}

function r8() {
    document.getElementById("in8").value = 0.01;
    document.getElementById("ir8").value = 0.01;
    dT = 0.01;
}


function ir9(val) {
    SCALE = val;

    console.log("scale " + SCALE);
    cancelAnimationFrame(req);
    req = null;
    mouseX = 0;
    mouseY = 0;
    swap = true;

    start();

}

function ir10(val) {
    rayonCercle = val;
    swap = true;
    cancelAnimationFrame(req);
    start();
}

function ir11(val) {
    nbCercles = val;
    swap = true;
    cancelAnimationFrame(req);
    start();
}

function ir12(val) {
    deltaCercles = val;
    swap = true;
    cancelAnimationFrame(req);
    start();
}

function ir13() {
    shizz = !shizz;
}

function ir15(val) {
    rayon = val;
    swap = true;
    cancelAnimationFrame(req);
    start();
}

function in_retina(val) {
    realToCSSPixels = val;
    swap = true;
    cancelAnimationFrame(req);
    //req=null;
    img = new Image();
    img.onload = start;
    if (val == 1)
        img.src = "moi2.png";
    else
        img.src = "moi1280x800.png";

}

function changeImage() {
    var x = document.getElementById("menuImage").value;
    if (x == "chat") {
        swap = true;
        cancelAnimationFrame(req);
        img = new Image();
        img.onload = start;

        img.src = "carre.png";

    }
    if (x == "moi") {
        swap = true;
        cancelAnimationFrame(req);
        img = new Image();
        img.onload = start;

        img.src = "trump.png";

    }
}

function changeResolutionX(x) {
    CSW = x;
    swap = true;
    //req=null;

    cancelAnimationFrame(req);
    start(null, x);



}

function start(e, forceResolution) {

    var i, j, k, l, x, y, vx, vy,x2,y2;

    var canvas = document.getElementById("glcanvas");

    CSW = canvas.clientWidth *2;
    CSH = canvas.clientHeight *2;

    canvas.width = CSW;
    canvas.height = CSH;

    //canvas.style.width = CSW + 'px';
    //canvas.style.height = CSH + 'px';

    var tempoCanvas = document.createElement("canvas");
    document.body.appendChild(tempoCanvas);
   //  var tempoCanvas = document.getElementById("tempocanvas");

    tempoCanvas.width = CSW;
    tempoCanvas.height = CSH;
//tempoCanvas.style.backgroundColor = "transparent";

    //tempoCanvas.style.width = CSW + 'px';
    //tempoCanvas.style.height = CSH + 'px';

    var ctx = tempoCanvas.getContext("2d", {
        antialias: false,
        depth: false,
        alpha: true,
        premultipliedAlpha: false
    });

    gl = canvas.getContext("webgl2", {
            antialias: false,
            depth: false,
            alpha: false,
            stencil: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false
        }) ;

    //ext1 = gl.getExtension("OES_texture_float");
    //ext2 = gl.getExtension("WEBGL_color_buffer_float");
    ext4 = gl.getExtension("EXT_color_buffer_float");
    //console.log("exteniosn = "+ext1+" , " +ext2 + " , "+ext3+" , "+ext4+ " , "+ ext5+ " , "+ext6);
    console.log("extension :"+ext4);
    //console.log(ext1);



    canvas.onmouseup = function (ev) {mousedown = false;}

    canvas.onmousemove = function (ev) {
        if (mousedown) {
            var pos = getNoPaddingNoBorderCanvasRelativeMousePosition(ev, gl.canvas);
            mouseX = pos.x / gl.canvas.width * 2 - 1;
            mouseY = pos.y / gl.canvas.height * -2 + 1;
        }
    }

    canvas.onmousedown = function (event) {mousedown = true;}


    ctx.fillStyle='rgba('+fond.r+','+fond.v+','+fond.b+',0)';
    ctx.fillRect(0, 0, CSW, CSH);
    ctx.drawImage(img, 0, 0);
    //  var lamb = img.height / img.width * CSW / CSH ;
    // var k2 = Math.min(1,1/lamb);
    // var k1 = lamb * k2 ;
    // ctx.drawImage(img,0, CSH * (1-k1),CSW * k2 ,CSH* k1);

    var imageData = ctx.getImageData(0, 0, CSW, CSH);
    var data = imageData.data;
    console.log(data);

    NBRE = 0;
    
    var r, v, b, alpha;

    var pixcols =[],pixcols2;


    for (j = 0; j < CSH; j++) {
        for (i = 0; i < CSW; i++) {

            k = (j * CSW + i) * 4;
            r =     data[k    ] ;
            v =     data[k + 1] ;
            b =     data[k + 2] ; 
            alpha = data[k + 3] ;

            if (!(r == fond.r && v == fond.v && b == fond.b)) {
                l = SCALE;
                while (l--) {
                    NBRE++;
                    pixcols.push({x:i,y:j,r:r,v:v,b:b,a:alpha});
                }
            }
        }

    }

   // pixcols = shuffle(pixcols);

    console.log(pixcols);

    pixcols2 = shuffle(pixcols);

    console.log(pixcols2);


    PVS = Math.pow(2, Math.ceil(Math.log(Math.ceil(Math.sqrt(NBRE))) / Math.LN2));
    console.log("nombre de points : "+NBRE );
    console.log("taille de la texture : "+PVS );

    GRIDX=CSW;
    GRIDY=CSH;


    var pvFloat32      = new Float32Array( PVS * PVS * 4);
    var Float32_imageDepart    = new Float32Array( PVS * PVS * 4);
    var Float32_imageArrivee    = new Float32Array( PVS * PVS * 4);

    var colorUint      = new Uint8Array(   PVS * PVS * 4);
    var angle;


    for (k = 0; k < NBRE; k++) {

        x = (2 * pixcols[k].x - CSW + 1) / CSW;
        y = (2 * pixcols[k].y - CSH + 1) / -CSH;

        x2 = (2 * pixcols2[k].x - CSW + 1) / CSW;
        y2 = (2 * pixcols2[k].y - CSH + 1) / -CSH;

        angle = Math.random() * 2 * Math.PI;
        vx = Math.cos(angle) * (rayon);
        vy = Math.sin(angle) * (rayon);

        pvFloat32[k * 4 + 0] = x;
        pvFloat32[k * 4 + 1] = y;
        pvFloat32[k * 4 + 2] = vx;
        pvFloat32[k * 4 + 3] = vy;

        Float32_imageDepart[k * 4 + 0] = x;
        Float32_imageDepart[k * 4 + 1] = y;

        Float32_imageArrivee[k * 4 + 0] = x2;
        Float32_imageArrivee[k * 4 + 1] = y2;

        colorUint[k * 4 + 0] = pixcols[k].r;
        colorUint[k * 4 + 1] = pixcols[k].v;
        colorUint[k * 4 + 2] = pixcols[k].b;
        colorUint[k * 4 + 3] = pixcols[k].a;

    }

    //Float32_imageDepart = shuffle(pvFloat32);

    var textureGeometry = [];
    var glGeometry = [];
    i = 0;
    j = 0;
    for (k = 0; k < NBRE; k++) {

        textureGeometry.push(i, j);

        var x = (2 * i + 1) / PVS - 1;
        var y = (2 * j + 1) / PVS - 1;

        glGeometry.push(x, y);

        i++;
        if (i == PVS) {
            i = 0.0;
            j++;
        }
    }

    positionFastCopy = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionFastCopy);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(
                [
                -1, -1,
                1, -1,
                -1, 1,
                -1, 1,
                1, -1,
                1, 1]),
        gl.STATIC_DRAW);

    positionAfficheurFullQuadShader = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER , positionAfficheurFullQuadShader);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), gl.STATIC_DRAW);

    positionTex = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    gl.bufferData(gl.ARRAY_BUFFER,new Uint16Array(textureGeometry),gl.STATIC_DRAW);

     // gl.vertexAttribIPointer( 0    , 2 , gl.UNSIGNED_SHORT  , 6 , 0 );
      //new Uint16Array(tabTemp2)

   // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureGeometry), gl.STATIC_DRAW);

    positionGl = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionGl);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(glGeometry), gl.STATIC_DRAW);



    copyShader = compilink('copy');
    copieShader = compilink('copie');
    afficheurShader = compilink('afficheur');
    gridShader = compilink('grid');
    main1Shader = compilink('main1');
    main2Shader = compilink('main2');
    fastCopyShader = compilink('fastCopy');

    afficheurFullQuadShader = compilink('afficheurFullQuad');




    function compilink(name) {
        var afficheurVertex = getShader(gl, name + "Vertex");
        console.log("vertex = "+afficheurVertex);
        var afficheurFragment = getShader(gl, name + "Fragment");

        console.log("fragment ="+afficheurFragment);
        var prog = gl.createProgram();
        gl.attachShader(prog, afficheurVertex);
        gl.attachShader(prog, afficheurFragment);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            var info = gl.getProgramInfoLog(prog);
            throw new Error('Could not compile ' + name + ' . \n\n' + info);
        }
        return prog;

    }
    /////////////////////////////////////
    /////////////////////////////////////




    afficheurShader.position =  gl.getAttribLocation(afficheurShader, "position");
    afficheurShader.pvTex =         gl.getUniformLocation(    afficheurShader,    "pvTex"     );
    afficheurShader.gridTex =       gl.getUniformLocation(    afficheurShader,    "gridTex"    );
    afficheurShader.mapColor =      gl.getUniformLocation(    afficheurShader,    "mapColor"  );
    afficheurShader.resolution =    gl.getUniformLocation(    afficheurShader,    "resolution");
    afficheurShader.PVS =           gl.getUniformLocation(    afficheurShader,    "PVS"       );

    copieShader.position =      gl.getAttribLocation(copieShader, "position");
    copieShader.positionGl =    gl.getAttribLocation(copieShader, "positionGl");
    copieShader.toCopy =            gl.getUniformLocation(copieShader, "toCopy");

    gridShader.position =       gl.getAttribLocation(gridShader, "position");
    gridShader.pvTex =              gl.getUniformLocation(gridShader, "pvTex");
    gridShader.resolution =         gl.getUniformLocation(gridShader, "resolution");
    gridShader.alea =               gl.getUniformLocation(gridShader, "alea");
    gridShader.gridSize =           gl.getUniformLocation(gridShader, "gridSize");
    gridShader.PVS =                gl.getUniformLocation(gridShader, "PVS");
    gridShader.obstacle =           gl.getUniformLocation(gridShader, "obstacle");




    main1Shader.position =      gl.getAttribLocation(main1Shader, "position");
    //main1Shader.positionGl =    gl.getAttribLocation(main1Shader, "positionGl");
    main1Shader.pvTex =             gl.getUniformLocation(main1Shader, "pvTex");
    main1Shader.imageDepart =       gl.getUniformLocation(main1Shader, "imageDepart");
    main1Shader.imageArrivee =      gl.getUniformLocation(main1Shader, "imageArrivee");
    main1Shader.dT =                gl.getUniformLocation(main1Shader, "dT");
    main1Shader.mouseCoords =       gl.getUniformLocation(main1Shader, "mouseCoords");
    main1Shader.click =             gl.getUniformLocation(main1Shader, "click");
    main1Shader.damping =           gl.getUniformLocation(main1Shader, "damping");
    main1Shader.forceMouse =        gl.getUniformLocation(main1Shader, "forceMouse");
    main1Shader.forceToOrigin =     gl.getUniformLocation(main1Shader, "forceToOrigin");
    main1Shader.slowdown =          gl.getUniformLocation(main1Shader, "slowdown");
    main1Shader.seuil =             gl.getUniformLocation(main1Shader, "seuil");
    main1Shader.seuilOrigin =       gl.getUniformLocation(main1Shader, "seuilOrigin");


    main2Shader.position =      gl.getAttribLocation(main2Shader, "position");
    //main2Shader.positionGl =    gl.getAttribLocation(main2Shader, "positionGl");
    main2Shader.pvTex =             gl.getUniformLocation(main2Shader, "pvTex");
    main2Shader.T6 =                gl.getUniformLocation(main2Shader, "T6");
    main2Shader.destination =       gl.getUniformLocation(main2Shader, "destination");
    main2Shader.gridTex =           gl.getUniformLocation(main2Shader, "gridTex");
    main2Shader.resolution =        gl.getUniformLocation(main2Shader, "resolution");
    main2Shader.vitAtt =            gl.getUniformLocation(main2Shader, "vitAtt");
    main2Shader.maxcoll =           gl.getUniformLocation(main2Shader, "maxcoll");
    main2Shader.vitAtt =            gl.getUniformLocation(main2Shader, "vitAtt");
    main2Shader.PVS =               gl.getUniformLocation(main2Shader, "PVS");
    main2Shader.gridSize =          gl.getUniformLocation(main2Shader, "gridSize");
        main2Shader.z1 =          gl.getUniformLocation(main2Shader, "z1");
        main2Shader.z2 =          gl.getUniformLocation(main2Shader, "z2");
        main2Shader.z3 =          gl.getUniformLocation(main2Shader, "z3");
        main2Shader.z4 =          gl.getUniformLocation(main2Shader, "z4");

    fastCopyShader.position =   gl.getAttribLocation(fastCopyShader,"position");
    fastCopyShader.pvTex =          gl.getUniformLocation(fastCopyShader,"image");



    afficheurFullQuadShader.position =   gl.getAttribLocation(afficheurFullQuadShader,"position");
    afficheurFullQuadShader.pvTex =          gl.getUniformLocation(afficheurFullQuadShader,"pvTex");
    afficheurFullQuadShader.mapColor =       gl.getUniformLocation(afficheurFullQuadShader,"mapColor");



    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.UNSIGNED_BYTE, colorUint);

    gl.activeTexture(gl.TEXTURE1);
    T1 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, T1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,PVS,PVS);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, PVS,PVS, gl.RGBA, gl.FLOAT,pvFloat32);


    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,PVS,PVS);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, PVS,PVS, gl.RGBA, gl.FLOAT,Float32_imageDepart);

    gl.activeTexture(gl.TEXTURE7);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,PVS,PVS);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, PVS,PVS, gl.RGBA, gl.FLOAT,Float32_imageArrivee);

    var T2 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, T2);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    var f32 = new Float32Array(GRIDX * GRIDY * 4);
    for (k = 0; k < GRIDX * GRIDY; k++)
        f32[k * 4 + 3] = Math.random() * 6.28;
    gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,GRIDX,GRIDY);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, GRIDX,GRIDY, gl.RGBA, gl.FLOAT,f32);


    T3 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, T3);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,PVS,PVS);

    var T5 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, T5);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,PVS,PVS);


    var T6 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, T6);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,PVS,PVS);

gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    var T8 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE8);
    gl.bindTexture(gl.TEXTURE_2D, T8);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,CSW,CSH);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, CSW,CSH, gl.RGBA, gl.FLOAT,imageData);
    
    
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)


    fbT5 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT5);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T5, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5")
        console.log("fbT5 is complete");
    else
        console.log("fbT5 is NOT complete");


    fbT1 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT1);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T1, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5")
        console.log("fbT1 is complete");
    else
        console.log("fbT1 is NOT complete");


    fbT3 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT3);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T3, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5")
        console.log("fbT3 is complete");
    else
        console.log("fbT3 is NOT complete");

    fbT6 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT6);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T6, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5")
        console.log("fbT6 is complete");
    else
        console.log("fbT6 is NOT complete");

    fbT2 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T2, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5")
        console.log("fbT2 is complete");
    else
        console.log("fbT2 is NOT complete");

    fbTx = gl.createFramebuffer();


    gl.disable(gl.BLEND);

    req = window.requestAnimationFrame(animate);

}



function animate() {



    var TEXTURE_UNIT_pv = 3;
    var framebuffer = fbT1;
    var fbOrig = fbT3;

    if (swap) {
        TEXTURE_UNIT_pv = 1;
        framebuffer = fbT3;
        fbOrig = fbT1;
    }



    /// AFFICHEUR // ************************************************************


    




    gl.useProgram(afficheurShader);

    gl.enableVertexAttribArray(afficheurShader.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    //gl.vertexAttribPointer(afficheurShader.position, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribIPointer( afficheurShader.position    , 2 , gl.UNSIGNED_SHORT  , 0 , 0 );

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.clearColor(fond.r / 255, fond.v / 255, fond.b / 255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //if (shizz)// gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, CSW, CSH);

    gl.uniform1i(afficheurShader.PVS, PVS);
    gl.uniform1i(afficheurShader.pvTex, TEXTURE_UNIT_pv); // 1er tour vaut 1, 2e tour vaut 3
    gl.uniform1i(afficheurShader.gridTex, 2); // 1er tour vaut 1, 2e tour vaut 3

    gl.uniform1i(afficheurShader.mapColor,0);
    gl.drawArrays(gl.POINTS, 0, NBRE);
    gl.disable(gl.BLEND);   




    /// COPIE // ************************************************************
    

    

    gl.bindFramebuffer ( gl.DRAW_FRAMEBUFFER, fbT6 );
    gl.bindFramebuffer ( gl.READ_FRAMEBUFFER, fbOrig );
    gl.readBuffer ( gl.COLOR_ATTACHMENT0 );
    gl.blitFramebuffer(0, 0, PVS, PVS,
                   0, 0, PVS, PVS,
                  gl.COLOR_BUFFER_BIT, gl.NEAREST);
                  


/*

    
    gl.useProgram(fastCopyShader);

    gl.enableVertexAttribArray(fastCopyShader.position);
    gl.bindBuffer(gl.ARRAY_BUFFER,positionFastCopy);
    gl.vertexAttribPointer( fastCopyShader.position , 2 , gl.FLOAT , false , 0 , 0 );


    gl.bindFramebuffer( gl.FRAMEBUFFER , fbT6);
    gl.viewport(0, 0, PVS, PVS);
    gl.uniform1i(fastCopyShader.pvTex,TEXTURE_UNIT_pv);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
*/


    /// MAIN1 // ************************************************************

    gl.useProgram(main1Shader);

    //gl.enableVertexAttribArray(main1Shader.positionGl);
    //gl.bindBuffer(gl.ARRAY_BUFFER,positionGl);
    //gl.vertexAttribPointer( main1Shader.positionGl , 2 , gl.FLOAT , false , 0 , 0 );
    gl.enableVertexAttribArray(main1Shader.position);
    //gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    gl.bindBuffer(gl.ARRAY_BUFFER,positionFastCopy);

    gl.vertexAttribPointer(main1Shader.position, 2, gl.FLOAT, false, 0, 0);
    //gl.vertexAttribIPointer( main1Shader.position   , 2 , gl.UNSIGNED_SHORT  , 0 , 0 );


    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT5); // TEXTURE_UNIT_pv => T5

    gl.viewport(0, 0, PVS, PVS);

    gl.uniform1i(main1Shader.imageDepart, 4);
    gl.uniform1i(main1Shader.imageArrivee, 7);
    gl.uniform1f(main1Shader.dT, dT);
    gl.uniform2f(main1Shader.mouseCoords, mouseX, mouseY);
    gl.uniform1i(main1Shader.click, click);
    gl.uniform1f(main1Shader.damping, damping);
    gl.uniform1f(main1Shader.forceMouse, forceMouse);
    gl.uniform1f(main1Shader.forceToOrigin, forceToOrigin);
    gl.uniform1f(main1Shader.slowdown, slowdown);
    gl.uniform1f(main1Shader.seuil, seuil);
    gl.uniform1f(main1Shader.seuilOrigin, seuilOrigin);
    gl.uniform1i(main1Shader.pvTex, TEXTURE_UNIT_pv);
    //gl.drawArrays(gl.POINTS, 0, NBRE);
    gl.drawArrays(gl.TRIANGLES,0,6);



    //gl.blendFunc( gl.ONE, gl.ONE);

    //R = Rs ∗ Sr + Rd ∗ Dr
    //G=  Gs ∗ Sg + Gd ∗ Dg
    //B = Bs ∗ Sb + Bd ∗ Db
    //A=  As ∗ Sa + Ad ∗ Da

    // S(r,g,b,a) et D(r,g,b,a) sont fixés par blendFunc
    //ici : (As, As, As) = (Sr , Sg, Sb)
    //As=0.1
    //S=(0.1,0.1,0.1,0.1)
    //D=(1-0.1,1-0.2,1-0.3,1-0.4)=(0.9,0.8,0.7,0.6)

    // Ad
    // (Dr,Dg,Db) = (1,1,1)−(0.1,0.1,0.1)


    //S  = (1,1,1,1) ( 0 , 0 , 0 , 0.1)
    //) [0.08999999612569809, 0.17999999225139618, 0.27000001072883606, 0.35999998450279236]

    //D =  (0.9 , 0.9 , 0.9 , 0.9 )
    //D = 0.1 * 0.9

    //src = SRC_ALPHA = ( 0 , 0 , 0 , 0.1)



    /// GRID // ************************************************************

    gl.useProgram(gridShader);

    gl.enableVertexAttribArray(gridShader.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    //gl.vertexAttribPointer(gridShader.position, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribIPointer( gridShader.position   , 2 , gl.UNSIGNED_SHORT  , 0 , 0 );


    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT2); // T5 => T2

    gl.clearColor(0, 0, 0, 1.0);

    gl.colorMask(true, true, true, false);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, GRIDX, GRIDY);

    gl.uniform1i(gridShader.PVS, PVS);
    gl.uniform1i(gridShader.pvTex, 5);
    gl.uniform1i(gridShader.obstacle, 8);


    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    gl.drawArrays(gl.POINTS, 0, NBRE);

    gl.disable(gl.BLEND);
    gl.colorMask(true, true, true, true);




    /// MAIN2 // ************************************************************

    //gl.enableVertexAttribArray(main2Shader.positionGl);
    //gl.bindBuffer(gl.ARRAY_BUFFER,positionGl);
    //gl.vertexAttribPointer( main2Shader.positionGl , 2 , gl.FLOAT , false , 0 , 0 );
    gl.enableVertexAttribArray(main2Shader.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    //gl.vertexAttribPointer(main2Shader.position, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribIPointer( main2Shader.position   , 2 , gl.UNSIGNED_SHORT  , 0 , 0 );


    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); // 5 = > T3 puis T1

    gl.viewport(0, 0, PVS, PVS);

    gl.useProgram(main2Shader);
    gl.uniform1i(main2Shader.gridTex, 2);
    gl.uniform1i(main2Shader.pvTex, 5);
    gl.uniform1i(main2Shader.PVS, PVS);
    // si copie est utilisée decommenter ligne suivante
    gl.uniform1i(main2Shader.T6 , 6);
    gl.uniform2f(main2Shader.resolution, CSW, CSH);
    gl.uniform2f(main2Shader.gridSize, GRIDX, GRIDY);
    gl.uniform1f(main2Shader.vitAtt, vitAtt);

        gl.uniform1f(main2Shader.z1, 200*Math.random()-100.0);
        gl.uniform1f(main2Shader.z2, 200*Math.random()-100.0);
        gl.uniform1f(main2Shader.z3, 200*Math.random()-100.0);
        gl.uniform1f(main2Shader.z4, 200*Math.random()-100.0);

    gl.drawArrays(gl.POINTS, 0, NBRE);




    swap = !swap;
    req = window.requestAnimationFrame(animate);


}



function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }
    var theSource = "";
    var currentChild = shaderScript.firstChild;
    while (currentChild) {
        if (currentChild.nodeType == 3) {
            theSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    gl.shaderSource(shader, theSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}



function dumpGrid(a, b) {
    var
        pixels,
        i = 0,
        prec = 7,
        // pixels = new Float32Array(4*a*b);
        pixels = new Uint16Array(4 * a * b);

    gl.readPixels(0, 0, a, b, gl.RGBA, ext2.HALF_FLOAT_OES, pixels);
    // gl.readPixels(0,0,a,b,gl.RGBA,gl.FLOAT,pixels);

    console.log(pixels);
    /*
      while ( compteur < a*b) {
        compteur = compteur + 1 ;
        if (pixels[i] || pixels[i+1] || pixels[i+2] || ( pixels[i+3] ))
        console.log("case=" + compteur + " :: " + pixels[i].toFixed(prec) + " , " + pixels[i+1].toFixed(prec) + " , " + pixels[i+2].toFixed(prec) + " , " + pixels[i+3].toFixed(prec));
        i=i+4;
      }

      */
    console.log("-------------");


}

function dump(a, b) {
    var
        i = 0,
        prec = 5;

    pixels = new Float32Array(4 * a * b);
    //pixels = new Uint8Array(a*b*4*4);

    gl.readPixels(0, 0, a, b, gl.RGBA, gl.FLOAT, pixels);

    console.log(pixels);
    /*

    while ( compteur < NBRE) {
      compteur = compteur + 1 ;
      console.log(" particule " + i/4 + " :: " + pixels[i].toFixed(prec) + " , " + pixels[i+1].toFixed(prec) + " , " +pixels[i+2].toFixed(prec) + " , " +pixels[i+3].toFixed(prec));
      i=i+4;
    }
    console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+");

    */



}

function getRelativeMousePosition(event, target) {
    target = target || event.target;
    var rect = target.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    }
}

// assumes target or event.target is canvas
function getNoPaddingNoBorderCanvasRelativeMousePosition(event, target) {
    target = target || event.target;
    var pos = getRelativeMousePosition(event, target);

    pos.x = pos.x * target.width / target.clientWidth;
    pos.y = pos.y * target.height / target.clientHeight;

    return pos;
}

function showRangeValue(prepend, sliderId, inputId) {
    document.getElementById(inputId).value = prepend + document.getElementById(sliderId).value;
}


function textureCopy(texSource,texDest,tx,ty) {

        var fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texDest, 0);

        bl.bindTexture(gl.TEXTURE_2D,texSource);
        gl.viewport(0, 0, tx, ty);
        gl.useProgram(copy);

        //gl.bindTexture(gl.TEXTURE_2D, tex);

        var position = gl.getAttribLocation(copie, "position");
        gl.enableVertexAttribArray(position);

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0       , 0,
            tx, 0,
            0       , ty,
            0       , ty,
            tx, 0,
            tx, ty,
        ]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

        var resolutionLocation              = gl.getUniformLocation(copie, "u_resolution");
        var resolutionLocationF             = gl.getUniformLocation(copie, "u_resolutionF");
        var textureLocation                 = gl.getUniformLocation(copie, "u_image");

        gl.uniform2f(resolutionLocation , tx, ty);
        gl.uniform2f(resolutionLocationF, tx, ty);
        gl.uniform1i(textureLocation, 3);


        gl.drawArrays(gl.TRIANGLES, 0, 6);

        //return texBis;


  }


  function shuffle(array) {
    var arrayCopy = array.slice(0);
    var counter = array.length;
    while (counter > 0) {
        var index = Math.floor(Math.random() * counter);
        counter--;
        var temp = arrayCopy[counter];
        arrayCopy[counter] = arrayCopy[index];
        arrayCopy[index] = temp; }
    return arrayCopy;
}

function egalise(debut,fin) {
  var
    s = [],
    i,q,r,debutSize,finSize,
    dataDepart=[],
    dataFin=[];

  debutSize = debut.length  ;
  finSize = fin.length ;
     
  if (debutSize > finSize) {
    q = Math.floor( debutSize / finSize) ;
    r = debutSize % finSize ;

    for (i=0 ; i < q ; i++) s = s.concat(fin);

    s = s.concat( fin.slice(0,r)) ; // on complète avec r éléments du tableau 'fin'.

    dataDepart = debut ;
    dataFin = shuffle(s) ;
  }
  if (debutSize < finSize) {
    q = Math.floor( finSize / debutSize) ;
    r = finSize % debutSize ;

    for (i=0 ; i < q ; i++) s = s.concat(debut);
    
    s = s.concat( debut.slice(0,r)) ;
  
    dataDepart = shuffle(s) ;
    dataFin = fin;
  }

  if (debutSize === finSize) {
    dataDepart = debut;
    dataFin= shuffle(fin);
  }

  return {depart:dataDepart , fin:dataFin};
}
