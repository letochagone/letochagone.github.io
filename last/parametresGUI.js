
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
        gl.uniform1i(afficheurShader.mapColor , 0 );
        gl.uniform2f(afficheurShader.resolution ,   CSW , CSH);

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
                                ([key,value]) => { value.courante = value.defaut;}
                            )
    );

    let gui = document.querySelector("#gui");
    gui.addEventListener('click', event => { 
        event.preventDefault();

        if (event.target.nodeName == "BUTTON") {

            let id = event.target.parentNode.id ;
            let parametre=document.querySelector("#"+id);
            let curseur= parametre.querySelector(".curseur");
            let valeur = parametre.querySelector(".valeur");

            if (curseur) { 
                curseur.value=model[id].valeur.defaut;
                model[id].valeur.courante = valeur.valueAsNumber ;
                updateModel();

             }
            if (valeur) { 
                valeur.value=model[id].valeur.defaut;
                model[id].valeur.courante = valeur.valueAsNumber ;
                updateModel();
            }

            if (id === 'saveModel') {
                Object.entries(model).map( 
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
                console.log(JSON.stringify(model));
            }
        }
    });


    gui.addEventListener('input', event => { 

        event.preventDefault();
        //console.log(event.target.nodeName);

        if (event.target.nodeName == "SELECT") {
            model[event.target.id].valeur.courante = event.target.value;
            return;
        }
        console.log("trace event");
        let id = event.target.parentNode.id ;
                console.log(id);
        let parametre=document.querySelector("#"+id);
        let curseur= parametre.querySelector(".curseur");
                console.log(curseur);
        let valeur = parametre.querySelector(".valeur");
                console.log(valeur);
        let eventClass = event.target.className ;
                console.log(eventClass);


        if (!curseur && eventClass === 'valeur') { // le parametre n'a pas de curseur
                console.log("a");
                model[id].valeur.courante   = valeur.valueAsNumber ;
                cancelAnimationFrame(req);
                req = undefined ;
                start();

        }

        if (valeur && eventClass  === 'curseur' ) {
            console.log("a");

                valeur.value = curseur.valueAsNumber ;
                model[id].valeur.courante = valeur.valueAsNumber ;
                updateModel();

        }
        if (!valeur && eventClass  === 'curseur' ) {
            console.log("e");

                model[id].valeur.courante = curseur.valueAsNumber ;
                updateModel();

        }
        if (curseur && eventClass === 'valeur') {
            console.log("b");


                curseur.value               = valeur.valueAsNumber ;
                model[id].valeur.courante   = valeur.valueAsNumber ;
                updateModel();

        }
        if (eventClass === 'max'  || eventClass === 'min') {
            console.log("c");

                valeur[eventClass]              = event.target.valueAsNumber;
                curseur[eventClass]             = event.target.valueAsNumber;
                model[id][eventClass].courante  = event.target.valueAsNumber;

        }
                
        if (eventClass === 'step') {
            console.log("d");

                valeur.step             = event.target.valueAsNumber;
                curseur.step            = event.target.valueAsNumber;
                model[id].step.courante = event.target.valueAsNumber;
        }


    });

             
    let vit0 = document.querySelector("#vit0");
    vit0.addEventListener('change', e => {
        e.preventDefault();

        if (e.target.className === 'valeur' || e.target.className === 'curseur') {
            model.vit0.valeur.courante = e.target.valueAsNumber;
            cancelAnimationFrame(req);
            req=undefined;
            start();

        }

    });

    let scale = document.querySelector("#scale");
    scale.addEventListener('change', e => {
        //start();
        
          //  model.scale.valeur.courante = e.target.value;
          // cancelAnimationFrame(req);
          // req = undefined ;
            //          start();

           // efface();
           // DOM_LOADED_AND_LISTENING();
          //  console.log(model);

        });
    let resolution = document.querySelector("#resolution");
    resolution.addEventListener('change', e => {
        //start();
        console.log("res");
        cancelAnimationFrame(req);
        req = undefined ;
        CSW=640;
        CSH=480;
        webcamConstraints = vgaConstraints ;

                 start();

           // efface();
           // DOM_LOADED_AND_LISTENING();
          //  console.log(model);

        });


    for (let i=0; i < 29 ; i++) {

        let id          = Object.keys(model)[i];
        let parametre   = document.querySelector("#"+id);
        let curseur     = parametre.querySelector(".curseur");
        let valeur      = parametre.querySelector(".valeur");
        let min         = parametre.querySelector(".min");
        let max         = parametre.querySelector(".max");
        let step        = parametre.querySelector(".step");

    console.log(id);
        if (id === "blend1" || id === "blend2") {
            parametre.value = model[id].valeur.defaut;
        }
        if (valeur) {
            valeur.max =   model[id].max.defaut;
            valeur.min =   model[id].min.defaut;
            valeur.step =  model[id].step.defaut;
            valeur.value = model[id].valeur.defaut;

        }

        if (curseur) {
            curseur.max =   model[id].max.defaut;
            curseur.min =   model[id].min.defaut;
            curseur.step =  model[id].step.defaut;
            curseur.value = model[id].valeur.defaut;

        }
        
        model[id].valeur.courante  =  model[id].valeur.defaut;

        if (min) {min.value = model[id].min.defaut; model[id].min.courante  =  model[id].min.defaut;}

        if (max) {max.value = model[id].max.defaut; model[id].max.courante  =  model[id].max.defaut;}

        if (step) {step.value = model[id].step.defaut; model[id].step.courante  =  model[id].step.defaut;}
      
    }



}
