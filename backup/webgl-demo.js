"use strict";

var logdump = false;
var fbT1,fbT3,fbT5,fbT2 ;
var swap ;
var gl;
var afficheurShader;
var main2Shader;
var copieShader;
var gridShader;
var copyShader;
var fastCopyShader;
var afficheurFullQuadShader;
var positionTex,positionFastCopy,positionAfficheurFullQuadShader ;
var fond;
var CSW;
var CSH;
var PVS;
var GRIDX,GRIDY;
var NBRE;
var mouseX,mouseY,click;
var req;
var capturer=null;
var sCB;
var dVB; 
var canvas = document.getElementById("glcanvas");
var loaded;
var compteur;
var logout;
var mousedown ;
var realToCSSPixels ;
var ext1, ext2, ext5, ext3, ext4, ext6;
var img ;
var img2 ;
var visage;
var texte ;
var poto18 = {"fontaine":2,"gravity":0,"force1":7494.64,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.5,"slowdown":1.066,"choc":1.859,"seuil2":0.062,"seuil1":0.022,"dt":0.0001,"scale":250,"gridStep":3,"delta2":1,"vit0":100,"pointSize":3,"flamme":0,"lumi":0.03,"alpha":1,"forceMouse":-8000,"seuilMouse":0.003,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0};
var poto17 = {"fontaine":2,"gravity":0,"force1":1757.14,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.2,"slowdown":0.978,"choc":1.962,"seuil2":0.062,"seuil1":0.022,"dt":0.0001,"scale":100,"gridStep":3,"delta2":1,"vit0":100,"pointSize":3,"flamme":0,"lumi":0.03,"alpha":1,"forceMouse":-8000,"seuilMouse":0.044,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0};
var poto16 = {"fontaine":2,"gravity":0,"force1":-387.5,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.47,"slowdown":0.861,"choc":1.559,"seuil2":0.062,"seuil1":0.071,"dt":0.0004,"scale":100,"gridStep":3,"delta2":1,"vit0":100,"pointSize":3,"flamme":0,"lumi":0.08,"alpha":1,"forceMouse":-8000,"seuilMouse":0.15,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.04};
var poto15 = {"fontaine":2,"gravity":0,"force1":3717.86,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.43,"slowdown":0.861,"choc":1.559,"seuil2":0.062,"seuil1":0.039,"dt":0.0001,"scale":10,"gridStep":3,"delta2":1,"vit0":100,"pointSize":3,"flamme":0,"lumi":0.08,"alpha":1,"forceMouse":-8000,"seuilMouse":0.15,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.04};
var poto14 = {"fontaine":2,"gravity":0,"force1":5787.5,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.13,"slowdown":0.825,"choc":1.582,"seuil2":0.062,"seuil1":0.576,"dt":0.0002,"scale":200,"gridStep":3,"delta2":1,"vit0":100,"pointSize":2,"flamme":0,"lumi":0.07,"alpha":1,"forceMouse":-8001,"seuilMouse":0.092,"blendf1":"ONE","blendf2":"ONE","angleBase":0.04};
var poto13 = {"fontaine":2,"gravity":0,"force1":0,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.18,"slowdown":0.998,"choc":1.949,"seuil2":0.062,"seuil1":0.038,"dt":0.0001,"scale":100,"gridStep":3,"delta2":1,"vit0":100,"pointSize":3,"flamme":0,"lumi":0.09,"alpha":1,"forceMouse":-800,"seuilMouse":0.001,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.48};
var poto12 = {"fontaine":2,"gravity":0,"force1":560,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.19,"slowdown":1.326,"choc":1.883,"seuil2":0.062,"seuil1":0.046,"dt":0.0001,"scale":100,"gridStep":3,"delta2":1,"vit0":100,"pointSize":3,"flamme":0,"lumi":0.09,"alpha":1,"forceMouse":-18010,"seuilMouse":0.05,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.03};
var pot11={"fontaine":2,"gravity":0,"force1":0,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.19,"slowdown":1.326,"choc":2.,"seuil2":0.062,"seuil1":0.088,"dt":0.0,"scale":255,"gridStep":4,"delta2":1,"vit0":100,"pointSize":2,"flamme":1,"lumi":0.09,"alpha":1,"forceMouse":-18010,"seuilMouse":0.05,"blendf1":"ONE","blendf2":"ONE","angleBase":0.03}
var pot10={"fontaine":2,"gravity":0,"force1":0,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.11,"slowdown":1.326,"choc":2.522,"seuil2":0.062,"seuil1":0.659,"dt":0.0004,"scale":255,"gridStep":3,"delta2":0.85,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.06,"alpha":0.44,"forceMouse":-18010,"seuilMouse":0.05,"blendf1":"ONE","blendf2":"ONE","angleBase":0.45};
var pot9 = {"fontaine":2,"gravity":0,"force1":0,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.1,"slowdown":1.113,"choc":2.32,"seuil2":0.062,"seuil1":0.024,"dt":0.0001,"scale":255,"gridStep":3,"delta2":0.85,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.06,"alpha":0.44,"forceMouse":-800,"seuilMouse":0.001,"blendf1":"ONE","blendf2":"ONE","angleBase":0};
var pot8= {"fontaine":2,"gravity":0,"force1":0,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.12,"slowdown":1.046,"choc":2.118,"seuil2":0.062,"seuil1":0.001,"dt":0.0002,"scale":65,"gridStep":3,"delta2":0.85,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.06,"alpha":0.44,"forceMouse":-800,"seuilMouse":0.001,"blendf1":"ONE","blendf2":"ONE","angleBase":1.08};
var pot7 = {"fontaine":2,"gravity":0,"force1":-800,"force2":800,"force1s":505,"force2s":638,"maxAngle":0.12,"slowdown":1.046,"choc":2.118,"seuil2":0.052,"seuil1":0.026,"dt":0.0002,"scale":65,"gridStep":3,"delta2":0.85,"vit0":1,"pointSize":1,"flamme":0,"lumi":0.06,"alpha":0.44,"forceMouse":-800,"seuilMouse":0.053,"blendf1":"ONE","blendf2":"ONE","angleBase":1.08};
var pot6 = {"fontaine":2,"gravity":0,"force1":-800,"force2":0,"force1s":494,"force2s":0,"maxAngle":0.09,"slowdown":1.253,"choc":2.459,"seuil2":0.767,"seuil1":0.422,"dt":0.0008,"scale":65,"gridStep":3,"delta2":0.41,"vit0":1,"pointSize":3,"flamme":0.41,"lumi":0.98,"alpha":0.63,"forceMouse":-8010,"seuilMouse":0.237,"blendf1":"SRC_COLOR","blendf2":"ONE","angleBase":0.17};
var pot5= {"fontaine":2,"gravity":0,"force1":-800,"force2":0,"force1s":-800,"force2s":0,"maxAngle":0.05,"slowdown":1.253,"choc":2.386,"seuil2":0.767,"seuil1":0.001,"dt":0.0001,"scale":65,"gridStep":3,"delta2":0.41,"vit0":1,"pointSize":5,"flamme":0.46,"lumi":1.71,"alpha":1,"forceMouse":-800,"seuilMouse":0.128,"blendf1":"SRC_COLOR","blendf2":"ONE","angleBase":1.01};
var pot4 = {"fontaine":2,"gravity":0,"force1":681,"force2":0,"force1s":101,"force2s":0,"maxAngle":0.08,"slowdown":1.142,"choc":2.243,"seuil2":0.767,"seuil1":0.055,"dt":0.0001,"scale":35,"gridStep":2,"delta2":0.41,"vit0":1,"pointSize":3,"flamme":0.26,"lumi":1.71,"alpha":1,"forceMouse":-99,"seuilMouse":0.033,"blendf1":"SRC_COLOR","blendf2":"ONE","angleBase":0.39};
var pot3= {"fontaine":2,"gravity":713,"force1":800,"force2":0,"force1s":46,"force2s":0,"maxAngle":0.2,"slowdown":1.057,"choc":1.844,"seuil2":0.935,"seuil1":0.04,"dt":0.0001,"scale":35,"gridStep":2,"delta2":0.41,"vit0":1,"pointSize":5,"flamme":0.26,"lumi":1.71,"alpha":1,"forceMouse":-699,"seuilMouse":0.013,"blendf1":"SRC_COLOR","blendf2":"ONE","angleBase":0.01};
var pot2 = {"fontaine":2,"gravity":0,"force1":327,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.54,"slowdown":0.882,"choc":1.487,"seuil2":0.935,"seuil1":0.04,"dt":0.0005,"scale":3,"gridStep":2,"delta2":1,"vit0":1,"pointSize":2,"flamme":0.72,"lumi":1.14,"alpha":0.51,"forceMouse":-699,"seuilMouse":0.049,"blendf1":"SRC_COLOR","blendf2":"DST_COLOR","angleBase":1.28};
var pot1 = {"fontaine":2,"gravity":0,"force1":-771,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.21,"slowdown":1.094,"choc":2.131,"seuil2":0.935,"seuil1":0.001,"dt":0.0001,"scale":1,"gridStep":3,"delta2":0,"vit0":1,"pointSize":1,"flamme":0.02,"lumi":0.04,"alpha":1,"forceMouse":-8010,"seuilMouse":0.126,"blendf1":"ONE","blendf2":"ONE","angleBase":0};
var potz = {"fontaine":2,"gravity":0,"force1":17719,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.21,"slowdown":1,"choc":2,"seuil2":0.065,"seuil1":0.067,"dt":0.0001,"scale":1,"gridStep":3,"delta2":0.47,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.04,"alpha":0.33,"forceMouse":-8010,"seuilMouse":0.126,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0};
var poty = {"fontaine":2,"gravity":-21800,"force1":0,"force2":800,"force1s":0,"force2s":6814,"maxAngle":0.21,"slowdown":1.094,"choc":2.131,"seuil2":0.502,"seuil1":0.237,"dt":0.0001,"scale":6,"gridStep":3,"delta2":0.47,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.04,"alpha":0.33,"forceMouse":-8010,"seuilMouse":0.126,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0};
var potx ={"fontaine":1,"gravity":0,"force1":8001,"force2":80011,"force1s":0,"force2s":80011,"maxAngle":0.05,"slowdown":0.919,"choc":1.792,"seuil2":0.649,"seuil1":0.891,"dt":0.0001,"scale":12,"gridStep":2,"delta2":0.7,"vit0":1,"pointSize":1,"flamme":0,"lumi":0.04,"alpha":0.23,"forceMouse":-7138,"seuilMouse":0.046,"blendf1":"ONE","blendf2":"ONE","angleBase":1.62} ;
var potw= {"fontaine":1,"gravity":0,"force1":0,"force2":-712,"force1s":0,"force2s":0,"maxAngle":0.15,"slowdown":1.077,"choc":2.067,"seuil2":0.293,"seuil1":0.415,"dt":0.0008,"scale":6,"gridStep":4,"delta2":0.77,"vit0":1,"pointSize":3,"flamme":0.01,"lumi":0.01,"alpha":0,"forceMouse":-2800,"seuilMouse":0.272,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.39};
var potv = {"alpha":0.03,"lumi":0.06,"flamme":0,"force1":-1800,"force2":0,"gravity":0,"force1s":0,"force2s":0,"forceMouse":-18100,"maxAngle":0.11,"angleBase":4.91,"slowdown":1.105,"choc":2.055,"seuil1":0.001,"seuil2":0.05,"seuilMouse":0.175,"dt":0.0002,"scale":6,"gridStep":2,"delta2":1,"pointSize":3,"vit0":1,"blendf1":"SRC_ALPHA","blendf2":"ONE","fontaine":2};    var potu = {"fontaine":1,"gravity":0,"force1":0,"force2":-712,"force1s":0,"force2s":0,"maxAngle":0.01,"slowdown":1.077,"choc":2.201,"seuil2":0.293,"seuil1":0.415,"dt":0.001,"scale":6,"gridStep":4,"delta2":1,"vit0":1,"pointSize":1,"flamme":0.25,"lumi":0.36,"alpha":0.03,"forceMouse":-190,"seuilMouse":0.245,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.42};
var pott = {"alpha":0.1,"lumi":0.07,"flamme":0,"force1":-523,"force2":0,"gravity":0,"force1s":0,"force2s":618,"forceMouse":-330,"maxAngle":0.1,"angleBase":0.36,"slowdown":1.107,"choc":2.167,"seuil1":0.131,"seuil2":0.305,"seuilMouse":0.004,"dt":0.0003,"scale":10,"gridStep":2,"delta2":0.73,"pointSize":1,"vit0":1,"blendf1":"SRC_ALPHA","blendf2":"ONE","fontaine":2};
var pots=   {"alpha":0.1,"lumi":0.08,"flamme":0,"force1":-800,"force2":0,"gravity":0,"force1s":0,"force2s":0,"forceMouse":-355,"maxAngle":0.16,"angleBase":0,"slowdown":1.105,"choc":2.253,"seuil1":0.001,"seuil2":0.05,"seuilMouse":0.04,"dt":0.0007,"scale":6,"gridStep":2,"delta2":1,"pointSize":3,"vit0":1,"blendf1":"SRC_ALPHA","blendf2":"ONE","fontaine":2};
var potr = {"fontaine":2,"gravity":-8100,"force1":363,"force2":0,"force1s":-800,"force2s":0,"maxAngle":0.03,"slowdown":1.131,"choc":2.306,"seuil2":0.154,"seuil1":0.001,"dt":0.0005,"scale":6,"gridStep":2,"delta2":1,"vit0":1,"pointSize":2,"flamme":0,"lumi":0.06,"alpha":0.03,"forceMouse":-800,"seuilMouse":0.005,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":1.75};
var potq = {"fontaine":1,"gravity":-8100,"force1":461,"force2":0,"force1s":-800,"force2s":0,"maxAngle":0.03,"slowdown":1.265,"choc":3,"seuil2":0.154,"seuil1":0.04,"dt":0.001,"scale":6,"gridStep":2,"delta2":1,"vit0":1,"pointSize":1,"flamme":0.25,"lumi":0.06,"alpha":0.03,"forceMouse":-353,"seuilMouse":0.089,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":2.76};
var potp ={"fontaine":1,"gravity":0,"force1":0,"force2":691,"force1s":0,"force2s":-800,"maxAngle":0.54,"slowdown":1.004,"choc":2.029,"seuil2":0.013,"seuil1":0.068,"dt":0.0008,"scale":6,"gridStep":2,"delta2":0.43,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.06,"alpha":0.03,"forceMouse":0,"seuilMouse":0.089,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.09}; 
var potn = {"fontaine":1,"gravity":0,"force1":0,"force2":800,"force1s":0,"force2s":2800,"maxAngle":0.04,"slowdown":1.011,"choc":2.02,"seuil2":0.073,"seuil1":0.415,"dt":0.0004,"scale":6,"gridStep":2,"delta2":1,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.06,"alpha":0.03,"forceMouse":0,"seuilMouse":0.089,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":4.36};
var potm = {"fontaine":1,"gravity":0,"force1":0,"force2":800,"force1s":-419,"force2s":0,"maxAngle":0.04,"slowdown":1.011,"choc":2.02,"seuil2":0.154,"seuil1":0.415,"dt":0.0013,"scale":6,"gridStep":2,"delta2":1,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.06,"alpha":0.03,"forceMouse":0,"seuilMouse":0.089,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":4.36};
var potl = {"fontaine":1,"gravity":0,"force1":754,"force2":0,"force1s":-800,"force2s":0,"maxAngle":0.07,"slowdown":1.265,"choc":2.62,"seuil2":0.154,"seuil1":0.165,"dt":0.0008,"scale":6,"gridStep":2,"delta2":1,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.06,"alpha":0.03,"forceMouse":-353,"seuilMouse":0.089,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.44};
var potk = {"fontaine":1,"gravity":0,"force1":754,"force2":0,"force1s":-800,"force2s":0,"maxAngle":0.04,"slowdown":1.265,"choc":2.5,"seuil2":0.154,"seuil1":0.729,"dt":0.0008,"scale":6,"gridStep":2,"delta2":1,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.06,"alpha":0.03,"forceMouse":0,"seuilMouse":0.089,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.46};
var potj= {"fontaine":1,"gravity":0,"force1":754,"force2":0,"force1s":-800,"force2s":0,"maxAngle":0.04,"slowdown":1.265,"choc":2.5,"seuil2":0.154,"seuil1":0.062,"dt":0.0003,"scale":6,"gridStep":2,"delta2":1,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.06,"alpha":0.03,"forceMouse":0,"seuilMouse":0.089,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.46};
var poti = {"fontaine":1,"gravity":0,"force1":471,"force2":0,"force1s":-419,"force2s":0,"maxAngle":0.04,"slowdown":1.011,"choc":2.02,"seuil2":0.154,"seuil1":0.415,"dt":0.0013,"scale":10,"gridStep":3,"delta2":1,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.06,"alpha":0.03,"forceMouse":0,"seuilMouse":0.089,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":4.36};
var poth = {"fontaine":1,"gravity":0,"force1":471,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.04,"slowdown":1.011,"choc":2.02,"seuil2":0.154,"seuil1":0.005,"dt":0.0011,"scale":10,"gridStep":2,"delta2":1,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.03,"alpha":0.05,"forceMouse":0,"seuilMouse":0.089,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.68};
var potg = {"fontaine":1,"gravity":0,"force1":-523,"force2":716,"force1s":0,"force2s":0,"maxAngle":0.04,"slowdown":1.152,"choc":2.154,"seuil2":0.049,"seuil1":0.722,"dt":0.0004,"scale":21,"gridStep":2,"delta2":1,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.46,"alpha":0.19,"forceMouse":-711,"seuilMouse":0.089,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.96};
var potf = {"fontaine":1,"gravity":0,"force1":-523,"force2":478,"force1s":0,"force2s":0,"maxAngle":0.04,"slowdown":1.152,"choc":2.154,"seuil2":0.416,"seuil1":0.722,"dt":0.0006,"scale":10,"gridStep":2,"delta2":1,"vit0":1,"pointSize":3,"flamme":0,"lumi":0.25,"alpha":0.21,"forceMouse":-711,"seuilMouse":0.089,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.96};
var pote = {"fontaine":1,"gravity":0,"force1":97,"force2":382,"force1s":0,"force2s":0,"maxAngle":1,"slowdown":1.038,"choc":2.154,"seuil2":0.416,"seuil1":0.018,"dt":0.0005,"scale":7,"gridStep":2,"delta2":1,"vit0":1,"pointSize":1,"flamme":0,"lumi":1,"alpha":1,"forceMouse":-8000,"seuilMouse":0.511,"blendf1":"ONE","blendf2":"ZERO","angleBase":0.96};
var potd = {"fontaine":1,"gravity":0,"force1":87,"force2":-33,"force1s":0,"force2s":0,"maxAngle":1,"slowdown":1.084,"choc":2.015,"seuil2":0.101,"seuil1":0.013,"dt":0.0004,"scale":5,"gridStep":3,"delta2":0.55,"vit0":1,"pointSize":3,"flamme":1,"lumi":1.41,"alpha":0.08,"forceMouse":-8000,"seuilMouse":0.511,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":2.64};
var potc = {"fontaine":1,"gravity":0,"force1":0,"force2":-245,"force1s":0,"force2s":0,"maxAngle":0.13,"slowdown":0.972,"choc":2.006,"seuil2":0.502,"seuil1":0.232,"dt":0.0011,"scale":10,"gridStep":3,"delta2":0.74,"vit0":1,"pointSize":1,"flamme":1,"lumi":1,"alpha":1,"forceMouse":-546,"seuilMouse":0.154,"blendf1":"SRC_ALPHA","blendf2":"ONE","angleBase":0.73};
var potb = {"fontaine":1,"gravity":0,"force1":0,"force2":546,"force1s":-2,"force2s":0,"maxAngle":5.71,"slowdown":0.972,"choc":2,"seuil2":0.135,"seuil1":0.445,"dt":0.0008,"scale":10,"gridStep":3,"delta2":0.74,"vit0":1,"pointSize":1,"flamme":1,"lumi":1,"alpha":1,"forceMouse":0,"seuilMouse":0.154,"blendf1":"SRC_ALPHA","blendf2":"ONE"};
var pota = {"force1":-800,"force2":-1,"force1s":800.6,"force2s":0,"maxAngle":0.61,"slowdown":1,"choc":2,"seuil2":0.135,"seuil1":0.492,"dt":0.0008,"scale":10,"gridStep":3,"delta2":0.17,"vit0":1,"pointSize":1,"flamme":1,"lumi":1,"alpha":1,"forceMouse":-579,"seuilMouse":0.061,"blendf1":"SRC_ALPHA","blendf2":"ONE"};
potb  = {"gravity":-800,"force1":10,"force2":0,"force1s":0,"force2s":0,"maxAngle":0.03,"slowdown":1.056,"choc":2.14,"seuil2":0.154,"seuil1":0.001,"dt":0.0005,"scale":6,"gridStep":2,"delta2":1,"vit0":1,"pointSize":0,"flamme":0,"lumi":1.06,"alpha":0.46,"forceMouse":800,"seuilMouse":0.485,"blendf1":"ONE","blendf2":"ONE","angleBase":2.76};

var poto= poto18;
poto.force1 = 0;
poto.collisionMax = 4;
poto.maxAngle=0.02;
poto.scale=6;



canvas.addEventListener('mouseup', function(ev) {  click = 0;}, false);
canvas.addEventListener('mousemove',
    function (ev) {
                    if (click) {
                        let pos = getNoPaddingNoBorderCanvasRelativeMousePosition(ev, gl.canvas);
                        mouseX = pos.x / gl.canvas.width * 2 - 1;
                        mouseY = pos.y / gl.canvas.height * -2 + 1;
                    }
    },
    false);

canvas.addEventListener(
    'mousedown',
    function (ev) {
        let pos = getNoPaddingNoBorderCanvasRelativeMousePosition(ev, gl.canvas);
        mouseX = pos.x / gl.canvas.width * 2 - 1;
        mouseY = pos.y / gl.canvas.height * -2 + 1;
        click = 1 ;
                

    }, 
    false);



document.addEventListener("DOMContentLoaded", ecouteurGUI);

function ecouteurGUI() {
    sCB = document.getElementById( 'start-capturing-button' );
    dVB = document.getElementById( 'download-video-button' );
    sCB.addEventListener( 'click', function( e ) {
        let framerate = 30;

        capturer = new CCapture( {
                verbose: true,
                display: true,
                framerate: framerate,
                //motionBlurFrames: ( 960 / framerate ) * ( document.querySelector('input[name="motion-blur"]').checked ? 1 : 0 ),
                quality: 99,
                format: 'webm',
                timeLimit: 0,
                frameLimit: 0,
                autoSaveTime: 0         
        } );

        capturer.start();
        e.preventDefault();
    }, false );

    dVB.addEventListener( 'click', function( e ) {
            capturer.stop();
            capturer.save();
            capturer=null;
    }, false );

    DOM_LOADED_AND_LISTENING();
}



function hidegui() {
        document.getElementById("gui").style.display = "none";
        document.getElementById("showgui").style.display = "initial";
        document.getElementById("hidegui").style.display = "none";}

function showgui() {
        document.getElementById("gui").style.display = "initial";
        document.getElementById("showgui").style.display = "none";
        document.getElementById("hidegui").style.display = "initial";}

/// alpha
function alphaCurseur(val) {
        poto.alpha = val;
        document.getElementById("alphaText").value = val;}
function alphaText(val) {
        poto.alpha  = val;
        document.getElementById("alphaCurseur").value = val;}
function alpha_up(step,d,sens) {
        poto.alpha = +(poto.alpha + step*sens).toFixed(d);
        document.getElementById("alphaCurseur").value=poto.alpha;
        document.getElementById("alphaText").value=poto.alpha;}

/// lumi
function lumiCurseur(val) {
        poto.lumi = val;
        document.getElementById("lumiText").value = val;}
function lumiText(val) {
        poto.lumi  = val;
        document.getElementById("lumiCurseur").value = val;}
function lumi_up(step,d,sens) {
        poto.lumi = +(poto.lumi + step*sens).toFixed(d);
        document.getElementById("lumiCurseur").value=poto.lumi;
        document.getElementById("lumiText").value=poto.lumi;}

/// flamme
function flammeCurseur(val) {
        poto.flamme = val;
        document.getElementById("flammeText").value = val;}
function flammeText(val) {
        poto.flamme  = val;
        document.getElementById("flammeCurseur").value = val;}
function flamme_up(step,d,sens) {
        poto.flamme = +(poto.flamme + step*sens).toFixed(d);
        document.getElementById("flammeCurseur").value=poto.flamme;
        document.getElementById("flammeText").value=poto.flamme;}

/// force1
function force1Curseur(val) {
        poto.force1 = val;
        document.getElementById("force1Text").value = val;}
function force1Text(val) {
        poto.force1  = val;
        document.getElementById("force1Curseur").value = val;}
function force1_up(step,d,sens) {
        poto.force1 = +(poto.force1 + step*sens).toFixed(d);
        document.getElementById("force1Curseur").value=poto.force1;
        document.getElementById("force1Text").value=poto.force1;}
function resetForce1() {
        document.getElementById("force1Text").value = 0;
        document.getElementById("force1Curseur").value = 0;
        poto.force1 = 0;}

/// force2
function force2Curseur(val) {
        poto.force2 = val;
        document.getElementById("force2Text").value = val;}
function force2Text(val) {
        poto.force2 = val;
        document.getElementById("force2Curseur").value = val;}
function force2_up(step,d,sens) {
        poto.force2 = +(poto.force2 + step*sens).toFixed(d);
        document.getElementById("force2Curseur").value=poto.force2;
        document.getElementById("force2Text").value=poto.force2;}
function resetForce2() {
        document.getElementById("force2Text").value = 0;
        document.getElementById("force2Curseur").value = 0;
        poto.force2 = 0;}

/// gravity
function gravityCurseur(val) {
        poto.gravity = val;
        document.getElementById("gravityText").value = val;}
function gravityText(val) {
        poto.gravity = val;
        document.getElementById("gravityCurseur").value = val;}
function resetGravity() {
        document.getElementById("gravityCurseur").value = 0;
        document.getElementById("gravityText").value = 0;
        poto.gravity = 0;}

/// force1s
function force1sCurseur(val) {
        poto.force1s = val;
        document.getElementById("force1sText").value = val;}
function force1sText(val) {
        poto.force1s  = val;
        document.getElementById("force1sCurseur").value = val;}
function force1s_up(step,d,sens) {
        poto.force1s = +(poto.force1s + step*sens).toFixed(d);
        document.getElementById("force1sCurseur").value=poto.force1s;
        document.getElementById("force1sText").value=poto.force1s;}
function resetForce1s() {
        document.getElementById("force1sText").value = 0;
        document.getElementById("force1sCurseur").value = 0;
        poto.force1s = 0;}

/// force2s
function force2sCurseur(val) {
        poto.force2s = val;
        document.getElementById("force2sText").value = val;}
function force2sText(val) {
        poto.force2s = val;
        document.getElementById("force2sCurseur").value = val;}
function force2s_up(step,d,sens) {
        poto.force2s = +(poto.force2s + step*sens).toFixed(d);
        document.getElementById("force2sCurseur").value=poto.force2s;
        document.getElementById("force2sText").value=poto.force2s;}
function resetForce2s() {
        document.getElementById("force2sText").value = 0;
        document.getElementById("force2sCurseur").value = 0;
        poto.force2s = 0;}

/// forceMouse    
function forceMouseCurseur(val) {
        poto.forceMouse = val;
        document.getElementById("forceMouseText").value = val;}
function forceMouseText(val) {
        poto.forceMouse  = val;
        document.getElementById("forceMouseCurseur").value = val;}
function resetForceMouse() {
        poto.forceMouse = 0;
        document.getElementById("forceMouseText").value = 0;
        document.getElementById("forceMouseCurseur").value = 0;}

/// maxAngle
function maxAngleText(val) {
        poto.maxAngle = val;
        document.getElementById("maxAngleCurseur").value=val;}
function maxAngleCurseur(val) {
        poto.maxAngle = val;
        let f32 = new Float32Array(GRIDX * GRIDY *4);
        for (let k = 0; k < GRIDX * GRIDY; k++) f32[k * 4 + 3] = Math.random() * 6.25 * val;
        let T2 = gl.createTexture();
          gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, T2);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, GRIDX, GRIDY, 0, gl.RGBA, gl.FLOAT, f32);
         gl.bindFramebuffer(gl.FRAMEBUFFER, fbT2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T2, 0);
        document.getElementById("maxAngleText").value=val;}

/// angleBase
function angleBaseText(val) {
        poto.angleBase = val;
        document.getElementById("angleBaseCurseur").value=val;}
function angleBaseCurseur(val) {
        poto.angleBase = val;
        document.getElementById("angleBaseText").value=val;}

/// slowdown
function slowdownCurseur(val) {
        poto.slowdown = val;
        document.getElementById("slowdownText").value = val;}
function slowdownText(val) {
        poto.slowdown = val;
        document.getElementById("slowdownCurseur").value = val;}
function slowdown_up(step,d,sens) {
        poto.slowdown = +(poto.slowdown + step*sens).toFixed(d);
        document.getElementById("slowdownText").value=poto.slowdown;
        document.getElementById("slowdownCurseur").value=poto.slowdown;}
function resetSlowdown() {
        document.getElementById("slowdownText").value = 1;
        document.getElementById("slowdownCurseur").value = 1;
        poto.slowdown = 1;}

/// choc
function chocCurseur(val) {
        poto.choc = val;
        document.getElementById("chocText").value = val;}
function chocText(val) {
        poto.choc = val;
        document.getElementById("chocCurseur").value = val;}
function choc_up(step,d,sens) {
        poto.choc = +(poto.choc + step*sens).toFixed(d);
        document.getElementById("chocText").value=poto.choc;
        document.getElementById("chocCurseur").value=poto.choc;}
function resetChoc() {
        document.getElementById("chocCurseur").value = 2;
        document.getElementById("chocText").value = 2;
        poto.choc = 2;}

/// seuil1
function seuil1Curseur(val) {
        poto.seuil1 = val;
        document.getElementById("seuil1Text").value = val;}
function seuil1Text(val) {
        poto.seuil1 = val;
        document.getElementById("seuil1Curseur").value = val;}

/// seuil2
function seuil2Curseur(val) {
        poto.seuil2 = val;
        document.getElementById("seuil2Text").value = val;}
function seuil2Text(val) {
        poto.seuil2 = val;
        document.getElementById("seuil2Curseur").value = val;}

/// seuilMouse
function seuilMouseCurseur(val) {
        poto.seuilMouse = val;
        document.getElementById("seuilMouseText").value = val;}
function seuilMouseText(val) {
        poto.seuilMouse= val;
        document.getElementById("seuilMouseCurseur").value = val;}

/// dt

function dtCurseur(val) {
        poto.dt = val;
        document.getElementById("dtText").value = val;}
function dtText(val) {
        poto.dt = val;
        document.getElementById("dtCurseur").value = val;}

/// scale
function scale_up(step,d,sens) {
        poto.scale = +(poto.scale + step*sens).toFixed(d);
        document.getElementById("scaleText").value=poto.scale;
        cancelAnimationFrame(req);
        DOM_LOADED_AND_LISTENING();}

/// gridStep
function grid_up(step,d,sens) {
          //  document.location.reload(true);

        poto.gridStep = +(poto.gridStep + step*sens).toFixed(d);
        document.getElementById("gridStepText").value=poto.gridStep;
        cancelAnimationFrame(req);
        req=undefined;
        DOM_LOADED_AND_LISTENING();}

/// delta2
function delta2Text(val) {
        poto.delta2 = val;
        document.getElementById("delta2Curseur").value = val;
}
function delta2Curseur(val) {
        poto.delta2 = val;
        document.getElementById("delta2Text").value = val;}

/// pointSize
function pointSize_up(step,d,sens) {
        poto.pointSize = +(poto.pointSize + step*sens).toFixed(d);
        document.getElementById("pointSizeText").value=poto.pointSize;}

function collisionMaxText(val) {
        poto.collisionMax = val;
        document.getElementById("collisionMaxText").value = val;
}

/// vit0
function vit0Curseur(val) {
        poto.vit0 = val;
        cancelAnimationFrame(req);
        efface();
        DOM_LOADED_AND_LISTENING();
}

/// blender
function blend1() { poto.blendf1 = document.getElementById("blend1").value;}
function blend2() { poto.blendf2 = document.getElementById("blend2").value;}


/// preset
function menuPreset() {
    var x = document.getElementById("menuPreset").value;
    if (x=="potj") poto = potj;
    if (x=="potk") poto = potk;
    if (x=="potl") poto = potl;
    if (x=="potm") poto = potm;
    if (x=="potn") poto = potn;
    if (x=="potp") poto = potp;
    if (x=="potq") poto = potq;
    if (x=="potr") poto = potr;
    if (x=="pots") poto = pots;
    if (x=="pott") poto = pott;
    if (x=="potu") poto = potu;
    if (x=="potv") poto = potv;
    if (x=="potw") poto = potw;
    initparamgui();}

/// Backup parameters
function backuparam() {console.log(JSON.stringify(poto));}


function efface() {
    fbT1=undefined;
    fbT3=undefined;
    fbT5=undefined;
    fbT2=undefined ;
    //swap =null;
    //gl=null;
    afficheurShader=undefined;
    main2Shader=undefined;
    copieShader=undefined;
    gridShader=undefined;
    copyShader=undefined;
    fastCopyShader=undefined;
    afficheurFullQuadShader=undefined;
    positionTex=undefined;
    positionFastCopy=undefined;
    positionAfficheurFullQuadShader=undefined ;
    fond=undefined;
    CSW=undefined;
    CSH=undefined;
    PVS=undefined;
    GRIDX=undefined;
    GRIDY=null;
    logout=null;
    realToCSSPixels=null ;
    img=undefined ;
    img2 =undefined;
    visage=undefined;
    texte =undefined;
    req = undefined;
}



function DOM_LOADED_AND_LISTENING() {
    loaded=0;
    compteur = 0;
    logout = false;
    mousedown = false;
    NBRE = 0;
    realToCSSPixels = 2;
    click = 0;
    mouseX = 0;
    mouseY = 0;
    img = new Image();
    img2 = new Image();
    visage = new Image();
    texte = new Image();

      
    initparamgui();
 
    fond= { r: 0, v: 0, b: 0, a:0};
     //fond ={ r: 255, v: 255, b: 255,a:255};

    img.onload = function() { loaded++;};
    img2.onload = function() { loaded++;};
    visage.onload = function() { loaded++;};
    texte.onload = function() { loaded++;};

    img.src="cecile.png";
    img2.src="a.png";
    visage.src="mh1.png";
    texte.src="mh2.png";

    function checkLoaded() {
        if (loaded>=4) start();
        else setTimeout(checkLoaded,100);
    }
    setTimeout(checkLoaded,100);

} 

function start() {

    CSW = img.width;
    CSH = img.height;

    canvas.width = CSW;
    canvas.height = CSH;

    canvas.style.width = CSW /2+ 'px';
    canvas.style.height = CSH /2+ 'px';

    var tempoCanvas = document.createElement("canvas");

    tempoCanvas.width = CSW;
    tempoCanvas.height = CSH;

    //tempoCanvas.style.width = CSW + 'px';
    //tempoCanvas.style.height = CSH + 'px';

    var tempctx = tempoCanvas.getContext("2d", {
        antialias: false,
        depth: false,
        alpha: false,
        premultipliedAlpha: false
    });

    gl = canvas.getContext("webgl", {
            antialias: false,
            depth: false,
            alpha: false,
            stencil: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false
        }) ;

  
    ext1 = gl.getExtension("OES_texture_float");
    ext4 = gl.getExtension("EXT_color_buffer_float");


    // var pvFloat32,pvFloat32_Shuffle,image2Float32,image2Float32_Shuffle,colorUint;
    var pvFloat32=[];
    var pvFloat32_Shuffle=[];
    var image2Float32=[];
    var image2Float32_Shuffle=[];
    var colorUint=[];

    var x={};
    init2(tempctx,pvFloat32,pvFloat32_Shuffle,image2Float32,image2Float32_Shuffle,colorUint) ;

    //  pvFloat32=  x.pvFloat32;
    //  pvFloat32_Shuffle=   x.pvFloat32_Shuffle;
    //  image2Float32 = x.image2Float32 ;
    //  image2Float32_Shuffle = x.image2Float32_Shuffle ;
    // colorUint = x.colorUint ;
    pvFloat32 = new Float32Array(pvFloat32);
    pvFloat32_Shuffle = new Float32Array(pvFloat32_Shuffle);
    image2Float32 = new Float32Array(image2Float32);
    image2Float32_Shuffle = new Float32Array(image2Float32_Shuffle);
    colorUint = new Uint8Array(colorUint);


    var textureGeometry = [];
    var glGeometry = [];

    for (let k = 0; k < NBRE; k++) {

        let i= k % PVS;
        let j= Math.floor( k / PVS);

        textureGeometry.push(i, j);

        let x = (2 * i + 1) / PVS - 1;
        let y = (2 * j + 1) / PVS - 1;

        glGeometry.push(x, y);

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


    afficheurShader = compilink('afficheur');
    gridShader = compilink('grid');
    main2Shader = compilink('main2');
    fastCopyShader = compilink('fastCopy');



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
    main2Shader.PVS =               gl.getUniformLocation(main2Shader, "PVS");
    main2Shader.maxAngle =          gl.getUniformLocation(main2Shader, "maxAngle");
    main2Shader.angleBase =         gl.getUniformLocation(main2Shader, "angleBase");
    main2Shader.gridSize =          gl.getUniformLocation(main2Shader, "gridSize");
    main2Shader.image1 =            gl.getUniformLocation(main2Shader, "image1");
    main2Shader.image2 =            gl.getUniformLocation(main2Shader, "image2");
    main2Shader.image1s =           gl.getUniformLocation(main2Shader, "image1s");
    main2Shader.image2s =           gl.getUniformLocation(main2Shader, "image2s");
    main2Shader.dt =                gl.getUniformLocation(main2Shader, "dt");
    main2Shader.mouseCoords =       gl.getUniformLocation(main2Shader, "mouseCoords");
    main2Shader.click =             gl.getUniformLocation(main2Shader, "click");
    main2Shader.force2 =            gl.getUniformLocation(main2Shader, "force2");
    main2Shader.force1 =            gl.getUniformLocation(main2Shader, "force1");
    main2Shader.gravity =           gl.getUniformLocation(main2Shader, "gravity");
    main2Shader.force2s =           gl.getUniformLocation(main2Shader, "force2s");
    main2Shader.force1s =           gl.getUniformLocation(main2Shader, "force1s");
    main2Shader.forceMouse =        gl.getUniformLocation(main2Shader, "forceMouse");
    main2Shader.slowdown =          gl.getUniformLocation(main2Shader, "slowdown");
    main2Shader.seuil2 =            gl.getUniformLocation(main2Shader, "seuil2");
    main2Shader.seuil1 =            gl.getUniformLocation(main2Shader, "seuil1");
    main2Shader.seuilMouse =        gl.getUniformLocation(main2Shader, "seuilMouse");
    main2Shader.PVS =               gl.getUniformLocation(main2Shader, "PVS");
    main2Shader.fontaine =          gl.getUniformLocation(main2Shader, "fontaine");
    main2Shader.collisionMax =      gl.getUniformLocation(main2Shader, "collisionMax");


    fastCopyShader.position =   gl.getAttribLocation(fastCopyShader,"position");
    fastCopyShader.pvTex =          gl.getUniformLocation(fastCopyShader,"image");
    fastCopyShader.PVS =            gl.getUniformLocation(fastCopyShader,"PVS");


    var T1,T2,T3,T5,T6;


    var T0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, T0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.UNSIGNED_BYTE, colorUint);
    //deletedeb
    /*
    gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T0, 0);
    var pixels = new Uint8Array(4 * PVS * PVS);
    gl.readPixels(0, 0, PVS, PVS, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    console.log("dump TEXTURE0 :");
    console.log(pixels);
    */
    //deletefin

    // T1
    T1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, T1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, pvFloat32);
    //webgl1        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, PVS, PVS, 0, gl.RGBA, gl.FLOAT, pvFloat32);



    // T2
    T2 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, T2);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    let f32 = new Float32Array(GRIDX * GRIDY *4);
    for (let k = 0; k < GRIDX * GRIDY; k++) f32[k * 4 + 3] = Math.random() * 6.25 * poto.maxAngle;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, GRIDX, GRIDY, 0, gl.RGBA, gl.FLOAT, f32);

    //gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,GRIDX,GRIDY);
    //gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, GRIDX,GRIDY, gl.RGBA, gl.FLOAT,f32);

    // T3
    T3 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, T3);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    f32 = new Float32Array(PVS * PVS * 4);
    for (let k = 0; k < PVS * PVS * 4; k++) f32[k ] = -2;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, f32);
    // webgl2 gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, PVS, PVS, 0, gl.RGBA, gl.FLOAT, null);

    // T4
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, pvFloat32_Shuffle);
    //gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,PVS,PVS);
    //gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, PVS,PVS, gl.RGBA, gl.FLOAT,Float32_imageDepart);


    T5 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, T5);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    f32 = new Float32Array(PVS * PVS * 4);
    for (let k = 0; k < PVS * PVS * 4; k++) f32[k ] = -2;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, f32);
    //webgl2 gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,PVS,PVS);


    T6 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, T6);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, null);
    // webgl2 gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,PVS,PVS);



    gl.activeTexture(gl.TEXTURE8);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, pvFloat32);

    gl.activeTexture(gl.TEXTURE7);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, image2Float32);
    //gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA32F,PVS,PVS);
    //gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, PVS,PVS, gl.RGBA, gl.FLOAT,Float32_imageArrivee);

    gl.activeTexture(gl.TEXTURE9);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PVS, PVS, 0, gl.RGBA, gl.FLOAT, image2Float32_Shuffle);


    fbT1 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT1);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T1, 0);

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5") console.log("fbT1 is complete"); else console.log("fbT1 is NOT complete");

    fbT2 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T2, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5") console.log("fbT2 is complete"); else console.log("fbT2 is NOT complete");

    fbT3 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT3);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T3, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5") console.log("fbT3 is complete"); else console.log("fbT3 is NOT complete");

    fbT5 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT5);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T5, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5") console.log("fbT5 is complete"); else console.log("fbT5 is NOT complete");


    gl.disable(gl.BLEND);

    swap= true;
    if (!req) {req =window.requestAnimationFrame(animate);}


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


function dump(a, b) {

    var pixels = new Float32Array(4 * a * b);
    //pixels = new Uint8Array(a*b*4*4);

    gl.readPixels(0, 0, a, b, gl.RGBA, gl.FLOAT, pixels);

  //  for (i=0 ; i < pixels.length/4; i++) {
    let i=0;
while (i < pixels.length/4 && pixels[i*4+2]==0) ++i;
if (i  == pixels.length/4)  return;
        console.log(pixels[i*4+0].toFixed(4)+ " , "+pixels[i*4+1].toFixed(4)+ " , "+pixels[i*4+2].toFixed(4)+ " , "+pixels[i*4+3].toFixed(4));
    
    
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



function colcod(r,v,b) {
    return decimalToHex(r)+decimalToHex(v)+decimalToHex(b);
}

function adm(e,da,map) { if (map.has(e)) (map.get(e)).push(da); else map.set(e,[da]); }

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
    while (hex.length < padding) hex = "0" + hex;
    return hex;
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
    dataFin= fin;
  }

  return {depart:dataDepart , fin:dataFin};
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




function animate(timestamp) {



    var TEXTURE_UNIT_pv = 3;
    var framebuffer = fbT1;
    var fbOrig = fbT3;

    if (swap) {
        TEXTURE_UNIT_pv = 1;
        framebuffer = fbT3;
        fbOrig = fbT1;
    }



    /// AFFICHEUR // ************************************************************
    /// AFFICHEUR // ************************************************************
    /// AFFICHEUR // ************************************************************
    gl.useProgram(afficheurShader);

    gl.enableVertexAttribArray(afficheurShader.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    gl.vertexAttribPointer(afficheurShader.position, 2, gl.UNSIGNED_SHORT, false, 0, 0);


    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.enable(gl.BLEND);



    gl.blendFunc(gl[poto.blendf1], gl[poto.blendf2]);
    
    gl.clearColor(fond.r / 255, fond.v / 255, fond.b / 255, fond.a / 255);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, CSW, CSH);

    gl.uniform1i(afficheurShader.PVS       , PVS );
    gl.uniform1i(afficheurShader.pvTex     , TEXTURE_UNIT_pv ); // 1er tour vaut 1, 2e tour vaut 3
    gl.uniform1f(afficheurShader.pointSize , poto.pointSize);
    gl.uniform1f(afficheurShader.delta2    , poto.delta2);
    gl.uniform1f(afficheurShader.alpha     , poto.alpha);
    gl.uniform1f(afficheurShader.lumi      , poto.lumi);
    gl.uniform1f(afficheurShader.flamme    , poto.flamme);
    gl.uniform2f(afficheurShader.resolution, CSW, CSH);
    gl.uniform1i(afficheurShader.mapColor , 0 );

    gl.drawArrays(gl.POINTS, 0, NBRE);

    gl.disable(gl.BLEND);   


    if (logdump) {

        if (swap) console.log("T1 avant copie "); else console.log("T3 avant copie"); 
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbTx);
        if (swap)
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T1, 0);
        else
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T3, 0);
        dump(PVS,PVS);
    }
    



    /// GRID // ************************************************************
    /// GRID // ************************************************************
    /// GRID // ************************************************************
    gl.useProgram(gridShader);

    gl.enableVertexAttribArray(gridShader.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    gl.vertexAttribPointer(gridShader.position, 2, gl.UNSIGNED_SHORT, false, 0, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT2); // T5 => T2
            console.log("T2 avant grid");

     //  dump(GRIDX,GRIDY);

    if (logdump) {
        console.log("T2 avant grid");
        dump(GRIDX,GRIDY);
    }

    gl.clearColor(0, 0, 0, 0);
    gl.colorMask(true, true, true, false);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, GRIDX, GRIDY);

    gl.uniform1i(gridShader.PVS, PVS);
    gl.uniform1i(gridShader.pvTex, TEXTURE_UNIT_pv);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    gl.drawArrays(gl.POINTS, 0, NBRE);

    gl.disable(gl.BLEND);
    gl.colorMask(true, true, true, true);
        console.log("T2 après grid");
     //   dump(GRIDX,GRIDY);
      //  dump(GRIDX,GRIDY);

//return;


    /// MAIN2 // ************************************************************
    /// MAIN2 // ************************************************************
    /// MAIN2 // ************************************************************
    gl.useProgram(main2Shader);

    gl.enableVertexAttribArray(main2Shader.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    gl.vertexAttribPointer(main2Shader.position, 2, gl.UNSIGNED_SHORT, false, 0, 0);


    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); // 5 = > T3 puis T1

    gl.viewport(0, 0, PVS, PVS);

    gl.uniform1i(main2Shader.gridTex, 2);
    gl.uniform1i(main2Shader.pvTex, TEXTURE_UNIT_pv); // 1er tour 1 , 2e tour 3
    gl.uniform1i(main2Shader.PVS, PVS);
    gl.uniform2f(main2Shader.resolution, CSW, CSH);
    gl.uniform2f(main2Shader.gridSize, GRIDX, GRIDY);
    gl.uniform1f(main2Shader.choc, poto.choc);
    gl.uniform1f(main2Shader.maxAngle,poto.maxAngle);
    gl.uniform1f(main2Shader.angleBase,poto.angleBase);
        // 8= image de départ
    // 7 = image d'arrivee
    // 4 = image de départ mélangée
     // 9 = immage2 mélangée
    gl.uniform1i(main2Shader.image1, 8); 
    gl.uniform1i(main2Shader.image2, 7); 
   // gl.uniform1i(main2Shader.image3, 8); 

    gl.uniform1i(main2Shader.image1s, 4); 
    gl.uniform1i(main2Shader.image2s, 9); 
    gl.uniform1f(main2Shader.dt, poto.dt);
    gl.uniform1i(main2Shader.PVS, PVS);
    gl.uniform2f(main2Shader.mouseCoords, mouseX, mouseY);
    gl.uniform1i(main2Shader.click, click);
    gl.uniform1f(main2Shader.force2, poto.force2);
    gl.uniform1f(main2Shader.force1, poto.force1);
    gl.uniform1f(main2Shader.gravity, poto.gravity);
    gl.uniform1f(main2Shader.force2s, poto.force2s);
    gl.uniform1f(main2Shader.force1s, poto.force1s);
    gl.uniform1f(main2Shader.forceMouse, poto.forceMouse);
    gl.uniform1f(main2Shader.slowdown, poto.slowdown);
    gl.uniform1f(main2Shader.seuil2, poto.seuil2);
    gl.uniform1f(main2Shader.seuil1, poto.seuil1);
    gl.uniform1f(main2Shader.seuilMouse, poto.seuilMouse);
    gl.uniform1f(main2Shader.fontaine, poto.fontaine);
    gl.uniform1i(main2Shader.collisionMax, poto.collisionMax);

    gl.drawArrays(gl.POINTS, 0, NBRE);

    //efface
    if (logdump) {
        if (swap) console.log("T3 après main2"); else console.log("T1 après main2"); 
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbTx);
        if (swap)
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T3, 0);
        else
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T1, 0);
        dump(PVS,PVS);
    }

    swap = !swap;
    if( capturer ) capturer.capture( glcanvas );
//delete
compteur++;


//if (compteur < 50) 
   req=requestAnimationFrame(animate);

}

function initparamgui() {

    document.getElementById("blend1").value = poto.blendf1 ;
    document.getElementById("blend2").value = poto.blendf2 ;

    document.getElementById("lumiCurseur").value = poto.lumi ;
    document.getElementById("lumiText").value    = poto.lumi ;

    document.getElementById("alphaCurseur").value = poto.alpha ;
    document.getElementById("alphaText").value =    poto.alpha ;

    document.getElementById("flammeCurseur").value = poto.flamme ;
    document.getElementById("flammeText").value =    poto.flamme ;

    document.getElementById("force1Curseur").value = poto.force1 ;
    document.getElementById("force1Text").value =    poto.force1 ;

    document.getElementById("force2Curseur").value = poto.force2 ;
    document.getElementById("force2Text").value =    poto.force2 ;

    document.getElementById("gravityCurseur").value = poto.gravity ;
    document.getElementById("gravityText").value =    poto.gravity ;


    document.getElementById("force1sCurseur").value = poto.force1s ;
    document.getElementById("force1sText").value =    poto.force1s ;

    document.getElementById("force2sCurseur").value = poto.force2s ;
    document.getElementById("force2sText").value =    poto.force2s ;

    document.getElementById("forceMouseCurseur").value = poto.forceMouse ;
    document.getElementById("forceMouseText").value =    poto.forceMouse ;

    document.getElementById("maxAngleCurseur").value= poto.maxAngle ;
    document.getElementById("maxAngleText").value= poto.maxAngle ;

    document.getElementById("angleBaseCurseur").value= poto.angleBase ;
    document.getElementById("angleBaseText").value= poto.angleBase ;

    document.getElementById("slowdownCurseur").value = poto.slowdown;
    document.getElementById("slowdownText").value = poto.slowdown;

    document.getElementById("chocCurseur").value = poto.choc;
    document.getElementById("chocText").value = poto.choc;

    document.getElementById("seuil2Curseur").value= poto.seuil2;
    document.getElementById("seuil2Text").value= poto.seuil2;

    document.getElementById("seuilMouseCurseur").value= poto.seuilMouse;
    document.getElementById("seuilMouseText").value= poto.seuilMouse;

    document.getElementById("seuil1Curseur").value= poto.seuil1;
    document.getElementById("seuil1Text").value= poto.seuil1;

    document.getElementById("dtCurseur").value = poto.dt;
    document.getElementById("dtText").value =    poto.dt;

    document.getElementById("scaleText").value = poto.scale;

    document.getElementById("gridStepText").value = poto.gridStep;

    document.getElementById("delta2Curseur").value = poto.delta2;
    document.getElementById("delta2Text").value = poto.delta2;

   // document.getElementById("vit0Curseur").value = poto.vit0 ;

    document.getElementById("pointSizeText").valueAsNumber = poto.pointSize;
    document.getElementById("collisionMaxText").valueAsNumber = poto.collisionMax;

}

function init2(tempctx,pvFloat32,pvFloat32_Shuffle,image2Float32,image2Float32_Shuffle,colorUint) {

   // var pvFloat32,pvFloat32_Shuffle,image2Float32,image2Float32_Shuffle,colorUint;

    function lookpix(tab,image) {
        tempctx.fillStyle='rgba('+fond.r+','+fond.v+','+fond.b+',1)';
        tempctx.fillRect(0, 0, CSW, CSH);
        tempctx.drawImage(image, 0, 0);
        //  var lamb = img.height / img.width * CSW / CSH ;
        // var k2 = Math.min(1,1/lamb);
        // var k1 = lamb * k2 ;
        // tempctx.drawImage(img,0, CSH * (1-k1),CSW * k2 ,CSH* k1);

        var rawpix = tempctx.getImageData(0, 0, CSW, CSH).data;
        for (let j = 0; j < CSH; j++) {
            for (let i = 0; i < CSW; i++) {

                let k = (j * CSW + i) * 4;
                let r =     rawpix[k    ] ;
                let v =     rawpix[k + 1] ;
                let b =     rawpix[k + 2] ; 

                if (!( (r == fond.r) && (v == fond.v) && (b == fond.b))) {

                    let l = poto.scale;
                    
                    //tab.push({ x:i , y:j , r:r , v:v , b:b });
                   // let gfe = 0.0001;
                    while (l--) {
                        let gfe = Math.random()*10 + 0.01;
                        let angle = Math.random() * 2 * Math.PI;
                        let xi = i + Math.cos(angle) * gfe;
                        let yi = j + Math.sin(angle) * gfe;
                        tab.push({ x:xi , y:yi , r:r , v:v , b:b });
                    }
                }
            }
        }
    }

   


    var pixcols =[];
    lookpix(pixcols,img);

    var pixcols2 =[];
    lookpix(pixcols2,img);


    var res={};
    res = egalise(pixcols,pixcols2);
    pixcols  = res.depart;
    pixcols2 = res.fin;

    var pixcols2_Shuffle = shuffle(pixcols2);
    var pixcols_Shuffle = shuffle(pixcols);

    NBRE = pixcols.length ;

    PVS = Math.pow(2, Math.ceil(Math.log(Math.ceil(Math.sqrt(NBRE))) / Math.LN2));
    //PVS = Math.ceil(Math.sqrt(NBRE));


    GRIDX= Math.floor(CSW / poto.gridStep);
    GRIDY= Math.floor(CSH / poto.gridStep);


   for (let k=0; k < (PVS*PVS*4) ; k ++) {
        colorUint[k]=0;
        pvFloat32[k]=0;
        pvFloat32_Shuffle[k]=0;
        image2Float32[k]=0;
        image2Float32_Shuffle[k]=0;
   }

    for (let k = 0; k < NBRE; k++) {
 

        let angle = Math.random() * 2 * Math.PI;
        let vx = Math.cos(angle) * poto.vit0;
        let vy = Math.sin(angle) * poto.vit0;


        pvFloat32[k * 4 + 0] = (2 * pixcols[k].x - CSW + 1) / CSW;
        pvFloat32[k * 4 + 1] = (2 * pixcols[k].y - CSH + 1) / -CSH;


        pvFloat32[k * 4 + 2] = vx;
        pvFloat32[k * 4 + 3] = vy;

        pvFloat32_Shuffle[k * 4 + 0] = (2 * pixcols_Shuffle[k].x - CSW + 1) / CSW;
        pvFloat32_Shuffle[k * 4 + 1] = (2 * pixcols_Shuffle[k].y - CSH + 1) / -CSH;

        image2Float32[k * 4 + 0] = (2 * pixcols2[k].x - CSW + 1) / CSW;
        image2Float32[k * 4 + 1] = (2 * pixcols2[k].y - CSH + 1) / -CSH;

        image2Float32_Shuffle[k * 4 + 0] =  (2 * pixcols2_Shuffle[k].x - CSW + 1) / CSW;
        image2Float32_Shuffle[k * 4 + 1] =  (2 * pixcols2_Shuffle[k].y - CSH + 1) / -CSH;
        

        colorUint[k * 4 + 0] = pixcols[k].r;
        colorUint[k * 4 + 1] = pixcols[k].v;
        colorUint[k * 4 + 2] = pixcols[k].b;
        colorUint[k * 4 + 3] = 1;

    }

    /*
    result.pvFloat32 = pvFloat32 ;
    result.pvFloat32_Shuffle = pvFloat32_Shuffle ;
    result.image2Float32 = image2Float32 ;
    result.image2Float32_Shuffle = image2Float32_Shuffle ;
    result.colorUint = colorUint ;
    */
}
