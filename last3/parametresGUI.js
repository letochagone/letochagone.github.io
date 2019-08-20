
function hidegui() {
        document.getElementById("gui").style.display = "none";
        document.getElementById("showgui").style.display = "initial";
        document.getElementById("hidegui").style.display = "none";}

function showgui() {
        document.getElementById("gui").style.display = "initial";
        document.getElementById("showgui").style.display = "none";
        document.getElementById("hidegui").style.display = "initial";}





function updateModel() {


        gl.useProgram(afficheurShader);
        gl.uniform1f(afficheurShader.PVS ,          model.PVS.valeur.courante );
        gl.uniform1f(afficheurShader.alpha ,        model.alpha.valeur.courante);
        gl.uniform1f(afficheurShader.lumi ,         model.lumi.valeur.courante);
        gl.uniform1f(afficheurShader.flamme ,       model.flamme.valeur.courante);
        gl.uniform1f(afficheurShader.delta2 ,       model.delta2.valeur.courante);
        gl.uniform1f(afficheurShader.pointSize ,    model.pointSize.valeur.courante);
        //gl.uniform1i(afficheurShader.mapColor , 0 );
        gl.uniform2f(afficheurShader.resolution ,   CSW , CSH);
        gl.uniform1i(afficheurShader.pix ,  0);


        gl.useProgram(main2Shader);
        gl.uniform1f(main2Shader.force,         model.force.valeur.courante     );
        gl.uniform1f(main2Shader.gravity,       model.gravity.valeur.courante   );
        gl.uniform1f(main2Shader.forceMouse,    model.forceMouse.valeur.courante   );
        gl.uniform1f(main2Shader.maxAngle,      model.maxAngle.valeur.courante   );
        gl.uniform1f(main2Shader.angleBase ,    model.angleBase.valeur.courante  );
        gl.uniform1f(main2Shader.slowdown,      model.slowdown.valeur.courante   );
        gl.uniform1f(main2Shader.choc ,         model.choc.valeur.courante       );
        gl.uniform1f(main2Shader.seuil,         model.seuil.valeur.courante     );
        gl.uniform1f(main2Shader.seuilMouse,    model.seuilMouse.valeur.courante );
        gl.uniform1f(main2Shader.dt,            model.dt.valeur.courante       );
        gl.uniform1f(main2Shader.collisionMax,  model.collisionMax.valeur.courante );
        gl.uniform1f(main2Shader.PVS ,          model.PVS.valeur.courante             );
        gl.uniform1i(main2Shader.gridTex ,      2               );
        gl.uniform2f(main2Shader.gridSize ,     GRIDX, GRIDY    );
        gl.uniform2f(main2Shader.resolution ,   CSW, CSH        );
        gl.uniform1i(main2Shader.image1,        8               ); 
        gl.uniform1i(main2Shader.textureInput,  6               );
        gl.uniform1f(main2Shader.uVelocityMax,  model.uVelocityMax.valeur.courante );
        gl.uniform1f(main2Shader.normalForce ,  model.normalForce.valeur.courante );


        gl.useProgram(gridShader);
        gl.uniform1f(gridShader.PVS, model.PVS.valeur.courante);

        gl_Traitement.useProgram(sobelShader);
        gl_Traitement.uniform1i(sobelShader.texture,7);
        gl_Traitement.uniform2f(sobelShader.resolution, CSW_T  , CSH_T);
        gl_Traitement.uniform1f(sobelShader.brightness ,  model.brightness.valeur.courante );
        gl_Traitement.uniform1f(sobelShader.contrast ,    model.contrast.valeur.courante );
        gl_Traitement.uniform1f(sobelShader.saturation ,  model.saturation.valeur.courante );
        gl_Traitement.uniform1f(sobelShader.threshold ,   model.threshold.valeur.courante );
var a=0.1;
        gl_Traitement.uniform2f(sobelShader.px ,   1/ CSW , 1/CSH );
        gl_Traitement.uniform1fv(sobelShader.m ,   new Float32Array(

   [
            1,  1, 1,
            1, 1, 1,
            1, 1, 1
        ]
            ) );


        gl_Traitement.uniform1f(sobelShader.threshold ,   model.threshold.valeur.courante );

    
}

function fillGui() {

    Object.entries(model).map( 
        ([key, value]) =>   Object.entries(value).map( 

                               ([key,value]) => { //value.courante = value.defaut;
                               }
                            )
    );
/*
 if ('courante' in value ) {
                                                    value.defaut = value.courante;
                                                    delete value.courante;
                                                }
     */
    let scaleValeur = document.querySelector("#scale .valeur");
    scaleValeur.addEventListener('change', 
                event => {
                    event.preventDefault();
                    model['scale'].valeur.courante = Number(event.target.value);
                    updateModel();

                });
    let PVSValeur = document.querySelector("#PVS .valeur");
    PVSValeur.addEventListener('change', 
                event => {
                    event.preventDefault();
                    model['PVS'].valeur.courante = Number(event.target.value);
                    cancelAnimationFrame(req);
                    req = undefined ;
                    start();

                });
    let gridStepValeur = document.querySelector("#gridStep .valeur");
    gridStepValeur.addEventListener('change', 
                event => {
                    event.preventDefault();
                    model['gridStep'].valeur.courante = Number(event.target.value);
                    cancelAnimationFrame(req);
                    req = undefined ;
                    start();

                });
    //let item0='alpha';
    ['alpha','lumi','flamme','delta2','force','gravity','forceMouse','seuilMouse','maxAngle',
    'angleBase','slowdown','choc','seuil','dt','collisionMax','vit0','pointSize','uVelocityMax','normalForce',
    'brightness','contrast','saturation','threshold'
    ].forEach(
    item0=>{

        let item='curseur';
        var eglr = document.querySelector("#"+item0+" ."+item);
        eglr.addEventListener('input', 
                event => {
                    event.preventDefault();
                    document.querySelector("#"+item0+" ."+'valeur').value = Number(event.target.value);
                    model[item0].valeur.courante = Number(event.target.value) ;
                    updateModel();
                });

        item='valeur';
        var eglr1 = document.querySelector("#"+item0+" ."+item);
        eglr1.addEventListener('input', 
                event => {
                    event.preventDefault();
                    document.querySelector("#"+item0+" ."+'curseur').value = Number(event.target.value) ;
                    model[item0].valeur.courante = Number(event.target.value);
                    updateModel();

                });

        item='reset';
        var eglr2 = document.querySelector("#"+item0+" ."+item);
        eglr2.addEventListener('click', 
                event => {
                    event.preventDefault();
                    document.querySelector("#"+item0+" ."+'curseur').value = 0; 
                    document.querySelector("#"+item0+" ."+'valeur').value = 0; 
                    model[item0].valeur.courante =0;

                    updateModel();
                });


        ['min','max','step'].forEach(
            item => {
                const eglr = document.querySelector("#"+item0+" ."+item);
                eglr.addEventListener('change', 
                    event => {
                    event.preventDefault();

                    document.querySelector("#"+item0+" ."+'valeur')[item] = Number(event.target.value) ;
                    document.querySelector("#"+item0+" ."+'curseur')[item] = Number(event.target.value) ;

                    model[item0][item].courante  = Number(event.target.value);
                    updateModel();
                });

            }
        );
    }
    );

   
    let consoleButton = document.querySelector("#console");
    consoleButton.addEventListener('click', 
        event => {

                    console.log(disprec(model));

                    Object.entries(model).map( ([key, value]) => 
                        Object.entries(value).map( ([key,value]) => {
                            if ('courante' in value ) {
                                //value.defaut = value.courante;
                                //delete value.courante;
                            }
                        })
                    );
                }
    );

    let blend1 = document.querySelector("#blend1");
    blend1.addEventListener('change', 
        event => {
                    model.blend1.valeur.courante = blend1.value;
                    updateModel();  
                }
    );
    let blend2 = document.querySelector("#blend2");
    blend2.addEventListener('change', 
        event => {
                    model.blend2.valeur.courante = blend2.value;
                    updateModel();   
                }
    );


function disprec(o) {
    let s="{";
    let lon=Object.keys(o).length;
    let coura=1;
    let separateur=" , ";
    for (let [key, value] of Object.entries(o)) {
        let propchaine;
        if (typeof(value)==="object") propchaine = disprec(value);
        //else propchaine=value;
        if (typeof(value)==="string") propchaine= `"${value}"`;
        if (typeof(value)==="number") propchaine=  value;
       // if (key==='blend1' || key==='blend2') s += `${key}:"${o[key].valeur.courante}"`;
       // else 
         s += `${key}:${propchaine}`;
        if (coura === lon) separateur="";
        s += separateur;
        coura++;
        
    }
    return s+"}";
  
}
    



for (let [key, value] of Object.entries(model)) {

    let parametre = document.querySelector("#"+key);
    if (!parametre) continue;
    let curseur     = parametre.querySelector(".curseur");
    let valeur      = parametre.querySelector(".valeur");
    let min         = parametre.querySelector(".min");
    let max         = parametre.querySelector(".max");
    let step        = parametre.querySelector(".step");
    
    console.log(parametre);


    if (key === "blend1" || key === "blend2") parametre.value = model[key].valeur.courante;

    if (valeur) {
            valeur.max =   model[key].max.courante;
            valeur.min =   model[key].min.courante;
            valeur.step =  model[key].step.courante;
            valeur.value = model[key].valeur.courante;

    }

    if (curseur) {
            curseur.max =   model[key].max.courante;
            curseur.min =   model[key].min.courante;
            curseur.step =  model[key].step.courante;
            curseur.value = model[key].valeur.courante;
    }

    if (min) {min.value = model[key].min.courante; }

    if (max) {max.value = model[key].max.courante; }

    if (step) {step.value = model[key].step.courante; }
}
             

let resX = document.querySelector("#resX");
let resY = document.querySelector("#resY");
let resCssX = document.querySelector("#resCssX");
let resCssY = document.querySelector("#resCssY");

resX.addEventListener('change', 
        event => {
                    CSW=Number(event.target.value);
                     cancelAnimationFrame(req);
                    req = undefined ;
                    start();
                }
    );
resY.addEventListener('change', 
        event => {
                    CSH=Number(event.target.value);
                    cancelAnimationFrame(req);
                    req = undefined ;
                    start();
                }
    );
resCssX.addEventListener('change', 
        event => {
                    CSSX=Number(event.target.value);
                    cancelAnimationFrame(req);
                    req = undefined ;
                    start();
                }
    );
resCssY.addEventListener('change', 
        event => {
                    CSSY=Number(event.target.value);
                    cancelAnimationFrame(req);
                    req = undefined ;
                    start();
                }
    );
resX.value = CSW;
resY.value = CSH;
resCssX.value = CSSX;
resCssY.value = CSSY;



}
