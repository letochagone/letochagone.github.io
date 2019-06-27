self.onmessage =  function(e) {

    let CSW     = e.data.CSW   ;
    let CSH     = e.data.CSH   ;
    let vit0    = e.data.vit0  ;
    let scale   = e.data.scale ;
    var rawpix  = e.data.rawpix;
    let pvFloat32=[];
    let image1Float=[];
    let colorUint=[];
    let NBRE  = 0;
    let la=0; 
    let range = 0.0001;

    for (let j = 0 ; j < CSH ; j++) {

        for (let i = 0 ; i < CSW ; i++) {

            let k = (j * CSW + i) * 4;

            let r = rawpix[k    ] ;
            let v = rawpix[k + 1] ;
            let b = rawpix[k + 2] ; 

            if ( r || v || b ) {

                let l = scale;
                let p =  (2 * i - CSW + 1) /  CSW ;
                let q =  (2 * j - CSH + 1) / -CSH ;

                while (l--) {

                    NBRE++ ;

                    let lb = la+1 ;
                    let lc = la+2;
                    let ld = la+3;

                    pvFloat32[la] = p + ( 2 * Math.random()-1)*range ;
                    pvFloat32[lb] = q + ( 2 * Math.random()-1)*range ;

                    let vx = (2*Math.random()-1) * vit0;
                    let vy = (2*Math.random()-1) * vit0;

                    pvFloat32[lc] = vit0;
                    pvFloat32[ld] = vy ;

                    image1Float[la] = p + ( 2 * Math.random()-1)*range ;
                    image1Float[lb] = q + ( 2 * Math.random()-1)*range ;
                    image1Float[lc] = 0 ;
                    image1Float[ld] = 0 ;

                    colorUint[la] = r ;
                    colorUint[lb] = v ;
                    colorUint[lc] = b ;
                    colorUint[ld] = 255;

                    la = la +   4 ;
                        
                }
            }
        }
    }

    PVS = Math.pow(2, Math.ceil(Math.log(Math.ceil(Math.sqrt(NBRE))) / Math.LN2));
    var r1 = new Float32Array([...pvFloat32,...new Float32Array(PVS*PVS*4-NBRE*4)]);
    var r2 = new Float32Array([...image1Float,...new Float32Array(PVS*PVS*4-NBRE*4)]);
    var r3 = new Uint8Array([...colorUint,...new Uint8Array(PVS*PVS*4-NBRE*4)]);

    var geometry = [];
    geometry.length = NBRE;
    let k=0;
    for (; k < NBRE; k++) {
        geometry[2*k]=k % PVS;
        geometry[2*k+1]=Math.floor( k / PVS);
    }
    var message={pvFloat32:r1,image1Float:r2,colorUint:r3,NBRE:NBRE,PVS:PVS,geometry:geometry};

    self.postMessage(message);

}