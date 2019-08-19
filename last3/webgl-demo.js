"use strict";


function ecouteurRecord(canvas) {
	//const recorder = new CanvasRecorder(canvas);
	const recorder = new CanvasRecorder(canvas, 145000);

	document.getElementById('recordStart').addEventListener('click',
		_=>{recorder.start();}
		);
	document.getElementById('recordStop').addEventListener('click',
		_=>{
			recorder.stop();
			recorder.save('busy_motion.webm');

		}
		);

}


function CanvasRecorder(canvas, video_bits_per_sec) {
    this.start = startRecording;
    this.stop = stopRecording;
    this.save = download;

    var recordedBlobs = [];
    var supportedType = null;
    var mediaRecorder = null;

    const stream = canvas.captureStream(25);
    if (typeof stream == undefined || !stream) {
        return;
    }

    const video = document.createElement('video');
    video.style.display = 'none';

    function startRecording() {
        let types = [
            "video/webm;codecs=vp9",
            'video/webm,codecs=vp9',
            'video/vp8',
            "video/webm\;codecs=vp8",
            "video/webm\;codecs=daala",
            "video/webm\;codecs=h264",
            "video/mpeg"
        ];

        for (let i in types) {
            if (MediaRecorder.isTypeSupported(types[i])) {
                supportedType = types[i];
                break;
            }
        }
        if (supportedType == null) {
            console.log("No supported type found for MediaRecorder");
        }
        let options = { 
            mimeType: supportedType,
            videoBitsPerSecond: video_bits_per_sec || 2500000 // 2.5Mbps
        };

        recordedBlobs = [];
        try {
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e) {
            alert('MediaRecorder is not supported by this browser.');
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }

        console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
        mediaRecorder.onstop = handleStop;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(2000); // collect 100ms of data blobs
        console.log('MediaRecorder started', mediaRecorder);
    }

    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function handleStop(event) {
        console.log('Recorder stopped: ', event);
        const superBuffer = new Blob(recordedBlobs, { type: supportedType });
        video.src = window.URL.createObjectURL(superBuffer);
    }

    function stopRecording() {
        mediaRecorder.stop();
        console.log('Recorded Blobs: ', recordedBlobs);
        video.controls = true;
    }

    function download(file_name) {
        const name = file_name || 'recording.webm';
        const blob = new Blob(recordedBlobs, { type: supportedType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 1000);
    }
}


function SstartRecording() {
	const canvas = document.getElementById("glcanvas");
  const chunks = []; // here we will store our recorded media chunks (Blobs)
  const stream = canvas.captureStream(60); // grab our canvas MediaStream
  const rec = new MediaRecorder(stream); // init the recorder
  // every time the recorder has new data, we will store it in our array
  //rec.ondataavailable = e => chunks.push(e.data);
  // only when the recorder stops, we construct a complete Blob from all the chunks
  rec.onstop = e => exportVid(new Blob(chunks, {type: 'video/webm'}));
  
 //rec.start();
  //setTimeout(()=>rec.stop(), 60000); // stop recording in 3s
}

function SexportVid(blob) {
  const vid = document.createElement('video');
  vid.src = URL.createObjectURL(blob);
  vid.controls = true;
  document.body.appendChild(vid);
  const a = document.createElement('a');
  a.download = 'myvid.webm';
  a.href = vid.src;
  a.textContent = 'download the video';
  document.body.appendChild(a);
}












//factoriser le bindbuffer
// remplacer image1 par pvTex1 (ou pvTexInit)

const video = document.querySelector('video#webcam');



const qvgaConstraints = { video: { width: 1280, height: 720}  };
const palConstraints =  { video: { width: 352,  height: 288}  };
const fhdConstraints =  { video: { width: 1920, height: 1080} };
const vgaConstraints =  { video: { width: 640, height:  480} };
const defautConstraints =  { video: true };

var webcamConstraints;

var pixels2 , fbEcran; // delete
// pas besoin pour l'instant 
//var ctx ;
var fbT1 , fbT3 , fbT2  ;
var pixT0;

var sobelOutput , textureWebcam;
var swap ;

// canvas
//var canvas;
var recorder;

var traitement;

var gl , gl_Traitement ;

//shader
var afficheurShader , main2Shader , gridShader , sobelShader;

//buffer
var positionTex , vertex_buffer; 

var fond= { r: 0, v: 0, b: 0, a:255};
var CSW , CSH;
var GRIDX,GRIDY;
var NBRE;
var mouseX=0 , mouseY=0 , click , mousedown ;
var req ;
var capturer=null , sCB ,dVB; 
var ext1, ext2,  ext4;
var img , pix;


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
/*
Object.entries(m7).map( ([key, value]) => Object.entries(value).map(  ([key,value]) => {
                                                if ('courante' in value ) {
                                                    value.defaut = value.courante;
                                                    delete value.courante;
                                                }
                                            }
                        )
                );

*/
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
  alpha:        { valeur: {defaut: 1       }  , max: {defaut: 1 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  lumi:         { valeur: {defaut: 1       }  , max: {defaut: 1 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  flamme:       { valeur: {defaut: 1       }  , max: {defaut: 1 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  delta2:       { valeur: {defaut: 1       }  , max: {defaut: 1 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  force:        { valeur: {defaut: 7.31    }  , max: {defaut: 8 }    , min: {defaut: -8 }        , step: {defaut: 0.001 }    },
  gravity:      { valeur: {defaut: 0       }  , max: {defaut: 800 }  , min: {defaut: -800 }      , step: {defaut: 0.001 }    },
  forceMouse:   { valeur: {defaut: -112    }  , max: {defaut: 800 }  , min: {defaut: -800 }      , step: {defaut: 0.001 }    },
  maxAngle:     { valeur: {defaut: 0.68    }  , max: {defaut: 7 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  angleBase:    { valeur: {defaut: 4.37    }  , max: {defaut: 7 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  slowdown:     { valeur: {defaut: 0.985   }  , max: {defaut: 2 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  choc:         { valeur: {defaut: 1.856   }  , max: {defaut: 3 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  seuil:        { valeur: {defaut: 0.56    }  , max: {defaut: 3 }    , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  seuilMouse:   { valeur: {defaut: 0.127   }  , max: {defaut: 3 }    , min: {defaut: 0.00001 }   , step: {defaut: 0.001 }    },
  dt:           { valeur: {defaut: 0.00588 }  , max: {defaut: 0.5 }  , min: {defaut: 0 } ,        step: {defaut: 0.00001 }    },
  collisionMax: { valeur: {defaut: 1       }  , max: {defaut: 1000 } , min: {defaut: 1 }         , step: {defaut: 1 }        },
  vit0:         { valeur: {defaut: 1.1     }  , max: {defaut: 100 }  , min: {defaut: 0 }         , step: {defaut: 0.001 }    },
  pointSize:    { valeur: {defaut: 1       }  , max: {defaut: 10 }   , min: {defaut: 1 }         , step: {defaut: 1 }        },
  blend1:       { valeur: {defaut: "ONE"   }                                                                                  },
  blend2:       { valeur: {defaut: "ONE"   }                                                                                  },
  scale:        { valeur: {defaut: 7       }  , max: {defaut: 500}   , min: {defaut: 1 }         , step: {defaut: 1 }        },
  gridStep:     { valeur: {defaut: 1       }  , max: {defaut: 20 }   , min: {defaut: 1 }         , step: {defaut: 1 }        },            
  uVelocityMax: { valeur: {defaut: 1       }  , max: {defaut: 20 }   , min: {defaut: 0 }         , step: {defaut: 0.01 }     },
  brightness:   { valeur: {defaut: 1       }  , max: {defaut: 1 }    , min: {defaut: -1 }         , step: {defaut: 0.01 }    },
  contrast:     { valeur: {defaut: 1       }  , max: {defaut: 1 }    , min: {defaut: -1 }         , step: {defaut: 0.01 }    },
  saturation:   { valeur: {defaut: 1       }  , max: {defaut: 1}     , min: {defaut: -1 }         , step: {defaut: 0.01 }    },
  resolution:   { valeur: {defaut: 0       }  , max: {defaut: 2 }    , min: {defaut: 0 }      , step: {defaut: 1 }           },
  PVS:          { valeur: {defaut: 512     }  , max: {defaut: 5000 } , min: {defaut: 2 }      , step: {defaut: 1 }           },
  threshold:    { valeur: {defaut: 0       }  , max: {defaut: 1    } , min: {defaut: -1  }     , step: {defaut: 0.01 }       }
           
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

m9.resolution = { valeur: {defaut: 0 }       , max: {defaut: 2 } , min: {defaut: 0 }      , step: {defaut: 1 }     };

var m10 ={"uVelocityMax":{"valeur":{"defaut":15.924},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.073},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.814},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.78},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":588.638},"max":{"defaut":1044},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":441},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-801},"max":{"defaut":80},"min":{"defaut":-801},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.146},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.666},"max":{"defaut":3},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":2.993},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":1.25401},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00149},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"DST_ALPHA"}},"blend2":{"valeur":{"defaut":"DST_ALPHA"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":2},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":2001.878},"max":{"defaut":15011},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.39},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":0.6},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}}} ;

var m11 ={"uVelocityMax":{"valeur":{"defaut":53.128},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.016},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.671},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.84},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.78},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":1795.033},"max":{"defaut":10441},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":441},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-7859.072},"max":{"defaut":80},"min":{"defaut":-8011},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.786},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":2.07},"max":{"defaut":3},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":6.414},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":1.63401},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00051},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":2},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":3},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":2},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":84.211},"max":{"defaut":150},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.39},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":0.6},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}}};


var m12 = {"uVelocityMax":{"valeur":{"defaut":25.433},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.016},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.671},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.84},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.78},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":4900.807},"max":{"defaut":10441},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":1642.289},"max":{"defaut":4411},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-7859.072},"max":{"defaut":80},"min":{"defaut":-8011},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.299},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.607},"max":{"defaut":3},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":3.296},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00044},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":2},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":2},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":397.469},"max":{"defaut":1501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.39},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":0.6},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}}};

var m13 = {"uVelocityMax":{"valeur":{"defaut":44.34},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.932},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.261},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.054},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":5009.675},"max":{"defaut":10441},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":4170.323},"max":{"defaut":4411},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-7859.072},"max":{"defaut":80},"min":{"defaut":-8011},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.372},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.607},"max":{"defaut":3},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":1.543},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00044},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1321.604},"max":{"defaut":1501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.39},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":0.6},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}}};


var m14 = {"uVelocityMax":{"valeur":{"defaut":30.132},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.932},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.261},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.054},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":-1931},"max":{"defaut":10411},"min":{"defaut":-5555},"step":{"defaut":1}},"gravity":{"valeur":{"defaut":4411},"max":{"defaut":4411},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-8011},"max":{"defaut":80},"min":{"defaut":-8011},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.631},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.121},"max":{"defaut":3},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":1.642},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":0.16001},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.0003},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1263.261},"max":{"defaut":15011},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.19},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":0.67},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}}};


m14.PVS= { valeur: {defaut: 512 }       , max: {defaut: 5000 } , min: {defaut: 2 }      , step: {defaut: 1 }     };
m13.PVS= { valeur: {defaut: 512 }       , max: {defaut: 5000 } , min: {defaut: 2 }      , step: {defaut: 1 }     };


var m15 ={"uVelocityMax":{"valeur":{"defaut":4.474},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.747},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.597},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.168},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":2870.109},"max":{"defaut":10441},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":505.381},"max":{"defaut":4411},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-7689.4},"max":{"defaut":80},"min":{"defaut":-8011},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.539},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":0.809},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":2.769},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":2.99901},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00145},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":2},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE_MINUS_SRC_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":2},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":836.535},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.39},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":0.6},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":512},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}} ;
var m16={"uVelocityMax":{"valeur":{"defaut":25.834},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.941},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.807},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.088},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":10441},"max":{"defaut":10441},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":4411},"max":{"defaut":4411},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-80111},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.246},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.112},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":8.872},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":2.36601},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00026},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":41},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"SRC_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":491.063},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.72},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":0.98},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.93},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.75},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":512},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
var m17={"uVelocityMax":{"valeur":{"defaut":34.221},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.941},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.807},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.088},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":5557.042},"max":{"defaut":10441},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":201.303},"max":{"defaut":4411},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":80},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.273},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.596},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":4.681},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":1.06301},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00045},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":11},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":1.1},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"SRC_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":303.521},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.78},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.75},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":500},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
var m18={"uVelocityMax":{"valeur":{"defaut":18.201},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.663},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.808},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.088},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":3922.503},"max":{"defaut":10441},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":8884.183},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-80111},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":6.382},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.399},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":0.847},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":8.477},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":0.39001},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00037},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":3},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"SRC_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1380.652},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":0.58},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":0.96},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.75},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":500},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
var m19={"uVelocityMax":{"valeur":{"defaut":24.054},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.663},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.808},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.088},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":3922.503},"max":{"defaut":10441},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":8884.183},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-80111},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":6.382},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.399},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":0.847},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":2.255},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":0.39001},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00023},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"SRC_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1824.83},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.58},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":0.98},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":0.96},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.75},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":1024},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};

// delete remetttre pvs à 1024
var m20={"uVelocityMax":{"valeur":{"defaut":43.554},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.663},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.808},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.088},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":3922.503},"max":{"defaut":10441},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":8884.183},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-80111},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":6.382},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.399},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":0.847},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":2.255},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":0.39001},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00023},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"ONE"}},"blend2":{"valeur":{"defaut":"ZERO"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":3668.167},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.52},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.03},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":1024},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
var m21={"uVelocityMax":{"valeur":{"defaut":86.579},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.663},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.808},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.088},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":3922.503},"max":{"defaut":10441},"min":{"defaut":-591},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":8884.183},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-80111},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":6.382},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.488},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.685},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":0},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":0.39001},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00023},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"SRC_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":2254.201},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.16},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.11},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":800},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};


var m22 = {"uVelocityMax":{"valeur":{"defaut":49.135},"max":{"defaut":117},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.765},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.778},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"flamme":{"valeur":{"defaut":0.034},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.19},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":-7472.474},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-80111},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.38},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.987},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":0.471},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":0.39001},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00048},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE_MINUS_DST_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1041.967},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.45},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.69},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.15},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":1024},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};

var m23 = {"uVelocityMax":{"valeur":{"defaut":3.988},"max":{"defaut":11},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.3169},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.097},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.237},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":-165.981},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-22671.558},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":1.798},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.627},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":2.164},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":0.367},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.001}},"seuilMouse":{"valeur":{"defaut":1.17701},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00168},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE_MINUS_SRC_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":2},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1041.967},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.45},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.69},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.15},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":1024},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};

var m24 = {"uVelocityMax":{"valeur":{"defaut":38.111},"max":{"defaut":111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.0683},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.41},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.319},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":3801.041},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-22671.558},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.829},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.883},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":1.4296},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":1.17701},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00092},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE_MINUS_DST_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1041.967},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.45},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.69},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.15},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":512},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
var m25= {"uVelocityMax":{"valeur":{"defaut":38.111},"max":{"defaut":111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.1254},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.013},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":3801.041},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-22671.558},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":5.64},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.829},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.883},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":1.4296},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":1.17701},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00092},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":2},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":4},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"SRC_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1041.967},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.45},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.69},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.15},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":512},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
var m26= {"uVelocityMax":{"valeur":{"defaut":38.902},"max":{"defaut":111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":1},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.1254},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.013},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":6.031},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":-27800.661},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-22671.558},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":5.64},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.242},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":2.082},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":1.4296},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":1.17701},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00092},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":2},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"SRC_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":982.743},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.35},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":0.74},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.15},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":512},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
var m27={"uVelocityMax":{"valeur":{"defaut":10.239},"max":{"defaut":111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.353},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.0174},"max":{"defaut":111},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.013},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":4.574},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":215.033},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-80111},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":5.64},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.073},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.124},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":0.5894},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":1.61501},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00325},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":473.789},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":-0.24},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.6},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.13},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":800},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
var m28 = {"uVelocityMax":{"valeur":{"defaut":3.959},"max":{"defaut":1111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.148},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.3747},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.097},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":6.031},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":9695.543},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-22671.558},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.916},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.816},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":2.9468},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":1.17701},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00092},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":2},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":10},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"ONE"}},"blend2":{"valeur":{"defaut":"ONE_MINUS_SRC_ALPHA"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":980.892},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.35},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":0.74},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.15},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":512},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
var m29 = {"uVelocityMax":{"valeur":{"defaut":71.569},"max":{"defaut":1111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.09},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.0667},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.225},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":2.186},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":-1040.07},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-22671.558},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.599},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":2.222},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":2.9468},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":0.22501},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00118},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":5},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":3},"max":{"defaut":101},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"DST_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1989.546},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.35},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.55},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.15},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":512},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
var m30= {"uVelocityMax":{"valeur":{"defaut":261.609},"max":{"defaut":1111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.289},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.0539},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.134},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":1.01},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":2882.127},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-22671.558},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.496},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.804},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":3.687},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":0.22501},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.0015},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":3},"max":{"defaut":101},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"SRC_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":2099.973},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.35},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.55},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.15},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":512},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
var m31 = {"uVelocityMax":{"valeur":{"defaut":234.504},"max":{"defaut":1111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.17},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.0217},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.012},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":1.01},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":4495.831},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-2162.183},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.46},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.507},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":8.4224},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":0.03201},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00097},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":101},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"DST_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":2676.17},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.35},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.13},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.15},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":512},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
m31 = {"uVelocityMax":{"valeur":{"defaut":199.024},"max":{"defaut":1111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.17},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.0217},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.012},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":1.01},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":-4446.779},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-2162.183},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.274},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.052},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":2.045},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":0.03201},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00097},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":101},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"DST_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1849.506},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.35},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.13},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.15},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":512},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
m31={"uVelocityMax":{"valeur":{"defaut":91.213},"max":{"defaut":1111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.17},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.0217},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.064},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.706},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":3442.441},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-2162.183},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.274},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.052},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":2.045},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":0.03201},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00097},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":4},"max":{"defaut":101},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"DST_COLOR"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":4},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1849.506},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.35},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.13},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.15},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":512},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
m31={"uVelocityMax":{"valeur":{"defaut":943.04},"max":{"defaut":1111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.17},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.0217},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.064},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.706},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":62723.648},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":-80},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-80111},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.375},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.163},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":10},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":0.09601},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00036},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":101},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":3152.427},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":-0.09},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.18},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":0.63},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":1024},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
m31={"uVelocityMax":{"valeur":{"defaut":7855.063},"max":{"defaut":11111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.17},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.6737},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.234},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":42126.51},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":21924.647},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-80111},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.41},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.96},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":1.8681},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":0.09601},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00036},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":101},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":2307.873},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.18},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.32},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.09},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":1024},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
m31={"uVelocityMax":{"valeur":{"defaut":1008.153},"max":{"defaut":11111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.663},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.6737},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.234},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":42126.51},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":22699.927},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-80111},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.206},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":0.927},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":1.3651},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":0.09601},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.0006},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":1},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":101},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"ONE"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1287.498},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":-0.17},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.46},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.09},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":1024},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
m31={"uVelocityMax":{"valeur":{"defaut":2590.435},"max":{"defaut":11111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.397},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.6515},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.181},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":-14778.967},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-80111},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.272},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":0.606},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":0.9306},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":0.09601},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00054},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":30},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":101},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"DST_ALPHA"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":1735.377},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":0.28},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.79},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.09},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":1024},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
m31={"uVelocityMax":{"valeur":{"defaut":723.372},"max":{"defaut":11111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.477},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.7919},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.381},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.154},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":-32596.948},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-44763.651},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.303},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":0.894},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":7.6206},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":0.00001},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00065},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":13},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":101},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"DST_ALPHA"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":4109.877},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":-0.16},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.18},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.02},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":800},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
m31={"uVelocityMax":{"valeur":{"defaut":723.372},"max":{"defaut":11111},"min":{"defaut":0},"step":{"defaut":0.001}},"alpha":{"valeur":{"defaut":0.477},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.7919},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.381},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.154},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":-56107.718},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-44763.651},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.303},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":0.632},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":7.6206},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":0.00001},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00065},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":7},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":1},"max":{"defaut":101},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"DST_ALPHA"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":3},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":4109.877},"max":{"defaut":4501},"min":{"defaut":0},"step":{"defaut":0.001}},"brightness":{"valeur":{"defaut":-0.16},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.18},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.02},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":800},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
m31={"uVelocityMax":{"valeur":{"defaut":19.5},"max":{"defaut":11111},"min":{"defaut":0},"step":{"defaut":0.5}},"alpha":{"valeur":{"defaut":0.405},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"lumi":{"valeur":{"defaut":0.4063},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.0001}},"flamme":{"valeur":{"defaut":0.34},"max":{"defaut":1},"min":{"defaut":0},"step":{"defaut":0.001}},"delta2":{"valeur":{"defaut":0.603},"max":{"defaut":22},"min":{"defaut":0},"step":{"defaut":0.001}},"force":{"valeur":{"defaut":0},"max":{"defaut":104411},"min":{"defaut":-59111},"step":{"defaut":0.001}},"gravity":{"valeur":{"defaut":0},"max":{"defaut":44111},"min":{"defaut":-80},"step":{"defaut":0.001}},"forceMouse":{"valeur":{"defaut":-26980.066},"max":{"defaut":80},"min":{"defaut":-80111},"step":{"defaut":0.001}},"maxAngle":{"valeur":{"defaut":7},"max":{"defaut":7},"min":{"defaut":0},"step":{"defaut":0.001}},"angleBase":{"valeur":{"defaut":0},"max":{"defaut":39},"min":{"defaut":0},"step":{"defaut":0.001}},"slowdown":{"valeur":{"defaut":0.424},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":0.001}},"choc":{"valeur":{"defaut":1.179},"max":{"defaut":4},"min":{"defaut":0},"step":{"defaut":0.001}},"seuil":{"valeur":{"defaut":0.3577},"max":{"defaut":10},"min":{"defaut":0},"step":{"defaut":0.0001}},"seuilMouse":{"valeur":{"defaut":0.31001},"max":{"defaut":3},"min":{"defaut":0.00001},"step":{"defaut":0.001}},"dt":{"valeur":{"defaut":0.00052},"max":{"defaut":0.01},"min":{"defaut":0},"step":{"defaut":0.00001}},"collisionMax":{"valeur":{"defaut":20},"max":{"defaut":1000},"min":{"defaut":1},"step":{"defaut":1}},"vit0":{"valeur":{"defaut":40.255},"max":{"defaut":100},"min":{"defaut":0},"step":{"defaut":0.001}},"pointSize":{"valeur":{"defaut":2},"max":{"defaut":101},"min":{"defaut":1},"step":{"defaut":1}},"blend1":{"valeur":{"defaut":"SRC_ALPHA"}},"blend2":{"valeur":{"defaut":"DST_ALPHA"}},"scale":{"valeur":{"defaut":7},"max":{"defaut":500},"min":{"defaut":1},"step":{"defaut":1}},"gridStep":{"valeur":{"defaut":5},"max":{"defaut":20},"min":{"defaut":1},"step":{"defaut":1}},"normalForce":{"valeur":{"defaut":20420},"max":{"defaut":450111},"min":{"defaut":0},"step":{"defaut":1}},"brightness":{"valeur":{"defaut":0.45},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"contrast":{"valeur":{"defaut":-0.15},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"saturation":{"valeur":{"defaut":-0.03},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"threshold":{"valeur":{"defaut":0.97},"max":{"defaut":1},"min":{"defaut":-1},"step":{"defaut":0.01}},"resolution":{"valeur":{"defaut":0},"max":{"defaut":2},"min":{"defaut":0},"step":{"defaut":1}},"PVS":{"valeur":{"defaut":512},"max":{"defaut":5000},"min":{"defaut":2},"step":{"defaut":1}}};
var m33={uVelocityMax:{valeur:{defaut:38.111 , courante:1.947} , max:{defaut:111 , courante:111} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , alpha:{valeur:{defaut:1 , courante:1} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , lumi:{valeur:{defaut:0.1254 , courante:0.9745} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , flamme:{valeur:{defaut:0.013 , courante:0.125} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , delta2:{valeur:{defaut:1 , courante:0.176} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , force:{valeur:{defaut:3801.041 , courante:25767213.437} , max:{defaut:104411 , courante:104411111} , min:{defaut:-59111 , courante:-5911111} , step:{defaut:0.001 , courante:0.001}} , gravity:{valeur:{defaut:0 , courante:5026.644} , max:{defaut:44111 , courante:44111} , min:{defaut:-80 , courante:-8011} , step:{defaut:0.001 , courante:0.001}} , forceMouse:{valeur:{defaut:-22671.558 , courante:-40707.939} , max:{defaut:80 , courante:80} , min:{defaut:-80111 , courante:-80111} , step:{defaut:0.001 , courante:0.001}} , maxAngle:{valeur:{defaut:5.64 , courante:7} , max:{defaut:7 , courante:7} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , angleBase:{valeur:{defaut:0 , courante:0} , max:{defaut:39 , courante:39} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , slowdown:{valeur:{defaut:0.829 , courante:0.63} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , choc:{valeur:{defaut:1.883 , courante:1.331} , max:{defaut:4 , courante:4} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , seuil:{valeur:{defaut:1.4296 , courante:0.2686} , max:{defaut:10 , courante:10} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , seuilMouse:{valeur:{defaut:1.17701 , courante:0.84001} , max:{defaut:3 , courante:3} , min:{defaut:0.00001 , courante:0.00001} , step:{defaut:0.001 , courante:0.001}} , dt:{valeur:{defaut:0.00092 , courante:0.00053} , max:{defaut:0.01 , courante:0.01} , min:{defaut:0 , courante:0} , step:{defaut:0.00001 , courante:0.00001}} , collisionMax:{valeur:{defaut:2 , courante:1} , max:{defaut:1000 , courante:1000} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , vit0:{valeur:{defaut:40.255 , courante:42.503} , max:{defaut:100 , courante:100} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , pointSize:{valeur:{defaut:4 , courante:2} , max:{defaut:10 , courante:10} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , blend1:{valeur:{defaut:"SRC_ALPHA" , courante:"SRC_ALPHA"}} , blend2:{valeur:{defaut:"SRC_COLOR" , courante:"DST_ALPHA"}} , scale:{valeur:{defaut:7 , courante:7} , max:{defaut:500 , courante:500} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , gridStep:{valeur:{defaut:3 , courante:4} , max:{defaut:20 , courante:20} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , normalForce:{valeur:{defaut:1041.967 , courante:4139.581} , max:{defaut:4501 , courante:45011} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , brightness:{valeur:{defaut:0.45 , courante:-0.25} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , contrast:{valeur:{defaut:-0.69 , courante:-0.12} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , saturation:{valeur:{defaut:-0.15 , courante:0.04} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , threshold:{valeur:{defaut:0.97 , courante:0.51} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , resolution:{valeur:{defaut:0 , courante:0} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:1 , courante:1}} , PVS:{valeur:{defaut:512 , courante:512} , max:{defaut:5000 , courante:5000} , min:{defaut:2 , courante:2} , step:{defaut:1 , courante:1}}};

var m32={uVelocityMax:{valeur:{defaut:10.239 , courante:5.918} , max:{defaut:111 , courante:111} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , alpha:{valeur:{defaut:0.353 , courante:0.815} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , lumi:{valeur:{defaut:0.0174 , courante:0} , max:{defaut:111 , courante:111} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , flamme:{valeur:{defaut:0.013 , courante:0.013} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , delta2:{valeur:{defaut:4.574 , courante:4.574} , max:{defaut:22 , courante:22} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , force:{valeur:{defaut:215.033 , courante:-18409.8} , max:{defaut:104411 , courante:104411} , min:{defaut:-59111 , courante:-59111} , step:{defaut:0.001 , courante:0.001}} , gravity:{valeur:{defaut:0 , courante:-80} , max:{defaut:44111 , courante:44111} , min:{defaut:-80 , courante:-80} , step:{defaut:0.001 , courante:0.001}} , forceMouse:{valeur:{defaut:-80111 , courante:-80111} , max:{defaut:80 , courante:80} , min:{defaut:-80111 , courante:-80111} , step:{defaut:0.001 , courante:0.001}} , maxAngle:{valeur:{defaut:5.64 , courante:5.64} , max:{defaut:7 , courante:7} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , angleBase:{valeur:{defaut:0 , courante:0} , max:{defaut:39 , courante:39} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , slowdown:{valeur:{defaut:0.073 , courante:0.189} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , choc:{valeur:{defaut:1.124 , courante:0.402} , max:{defaut:4 , courante:4} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , seuil:{valeur:{defaut:0.5894 , courante:0.71} , max:{defaut:10 , courante:10} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , seuilMouse:{valeur:{defaut:1.61501 , courante:1.61501} , max:{defaut:3 , courante:3} , min:{defaut:0.00001 , courante:0.00001} , step:{defaut:0.001 , courante:0.001}} , dt:{valeur:{defaut:0.00325 , courante:0.00147} , max:{defaut:0.01 , courante:0.01} , min:{defaut:0 , courante:0} , step:{defaut:0.00001 , courante:0.00001}} , collisionMax:{valeur:{defaut:1 , courante:9} , max:{defaut:1000 , courante:1000} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , vit0:{valeur:{defaut:40.255 , courante:40.255} , max:{defaut:100 , courante:100} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , pointSize:{valeur:{defaut:1 , courante:2} , max:{defaut:10 , courante:10} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , blend1:{valeur:{defaut:"ONE_MINUS_SRC_ALPHA" , courante:"SRC_ALPHA"}} , blend2:{valeur:{defaut:"ONE" , courante:"DST_ALPHA"}} , scale:{valeur:{defaut:7 , courante:5} , max:{defaut:500 , courante:500} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , gridStep:{valeur:{defaut:4 , courante:3} , max:{defaut:20 , courante:20} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , normalForce:{valeur:{defaut:473.789 , courante:516.356} , max:{defaut:4501 , courante:4501} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , brightness:{valeur:{defaut:-0.24 , courante:-0.55} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , contrast:{valeur:{defaut:-0.6 , courante:-0.6} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , saturation:{valeur:{defaut:-0.13 , courante:-0.24} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , threshold:{valeur:{defaut:0.97 , courante:0.97} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , resolution:{valeur:{defaut:0 , courante:0} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:1 , courante:1}} , PVS:{valeur:{defaut:800 , courante:800} , max:{defaut:5000 , courante:5000} , min:{defaut:2 , courante:2} , step:{defaut:1 , courante:1}}};

var m34={uVelocityMax:{valeur:{defaut:38.111 , courante:52.153} , max:{defaut:111 , courante:111} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , alpha:{valeur:{defaut:1 , courante:0.938} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , lumi:{valeur:{defaut:0.1254 , courante:1} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , flamme:{valeur:{defaut:0.013 , courante:0.215} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , delta2:{valeur:{defaut:1 , courante:0.061} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , force:{valeur:{defaut:3801.041 , courante:18738} , max:{defaut:104411 , courante:55551} , min:{defaut:-59111 , courante:-5911} , step:{defaut:0.001 , courante:1}} , gravity:{valeur:{defaut:0 , courante:0} , max:{defaut:44111 , courante:44111} , min:{defaut:-80 , courante:-8011} , step:{defaut:0.001 , courante:0.001}} , forceMouse:{valeur:{defaut:-22671.558 , courante:-40707.939} , max:{defaut:80 , courante:80} , min:{defaut:-80111 , courante:-80111} , step:{defaut:0.001 , courante:0.001}} , maxAngle:{valeur:{defaut:5.64 , courante:7} , max:{defaut:7 , courante:7} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , angleBase:{valeur:{defaut:0 , courante:0} , max:{defaut:39 , courante:39} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , slowdown:{valeur:{defaut:0.829 , courante:0.523} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , choc:{valeur:{defaut:1.883 , courante:1.753} , max:{defaut:4 , courante:4} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , seuil:{valeur:{defaut:1.4296 , courante:1} , max:{defaut:10 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , seuilMouse:{valeur:{defaut:1.17701 , courante:0.84001} , max:{defaut:3 , courante:3} , min:{defaut:0.00001 , courante:0.00001} , step:{defaut:0.001 , courante:0.001}} , dt:{valeur:{defaut:0.00092 , courante:0.00017} , max:{defaut:0.01 , courante:0.01} , min:{defaut:0 , courante:0} , step:{defaut:0.00001 , courante:0.00001}} , collisionMax:{valeur:{defaut:2 , courante:3} , max:{defaut:1000 , courante:1000} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , vit0:{valeur:{defaut:40.255 , courante:42.503} , max:{defaut:100 , courante:100} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , pointSize:{valeur:{defaut:4 , courante:2} , max:{defaut:10 , courante:10} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , blend1:{valeur:{defaut:"SRC_ALPHA" , courante:"SRC_ALPHA"}} , blend2:{valeur:{defaut:"SRC_COLOR" , courante:"DST_ALPHA"}} , scale:{valeur:{defaut:7 , courante:7} , max:{defaut:500 , courante:500} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , gridStep:{valeur:{defaut:3 , courante:3} , max:{defaut:20 , courante:20} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , normalForce:{valeur:{defaut:1041.967 , courante:2188.847} , max:{defaut:4501 , courante:45011} , min:{defaut:0 , courante:-1111} , step:{defaut:0.001 , courante:0.001}} , brightness:{valeur:{defaut:0.45 , courante:-0.38} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , contrast:{valeur:{defaut:-0.69 , courante:-0.44} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , saturation:{valeur:{defaut:-0.15 , courante:0} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , threshold:{valeur:{defaut:0.97 , courante:-0.14} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , resolution:{valeur:{defaut:0 , courante:0} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:1 , courante:1}} , PVS:{valeur:{defaut:512 , courante:600} , max:{defaut:5000 , courante:5000} , min:{defaut:2 , courante:2} , step:{defaut:1 , courante:1}}};

var m35={uVelocityMax:{valeur:{defaut:38.111 , courante:55.013} , max:{defaut:111 , courante:111} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , alpha:{valeur:{defaut:1 , courante:0.938} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , lumi:{valeur:{defaut:0.1254 , courante:1} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , flamme:{valeur:{defaut:0.013 , courante:0.138} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , delta2:{valeur:{defaut:1 , courante:0.061} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , force:{valeur:{defaut:3801.041 , courante:-21723} , max:{defaut:104411 , courante:55551} , min:{defaut:-59111 , courante:-59111} , step:{defaut:0.001 , courante:1}} , gravity:{valeur:{defaut:0 , courante:-7303.752} , max:{defaut:44111 , courante:44111} , min:{defaut:-80 , courante:-8011} , step:{defaut:0.001 , courante:0.001}} , forceMouse:{valeur:{defaut:-22671.558 , courante:-5723.296} , max:{defaut:80 , courante:80} , min:{defaut:-80111 , courante:-80111} , step:{defaut:0.001 , courante:0.001}} , maxAngle:{valeur:{defaut:5.64 , courante:7} , max:{defaut:7 , courante:7} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , angleBase:{valeur:{defaut:0 , courante:0} , max:{defaut:39 , courante:39} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , slowdown:{valeur:{defaut:0.829 , courante:0.301} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , choc:{valeur:{defaut:1.883 , courante:1.548} , max:{defaut:4 , courante:4} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , seuil:{valeur:{defaut:1.4296 , courante:0.0304} , max:{defaut:10 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , seuilMouse:{valeur:{defaut:1.17701 , courante:0.19301} , max:{defaut:3 , courante:3} , min:{defaut:0.00001 , courante:0.00001} , step:{defaut:0.001 , courante:0.001}} , dt:{valeur:{defaut:0.00092 , courante:0.00017} , max:{defaut:0.01 , courante:0.01} , min:{defaut:0 , courante:0} , step:{defaut:0.00001 , courante:0.00001}} , collisionMax:{valeur:{defaut:2 , courante:1} , max:{defaut:1000 , courante:1000} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , vit0:{valeur:{defaut:40.255 , courante:42.503} , max:{defaut:100 , courante:100} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , pointSize:{valeur:{defaut:4 , courante:2} , max:{defaut:10 , courante:10} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , blend1:{valeur:{defaut:"SRC_ALPHA" , courante:"SRC_ALPHA"}} , blend2:{valeur:{defaut:"SRC_COLOR" , courante:"DST_ALPHA"}} , scale:{valeur:{defaut:7 , courante:7} , max:{defaut:500 , courante:500} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , gridStep:{valeur:{defaut:3 , courante:3} , max:{defaut:20 , courante:20} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , normalForce:{valeur:{defaut:1041.967 , courante:10343.641} , max:{defaut:4501 , courante:45011} , min:{defaut:0 , courante:-1111} , step:{defaut:0.001 , courante:0.001}} , brightness:{valeur:{defaut:0.45 , courante:-0.57} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , contrast:{valeur:{defaut:-0.69 , courante:-0.82} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , saturation:{valeur:{defaut:-0.15 , courante:0} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , threshold:{valeur:{defaut:0.97 , courante:-0.14} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , resolution:{valeur:{defaut:0 , courante:0} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:1 , courante:1}} , PVS:{valeur:{defaut:512 , courante:600} , max:{defaut:5000 , courante:5000} , min:{defaut:2 , courante:2} , step:{defaut:1 , courante:1}}};
var m36={uVelocityMax:{valeur:{defaut:38.111 , courante:55.013} , max:{defaut:111 , courante:111} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , alpha:{valeur:{defaut:1 , courante:0.999} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , lumi:{valeur:{defaut:0.1254 , courante:1} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , flamme:{valeur:{defaut:0.013 , courante:0.138} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , delta2:{valeur:{defaut:1 , courante:0.061} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , force:{valeur:{defaut:3801.041 , courante:-21723} , max:{defaut:104411 , courante:55551} , min:{defaut:-59111 , courante:-59111} , step:{defaut:0.001 , courante:1}} , gravity:{valeur:{defaut:0 , courante:-7303.752} , max:{defaut:44111 , courante:44111} , min:{defaut:-80 , courante:-8011} , step:{defaut:0.001 , courante:0.001}} , forceMouse:{valeur:{defaut:-22671.558 , courante:-15292.636} , max:{defaut:80 , courante:8110} , min:{defaut:-80111 , courante:-801111} , step:{defaut:0.001 , courante:0.001}} , maxAngle:{valeur:{defaut:5.64 , courante:7} , max:{defaut:7 , courante:7} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , angleBase:{valeur:{defaut:0 , courante:0} , max:{defaut:39 , courante:39} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , slowdown:{valeur:{defaut:0.829 , courante:0.301} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , choc:{valeur:{defaut:1.883 , courante:1.548} , max:{defaut:4 , courante:4} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , seuil:{valeur:{defaut:1.4296 , courante:0.0304} , max:{defaut:10 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , seuilMouse:{valeur:{defaut:1.17701 , courante:0.00001} , max:{defaut:3 , courante:3} , min:{defaut:0.00001 , courante:0.00001} , step:{defaut:0.001 , courante:0.001}} , dt:{valeur:{defaut:0.00092 , courante:0.00017} , max:{defaut:0.01 , courante:0.01} , min:{defaut:0 , courante:0} , step:{defaut:0.00001 , courante:0.00001}} , collisionMax:{valeur:{defaut:2 , courante:1} , max:{defaut:1000 , courante:1000} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , vit0:{valeur:{defaut:40.255 , courante:42.503} , max:{defaut:100 , courante:100} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , pointSize:{valeur:{defaut:4 , courante:2} , max:{defaut:10 , courante:10} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , blend1:{valeur:{defaut:"SRC_ALPHA" , courante:"SRC_ALPHA"}} , blend2:{valeur:{defaut:"SRC_COLOR" , courante:"ONE_MINUS_SRC_COLOR"}} , scale:{valeur:{defaut:7 , courante:7} , max:{defaut:500 , courante:500} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , gridStep:{valeur:{defaut:3 , courante:3} , max:{defaut:20 , courante:20} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , normalForce:{valeur:{defaut:1041.967 , courante:10343.641} , max:{defaut:4501 , courante:45011} , min:{defaut:0 , courante:-1111} , step:{defaut:0.001 , courante:0.001}} , brightness:{valeur:{defaut:0.45 , courante:-0.57} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , contrast:{valeur:{defaut:-0.69 , courante:-0.82} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , saturation:{valeur:{defaut:-0.15 , courante:0} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , threshold:{valeur:{defaut:0.97 , courante:-0.14} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , resolution:{valeur:{defaut:0 , courante:0} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:1 , courante:1}} , PVS:{valeur:{defaut:512 , courante:600} , max:{defaut:5000 , courante:5000} , min:{defaut:2 , courante:2} , step:{defaut:1 , courante:1}}};
var m37={uVelocityMax:{valeur:{defaut:38.111 , courante:19.2} , max:{defaut:111 , courante:111} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , alpha:{valeur:{defaut:1 , courante:0.999} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , lumi:{valeur:{defaut:0.1254 , courante:1} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , flamme:{valeur:{defaut:0.013 , courante:0.138} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , delta2:{valeur:{defaut:1 , courante:0.061} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , force:{valeur:{defaut:3801.041 , courante:16733} , max:{defaut:104411 , courante:55551} , min:{defaut:-59111 , courante:-59111} , step:{defaut:0.001 , courante:1}} , gravity:{valeur:{defaut:0 , courante:-463.177} , max:{defaut:44111 , courante:44111} , min:{defaut:-80 , courante:-80111} , step:{defaut:0.001 , courante:0.001}} , forceMouse:{valeur:{defaut:-22671.558 , courante:-15292.636} , max:{defaut:80 , courante:8110} , min:{defaut:-80111 , courante:-801111} , step:{defaut:0.001 , courante:0.001}} , maxAngle:{valeur:{defaut:5.64 , courante:7} , max:{defaut:7 , courante:7} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , angleBase:{valeur:{defaut:0 , courante:0} , max:{defaut:39 , courante:39} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , slowdown:{valeur:{defaut:0.829 , courante:0.28} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , choc:{valeur:{defaut:1.883 , courante:0.655} , max:{defaut:4 , courante:4} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , seuil:{valeur:{defaut:1.4296 , courante:7.6077} , max:{defaut:10 , courante:11} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , seuilMouse:{valeur:{defaut:1.17701 , courante:0.00001} , max:{defaut:3 , courante:3} , min:{defaut:0.00001 , courante:0.00001} , step:{defaut:0.001 , courante:0.001}} , dt:{valeur:{defaut:0.00092 , courante:0.00061} , max:{defaut:0.01 , courante:0.01} , min:{defaut:0 , courante:0} , step:{defaut:0.00001 , courante:0.00001}} , collisionMax:{valeur:{defaut:2 , courante:1} , max:{defaut:1000 , courante:1000} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , vit0:{valeur:{defaut:40.255 , courante:42.503} , max:{defaut:100 , courante:100} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , pointSize:{valeur:{defaut:4 , courante:3} , max:{defaut:10 , courante:10} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , blend1:{valeur:{defaut:"SRC_ALPHA" , courante:"SRC_ALPHA"}} , blend2:{valeur:{defaut:"SRC_COLOR" , courante:"DST_ALPHA"}} , scale:{valeur:{defaut:7 , courante:7} , max:{defaut:500 , courante:500} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , gridStep:{valeur:{defaut:3 , courante:3} , max:{defaut:20 , courante:20} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , normalForce:{valeur:{defaut:1041.967 , courante:1468.191} , max:{defaut:4501 , courante:45011} , min:{defaut:0 , courante:-1111} , step:{defaut:0.001 , courante:0.001}} , brightness:{valeur:{defaut:0.45 , courante:-0.57} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , contrast:{valeur:{defaut:-0.69 , courante:-0.82} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , saturation:{valeur:{defaut:-0.15 , courante:0} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , threshold:{valeur:{defaut:0.97 , courante:-0.14} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , resolution:{valeur:{defaut:0 , courante:0} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:1 , courante:1}} , PVS:{valeur:{defaut:512 , courante:512} , max:{defaut:5000 , courante:5000} , min:{defaut:2 , courante:2} , step:{defaut:1 , courante:1}}};
var m38={uVelocityMax:{valeur:{defaut:38.111 , courante:64.613} , max:{defaut:111 , courante:111} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , alpha:{valeur:{defaut:1 , courante:0.999} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , lumi:{valeur:{defaut:0.1254 , courante:1} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , flamme:{valeur:{defaut:0.013 , courante:0.138} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , delta2:{valeur:{defaut:1 , courante:0} , max:{defaut:1 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , force:{valeur:{defaut:3801.041 , courante:-48326} , max:{defaut:104411 , courante:55551} , min:{defaut:-59111 , courante:-591111} , step:{defaut:0.001 , courante:1}} , gravity:{valeur:{defaut:0 , courante:2054.775} , max:{defaut:44111 , courante:44111} , min:{defaut:-80 , courante:-8011} , step:{defaut:0.001 , courante:0.001}} , forceMouse:{valeur:{defaut:-22671.558 , courante:-392840.372} , max:{defaut:80 , courante:8110} , min:{defaut:-80111 , courante:-801111} , step:{defaut:0.001 , courante:0.001}} , maxAngle:{valeur:{defaut:5.64 , courante:7} , max:{defaut:7 , courante:7} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , angleBase:{valeur:{defaut:0 , courante:0} , max:{defaut:39 , courante:39} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , slowdown:{valeur:{defaut:0.829 , courante:0.553} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , choc:{valeur:{defaut:1.883 , courante:2.417} , max:{defaut:4 , courante:4} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , seuil:{valeur:{defaut:1.4296 , courante:0.4875} , max:{defaut:10 , courante:1} , min:{defaut:0 , courante:0} , step:{defaut:0.0001 , courante:0.0001}} , seuilMouse:{valeur:{defaut:1.17701 , courante:0.00601} , max:{defaut:3 , courante:3} , min:{defaut:0.00001 , courante:0.00001} , step:{defaut:0.001 , courante:0.001}} , dt:{valeur:{defaut:0.00092 , courante:0.00019} , max:{defaut:0.01 , courante:0.01} , min:{defaut:0 , courante:0} , step:{defaut:0.00001 , courante:0.00001}} , collisionMax:{valeur:{defaut:2 , courante:2} , max:{defaut:1000 , courante:1000} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , vit0:{valeur:{defaut:40.255 , courante:42.503} , max:{defaut:100 , courante:100} , min:{defaut:0 , courante:0} , step:{defaut:0.001 , courante:0.001}} , pointSize:{valeur:{defaut:4 , courante:3} , max:{defaut:10 , courante:10} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , blend1:{valeur:{defaut:"SRC_ALPHA" , courante:"SRC_ALPHA"}} , blend2:{valeur:{defaut:"SRC_COLOR" , courante:"DST_ALPHA"}} , scale:{valeur:{defaut:7 , courante:7} , max:{defaut:500 , courante:500} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , gridStep:{valeur:{defaut:3 , courante:5} , max:{defaut:20 , courante:20} , min:{defaut:1 , courante:1} , step:{defaut:1 , courante:1}} , normalForce:{valeur:{defaut:1041.967 , courante:2821.002} , max:{defaut:4501 , courante:45011} , min:{defaut:0 , courante:-1111} , step:{defaut:0.001 , courante:0.001}} , brightness:{valeur:{defaut:0.45 , courante:-0.43} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , contrast:{valeur:{defaut:-0.69 , courante:-0.45} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , saturation:{valeur:{defaut:-0.15 , courante:-0.1} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , threshold:{valeur:{defaut:0.97 , courante:-0.14} , max:{defaut:1 , courante:1} , min:{defaut:-1 , courante:-1} , step:{defaut:0.01 , courante:0.01}} , resolution:{valeur:{defaut:0 , courante:0} , max:{defaut:2 , courante:2} , min:{defaut:0 , courante:0} , step:{defaut:1 , courante:1}} , PVS:{valeur:{defaut:512 , courante:600} , max:{defaut:5000 , courante:5000} , min:{defaut:2 , courante:2} , step:{defaut:1 , courante:1}}};

model = m38;




//img = new Image();
//img.onload = start ; 
//img.src="1280_720.png";
//img.src="352_288.png";
//img.src="1920_1080.png";
//img.src="640_480.png";

CSW=1920; ///1280;
CSH=1080; //720;
CSW=1680*2;
CSH=1050*2;
var CSW_T,CSH_T;

CSW_T=window.innerWidth;
CSH_T=window.innerHeight;

CSW_T=1280;
CSH_T=720;
var CSSX= 1680;
var CSSY= 1050;
fillGui();

ecouteurGUI();


start();



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
                quality: 1,
                format: 'png',
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


	webcamConstraints=fhdConstraints;
	getMedia(webcamConstraints);

pix = new Image();
  pix.onload = function () {
    console.log("chargée");
      gl.activeTexture(gl.TEXTURE0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pix);

//gl_Traitement.activeTexture(gl_Traitement.TEXTURE7);
//gl_Traitement.texImage2D(gl_Traitement.TEXTURE_2D, 0, gl_Traitement.RGBA, gl_Traitement.RGBA, gl_Traitement.UNSIGNED_BYTE, pix); //delete

      console.log("fin onload");

  }
  pix.src="particle.png";

  /// chargement image particule ////
  

  /////////////////

// pas besoin pour l'instant
 // CSW = img.width;
 // CSH = img.height;
 const canvas = document.getElementById("glcanvas");

 gl = canvas.getContext(
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
  ext2 = gl.getExtension('OES_standard_derivatives');


  gl.canvas.width = CSW;
  gl.canvas.height = CSH;


   //debug
   /*
    gl.canvas.style.width = CSW /2+ 'px';
   gl.canvas.style.height = CSH /2+ 'px';
    gl.canvas.style.width =  '100%';
    gl.canvas.style.height = '100%';
*/
  gl.canvas.style.width =  CSSX+'px';
  gl.canvas.style.height = CSSY+'px';

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

  gl_Traitement.canvas.width = CSW_T;
  gl_Traitement.canvas.height = CSH_T;
  gl_Traitement.canvas.style.width = CSW_T /2+ 'px';
  gl_Traitement.canvas.style.height = CSH_T /2+ 'px';

  afficheurShader = compilink(gl,'afficheur');
  gridShader = compilink(gl,'grid');
  main2Shader = compilink(gl,'main2');
  sobelShader = compilink(gl_Traitement,'sobel');



  afficheurShader.position =  gl.getAttribLocation(afficheurShader, "position");
  afficheurShader.pvTex =         gl.getUniformLocation(    afficheurShader,    "pvTex"     );
  //afficheurShader.mapColor =      gl.getUniformLocation(    afficheurShader,    "mapColor"  );
  afficheurShader.resolution =    gl.getUniformLocation(    afficheurShader,    "resolution");
  afficheurShader.PVS =           gl.getUniformLocation(    afficheurShader,    "PVS"       );
  afficheurShader.pointSize =     gl.getUniformLocation(    afficheurShader,    "pointSize"       );
  afficheurShader.delta2 =        gl.getUniformLocation(    afficheurShader,    "delta2"       );
  afficheurShader.alpha =         gl.getUniformLocation(    afficheurShader,    "alpha"       );
  afficheurShader.lumi =          gl.getUniformLocation(    afficheurShader,    "lumi"       );
  afficheurShader.flamme =        gl.getUniformLocation(    afficheurShader,    "flamme"       );
  afficheurShader.pix =           gl.getUniformLocation(    afficheurShader,    "pix"       );

  gridShader.position =       gl.getAttribLocation(gridShader, "position");
  gridShader.pvTex =              gl.getUniformLocation(gridShader, "pvTex");
  gridShader.PVS =                gl.getUniformLocation(gridShader, "PVS");

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
  sobelShader.m =                 gl_Traitement.getUniformLocation(sobelShader,"m");
  sobelShader.px =                gl_Traitement.getUniformLocation(sobelShader,"px");
  sobelShader.threshold =         gl_Traitement.getUniformLocation(sobelShader,"threshold");



  NBRE= model.PVS.valeur.courante * model.PVS.valeur.courante;
console.log(NBRE);
  //PVS = Math.pow(2, Math.ceil(Math.log(Math.ceil(Math.sqrt(NBRE))) / Math.LN2));
  // ici je force PVS avec la valeur 2 , par ce que la formule marche pas pour NBRE = 1

  if (NBRE === 1) model.PVS.valeur.courante=2;  

  let pvFloat32 = new Float32Array(model.PVS.valeur.courante*model.PVS.valeur.courante*4);
  let image1 = new Float32Array(model.PVS.valeur.courante*model.PVS.valeur.courante*4);

  for (let i=0 ; i < model.PVS.valeur.courante*model.PVS.valeur.courante*4 ; i=i+4) {
    pvFloat32[i]=   Math.random()*2-1;
    pvFloat32[i+1]= Math.random()*2-1;
    pvFloat32[i+2]= Math.random()*2-1;
    pvFloat32[i+3]= Math.random()*2-1;
    image1[i]=   Math.random()*2-1;
    image1[i+1]= Math.random()*2-1;
    image1[i+2]= Math.random()*2-1;
    image1[i+3]= Math.random()*2-1;

  }
 

  positionTex = makeBufferPosition(NBRE);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
  gl.enableVertexAttribArray(afficheurShader.position);
  gl.vertexAttribPointer(afficheurShader.position, 2, gl.UNSIGNED_SHORT, false, 0, 0);


  GRIDX= Math.floor(CSW / model.gridStep.valeur.courante);
  GRIDY= Math.floor(CSH / model.gridStep.valeur.courante);


  vertex_buffer = gl_Traitement.createBuffer();
  gl_Traitement.bindBuffer(gl_Traitement.ARRAY_BUFFER, vertex_buffer); // arrayBuffer = vertex_buffer
  gl_Traitement.bufferData(gl_Traitement.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl_Traitement.STATIC_DRAW);
  gl_Traitement.enableVertexAttribArray(sobelShader.coordinates);
  gl_Traitement.vertexAttribPointer(sobelShader.coordinates, 2, gl_Traitement.FLOAT, false, 0, 0);
  gl_Traitement.bindBuffer(gl_Traitement.ARRAY_BUFFER, null);

  /*
  var T0 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, T0);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, model.PVS.valeur.courante, model.PVS.valeur.courante, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255,255,255,255,...new Array(model.PVS.valeur.courante * model.PVS.valeur.courante * 4-4)]));
  var fbT0 = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbT0);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, T0, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER).toString(16) == "8cd5") console.log("fbT0 is complete"); else console.log("fbT0 is NOT complete");
  */

  pixT0=gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D,pixT0);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  var T1 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, T1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, model.PVS.valeur.courante, model.PVS.valeur.courante, 0, gl.RGBA, gl.FLOAT, new Float32Array([-1.0054558515548706,0.9974316358566284,0,0,...new Array(model.PVS.valeur.courante * model.PVS.valeur.courante * 4-4)]));
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, model.PVS.valeur.courante, model.PVS.valeur.courante, 0, gl.RGBA, gl.FLOAT, pvFloat32);

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
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, model.PVS.valeur.courante, model.PVS.valeur.courante, 0, gl.RGBA, gl.FLOAT, new Float32Array([-0.996874988079071, 0.9958333373069763,0,0,...new Array(model.PVS.valeur.courante * model.PVS.valeur.courante * 4-4)]));
  //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, model.PVS.valeur.courante, model.PVS.valeur.courante, 0, gl.RGBA, gl.FLOAT, new Float32Array(Array(model.PVS.valeur.courante * model.PVS.valeur.courante * 4).fill(0)));
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, model.PVS.valeur.courante, model.PVS.valeur.courante, 0, gl.RGBA, gl.FLOAT, image1);

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
  for (let k = 0; k < GRIDX * GRIDY; k++) f32[k * 4 + 3] = Math.random()  ; 
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
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, model.PVS.valeur.courante, model.PVS.valeur.courante, 0, gl.RGBA, gl.FLOAT, null);
  // webgl2 gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, model.PVS.valeur.courante, model.PVS.valeur.courante, 0, gl.RGBA, gl.FLOAT, null);
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
  //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, CSH, CSH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  var textureWebcamSobel = gl_Traitement.createTexture();
  gl_Traitement.activeTexture(gl_Traitement.TEXTURE7);
  gl_Traitement.bindTexture(gl_Traitement.TEXTURE_2D, textureWebcamSobel);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_MIN_FILTER, gl_Traitement.NEAREST);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_MAG_FILTER, gl_Traitement.NEAREST);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_WRAP_S, gl_Traitement.CLAMP_TO_EDGE);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_WRAP_T, gl_Traitement.CLAMP_TO_EDGE);
  //gl_Traitement.texImage2D(gl_Traitement.TEXTURE_2D, 0, gl_Traitement.RGBA, gl_Traitement.RGBA, gl_Traitement.UNSIGNED_BYTE, img);
  gl_Traitement.texImage2D(gl_Traitement.TEXTURE_2D, 0, gl_Traitement.RGBA, 1, 1, 0, gl_Traitement.RGBA, gl_Traitement.UNSIGNED_BYTE, new Uint8Array([255,255,255,255]));
  //gl_Traitement.pixelStorei(gl_Traitement.UNPACK_FLIP_Y_WEBGL, true);

  //gl_Traitement.texImage2D(gl_Traitement.TEXTURE_2D, 0, gl_Traitement.RGBA, CSW, CSH, 0, gl_Traitement.RGBA, gl_Traitement.UNSIGNED_BYTE, null);
  /*
  sobelOutput = gl_Traitement.createTexture();
  gl_Traitement.activeTexture(gl_Traitement.TEXTURE4);
  gl_Traitement.bindTexture(gl_Traitement.TEXTURE_2D, sobelOutput);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_MIN_FILTER, gl_Traitement.NEAREST);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_MAG_FILTER, gl_Traitement.NEAREST);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_WRAP_S, gl_Traitement.CLAMP_TO_EDGE);
  gl_Traitement.texParameteri(gl_Traitement.TEXTURE_2D, gl_Traitement.TEXTURE_WRAP_T, gl_Traitement.CLAMP_TO_EDGE);
  gl_Traitement.texImage2D(gl_Traitement.TEXTURE_2D, 0, gl_Traitement.RGBA, CSW, CSH, 0, gl_Traitement.RGBA, gl_Traitement.UNSIGNED_BYTE, null);

  fbSobel = gl_Traitement.createFramebuffer();
  gl_Traitement.bindFramebuffer(gl_Traitement.FRAMEBUFFER, fbSobel);
  gl_Traitement.framebufferTexture2D(gl_Traitement.FRAMEBUFFER, gl_Traitement.COLOR_ATTACHMENT0, gl_Traitement.TEXTURE_2D, sobelOutput, 0);
  */

/*
  var textureEcran = gl.createTexture();
  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, textureEcran);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, CSW, CSH, 0, gl.RGBA, gl.FLOAT, null);
  fbEcran = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbEcran);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureEcran, 0);
*/

  //var update = new Worker("update.js");

  //update.onmessage = onWorkEnded;
  
  // pas besoin pour l'instant
  /*
  ctx  = document.getElementById("telecran").getContext('2d');
  ctx.canvas.width  = CSW;
  ctx.canvas.height = CSH;
  ctx.drawImage(img, 0, 0, CSW, CSH);
  */

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


// T0 image particle 
// T1 , T3 position vitesse
// T2 gridTex
// T7 webcam
// T6 texture après traitement pour main2
// T8 image1

//mercredi
//+
//ecouteurRecord(canvas);


  
  if (!req) {req =window.requestAnimationFrame(animate);}

}







function animate(timestamp) {


    var TEXTURE_UNIT_pv = swap ? 1 : 3 ;
    var framebuffer = swap ? fbT3 : fbT1 ;

    var fbPvCurrent = swap ? fbT1 : fbT3 ;
//{tbT1,fbT3}={fbT3,fbT1};


    /// SOBEL // ************************************************************
    /// SOBEL // ************************************************************
    /// SOBEL // ************************************************************
    gl_Traitement.useProgram(       sobelShader);
    gl_Traitement.viewport(0, 0, CSW_T, CSH_T);
    gl_Traitement.bindFramebuffer(  gl_Traitement.FRAMEBUFFER, null);
    //gl_Traitement.bindBuffer(       gl_Traitement.ARRAY_BUFFER, vertex_buffer);
    //gl_Traitement.enableVertexAttribArray(  sobelShader.coordinates );
    //gl_Traitement.vertexAttribPointer(      sobelShader.coordinates, 2, gl_Traitement.FLOAT, false, 0, 0);
    //gl_Traitement.activeTexture(gl_Traitement.TEXTURE7); marche sans
    gl_Traitement.texImage2D(gl_Traitement.TEXTURE_2D, 0, gl_Traitement.RGBA, gl_Traitement.RGBA, gl_Traitement.UNSIGNED_BYTE, video);
    gl_Traitement.drawArrays(gl_Traitement.TRIANGLE_STRIP, 0, 4);


    /// AFFICHEUR // ************************************************************
    /// AFFICHEUR // ************************************************************
    /// AFFICHEUR // ************************************************************
    gl.useProgram(afficheurShader);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); 
    gl.enable(gl.BLEND);
    gl.blendFunc(gl[model.blend1.valeur.courante], gl[model.blend2.valeur.courante]);
    //gl.clearColor(fond.r / 255, fond.v / 255, fond.b / 255, fond.a / 255);
    //gl.clearColor(0,0,0,1);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, CSW, CSH);
    gl.uniform1i(afficheurShader.pvTex     , TEXTURE_UNIT_pv ); // 1er tour vaut 1, 2e tour vaut 3
    gl.drawArrays(gl.POINTS, 0, NBRE);


    /// GRID // ************************************************************
    /// GRID // ************************************************************
    /// GRID // ************************************************************
    gl.useProgram(gridShader);
    //gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    //gl.enableVertexAttribArray(gridShader.position);
    //gl.vertexAttribPointer(gridShader.position, 2, gl.UNSIGNED_SHORT, false, 0, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbT2); 
    gl.viewport(0, 0, GRIDX, GRIDY);
    gl.clearColor(0, 0, 0,  0);
    gl.colorMask(true, true, true,false);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1i(gridShader.pvTex, TEXTURE_UNIT_pv); // 1 puis 3
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.drawArrays(gl.POINTS, 0, NBRE);
    gl.disable(gl.BLEND);
    gl.colorMask(true, true, true, true);




    /// MAIN2 // ************************************************************
    /// MAIN2 // ************************************************************
    /// MAIN2 // ************************************************************
    gl.useProgram(main2Shader);
    //gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
    //gl.enableVertexAttribArray(main2Shader.position);
    //gl.vertexAttribPointer(main2Shader.position, 2, gl.UNSIGNED_SHORT, false, 0, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); // fbT3 puis fbT1  
    gl.viewport(0, 0, model.PVS.valeur.courante, model.PVS.valeur.courante);
    gl.activeTexture(gl.TEXTURE6);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, traitement);
    gl.uniform1i(main2Shader.pvTex ,        TEXTURE_UNIT_pv ); // T1 puis T3
    gl.uniform2f(main2Shader.mouseCoords,   mouseX, mouseY  );
    gl.uniform1i(main2Shader.click,         click           );
    gl.drawArrays(gl.POINTS, 0, NBRE);


    swap = !swap;
    if( capturer ) capturer.capture( glcanvas );

    req=requestAnimationFrame(animate);


}



function makeBufferPosition(size) {
    let geometry = [];
	geometry.length = size;
	let k=0;
    for (; k < size; k++) {
        geometry[2*k]=k % model.PVS.valeur.courante;
        geometry[2*k+1]=Math.floor( k / model.PVS.valeur.courante);
    }
   // console.log("geometry :");console.log(geometry);
    let buffer = gl.createBuffer();
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
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
}
function gotStream(mediaStream) {
  video.srcObject = mediaStream;

}
function handleError(error) {
  console.error('Error: ', error);
}
function onWorkEnded(evt) {

  model.PVS.valeur.courante = evt.data.PVS;
  NBRE = evt.data.NBRE;

  gl.activeTexture(gl.TEXTURE1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, model.PVS.valeur.courante, model.PVS.valeur.courante, 0, gl.RGBA, gl.FLOAT, new Float32Array(evt.data.pvFloat32) );
  gl.activeTexture(gl.TEXTURE3);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, model.PVS.valeur.courante, model.PVS.valeur.courante, 0, gl.RGBA, gl.FLOAT, new Float32Array(evt.data.pvFloat32) );

  gl.activeTexture(gl.TEXTURE8);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, model.PVS.valeur.courante, model.PVS.valeur.courante, 0, gl.RGBA, gl.FLOAT, new Float32Array(evt.data.image1Float));

  gl.activeTexture(gl.TEXTURE0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, model.PVS.valeur.courante, model.PVS.valeur.courante, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(evt.data.colorUint));

  gl.bindBuffer(gl.ARRAY_BUFFER, positionTex);
  gl.bufferData(gl.ARRAY_BUFFER,new Uint16Array(evt.data.geometry),gl.STATIC_DRAW);

  updateModel();


}