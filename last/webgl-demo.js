"use strict";


//factoriser le bindbuffer

const video = document.createElement('video');
video.autoplay = true;

const qvgaConstraints = { video: { width: 1280, height: 720}  };
const palConstraints =  { video: { width: 352,  height: 288}  };
const fhdConstraints =  { video: { width: 1920, height: 1080} };
const vgaConstraints =  { video: { width: 640, height:  480} };

var webcamConstraints;
webcamConstraints = vgaConstraints ;
webcamConstraints =qvgaConstraints ;
getMedia(webcamConstraints);


var ctx ;
var fbT1 , fbT3 , fbT2 , fbSobel ;

var sobelOutput , textureWebcam, textureWebcamSobel;
var swap ;

// canvas
var traitement;

var gl , gl_Traitement ;

//shader
var afficheurShader , main2Shader , gridShader , sobelShader;

//buffer
var positionTex , vertex_buffer; 

var fond= { r: 0, v: 0, b: 0, a:255};
var CSW , CSH;
var PVS;
var GRIDX,GRIDY;
var NBRE;
var mouseX=0 , mouseY=0 , click , mousedown ;
var req ;
var capturer=null , sCB ,dVB; 
var realToCSSPixels =2 ;
var ext1, ext2, ext5, ext3, ext4, ext6;
var img ;




var m7;

 // "alpha":{"valeur":{"defaut":0.187,"courante":0.187},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"lumi":{"valeur":{"defaut":0.823,"courante":0.823},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"flamme":{"valeur":{"defaut":0.308,"courante":0.308},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"delta2":{"valeur":{"defaut":0.041,"courante":0.041},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"force":{"valeur":{"defaut":73.666,"courante":-148.803},"max":{"defaut":1041,"courante":10441},"min":{"defaut":-8,"courante":-5911},"step":{"defaut":0.001,"courante":0.001}},"gravity":{"valeur":{"defaut":0,"courante":26.783},"max":{"defaut":80,"courante":44},"min":{"defaut":-800,"courante":-80},"step":{"defaut":0.001,"courante":0.001}},"forceMouse":{"valeur":{"defaut":-155.223,"courante":-676.989},"max":{"defaut":80,"courante":80},"min":{"defaut":-801,"courante":-801},"step":{"defaut":0.001,"courante":0.001}},"maxAngle":{"valeur":{"defaut":6.399,"courante":7},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"angleBase":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"slowdown":{"valeur":{"defaut":0.861,"courante":0.91},"max":{"defaut":2,"courante":2},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"choc":{"valeur":{"defaut":1.656,"courante":2.053},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuil":{"valeur":{"defaut":2.209,"courante":18.665},"max":{"defaut":3,"courante":44},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901,"courante":2.99901},"max":{"defaut":3,"courante":3},"min":{"defaut":0.00001,"courante":0.00001},"step":{"defaut":0.001,"courante":0.001}},"dt":{"valeur":{"defaut":0.00338,"courante":0.00559},"max":{"defaut":0.01,"courante":0.01},"min":{"defaut":0,"courante":0},"step":{"defaut":0.00001,"courante":0.00001}},"collisionMax":{"valeur":{"defaut":1,"courante":1},"max":{"defaut":1000,"courante":1000},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"vit0":{"valeur":{"defaut":1.1,"courante":1.1},"max":{"defaut":100,"courante":100},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"pointSize":{"valeur":{"defaut":2,"courante":1},"max":{"defaut":10,"courante":10},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA","courante":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE","courante":"ONE"}},"scale":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":500,"courante":500},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"gridStep":{"valeur":{"defaut":3,"courante":2},"max":{"defaut":20,"courante":20},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}}};
m7 = {"alpha":{"valeur":{"defaut":0.187,"courante":0.985},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"lumi":{"valeur":{"defaut":0.823,"courante":0.963},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"flamme":{"valeur":{"defaut":0.308,"courante":0.243},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"delta2":{"valeur":{"defaut":0.041,"courante":0.049},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"force":{"valeur":{"defaut":-148.803,"courante":25.486},"max":{"defaut":10441,"courante":1044},"min":{"defaut":-5911,"courante":-591},"step":{"defaut":0.001,"courante":0.001}},"gravity":{"valeur":{"defaut":26.783,"courante":23.996},"max":{"defaut":44,"courante":44},"min":{"defaut":-80,"courante":-80},"step":{"defaut":0.001,"courante":0.001}},"forceMouse":{"valeur":{"defaut":-676.989,"courante":-399.14},"max":{"defaut":80,"courante":80},"min":{"defaut":-801,"courante":-801},"step":{"defaut":0.001,"courante":0.001}},"maxAngle":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"angleBase":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"slowdown":{"valeur":{"defaut":0.91,"courante":0.475},"max":{"defaut":2,"courante":2},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"choc":{"valeur":{"defaut":2.053,"courante":0.986},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuil":{"valeur":{"defaut":18.665,"courante":1.273},"max":{"defaut":44,"courante":44},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901,"courante":2.99901},"max":{"defaut":3,"courante":3},"min":{"defaut":0.00001,"courante":0.00001},"step":{"defaut":0.001,"courante":0.001}},"dt":{"valeur":{"defaut":0.00559,"courante":0.00812},"max":{"defaut":0.01,"courante":0.01},"min":{"defaut":0,"courante":0},"step":{"defaut":0.00001,"courante":0.00001}},"collisionMax":{"valeur":{"defaut":1,"courante":2},"max":{"defaut":1000,"courante":1000},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"vit0":{"valeur":{"defaut":1.1,"courante":1.1},"max":{"defaut":100,"courante":100},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"pointSize":{"valeur":{"defaut":1,"courante":2},"max":{"defaut":10,"courante":10},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA","courante":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE","courante":"DST_ALPHA"}},"scale":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":500,"courante":500},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"gridStep":{"valeur":{"defaut":2,"courante":2},"max":{"defaut":20,"courante":20},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}}};
m7 = {"alpha":{"valeur":{"defaut":0.985,"courante":0.762},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"lumi":{"valeur":{"defaut":0.963,"courante":0.963},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"flamme":{"valeur":{"defaut":0.243,"courante":0.243},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"delta2":{"valeur":{"defaut":0.049,"courante":0.049},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"force":{"valeur":{"defaut":25.486,"courante":-54.516},"max":{"defaut":1044,"courante":1044},"min":{"defaut":-591,"courante":-591},"step":{"defaut":0.001,"courante":0.001}},"gravity":{"valeur":{"defaut":23.996,"courante":137.94},"max":{"defaut":44,"courante":441},"min":{"defaut":-80,"courante":-80},"step":{"defaut":0.001,"courante":0.001}},"forceMouse":{"valeur":{"defaut":-399.14,"courante":-399.14},"max":{"defaut":80,"courante":80},"min":{"defaut":-801,"courante":-801},"step":{"defaut":0.001,"courante":0.001}},"maxAngle":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"angleBase":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"slowdown":{"valeur":{"defaut":0.475,"courante":0.822},"max":{"defaut":2,"courante":2},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"choc":{"valeur":{"defaut":0.986,"courante":1.827},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuil":{"valeur":{"defaut":1.273,"courante":0.119},"max":{"defaut":44,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901,"courante":2.99901},"max":{"defaut":3,"courante":3},"min":{"defaut":0.00001,"courante":0.00001},"step":{"defaut":0.001,"courante":0.001}},"dt":{"valeur":{"defaut":0.00812,"courante":0.00668},"max":{"defaut":0.01,"courante":0.01},"min":{"defaut":0,"courante":0},"step":{"defaut":0.00001,"courante":0.00001}},"collisionMax":{"valeur":{"defaut":2,"courante":1},"max":{"defaut":1000,"courante":1000},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"vit0":{"valeur":{"defaut":1.1,"courante":1.1},"max":{"defaut":100,"courante":100},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"pointSize":{"valeur":{"defaut":2,"courante":2},"max":{"defaut":10,"courante":10},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA","courante":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"DST_ALPHA","courante":"ONE"}},"scale":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":500,"courante":500},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"gridStep":{"valeur":{"defaut":2,"courante":2},"max":{"defaut":20,"courante":20},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}}};
m7 = {"alpha":{"valeur":{"defaut":0.762,"courante":0.039},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"lumi":{"valeur":{"defaut":0.963,"courante":0.963},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"flamme":{"valeur":{"defaut":0.243,"courante":0.243},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"delta2":{"valeur":{"defaut":0.049,"courante":0.049},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"force":{"valeur":{"defaut":-54.516,"courante":-18.212},"max":{"defaut":1044,"courante":1044},"min":{"defaut":-591,"courante":-591},"step":{"defaut":0.001,"courante":0.001}},"gravity":{"valeur":{"defaut":137.94,"courante":137.94},"max":{"defaut":441,"courante":441},"min":{"defaut":-80,"courante":-80},"step":{"defaut":0.001,"courante":0.001}},"forceMouse":{"valeur":{"defaut":-399.14,"courante":-399.14},"max":{"defaut":80,"courante":80},"min":{"defaut":-801,"courante":-801},"step":{"defaut":0.001,"courante":0.001}},"maxAngle":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"angleBase":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"slowdown":{"valeur":{"defaut":0.822,"courante":0.822},"max":{"defaut":2,"courante":2},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"choc":{"valeur":{"defaut":1.827,"courante":1.827},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuil":{"valeur":{"defaut":0.119,"courante":0.189},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901,"courante":2.99901},"max":{"defaut":3,"courante":3},"min":{"defaut":0.00001,"courante":0.00001},"step":{"defaut":0.001,"courante":0.001}},"dt":{"valeur":{"defaut":0.00668,"courante":0.00437},"max":{"defaut":0.01,"courante":0.01},"min":{"defaut":0,"courante":0},"step":{"defaut":0.00001,"courante":0.00001}},"collisionMax":{"valeur":{"defaut":1,"courante":1},"max":{"defaut":1000,"courante":1000},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"vit0":{"valeur":{"defaut":1.1,"courante":1.1},"max":{"defaut":100,"courante":100},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"pointSize":{"valeur":{"defaut":2,"courante":1},"max":{"defaut":10,"courante":10},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA","courante":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE","courante":"ONE"}},"scale":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":500,"courante":500},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"gridStep":{"valeur":{"defaut":2,"courante":2},"max":{"defaut":20,"courante":20},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}}};
m7 = {"alpha":{"valeur":{"defaut":0.039,"courante":0.026},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"lumi":{"valeur":{"defaut":0.963,"courante":0.963},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"flamme":{"valeur":{"defaut":0.243,"courante":0.243},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"delta2":{"valeur":{"defaut":0.049,"courante":0.049},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"force":{"valeur":{"defaut":-18.212,"courante":-171.493},"max":{"defaut":1044,"courante":1044},"min":{"defaut":-591,"courante":-591},"step":{"defaut":0.001,"courante":0.001}},"gravity":{"valeur":{"defaut":137.94,"courante":179.357},"max":{"defaut":441,"courante":441},"min":{"defaut":-80,"courante":-80},"step":{"defaut":0.001,"courante":0.001}},"forceMouse":{"valeur":{"defaut":-399.14,"courante":-575.92},"max":{"defaut":80,"courante":80},"min":{"defaut":-801,"courante":-801},"step":{"defaut":0.001,"courante":0.001}},"maxAngle":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"angleBase":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"slowdown":{"valeur":{"defaut":0.822,"courante":0.768},"max":{"defaut":2,"courante":2},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"choc":{"valeur":{"defaut":1.827,"courante":1.593},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuil":{"valeur":{"defaut":0.189,"courante":0.904},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901,"courante":0.85601},"max":{"defaut":3,"courante":3},"min":{"defaut":0.00001,"courante":0.00001},"step":{"defaut":0.001,"courante":0.001}},"dt":{"valeur":{"defaut":0.00437,"courante":0.0037},"max":{"defaut":0.01,"courante":0.01},"min":{"defaut":0,"courante":0},"step":{"defaut":0.00001,"courante":0.00001}},"collisionMax":{"valeur":{"defaut":1,"courante":1},"max":{"defaut":1000,"courante":1000},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"vit0":{"valeur":{"defaut":1.1,"courante":1.1},"max":{"defaut":100,"courante":100},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"pointSize":{"valeur":{"defaut":1,"courante":2},"max":{"defaut":10,"courante":10},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA","courante":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE","courante":"ONE_MINUS_SRC_COLOR"}},"scale":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":500,"courante":500},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"gridStep":{"valeur":{"defaut":2,"courante":2},"max":{"defaut":20,"courante":20},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}}};

m7 = {
  "uVelocityMax":{"valeur":{"defaut":0.026,"courante":0},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},

  "alpha":{"valeur":{"defaut":0.026,"courante":0},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},
  "lumi":{"valeur":{"defaut":0.963,"courante":0.963},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"flamme":{"valeur":{"defaut":0.243,"courante":0.243},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"delta2":{"valeur":{"defaut":0.049,"courante":0.049},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"force":{"valeur":{"defaut":-171.493,"courante":251.375},"max":{"defaut":1044,"courante":1044},"min":{"defaut":-591,"courante":-591},"step":{"defaut":0.001,"courante":0.001}},"gravity":{"valeur":{"defaut":179.357,"courante":179.357},"max":{"defaut":441,"courante":441},"min":{"defaut":-80,"courante":-80},"step":{"defaut":0.001,"courante":0.001}},"forceMouse":{"valeur":{"defaut":-575.92,"courante":-575.92},"max":{"defaut":80,"courante":80},"min":{"defaut":-801,"courante":-801},"step":{"defaut":0.001,"courante":0.001}},"maxAngle":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"angleBase":{"valeur":{"defaut":0,"courante":39},"max":{"defaut":7,"courante":39},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"slowdown":{"valeur":{"defaut":0.768,"courante":0.754},"max":{"defaut":2,"courante":2},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"choc":{"valeur":{"defaut":1.593,"courante":1.593},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuil":{"valeur":{"defaut":0.904,"courante":1.865},"max":{"defaut":1,"courante":4},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuilMouse":{"valeur":{"defaut":0.85601,"courante":0.85601},"max":{"defaut":3,"courante":3},"min":{"defaut":0.00001,"courante":0.00001},"step":{"defaut":0.001,"courante":0.001}},"dt":{"valeur":{"defaut":0.0037,"courante":0.00168},"max":{"defaut":0.01,"courante":0.01},"min":{"defaut":0,"courante":0},"step":{"defaut":0.00001,"courante":0.00001}},"collisionMax":{"valeur":{"defaut":1,"courante":1},"max":{"defaut":1000,"courante":1000},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"vit0":{"valeur":{"defaut":1.1,"courante":1.1},"max":{"defaut":100,"courante":100},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"pointSize":{"valeur":{"defaut":2,"courante":1},"max":{"defaut":10,"courante":10},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA","courante":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE_MINUS_SRC_COLOR","courante":"ONE_MINUS_SRC_COLOR"}},"scale":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":500,"courante":500},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"gridStep":{"valeur":{"defaut":2,"courante":2},"max":{"defaut":20,"courante":20},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}}
};
/*
VM93:1 {"alpha":{"valeur":{"defaut":0.187,"courante":0.016},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"lumi":{"valeur":{"defaut":0.823,"courante":0.823},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"flamme":{"valeur":{"defaut":0.308,"courante":0.308},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"delta2":{"valeur":{"defaut":0.041,"courante":0.041},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"force":{"valeur":{"defaut":73.666,"courante":917.351},"max":{"defaut":1041,"courante":1041},"min":{"defaut":-8,"courante":-8},"step":{"defaut":0.001,"courante":0.001}},"gravity":{"valeur":{"defaut":0,"courante":138},"max":{"defaut":80,"courante":138},"min":{"defaut":-800,"courante":-800},"step":{"defaut":0.001,"courante":0.001}},"forceMouse":{"valeur":{"defaut":-155.223,"courante":-368.349},"max":{"defaut":80,"courante":80},"min":{"defaut":-801,"courante":-801},"step":{"defaut":0.001,"courante":0.001}},"maxAngle":{"valeur":{"defaut":6.399,"courante":6.399},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"angleBase":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"slowdown":{"valeur":{"defaut":0.861,"courante":0.735},"max":{"defaut":2,"courante":2},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"choc":{"valeur":{"defaut":1.656,"courante":1.75},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuil":{"valeur":{"defaut":2.209,"courante":34},"max":{"defaut":3,"courante":34},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901,"courante":2.99901},"max":{"defaut":3,"courante":3},"min":{"defaut":0.00001,"courante":0.00001},"step":{"defaut":0.001,"courante":0.001}},"dt":{"valeur":{"defaut":0.00338,"courante":0.0044},"max":{"defaut":0.01,"courante":0.01},"min":{"defaut":0,"courante":0},"step":{"defaut":0.00001,"courante":0.00001}},"collisionMax":{"valeur":{"defaut":1,"courante":4},"max":{"defaut":1000,"courante":1000},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"vit0":{"valeur":{"defaut":1.1,"courante":1.1},"max":{"defaut":100,"courante":100},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"pointSize":{"valeur":{"defaut":2,"courante":1},"max":{"defaut":10,"courante":10},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA","courante":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE","courante":"ONE"}},"scale":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":500,"courante":500},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"gridStep":{"valeur":{"defaut":3,"courante":3},"max":{"defaut":20,"courante":20},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}}};
/*


m7 = VM440:1 {"alpha":{"valeur":{"defaut":0.187,"courante":0.985},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"lumi":{"valeur":{"defaut":0.823,"courante":0.963},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"flamme":{"valeur":{"defaut":0.308,"courante":0.243},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"delta2":{"valeur":{"defaut":0.041,"courante":0.049},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"force":{"valeur":{"defaut":-148.803,"courante":25.486},"max":{"defaut":10441,"courante":1044},"min":{"defaut":-5911,"courante":-591},"step":{"defaut":0.001,"courante":0.001}},"gravity":{"valeur":{"defaut":26.783,"courante":23.996},"max":{"defaut":44,"courante":44},"min":{"defaut":-80,"courante":-80},"step":{"defaut":0.001,"courante":0.001}},"forceMouse":{"valeur":{"defaut":-676.989,"courante":-399.14},"max":{"defaut":80,"courante":80},"min":{"defaut":-801,"courante":-801},"step":{"defaut":0.001,"courante":0.001}},"maxAngle":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"angleBase":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"slowdown":{"valeur":{"defaut":0.91,"courante":0.475},"max":{"defaut":2,"courante":2},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"choc":{"valeur":{"defaut":2.053,"courante":0.986},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuil":{"valeur":{"defaut":18.665,"courante":1.273},"max":{"defaut":44,"courante":44},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901,"courante":2.99901},"max":{"defaut":3,"courante":3},"min":{"defaut":0.00001,"courante":0.00001},"step":{"defaut":0.001,"courante":0.001}},"dt":{"valeur":{"defaut":0.00559,"courante":0.00812},"max":{"defaut":0.01,"courante":0.01},"min":{"defaut":0,"courante":0},"step":{"defaut":0.00001,"courante":0.00001}},"collisionMax":{"valeur":{"defaut":1,"courante":2},"max":{"defaut":1000,"courante":1000},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"vit0":{"valeur":{"defaut":1.1,"courante":1.1},"max":{"defaut":100,"courante":100},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"pointSize":{"valeur":{"defaut":1,"courante":2},"max":{"defaut":10,"courante":10},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA","courante":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE","courante":"DST_ALPHA"}},"scale":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":500,"courante":500},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"gridStep":{"valeur":{"defaut":2,"courante":2},"max":{"defaut":20,"courante":20},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}}};
/*
VM160:1 {"alpha":{"valeur":{"defaut":0.187,"courante":0.004},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"lumi":{"valeur":{"defaut":0.823,"courante":0.823},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"flamme":{"valeur":{"defaut":0.308,"courante":0.308},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"delta2":{"valeur":{"defaut":0.041,"courante":0.041},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"force":{"valeur":{"defaut":73.666,"courante":900.817},"max":{"defaut":1041,"courante":1041},"min":{"defaut":-8,"courante":-8},"step":{"defaut":0.001,"courante":0.001}},"gravity":{"valeur":{"defaut":0,"courante":134},"max":{"defaut":80,"courante":134},"min":{"defaut":-800,"courante":-800},"step":{"defaut":0.001,"courante":0.001}},"forceMouse":{"valeur":{"defaut":-155.223,"courante":-556.721},"max":{"defaut":80,"courante":80},"min":{"defaut":-801,"courante":-801},"step":{"defaut":0.001,"courante":0.001}},"maxAngle":{"valeur":{"defaut":6.399,"courante":6.399},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"angleBase":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"slowdown":{"valeur":{"defaut":0.861,"courante":0.901},"max":{"defaut":2,"courante":2},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"choc":{"valeur":{"defaut":1.656,"courante":1.911},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuil":{"valeur":{"defaut":2.209,"courante":8.166},"max":{"defaut":3,"courante":22},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901,"courante":2.99901},"max":{"defaut":3,"courante":4},"min":{"defaut":0.00001,"courante":0.00001},"step":{"defaut":0.001,"courante":0.001}},"dt":{"valeur":{"defaut":0.00338,"courante":0.00281},"max":{"defaut":0.01,"courante":0.01},"min":{"defaut":0,"courante":0},"step":{"defaut":0.00001,"courante":0.00001}},"collisionMax":{"valeur":{"defaut":1,"courante":1},"max":{"defaut":1000,"courante":1000},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"vit0":{"valeur":{"defaut":1.1,"courante":1.1},"max":{"defaut":100,"courante":100},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"pointSize":{"valeur":{"defaut":2,"courante":1},"max":{"defaut":10,"courante":10},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA","courante":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE","courante":"ONE"}},"scale":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":500,"courante":500},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"gridStep":{"valeur":{"defaut":3,"courante":2},"max":{"defaut":20,"courante":20},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}}};
*/

 /*
VM302:1 {"alpha":{"valeur":{"defaut":0.187,"courante":0.0005},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.0001}},"lumi":{"valeur":{"defaut":0.823,"courante":0.823},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"flamme":{"valeur":{"defaut":0.308,"courante":0.308},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"delta2":{"valeur":{"defaut":0.041,"courante":0.051},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"force":{"valeur":{"defaut":73.666,"courante":107.993},"max":{"defaut":1041,"courante":1107},"min":{"defaut":-8,"courante":-8},"step":{"defaut":0.001,"courante":0.001}},"gravity":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":80,"courante":80},"min":{"defaut":-800,"courante":-800},"step":{"defaut":0.001,"courante":0.001}},"forceMouse":{"valeur":{"defaut":-155.223,"courante":-5158.378},"max":{"defaut":80,"courante":80},"min":{"defaut":-801,"courante":-8111},"step":{"defaut":0.001,"courante":0.001}},"maxAngle":{"valeur":{"defaut":6.399,"courante":6.399},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"angleBase":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"slowdown":{"valeur":{"defaut":0.861,"courante":0.518},"max":{"defaut":2,"courante":2},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"choc":{"valeur":{"defaut":1.656,"courante":1.008},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuil":{"valeur":{"defaut":2.209,"courante":3},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901,"courante":0.64801},"max":{"defaut":3,"courante":3},"min":{"defaut":0.00001,"courante":0.00001},"step":{"defaut":0.001,"courante":0.001}},"dt":{"valeur":{"defaut":0.00338,"courante":0.00306},"max":{"defaut":0.01,"courante":0.01},"min":{"defaut":0,"courante":0},"step":{"defaut":0.00001,"courante":0.00001}},"collisionMax":{"valeur":{"defaut":1,"courante":1},"max":{"defaut":1000,"courante":1000},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"vit0":{"valeur":{"defaut":1.1,"courante":1.1},"max":{"defaut":100,"courante":100},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"pointSize":{"valeur":{"defaut":2,"courante":1},"max":{"defaut":10,"courante":10},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA","courante":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE","courante":"ONE"}},"scale":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":500,"courante":500},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"gridStep":{"valeur":{"defaut":3,"courante":3},"max":{"defaut":20,"courante":20},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}}}

 */

 /*
VM336:1 {"alpha":{"valeur":{"defaut":0.187},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.823},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.308},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.041},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":-8},"max":{"defaut":1041},"min":{"defaut":-8},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":80},"min":{"defaut":-800},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-337.92},"max":{"defaut":80},"min":{"defaut":-801},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":6.399},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.899},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.656},"max":{"defaut":3},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":2.797},"max":{"defaut":3},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00338},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":2},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":1},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}}}

 */

 var m6 = {
  "alpha":{"valeur":{"defaut":1,"courante":0.187},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},
  "step":{"defaut":0.001,"courante":0.001}},
  "lumi":{"valeur":{"defaut":0.117,"courante":0.823},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},
  "flamme":{"valeur":{"defaut":1,"courante":0.308},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},
  "delta2":{"valeur":{"defaut":1,"courante":0.041},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},
  "force":{"valeur":{"defaut":6.039,"courante":73.666},"max":{"defaut":36,"courante":1041},"min":{"defaut":-8,"courante":-8},"step":{"defaut":0.001,"courante":0.001}},
  "gravity":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":80,"courante":80},"min":{"defaut":-800,"courante":-800},"step":{"defaut":0.001,"courante":0.001}},
  "forceMouse":{"valeur":{"defaut":-2.961,"courante":-155.223},"max":{"defaut":80,"courante":80},"min":{"defaut":-80,"courante":-801},"step":{"defaut":0.001,"courante":0.001}},
  "maxAngle":{"valeur":{"defaut":6.399,"courante":6.399},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},
  "angleBase":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},
  "slowdown":{"valeur":{"defaut":1.035,"courante":0.861},"max":{"defaut":2,"courante":2},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},
  "choc":{"valeur":{"defaut":2.185,"courante":1.656},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},
  "seuil":{"valeur":{"defaut":2.824,"courante":2.209},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},
  "seuilMouse":{"valeur":{"defaut":0.22901,"courante":2.99901},"max":{"defaut":3,"courante":3},"min":{"defaut":0.00001,"courante":0.00001},"step":{"defaut":0.001,"courante":0.001}},
  "dt":{"valeur":{"defaut":0.00735,"courante":0.00338},"max":{"defaut":0.01,"courante":0.01},"min":{"defaut":0,"courante":0},"step":{"defaut":0.00001,"courante":0.00001}},
  "collisionMax":{"valeur":{"defaut":1,"courante":1},"max":{"defaut":1000,"courante":1000},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},
  "vit0":{"valeur":{"defaut":1.1,"courante":1.1},"max":{"defaut":100,"courante":100},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},
  "pointSize":{"valeur":{"defaut":1,"courante":2},"max":{"defaut":10,"courante":10},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},
  "blend1":{"valeur":{"defaut":"ONE","courante":"ONE_MINUS_SRC_ALPHA"}},
  "blend2":{"valeur":{"defaut":"ONE","courante":"ONE"}},"scale":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":500,"courante":500},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"gridStep":{"valeur":{"defaut":3,"courante":3},"max":{"defaut":20,"courante":20},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}}};
 var m4= {"alpha":{"valeur":{"defaut":1,"courante":1},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"lumi":{"valeur":{"defaut":0.117,"courante":0.117},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"flamme":{"valeur":{"defaut":1,"courante":1},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"delta2":{"valeur":{"defaut":1,"courante":1},"max":{"defaut":1,"courante":1},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"force":{"valeur":{"defaut":4.797,"courante":"3.422"},"max":{"defaut":36,"courante":36},"min":{"defaut":-8,"courante":-8},"step":{"defaut":0.001,"courante":0.001}},"gravity":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":80,"courante":80},"min":{"defaut":-800,"courante":-800},"step":{"defaut":0.001,"courante":0.001}},"forceMouse":{"valeur":{"defaut":-26.404,"courante":"-38.224"},"max":{"defaut":80,"courante":80},"min":{"defaut":-80,"courante":-80},"step":{"defaut":0.001,"courante":0.001}},"maxAngle":{"valeur":{"defaut":6.399,"courante":6.399},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"angleBase":{"valeur":{"defaut":0,"courante":0},"max":{"defaut":7,"courante":7},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"slowdown":{"valeur":{"defaut":1.006,"courante":"0.996"},"max":{"defaut":2,"courante":2},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"choc":{"valeur":{"defaut":1.886,"courante":1.886},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuil":{"valeur":{"defaut":0.236,"courante":"0.083"},"max":{"defaut":3,"courante":3},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"seuilMouse":{"valeur":{"defaut":1.172,"courante":1.172},"max":{"defaut":3,"courante":3},"min":{"defaut":0.00001,"courante":0.00001},"step":{"defaut":0.001,"courante":0.001}},"dt":{"valeur":{"defaut":0.01535,"courante":0.01535},"max":{"defaut":0.01,"courante":0.01},"min":{"defaut":0,"courante":0},"step":{"defaut":0.00001,"courante":0.00001}},"collisionMax":{"valeur":{"defaut":5,"courante":5},"max":{"defaut":1000,"courante":1000},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"vit0":{"valeur":{"defaut":1.1,"courante":1.1},"max":{"defaut":100,"courante":100},"min":{"defaut":0,"courante":0},"step":{"defaut":0.001,"courante":0.001}},"pointSize":{"valeur":{"defaut":1,"courante":1},"max":{"defaut":10,"courante":10},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"blend1":{"valeur":{"defaut":"ONE","courante":"ONE"}},"blend2":{"valeur":{"defaut":"ONE","courante":"ONE"}},"scale":{"valeur":{"defaut":7,"courante":7},"max":{"defaut":500,"courante":500},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}},"gridStep":{"valeur":{"defaut":3,"courante":3},"max":{"defaut":20,"courante":20},"min":{"defaut":1,"courante":1},"step":{"defaut":1,"courante":1}}}  ;

Object.entries(m7).map( 
                    ([key, value]) => 
                        Object.entries(value).map( 
                            ([key,value]) => {
                                                if ('courante' in value ) {
                                                    value.defaut = value.courante;
                                                    delete value.courante;
                                                }
                                            }
                        )
                );


var m5= {
  "alpha":
    {"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},
  "lumi":
    {"valeur":{"defaut":0.117},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},
  "flamme":
    {"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},
  "delta2":
    {"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},
  "force":
    {"valeur":{"defaut":6.039},"max":{"defaut":36},"min":{"defaut":-8},"step":{"defaut":0.001}},
  "gravity":
    {"valeur":{"defaut":0},"max":{"defaut":80},"min":{"defaut":-800},"step":{"defaut":0.001}},
  "forceMouse":
    {"valeur":{"defaut":-2.961},"max":{"defaut":80},"min":{"defaut":-80},"step":{"defaut":0.001}},
  "maxAngle":
    {"valeur":{"defaut":6.399},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},
  "angleBase":
    {"valeur":{"defaut":0},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},
  "slowdown":
    {"valeur":{"defaut":1.035},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},
  "choc":
    {"valeur":{"defaut":2.185},"max":{"defaut":3},"min":{"defaut":0},"step":{"defaut":0.001}},
  "seuil":
    {"valeur":{"defaut":2.824},"max":{"defaut":3},"min":{"defaut":0},"step":{"defaut":0.001}},
  "seuilMouse":
    {"valeur":{"defaut":0.22901},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},
  "dt":
    {"valeur":{"defaut":0.00735},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},
  "collisionMax":
    {"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},
  "vit0":
    {"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},
  "pointSize":
    {"valeur":{"defaut":1},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},
  "blend1":
    {"valeur":{"defaut":"ONE"}},
  "blend2":
    {"valeur":{"defaut":"ONE"}},
  "scale":
    {"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},
  "gridStep":
    {"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}}};




var model = {
  alpha:        { valeur: {defaut: 1 }       , max: {defaut: 1 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  lumi:         { valeur: {defaut: 1 }       , max: {defaut: 1 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  flamme:       { valeur: {defaut: 1 }       , max: {defaut: 1 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  delta2:       { valeur: {defaut: 1 }       , max: {defaut: 1 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  force:        { valeur: {defaut: 7.31 }    , max: {defaut: 8 }    , min: {defaut: -8 }        , step: {defaut: 0.001 }    },
  gravity:      { valeur: {defaut: 0 }       , max: {defaut: 800 }  , min: {defaut: -800 }      , step: {defaut: 0.001 }    },
  forceMouse:   { valeur: {defaut: -112 }    , max: {defaut: 800 }  , min: {defaut: -800 }      , step: {defaut: 0.001 }    },
  maxAngle:     { valeur: {defaut: 0.68 }    , max: {defaut: 7 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  angleBase:    { valeur: {defaut: 4.37 }    , max: {defaut: 7 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  slowdown:     { valeur: {defaut: 0.985 }   , max: {defaut: 2 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  choc:         { valeur: {defaut: 1.856 }   , max: {defaut: 3 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  seuil:        { valeur: {defaut: 0.56 }    , max: {defaut: 3 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  seuilMouse:   { valeur: {defaut: 0.127 }   , max: {defaut: 3 }    , min: {defaut: 0.00001 }   , step: {defaut: 0.001 }    },
  dt:           { valeur: {defaut: 0.00588 } , max: {defaut: 0.5 }  , min: {defaut: 0 } ,        step: {defaut: 0.00001 }    },
  collisionMax: { valeur: {defaut: 1 }      , max: {defaut: 1000 } , min: {defaut: 1 }         , step: {defaut: 1 }        },
  vit0:         { valeur: {defaut: 1.1 }     , max: {defaut: 100 }  , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  pointSize:    { valeur: {defaut: 1 }       , max: {defaut: 10 }   , min: {defaut: 1 }         , step: {defaut: 1 }        },
  blend1:       { valeur: {defaut: "ONE" }                                                                                  },
  blend2:       { valeur: {defaut: "ONE" }                                                                                  },
  scale:        { valeur: {defaut: 7 }       , max: {defaut: 500}   , min: {defaut: 1 }         , step: {defaut: 1 }        },
  gridStep:     { valeur: {defaut: 1 }       , max: {defaut: 20 }   , min: {defaut: 1 }         , step: {defaut: 1 }        },            
  uVelocityMax: { valeur: {defaut: 1 }       , max: {defaut: 20 }   , min: {defaut: 0 }         , step: {defaut: 0.01 }     },
  brightness:   { valeur: {defaut: 1 }       , max: {defaut: 1 }    , min: {defaut: -1 }         , step: {defaut: 0.01 }     },
  contrast:     { valeur: {defaut: 1 }       , max: {defaut: 1 }    , min: {defaut: -1 }         , step: {defaut: 0.01 }     },
  saturation:   { valeur: {defaut: 1 }       , max: {defaut: 1}     , min: {defaut: -1 }         , step: {defaut: 0.01 }     }

                 
};



m7={"uVelocityMax":{"valeur":{"defaut":85.473},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.963},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.243},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.049},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":100.334},"max":{"defaut":1044},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":179.357},"max":{"defaut":441},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-575.92},"max":{"defaut":80},"min":{"defaut":-801},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":39},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.845},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":2.151},"max":{"defaut":3},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":0.625},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":0.85601},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00168},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":2},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}}};
m7.normalForce = {"valeur":{"defaut":85.473},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}};
m7.brightness=  { valeur: {defaut: -0.2 }    , max: {defaut: 1 } , min: {defaut: -1 }      , step: {defaut: 0.01 }     };
m7.contrast=    { valeur: {defaut: 0.9 }     , max: {defaut: 1 } , min: {defaut: -1 }      , step: {defaut: 0.01 }     };
m7.saturation=  { valeur: {defaut: 0 }       , max: {defaut: 1 } , min: {defaut: -1 }      , step: {defaut: 0.01 }     };
m7.threshold=  { valeur: {defaut: 0 }       , max: {defaut: 1 } , min: {defaut: -1 }      , step: {defaut: 0.01 }     };



var m8 = {"uVelocityMax":{"valeur":{"defaut":7.922},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.963},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.243},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.049},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":-208.693},"max":{"defaut":1044},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":376.875},"max":{"defaut":441},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-801},"max":{"defaut":80},"min":{"defaut":-801},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.507},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.099},"max":{"defaut":3},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":0.279},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":1.25401},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00149},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":3},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":2},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":150},"max":{"defaut":150},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.46},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":0.9},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}}};
var m9 = {"uVelocityMax":{"valeur":{"defaut":15.924},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.963},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.243},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.049},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":-252.392},"max":{"defaut":1044},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":435.43},"max":{"defaut":441},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-801},"max":{"defaut":80},"min":{"defaut":-801},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.523},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.666},"max":{"defaut":3},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":0.4},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":1.25401},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00149},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":2},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1691.206},"max":{"defaut":15011},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.53},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":0.92},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}}};
model=m9;

fillGui();

ecouteurGUI();

img = new Image();
img.onload = start ; 
img.src="1280_720.png";
//img.src="352_288.png";
//img.src="1920_1080.png";
//img.src="640_480.png";



function ecouteurGUI() {
    sCB = document.getElementById( 'start-capturing-button' );
    dVB = document.getElementById( 'download-video-button' );
    sCB.addEventListener( 'click', function( e ) 
      {
        let framerate = 60;

        capturer = new CCapture( 
          {
                verbose: true,
                display: true,
                framerate: framerate,
                //motionBlurFrames: ( 960 / framerate ) * ( document.querySelector('input[name="motion-blur"]').checked ? 1 : 0 ),
                quality: 90,
                format: 'webm',
                timeLimit: 0,
                frameLimit: 0,
                autoSaveTime: 0         
          }
        );

        capturer.start();
        e.preventDefault();
      },
    false);

    dVB.addEventListener( 'click', function( e )
      {
            capturer.stop();
            capturer.save();
            capturer=null;
      },
      false
    );
}





function start() {


  CSW = img.width;
  CSH = img.height;

  gl = document.getElementById("glcanvas").getContext(
            "webgl",
            {
                antialias: false,
                depth: false,
                alpha: false,
                stencil: false,
                premultipliedAlpha: false,
                preserveDrawingBuffer: false
            }
  );
  ext1 = gl.getExtension("OES_texture_float");
  ext4 = gl.getExtension("EXT_color_buffer_float");

  gl.canvas.width = CSW;
  gl.canvas.height = CSH;

   //debug
    gl.canvas.style.width = CSW /2+ 'px';
   gl.canvas.style.height = CSH /2+ 'px';
    //gl.canvas.style.width =  '800px';
    //gl.canvas.style.height = '800px';


  gl.canvas.addEventListener('mouseup', function(ev) {  click = 0;}, false);
  gl.canvas.addEventListener('mousemove',
        function (ev) {
          ev.preventDefault();

          if (click) {
            let pos = getNoPaddingNoBorderCanvasRelativeMousePosition(ev, gl.canvas);
            mouseX = pos.x / gl.canvas.width * 2 - 1;
            mouseY = pos.y / gl.canvas.height * -2 + 1;
          }
        },
        false
  );

  gl.canvas.addEventListener('mousedown',
        function (ev) {
          ev.preventDefault();

          let pos = getNoPaddingNoBorderCanvasRelativeMousePosition(ev, gl.canvas);
          mouseX = pos.x / gl.canvas.width * 2 - 1;
          mouseY = pos.y / gl.canvas.height * -2 + 1;
          click = 1 ;
        }, 
        false
  );

  traitement = document.getElementById("traitement");
  gl_Traitement = traitement.getContext(
            "webgl",
            {
                antialias: false,
                depth: false,
                alpha: false,
                stencil: false,
                premultipliedAlpha: false,
                preserveDrawingBuffer: false
            }
  );

  gl_Traitement.getExtension('OES_standard_derivatives');

  gl_Traitement.canvas.width = CSW;
  gl_Traitement.canvas.height = CSH;



  afficheurShader = compilink(gl,'afficheur');
  gridShader = compilink(gl,'grid');
  main2Shader = compilink(gl,'main2');
  sobelShader = compilink(gl_Traitement,'sobel');



  afficheurShader.position =  gl.getAttribLocation(afficheurShader, "position");
  afficheurShader.pvTex =         gl.getUniformLocation(    afficheurShader,    "pvTex"     );
  afficheurShader.gridTex =       gl.getUniformLocation(    afficheurShader,    "gridTex"    );
  afficheurShader.mapColor =      gl.getUniformLocation(    afficheurShader,    "mapColor"  );
  afficheurShader.resolution =    gl.getUniformLocation(    afficheurShader,    "resolution");
  afficheurShader.PVS =           gl.getUniformLocation(    afficheurShader,    "PVS"       );
  afficheurShader.pointSize =     gl.getUniformLocation(    afficheurShader,    "pointSize"       );
  afficheurShader.delta2 =        gl.getUniformLocation(    afficheurShader,    "delta2"       );
  afficheurShader.alpha =         gl.getUniformLocation(    afficheurShader,    "alpha"       );
  afficheurShader.lumi =          gl.getUniformLocation(    afficheurShader,    "lumi"       );
  afficheurShader.flamme =        gl.getUniformLocation(    afficheurShader,    "flamme"       );

  gridShader.position =       gl.getAttribLocation(gridShader, "position");
  gridShader.pvTex =              gl.getUniformLocation(gridShader, "pvTex");
  gridShader.resolution =         gl.getUniformLocation(gridShader, "resolution");
  gridShader.alea =               gl.getUniformLocation(gridShader, "alea");
  gridShader.gridSize =           gl.getUniformLocation(gridShader, "gridSize");
  gridShader.PVS =                gl.getUniformLocation(gridShader, "PVS");
  gridShader.obstacle =           gl.getUniformLocation(gridShader, "obstacle");

  main2Shader.position =      gl.getAttribLocation(main2Shader, "position");
  main2Shader.pvTex =             gl.getUniformLocation(main2Shader, "pvTex");
  main2Shader.T6 =                gl.getUniformLocation(main2Shader, "T6");
  main2Shader.destination =       gl.getUniformLocation(main2Shader, "destination");
  main2Shader.gridTex =           gl.getUniformLocation(main2Shader, "gridTex");
  main2Shader.resolution =        gl.getUniformLocation(main2Shader, "resolution");
  main2Shader.choc =              gl.getUniformLocation(main2Shader, "choc");
  main2Shader.maxAngle =          gl.getUniformLocation(main2Shader, "maxAngle");
  main2Shader.angleBase =         gl.getUniformLocation(main2Shader, "angleBase");
  main2Shader.gridSize =          gl.getUniformLocation(main2Shader, "gridSize");
  main2Shader.image1 =            gl.getUniformLocation(main2Shader, "image1");
  main2Shader.textureInput =      gl.getUniformLocation(main2Shader, "textureInput");
  main2Shader.dt =                gl.getUniformLocation(main2Shader, "dt");
  main2Shader.mouseCoords =       gl.getUniformLocation(main2Shader, "mouseCoords");
  main2Shader.click =             gl.getUniformLocation(main2Shader, "click");
  main2Shader.force =             gl.getUniformLocation(main2Shader, "force");
  main2Shader.gravity =           gl.getUniformLocation(main2Shader, "gravity");
  main2Shader.forceMouse =        gl.getUniformLocation(main2Shader, "forceMouse");
  main2Shader.slowdown =          gl.getUniformLocation(main2Shader, "slowdown");
  main2Shader.seuil =             gl.getUniformLocation(main2Shader, "seuil");
  main2Shader.seuilMouse =        gl.getUniformLocation(main2Shader, "seuilMouse");
  main2Shader.PVS =               gl.getUniformLocation(main2Shader, "PVS");
  main2Shader.collisionMax =      gl.getUniformLocation(main2Shader, "collisionMax");
  main2Shader.uVelocityMax =      gl.getUniformLocation(main2Shader, "uVelocityMax");
  main2Shader.normalForce =       gl.getUniformLocation(main2Shader, "normalForce");



  sobelShader.coordinates =   gl_Traitement.getAttribLocation(sobelShader, "coordinates");
  sobelShader.texture =           gl_Traitement.getUniformLocation(sobelShader,"texture");
  sobelShader.resolution =        gl_Traitement.getUniformLocation(sobelShader,"resolution");
  sobelShader.brightness =        gl_Traitement.getUniformLocation(sobelShader,"brightness");
  sobelShader.contrast =          gl_Traitement.getUniformLocation(sobelShader,"contrast");
  sobelShader.saturation =        gl_Traitement.getUniformLocation(sobelShader,"saturation");
  sobelShader.threshold =         gl_Traitement.getUniformLocation(sobelShader,"threshold");


  PVS=512;
  NBRE=PVS*PVS;

  //PVS = Math.pow(2, Math.ceil(Math.log(Math.ceil(Math.sqrt(NBRE))) / Math.LN2));
  // ici je force PVS avec la valeur 2 , par ce que la formule marche pas pour NBRE = 1

  if (NBRE === 1) PVS=2;  

  let pvFloat32 = new Float32Array(PVS*PVS*4);
  let image1 = new Float32Array(PVS*PVS*4);

  for (let i=0 ; i < PVS*PVS*4 ; i=i+4) {
    pvFloat32[i]= Math.random()*2-1;
    pvFloat32[i+1]=Math.random()*2-1;
    pvFloat32[i+2]= Math.random()*2-1;
    pvFloat32[i+3]= Math.random()*2-1;
    image1[i]= Math.random()*2-1;
    image1[i+1]= Math.random()*2-1;
    image1[i+2]= Math.random()*2-1;
    image1[i+3]= Math.random()*2-1;

  }
  positionTex = makeBufferPosition(NBRE);


  GRIDX= Math.floor(CSW / model.gridStep.valeur.courante);
  GRIDY= Math.floor(CSH / model.gridStep.valeur.courante);




  vertex_buffer = gl_Traitement.createBuffer();
  gl_Traitement.bindBuffer(gl_Traitement.ARRAY_BUFFER, vertex_buffer);
  gl_Traitement.enableVertexAttribArray(sobelShader.coordinates);
  gl_Traitement.vertexAttribPointer(sobelShader.coordinates, 2, gl_Traitement.FLOAT, false, 0, 0);
  gl_Traitement.bufferData(gl_Traitement.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl_Traitement.STATIC_DRAW);
  gl_Traitement.bindBuffer(gl_Traitement.ARRAY_BUFFER, null);

  var T0 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, T0);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255,255,255,255,...new Array(PVS * PVS * 4-4)]));
  var fbT0 = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbT0);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T0, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5") console.log("fbT0 is complete"); else console.log("fbT0 is NOT complete");


  var T1 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, T1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, new Float32Array([-1.0054558515548706,0.9974316358566284,0,0,...new Array(PVS * PVS * 4-4)]));
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, pvFloat32);

  fbT1 = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbT1);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T1, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5") console.log("fbT1 is complete"); else console.log("fbT1 is NOT complete");


  var T8 = gl.createTexture() ;
  gl.activeTexture(gl.TEXTURE8);
  gl.bindTexture(gl.TEXTURE_2D, T8);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //modif
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, new Float32Array([-0.996874988079071, 0.9958333373069763,0,0,...new Array(PVS * PVS * 4-4)]));
  //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, new Float32Array(Array(PVS * PVS * 4).fill(0)));
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, image1);

  var fbT8= gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbT8);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T8, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5") console.log("fbT8 is complete"); else console.log("fbT8 is NOT complete");


  var T2 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, T2);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let f32 = new Float32Array(GRIDX * GRIDY *4);
  for (let k = 0; k < GRIDX * GRIDY; k++) f32[k * 4 + 3] = Math.random() * 6.25 ; 
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, GRIDX, GRIDY, 0, gl.RGBA, gl.FLOAT, f32);
    //gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,GRIDX,GRIDY);
    //gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, GRIDX,GRIDY, gl.RGBA, gl.FLOAT,f32);
  fbT2 = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbT2);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T2, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5") console.log("fbT2 is complete"); else console.log("fbT2 is NOT complete");

  var T3 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, T3);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, null);
  // webgl2 gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, PVS, PVS, 0, gl.RGBA, gl.FLOAT, null);
  fbT3 = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbT3);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T3, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5") console.log("fbT3 is complete"); else console.log("fbT3 is NOT complete");


  textureWebcam = gl.createTexture();
  gl.activeTexture(gl.TEXTURE6);
  gl.bindTexture(gl.TEXTURE_2D, textureWebcam);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

  textureWebcamSobel = gl_Traitement.createTexture();
  gl_Traitement.activeTexture(gl_Traitement.TEXTURE7);
  gl_Traitement.bindTexture(gl_Traitement.TEXTURE_2D, textureWebcamSobel);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_MIN_FILTER, gl_Traitement.NEAREST);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_MAG_FILTER, gl_Traitement.NEAREST);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_WRAP_S, gl_Traitement.CLAMP_TO_EDGE);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_WRAP_T, gl_Traitement.CLAMP_TO_EDGE);
  gl_Traitement.texImage2D(gl_Traitement.TEXTURE_2D, 0, gl_Traitement.RGBA, gl_Traitement.RGBA, gl_Traitement.UNSIGNED_BYTE, img);

  sobelOutput = gl_Traitement.createTexture();
  gl_Traitement.activeTexture(gl_Traitement.TEXTURE4);
  gl_Traitement.bindTexture(gl_Traitement.TEXTURE_2D, sobelOutput);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_MIN_FILTER, gl_Traitement.NEAREST);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_MAG_FILTER, gl_Traitement.NEAREST);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_WRAP_S, gl_Traitement.CLAMP_TO_EDGE);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_WRAP_T, gl_Traitement.CLAMP_TO_EDGE);
  gl_Traitement.texImage2D(gl_Traitement.TEXTURE_2D, 0, gl_Traitement.RGBA, CSW, CSH, 0, gl_Traitement.RGBA, gl_Traitement.UNSIGNED_BYTE, null);
  gl_Traitement.pixelStorei(gl_Traitement.UNPACK_FLIP_Y_WEBGL, true);

  fbSobel = gl_Traitement.createFramebuffer();
  gl_Traitement.bindFramebuffer(gl_Traitement.FRAMEBUFFER, fbSobel);
  gl_Traitement.framebufferTexture2D(gl_Traitement.FRAMEBUFFER, gl_Traitement.COLOR_ATTACHMENT0, gl_Traitement.TEXTURE_2D, sobelOutput, 0);

  var update = new Worker("update.js");

  update.onmessage = onWorkEnded;
   
  ctx  = document.getElementById("telecran").getContext('2d');
  ctx.canvas.width  = CSW;
  ctx.canvas.height = CSH;
  ctx.drawImage(img, 0, 0, CSW, CSH);



	updateModel();


  swap= true;


  /*
  update.postMessage({
    rawpix  : ctx.getImageData(0, 0, CSW, CSH).data ,
    vit0    : model.vit0.valeur.courante ,
    scale   : model.scale.valeur.courante ,
    CSW     : CSW ,
    CSH     : CSH 

  });

*/

  if (!req) {req =window.requestAnimationFrame(animate);}


}







function animate(timestamp) {


    var TEXTURE_UNIT_pv = swap ? 1 : 3 ;
    var framebuffer = swap ? fbT3 : fbT1 ;

    var fbPvCurrent = swap ? fbT1 : fbT3 ;





   // gl_Traitement.viewport(0, 0, 640, 480);
    gl_Traitement.useProgram(       sobelShader);

    gl_Traitement.viewport(0, 0, CSW, CSH);

    gl_Traitement.clear(            gl_Traitement.COLOR_BUFFER_BIT);
    gl_Traitement.bindFramebuffer(  gl_Traitement.FRAMEBUFFER, null);
    gl_Traitement.bindBuffer(       gl_Traitement.ARRAY_BUFFER, vertex_buffer);
    gl_Traitement.enableVertexAttribArray(sobelShader.coordinates);
    gl_Traitement.vertexAttribPointer(sobelShader.coordinates, 2, gl_Traitement.FLOAT, false, 0, 0);
    gl_Traitement.bindTexture(gl_Traitement.TEXTURE_2D, textureWebcamSobel);
    gl_Traitement.texImage2D(gl_Traitement.TEXTURE_2D, 0, gl_Traitement.RGBA, gl_Traitement.RGBA, gl_Traitement.UNSIGNED_BYTE, video);

    gl_Traitement.drawArrays(gl_Traitement.TRIANGLE_STRIP, 0, 4);


    /// AFFICHEUR // ************************************************************
    /// AFFICHEUR // ************************************************************
    /// AFFICHEUR // ************************************************************
    gl.useProgram(afficheurShader);

    gl.enableVertexAttribArray(afficheurShader.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    gl.vertexAttribPointer(afficheurShader.position, 2, gl.UNSIGNED_SHORT, false, 0, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl[model.blend1.valeur.courante], gl[model.blend2.valeur.courante]);
    
    gl.clearColor(fond.r / 255, fond.v / 255, fond.b / 255, fond.a / 255);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, CSW, CSH);

    gl.uniform1i(afficheurShader.pvTex     , TEXTURE_UNIT_pv ); // 1er tour vaut 1, 2e tour vaut 3

    gl.drawArrays(gl.POINTS, 0, NBRE);

    gl.disable(gl.BLEND);   
    


    /// GRID // ************************************************************
    /// GRID // ************************************************************
    /// GRID // ************************************************************
    gl.useProgram(gridShader);

    gl.enableVertexAttribArray(gridShader.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    gl.vertexAttribPointer(gridShader.position, 2, gl.UNSIGNED_SHORT, false, 0, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT2); 

    gl.viewport(0, 0, GRIDX, GRIDY);

    gl.clearColor(0, 0, 0,  0);
    gl.colorMask(true, true, true,false);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1i(gridShader.pvTex, TEXTURE_UNIT_pv); // 1 puis 3

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    gl.drawArrays(gl.POINTS, 0, NBRE);

    gl.disable(gl.BLEND);
    gl.colorMask(true, true, true, true);




    /// MAIN2 // ************************************************************
    /// MAIN2 // ************************************************************
    /// MAIN2 // ************************************************************
    gl.useProgram(main2Shader);

    gl.enableVertexAttribArray(main2Shader.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    gl.vertexAttribPointer(main2Shader.position, 2, gl.UNSIGNED_SHORT, false, 0, 0);


    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); // fbT3 puis fbT1  

    gl.viewport(0, 0, PVS, PVS);
    gl.bindTexture(gl.TEXTURE_2D, textureWebcam);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, traitement);
 //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

  //gl.bindTexture(gl.TEXTURE_2D, sobelOutput);

    gl.uniform1i(main2Shader.pvTex ,        TEXTURE_UNIT_pv ); // T1 puis T3
    gl.uniform2f(main2Shader.mouseCoords,   mouseX, mouseY  );
    gl.uniform1i(main2Shader.click,         click           );

    gl.drawArrays(gl.POINTS, 0, NBRE);


    swap = !swap;
    if( capturer ) capturer.capture( glcanvas );

    req=requestAnimationFrame(animate);


}



function makeBufferPosition(size) {
  var geometry = [];
	geometry.length = size;
	let k=0;
    for (; k < size; k++) {
        geometry[2*k]=k % PVS;
        geometry[2*k+1]=Math.floor( k / PVS);
    }
   // console.log("geometry :");console.log(geometry);
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Uint16Array(geometry),gl.STATIC_DRAW);
    return buffer;
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

function compilink(GL,name) {
        var afficheurVertex = getShader(GL, name + "Vertex");
        console.log("vertex = "+afficheurVertex);
        var afficheurFragment = getShader(GL, name + "Fragment");

        console.log("fragment ="+afficheurFragment);
        var prog = GL.createProgram();
        GL.attachShader(prog, afficheurVertex);
        GL.attachShader(prog, afficheurFragment);
        GL.linkProgram(prog);
        if (!GL.getProgramParameter(prog, GL.LINK_STATUS)) {
            var info = GL.getProgramInfoLog(prog);
            throw new Error('Could not compile ' + name + ' . \n\n' + info);
        }
        return prog;

}


function dump(a, b) {
  var pixels = new Float32Array(4 * a * b);
  gl.readPixels(0, 0, a, b, gl.RGBA, gl.FLOAT, pixels);
   console.log(pixels);
    for ( let i=0 ; i < pixels.length/4; i++) {
    //  console.log(pixels[i*4+0].toFixed(4)+ " , "+pixels[i*4+1].toFixed(4)+ " , "+pixels[i*4+2].toFixed(4)+ " , "+pixels[i*4+3].toFixed(4));
   }  
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



function getMedia(constraints) {
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream);
}
function gotStream(mediaStream) {
  video.srcObject = mediaStream;

}

function onWorkEnded(evt) {

  PVS = evt.data.PVS;
  NBRE = evt.data.NBRE;

  gl.activeTexture(gl.TEXTURE1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, new Float32Array(evt.data.pvFloat32) );
  gl.activeTexture(gl.TEXTURE3);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, new Float32Array(evt.data.pvFloat32) );

  gl.activeTexture(gl.TEXTURE8);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, new Float32Array(evt.data.image1Float));

  gl.activeTexture(gl.TEXTURE0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(evt.data.colorUint));

  gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
  gl.bufferData(gl.ARRAY_BUFFER,new Uint16Array(evt.data.geometry),gl.STATIC_DRAW);

  updateModel();


}