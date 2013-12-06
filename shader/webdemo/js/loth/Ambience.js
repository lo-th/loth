/**
 * @author loth / http://3dflashlo.wordpress.com/
 */

var Ambience = function () {
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none; '
	var mini = true;


    var container = document.createElement( 'div' );
	container.id = 'Ambience';
	container.style.cssText = unselect+'width:260px;position:absolute;bottom:8px; left:276px; color:#CCCCCC;font-size:12px;font-family:Monospace;text-align:center;';//pointer-events:none;

	var aMini = document.createElement( 'div' );
	aMini.style.cssText = 'padding:0px 1px; position:relative; display:block;-webkit-border-top-left-radius:20px; border-top-left-radius: 20px;-webkit-border-top-right-radius: 20px; border-top-right-radius: 20px;';//' background-color:#ff55ff';
	container.appendChild( aMini );

	var buttonStyle = 'width:20px; position:relative;padding:4px 2px;margin:2px 2px; -webkit-border-radius: 20px; border-radius:20px; border:1px solid rgba(1,1,1,0.2); background-color: rgba(1,1,1,0.2); display:inline-block; text-decoration:none; cursor:pointer;';
	
	var bnext = document.createElement( 'div' );
	bnext.style.cssText = buttonStyle;
	bnext.textContent = ">";

	var bprev = document.createElement( 'div' );
	bprev.style.cssText = buttonStyle;
	bprev.textContent = "<";

	var bcenter = document.createElement( 'div' );
	bcenter.style.cssText = buttonStyle+'width:80px';
	bcenter.textContent = "Ambiente";

	aMini.appendChild( bprev );
	aMini.appendChild( bcenter );
	aMini.appendChild( bnext );

	var bigMap = document.createElement( 'div' );
	bigMap.style.cssText = ' width:256px;height:256px; position:relative;margin:2px 0px; display:none; visibility:hidden';
	aMini.appendChild( bigMap );

	var bigGradian = document.createElement( 'div' );
	bigGradian.style.cssText = ' width:256px;height:102px; position:relative;margin:2px 0px; display:none; visibility:hidden';
	aMini.appendChild( bigGradian );

	var bigColor = document.createElement( 'div' );
	bigColor.style.cssText = ' width:256px;height:64px; position:relative;margin:2px 0px; display:none; visibility:hidden';
	aMini.appendChild( bigColor );

	bcenter.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); openPannel() }, false );
	bprev.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); prev() }, false );
	bnext.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); next() }, false );

	bcenter.addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.6)'; this.style.backgroundColor = 'rgba(1,1,1,0.6)';  }, false );
    bcenter.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.2)'; this.style.backgroundColor = 'rgba(1,1,1,0.2)';  }, false );
    bprev.addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.6)'; this.style.backgroundColor = 'rgba(1,1,1,0.6)';  }, false );
    bprev.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.2)'; this.style.backgroundColor = 'rgba(1,1,1,0.2)';  }, false );
    bnext.addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.6)'; this.style.backgroundColor = 'rgba(1,1,1,0.6)';  }, false );
    bnext.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.2)'; this.style.backgroundColor = 'rgba(1,1,1,0.2)';  }, false );

    var openPannel = function () {
    	if(mini){

    		mini=false;
    		aMini.style.border = '1px solid #010101';
    		container.style.bottom = '-1px';

    		bigMap.style.display = 'block';
    		bigMap.style.visibility = 'visible';

    		bigGradian.style.display = 'block';
    		bigGradian.style.visibility = 'visible';

    	}else{
    		mini=true;
    		aMini.style.border = 'none';
    		container.style.bottom = '8px';

    		bigMap.style.display = 'none';
    		bigMap.style.visibility = 'hidden';

    		bigGradian.style.display = 'none';
    		bigGradian.style.visibility = 'hidden';

    		bigColor.style.display = 'none';
    		bigColor.style.visibility = 'hidden';
    	}
	}

	//--------------------------------------
    // 3D SIDE
    //--------------------------------------
    var envSphere, envMaterial, cubeCamera;
    var materials = [];

    function loadSphere(sc, mats, N, PY, S){
    	materials = mats;
		var seaLoader = new THREE.SEA3D( true );
		seaLoader.onComplete = function( e ) {
			var posY = PY  || -1000 ;
			var s = S || 1 ;
			var geo = seaLoader.meshes[0].geometry;
			envMaterial = new THREE.MeshBasicMaterial( {map:texture} );
			envSphere = new THREE.Mesh(geo, envMaterial);
			envSphere.scale.set(s,s,s);
			envSphere.position.set(0,posY,0);
			cubeCamera = new THREE.CubeCamera( 0.1, s*1.2, 128 );
			cubeCamera.scale.set(-1,1,1);
			cubeCamera.position.set(0,posY,0);
			cubeCamera.lookAt( new THREE.Vector3(0,posY,5))
			//cubeCamera.updateCubeMap( render, scene );

			sc.add( envSphere );
			sc.add( cubeCamera );

			for(var i=0;i!==materials.length; i++){
				materials[i].envMap = cubeCamera.renderTarget;
				//materials[i].combine = THREE.MixOperation;
				//materials[i].reflectivity = 1;
			}

			//materialAnim.envMap = cubeCamera.renderTarget;
			//materialTrans.envMap = cubeCamera.renderTarget;
			//sc=SC

			
		}
		var n = N || 2;
		seaLoader.load( "webdemo/assets/models/sphere"+n+".sea" );
	}

	var applyMaterial = function () {
		// update texture
		if(texture==null){
			texture = new THREE.Texture(canvasSphere[0]);
		   // texture.anisotropy = MaxAnistropy;
		    texture.needsUpdate = true;
		}
		
		// update material 
		if(envMaterial){
			texture.needsUpdate = true;
			envMaterial.map = texture;
			//if(material)material.uniforms.tMatCap.value=texture;
			
		}
	}

    //--------------------------------------
    // SHADER PRESET
    //--------------------------------------

    var canvasSphere, ctxSphere;
    var canvasSphere2, ctxSphere2;
    var canvasSphere3, ctxSphere3;
    var alphaset, alphatxt;
    var lineset, linetxt;
	var canvasSphere=[];
	var canvasHelper=[];
	var canvasColors=[];

	var mh = [];
	var grd = [];
	var cac = [];
	var drag2 = false;
	var drag3 = false;

	var finalPreset;
	var finalPresetButton;
	var isShowfinalPreset = false;
	var currentColor = -1;


	var ctxs=[];
	var ctxh=[];
	var ctxc=[];
	var dragcc=[];
	var grads = [];

	var texture;
    var currentShader = 0;
    var tweenner = [];
    var GRD = {
		line:10, alpha:0.5,
		ranging:{ 
			r0:0.1,r1:0.3,r2:0.8,r3:1,
			r4:0.1,r5:0.5,r6:0.95,r7:1,
			r8:0.1,r9:0.5,r10:0.95,r11:1
		},
		positions:{ 
			p0:128, p1:50, p2:128, p3:128,
			p4:128, p5:200, p6:128, p7:128 
		},
		colors:{ 
			r0:0 ,   v0:0 ,   b0:0 ,   a0:1,
			r1:60,   v1:60,   b1:60,   a1:1,
			r2:60,   v2:60,   b2:60,   a2:1,
			r3:0 ,   v3:0,    b3:0,    a3:1,

			r4:255,  v4:255,  b4:255,  a4:1,
			r5:180,  v5:180,  b5:180,  a5:1,
			r6:60,   v6:60,   b6:60,   a6:0.5,
			r7:0,    v7:0,    b7:0,    a7:0 ,

			r8:0,    v8:0,    b8:0,    a8:1,
			r9:20,   v9:20,   b9:20,   a9:0.5, 
			r10:30,  v10:30,  b10:30,  a10:0.1,
			r11:0,   v11:0,   b11:0,   a11:0
		}
	}

	var initInterface = function (){
		finalPresetButton = document.createElement( 'div' );
		finalPresetButton.style.cssText = buttonStyle+'width:80px';
		finalPresetButton.textContent = "Display settng";
		finalPreset = document.createElement( 'div' );
		finalPresetButton.style.cssText = 'font-size:9px; position:relative; padding:10px 10px; display:block; width:256px; height:0px; border-radius: 10px; border:1px solid #010101; background-color: #111; text-align:left; visibility:hidden;';

		finalPresetButton.addEventListener('click',function(e){
			if(isShowfinalPreset){isShowfinalPreset = false;  finalPreset.classList.remove('active');}
			else {isShowfinalPreset=true; finalPreset.classList.add('active'); traceCurrent();}
		});

		mh[0]= document.createElement( 'div' );//document.getElementById('mh0');
		mh[1]= document.createElement( 'div' );//document.getElementById('mh1');
		mh[2]= document.createElement( 'div' );//document.getElementById('mh2');
		mh[3]= document.createElement( 'div' );//document.getElementById('mh3');

		mh[0].style.cssText = mh[1].style.cssText ='pointer-events:none; position:absolute; margin-left:-64px; margin-top:-64px;';
		mh[2].style.cssText = mh[3].style.cssText ='position:absolute; margin-left:-10px; margin-top:-10px; cursor:move;';

		initSphereGradian();
		drawSphereGradian();
		initColorSelector();

		mh[0].appendChild(canvasHelper[0]);
		mh[1].appendChild(canvasHelper[1]);
		mh[2].appendChild(canvasHelper[2]);
		mh[3].appendChild(canvasHelper[3]);

		mh[2].addEventListener( 'mousedown', function(e){ drag2 = true; currentColor = 4; getColorSelector();}, false );
		mh[2].addEventListener( 'mouseout', function(e){ drag2 = false; }, false );
		mh[2].addEventListener( 'mouseup', function(e){ drag2 = false; }, false );
		mh[2].addEventListener( 'mousemove', function(e){
			var rect = canvasSphere[0].getBoundingClientRect();
			if(drag2){
				GRD.positions['p'+0] = parseInt(e.clientX-rect.left);
				GRD.positions['p'+1] = parseInt(e.clientY-rect.top);
				placeHelper();
				drawSphereGradian();
			}
		} , false );

		mh[3].addEventListener( 'mousedown', function(e){ drag3 = true; currentColor = 8; getColorSelector();}, false );
		mh[3].addEventListener( 'mouseout', function(e){ drag3 = false; }, false );
		mh[3].addEventListener( 'mouseup', function(e){ drag3 = false; }, false );
		mh[3].addEventListener( 'mousemove', function(e){
			
			var rect = canvasSphere[0].getBoundingClientRect();
			if(drag3){
				GRD.positions['p'+4] = parseInt(e.clientX-rect.left);
				GRD.positions['p'+5] = parseInt(e.clientY-rect.top);
				placeHelper();
				drawSphereGradian();
			}
		} , false );

		grd[0]=document.createElement( 'div' );
		grd[1]=document.createElement( 'div' );
		grd[2]=document.createElement( 'div' );
		grd[0].style.cssText = grd[1].style.cssText = grd[2].style.cssText ='position:relative; display:block; height:30px; padding:0px 0px;';

		bigMap.appendChild(canvasSphere[0]);
		bigMap.appendChild(mh[0]);
		bigMap.appendChild(mh[1]);
		bigMap.appendChild(mh[2]);
		bigMap.appendChild(mh[3]);

		bigGradian.appendChild(grd[0]);
		bigGradian.appendChild(grd[1]);
		bigGradian.appendChild(grd[2]);

		grd[0].appendChild(canvasSphere[3]);
		grd[1].appendChild(canvasSphere[4]);
		grd[2].appendChild(canvasSphere[5]);

		var ccIn;
		var ccIn2;
		//_____ color helper
		for(var i=0; i!==12; i++){
			dragcc[i] = false;
			cac[i]= document.createElement( 'div' ); //document.getElementById('cc'+i);
			cac[i].style.cssText = 'width:20px; height:28px; position:absolute; margin-top:-34px; margin-left:-10px; cursor:w-resize; background-color: rgba(1,1,1,0);';

			ccIn= document.createElement( 'div' ); //document.getElementById('cc'+i);
			ccIn.style.cssText = 'width:2px; height:28px; position:absolute; margin-left:9px; background-color: rgba(255,255,0,1);pointer-events:none;';
			
			ccIn2= document.createElement( 'div' ); //document.getElementById('cc'+i);
			ccIn2.style.cssText = 'width:4px; height:28px; position:absolute; margin-left:8px; background-color: rgba(0,0,0,0.3);pointer-events:none;';
			cac[i].appendChild(ccIn2);
			cac[i].appendChild(ccIn);

			if(i<4) grd[0].appendChild(cac[i]);
			else if(i<8) grd[1].appendChild(cac[i]);
			else grd[2].appendChild(cac[i]);

			cac[i].name = i;
			dragcc[i] = false;
			cac[i].addEventListener( 'mousedown', function(e){e.preventDefault(); dragcc[this.name] = true; currentColor = this.name; getColorSelector();}, false );
		}

		for(var i=0; i!==3; i++){
			
			/**/
			if(i==0){
				grd[i].addEventListener( 'mouseout', function(e){e.preventDefault(); dragcc[0] = false;dragcc[1] = false;dragcc[2] = false;dragcc[3] = false; }, false );
				grd[i].addEventListener( 'mouseup', function(e){e.preventDefault(); dragcc[0] = false;dragcc[1] = false;dragcc[2] = false;dragcc[3] = false; }, false );
			}else if(i==1){
				grd[i].addEventListener( 'mouseout', function(e){e.preventDefault(); dragcc[4] = false;dragcc[5] = false;dragcc[6] = false;dragcc[7] = false; }, false );
				grd[i].addEventListener( 'mouseup', function(e){e.preventDefault(); dragcc[4] = false;dragcc[5] = false;dragcc[6] = false;dragcc[7] = false; }, false );
			}else {
				grd[i].addEventListener( 'mouseout', function(e){e.preventDefault(); dragcc[8] = false;dragcc[9] = false;dragcc[10] = false;dragcc[11] = false; }, false );
				grd[i].addEventListener( 'mouseup', function(e){e.preventDefault(); dragcc[8] = false;dragcc[9] = false;dragcc[10] = false;dragcc[11] = false; }, false );
			}
			grd[i].addEventListener( 'mousemove', function(e){e.preventDefault(); moveCurrentColor(e); } , false );
		}

		placeColors();
	}

	var moveCurrentColor = function (e){
		var rect = canvasSphere[0].getBoundingClientRect();
		var pos;
		if( dragcc[currentColor]){
			pos = (e.clientX-rect.left);
			if(pos<0)pos = 0;
			if(pos>256)pos=256;
			cac[currentColor].style.left = pos+'px';
			getColorsRange();
		}
	}

	var prev = function (){
		if(currentShader!==0)currentShader--;
		else currentShader = ShaderMapList.length-1;
		bcenter.textContent = ShaderMapList[currentShader].name;
		tweenToPreset(  ShaderMapList[currentShader] );
	}
	var next = function (){
		if(currentShader!==ShaderMapList.length-1) currentShader++;
		else currentShader = 0;
		bcenter.textContent = ShaderMapList[currentShader].name;
		tweenToPreset(  ShaderMapList[currentShader] );
	}

	var tweenToPreset = function (obj){
		tweenner[0] = TweenLite.to(GRD, 4, { line:obj.line, alpha:obj.alpha});
		tweenner[1] = TweenLite.to(GRD.positions, 4, {
			p0:obj.positions.p0, p1:obj.positions.p1, p2:obj.positions.p2, p3:obj.positions.p3,
			p4:obj.positions.p4, p5:obj.positions.p5, p6:obj.positions.p6, p7:obj.positions.p7,
			onUpdate: placeHelper
		});
		tweenner[2] = TweenLite.to(GRD.ranging, 4, {
			r0:obj.ranging.r0, r1:obj.ranging.r1, r2:obj.ranging.r2, r3:obj.ranging.r3,
			r4:obj.ranging.r4, r5:obj.ranging.r5, r6:obj.ranging.r6, r7:obj.ranging.r7,
			r8:obj.ranging.r8, r9:obj.ranging.r9, r10:obj.ranging.r10, r11:obj.ranging.r11,
			onUpdate: placeColors
		});
		tweenner[3] = TweenLite.to(GRD.colors, 4, {
			r0:obj.colors.r0, v0:obj.colors.v0, b0:obj.colors.b0, a0:obj.colors.a0,
			r1:obj.colors.r1, v1:obj.colors.v1, b1:obj.colors.b1, a1:obj.colors.a1,
			r2:obj.colors.r2, v2:obj.colors.v2, b2:obj.colors.b2, a2:obj.colors.a2,
			r3:obj.colors.r3, v3:obj.colors.v3, b3:obj.colors.b3, a3:obj.colors.a3,
			r4:obj.colors.r4, v4:obj.colors.v4, b4:obj.colors.b4, a4:obj.colors.a4,
			r5:obj.colors.r5, v5:obj.colors.v5, b5:obj.colors.b5, a5:obj.colors.a5,
			r6:obj.colors.r6, v6:obj.colors.v6, b6:obj.colors.b6, a6:obj.colors.a6,
			r7:obj.colors.r7, v7:obj.colors.v7, b7:obj.colors.b7, a7:obj.colors.a7,
			r8:obj.colors.r8, v8:obj.colors.v8, b8:obj.colors.b8, a8:obj.colors.a8,
			r9:obj.colors.r9, v9:obj.colors.v9, b9:obj.colors.b9, a9:obj.colors.a9,
			r10:obj.colors.r10, v10:obj.colors.v10, b10:obj.colors.b10, a10:obj.colors.a10,
			r11:obj.colors.r11, v11:obj.colors.v11, b11:obj.colors.b11, a11:obj.colors.a11,
			onUpdate: drawSphereGradian
		});
	}

	var placeColors = function (){
		for(var i=0;i!==12; i++){
			cac[i].style.left = parseInt(256*GRD.ranging['r'+i])+'px';
		}
	}

	var setActiveColor = function (){
		for(var i=0;i!==12; i++){
			if(i!==currentColor){cac[i].style.border='none';}
			else {
				cac[i].style.border='1px solid #33FFFF';
			}
		}
	}

	var getColorsRange = function (){
		setActiveColor();
		for(var i=0;i!==12; i++){
			GRD.ranging['r'+i] = (parseInt((cac[i].style.left).replace('px', ''))/256).toFixed(2);
		}
		drawHelper2();
		drawSphereGradian();
	}

	var initSphereGradian = function (){
		canvasHelper[0] = document.createElement("canvas");
		canvasHelper[1] = document.createElement("canvas");
		canvasHelper[2] = document.createElement("canvas");
		canvasHelper[3] = document.createElement("canvas");

		canvasHelper[0].width = canvasHelper[0].height = 128;
		canvasHelper[1].width = canvasHelper[1].height = 128;
		canvasHelper[2].width = canvasHelper[2].height = 20;
		canvasHelper[3].width = canvasHelper[3].height = 20;

		ctxh[0] = canvasHelper[0].getContext("2d");
		ctxh[1] = canvasHelper[1].getContext("2d");
		ctxh[2] = canvasHelper[2].getContext("2d");
		ctxh[3] = canvasHelper[3].getContext("2d");

		drawHelper();

		canvasSphere[0] = document.createElement("canvas");
		canvasSphere[1] = document.createElement("canvas");
		canvasSphere[2] = document.createElement("canvas"); 
		canvasSphere[0].width = canvasSphere[0].height = 256;
		canvasSphere[1].width = canvasSphere[1].height = 256;
		canvasSphere[2].width = canvasSphere[2].height = 256;
		ctxs[0] = canvasSphere[0].getContext("2d");
		ctxs[1] = canvasSphere[1].getContext("2d");
		ctxs[2] = canvasSphere[2].getContext("2d");
		ctxs[2].scale(0.5, 0.5);
		//__________linear degrad
		canvasSphere[3] = document.createElement("canvas"); 
		canvasSphere[4] = document.createElement("canvas");
		canvasSphere[5] = document.createElement("canvas");

		canvasSphere[3].width = canvasSphere[4].width = canvasSphere[5].width =256;
		canvasSphere[3].height = canvasSphere[4].height = canvasSphere[5].height =30;
		ctxs[3] = canvasSphere[3].getContext("2d");
		ctxs[4] = canvasSphere[4].getContext("2d");
		ctxs[5] = canvasSphere[5].getContext("2d");
	}

	var drawHelper = function (){
		ctxh[2].beginPath();
	    ctxh[2].arc(10, 10, 8, 0, 2 * Math.PI, false);
	    ctxh[2].lineWidth = 4;
	    ctxh[2].strokeStyle = 'rgba(225,225,0,0.8)';
	    ctxh[2].stroke();
	    ctxh[2].fillStyle = 'rgba(225,225,0,0.1)';
	    ctxh[2].fill();

	    ctxh[3].beginPath();
	    ctxh[3].arc(10, 10, 8, 0, 2 * Math.PI, false);
	    ctxh[3].lineWidth = 4;
	    ctxh[3].strokeStyle = 'rgba(225,225,0,0.8)';
	    ctxh[3].stroke();
	    ctxh[3].fillStyle = 'rgba(225,225,0,0.1)';
	    ctxh[3].fill();

	    placeHelper();
	    drawHelper2();
	}

	var drawHelper2 = function (){
		ctxh[0].clearRect(0, 0, 128, 128);
		ctxh[1].clearRect(0, 0, 128, 128);
		var r0 = GRD.ranging['r'+4]*128;
		var r1 = GRD.ranging['r'+8]*128;
		
		ctxh[0].beginPath();
	    ctxh[0].arc(64, 64, r0, 0, 2 * Math.PI, false);
	    ctxh[0].lineWidth = 1;
	    ctxh[0].strokeStyle = 'rgba(225,225,0,0.3)';
	    ctxh[0].stroke();

	    ctxh[1].beginPath();
	    ctxh[1].arc(64, 64, r1, 0, 2 * Math.PI, false);
	    ctxh[1].lineWidth = 1;
	    ctxh[1].strokeStyle = 'rgba(225,225,0,0.3)';
	    ctxh[1].stroke();
	}

	var placeHelper = function (){
		mh[0].style.left = mh[2].style.left = parseInt(GRD.positions['p'+0])+'px' ;
		mh[0].style.top = mh[2].style.top = parseInt(GRD.positions['p'+1])+'px' ;
		mh[1].style.left = mh[3].style.left = parseInt(GRD.positions['p'+4])+'px' ;
		mh[1].style.top = mh[3].style.top = parseInt(GRD.positions['p'+5])+'px' ;
	}

	var drawSphereGradian = function (){
		var i;
		var color;
		ctxs[0].clearRect(0, 0, 256, 256);
		ctxs[1].clearRect(0, 0, 256, 256);
		grads[0] = ctxs[0].createLinearGradient(0,0,0,256);
		grads[5] = ctxs[0].createLinearGradient(0,0,256,0);
		grads[3] = ctxs[0].createLinearGradient(0,0,256,0);
		grads[4] = ctxs[0].createLinearGradient(0,0,256,0);
		grads[1] = ctxs[0].createRadialGradient(parseInt(GRD.positions['p'+0]),parseInt(GRD.positions['p'+1]),parseInt(GRD.ranging['r'+4]*128),parseInt(GRD.positions['p'+2]),parseInt(GRD.positions['p'+3]),parseInt(GRD.ranging['r'+7]*128));
		grads[2] = ctxs[0].createRadialGradient(parseInt(GRD.positions['p'+4]),parseInt(GRD.positions['p'+5]),parseInt(GRD.ranging['r'+8]*128),parseInt(GRD.positions['p'+6]),parseInt(GRD.positions['p'+7]),parseInt(GRD.ranging['r'+11]*128));

		for(i=0; i!==4; i++){
			color = 'rgba('+parseInt(GRD.colors['r'+i])+','+parseInt(GRD.colors['v'+i])+','+parseInt(GRD.colors['b'+i])+','+parseFloat(GRD.colors['a'+i]).toFixed(2)+')';
			grads[0].addColorStop(parseFloat(GRD.ranging['r'+i]).toFixed(2), color);
			grads[5].addColorStop(parseFloat(GRD.ranging['r'+i]).toFixed(2), color);
	    }

		for(i=0; i!==4; i++){
			color = 'rgba('+parseInt(GRD.colors['r'+(i+4)])+','+parseInt(GRD.colors['v'+(i+4)])+','+parseInt(GRD.colors['b'+(i+4)])+','+parseFloat(GRD.colors['a'+(i+4)]).toFixed(2)+')';
			grads[1].addColorStop(parseFloat(GRD.ranging['r'+(i+4)]).toFixed(2), color);
			grads[3].addColorStop(parseFloat(GRD.ranging['r'+(i+4)]).toFixed(2), color);
	    }

		for(i=0; i!==4; i++){
			color = 'rgba('+parseInt(GRD.colors['r'+(i+8)])+','+parseInt(GRD.colors['v'+(i+8)])+','+parseInt(GRD.colors['b'+(i+8)])+','+parseFloat(GRD.colors['a'+(i+8)]).toFixed(2)+')';
			grads[2].addColorStop(parseFloat(GRD.ranging['r'+(i+8)]).toFixed(2), color);
			grads[4].addColorStop(parseFloat(GRD.ranging['r'+(i+8)]).toFixed(2), color);
	    }
	    
	    ctxs[0].fillStyle = grads[0];
		ctxs[0].fillRect(0, 0, 256, 256);

	    ctxs[0].fillStyle = grads[1];
		ctxs[0].fillRect(0, 0, 256, 256);

		ctxs[0].fillStyle = grads[2];
		ctxs[0].fillRect(0, 0, 256, 256);

		//______________linear gradian
		ctxs[3].clearRect(0, 0, 256, 30);
		ctxs[4].clearRect(0, 0, 256, 30);
		ctxs[5].clearRect(0, 0, 256, 30);

		ctxs[3].fillStyle = grads[5];
		ctxs[3].fillRect(0, 0, 256, 30);

		ctxs[4].fillStyle = grads[3];
		ctxs[4].fillRect(0, 0, 256, 30);

		ctxs[5].fillStyle = grads[4];
		ctxs[5].fillRect(0, 0, 256, 30);

		//_____________stroke line
		ctxs[1].beginPath();
	    ctxs[1].arc(128, 128, 128, 0, 2 * Math.PI, false);
	    ctxs[1].lineWidth = GRD.line;
	    ctxs[1].strokeStyle = grads[0];
	    ctxs[1].stroke();

	    //_____________border line
	    ctxs[0].drawImage( canvasSphere[1], 0, 0 );
	    ctxs[0].globalAlpha = GRD.alpha;

		applyMaterial();
		if(isShowfinalPreset) traceCurrent();
	}

	var traceCurrent = function (){
		var finalshade = "var Map_"+ShaderMapList[currentShader].name+" ={<br> name:'"+ShaderMapList[currentShader].name+"' ,line:"+GRD.line+", alpha:"+GRD.alpha+", <br>";
		finalshade += " ranging:{<br>"+" r0:"+GRD.ranging.r0+", r1:"+GRD.ranging.r1+", r2:"+GRD.ranging.r2+", r3:"+GRD.ranging.r3+",<br>";
		finalshade += " r4:"+GRD.ranging.r4+", r5:"+GRD.ranging.r5+", r6:"+GRD.ranging.r6+", r7:"+GRD.ranging.r7+",<br>";
		finalshade += " r8:"+GRD.ranging.r8+", r9:"+GRD.ranging.r9+", r10:"+GRD.ranging.r10+", r11:"+GRD.ranging.r11+"<br>},<br>";
		finalshade += " positions:{<br>"+" p0:"+GRD.positions.p0+", p1:"+GRD.positions.p1+", p2:"+GRD.positions.p2+", p3:"+GRD.positions.p3+",<br>";
		finalshade += " p4:"+GRD.positions.p4+", p5:"+GRD.positions.p5+", p6:"+GRD.positions.p6+", p7:"+GRD.positions.p7+"<br>},<br>";

		finalshade += " colors:{<br>"+" r0:"+GRD.colors.r0+", v0:"+GRD.colors.v0+", b0:"+GRD.colors.b0+", a0:"+GRD.colors.a0+",<br>";
		finalshade += " r1:"+GRD.colors.r1+", v1:"+GRD.colors.v1+", b1:"+GRD.colors.b1+", a1:"+GRD.colors.a1+",<br>";
		finalshade += " r2:"+GRD.colors.r2+", v2:"+GRD.colors.v2+", b2:"+GRD.colors.b2+", a2:"+GRD.colors.a2+",<br>";
		finalshade += " r3:"+GRD.colors.r3+", v3:"+GRD.colors.v3+", b3:"+GRD.colors.b3+", a3:"+GRD.colors.a3+",<br>";

		finalshade += " r4:"+GRD.colors.r4+", v4:"+GRD.colors.v4+", b4:"+GRD.colors.b4+", a4:"+GRD.colors.a4+",<br>";
		finalshade += " r5:"+GRD.colors.r5+", v5:"+GRD.colors.v5+", b5:"+GRD.colors.b5+", a5:"+GRD.colors.a5+",<br>";
		finalshade += " r6:"+GRD.colors.r6+", v6:"+GRD.colors.v6+", b6:"+GRD.colors.b6+", a6:"+GRD.colors.a6+",<br>";
		finalshade += " r7:"+GRD.colors.r7+", v7:"+GRD.colors.v7+", b7:"+GRD.colors.b7+", a7:"+GRD.colors.a7+",<br>";

		finalshade += " r8:"+GRD.colors.r8+", v8:"+GRD.colors.v8+", b8:"+GRD.colors.b8+", a8:"+GRD.colors.a8+",<br>";
		finalshade += " r9:"+GRD.colors.r9+", v9:"+GRD.colors.v9+", b9:"+GRD.colors.b9+", a9:"+GRD.colors.a9+",<br>";
		finalshade += " r10:"+GRD.colors.r10+", v10:"+GRD.colors.v10+", b10:"+GRD.colors.b10+", a10:"+GRD.colors.a10+",<br>";
		finalshade += " r11:"+GRD.colors.r11+", v11:"+GRD.colors.v11+", b11:"+GRD.colors.b11+", a11:"+GRD.colors.a11+"<br>}};";
		finalPreset.innerHTML = finalshade;
	}

	//--------------------------------------
    // COLOR SELECTOR
    //--------------------------------------

    var ddDrag =  [];
	var ddcolors = [];
	var ddselect = [];
	var ddDiv = [];
	var ddSel = [];
	var ddOutColor;
	var ddOutCanvas;

	var initColorSelector = function (){
		var ccw = 64;
		var cch = (ccw/4);
		var ctx;
		var grd;
		ddOutCanvas = document.createElement("canvas");
		ddOutCanvas.width = ddOutCanvas.height = ccw;

		ddOutColor =  document.createElement( 'div' );//document.getElementById('finalColor');
		ddOutColor.style.cssText ='position:absolute; pointer-events:none; width:64px; height:64px;';
		bigColor.appendChild( ddOutColor );

		ddOutColor.appendChild(ddOutCanvas);
		ddOutColor.style.left = 256-ccw+'px';
		ctx = ddOutCanvas.getContext("2d");
		ctx.fillStyle = 'rgba(0,0,0,0)';
		ctx.fillRect(0, 0, ccw, ccw);
		
		for(var i=0;i!==4; i++){
			ddDiv[i] = document.createElement( 'div' );
			ddSel[i] = document.createElement( 'div' );
			ddDiv[i].style.cssText ='position:absolute; cursor:w-resize;';
			ddSel[i].style.cssText ='position:absolute; pointer-events:none;margin-left:0.5px;width:1px;height:'+cch+'px; background-color:#FFFF00';
			bigColor.appendChild( ddDiv[i] );
			ddDiv[i].appendChild( ddSel[i] );
			ddDiv[i].style.top = i*cch+'px';

			ddcolors[i] = document.createElement("canvas");
			ddcolors[i].width = 187.5;
			ddcolors[i].height = cch;
			ctx = ddcolors[i].getContext("2d");
			grd = ctx.createLinearGradient(0,0,187.5,0);
			grd.addColorStop(0,'rgba(0,0,0,0)');
			if(i==0)grd.addColorStop(1,'rgba(255,0,0,1)');
			if(i==1)grd.addColorStop(1,'rgba(0,255,0,1)');
			if(i==2)grd.addColorStop(1,'rgba(0,0,255,1)');
			if(i==3)grd.addColorStop(1,'rgba(0,0,0,1)');

			ctx.fillStyle = grd;
			ctx.fillRect(0, 0, 187.5, cch);

			ddDiv[i].appendChild(ddcolors[i]);
			ddDiv[i].name = i;
			ddDrag[i] = false;

			ddDiv[i].addEventListener( 'mouseout', function(e){ ddDrag[this.name] = false; }, false );
			ddDiv[i].addEventListener( 'mouseup', function(e){ ddDrag[this.name] = false; }, false );
			ddDiv[i].addEventListener( 'mousedown', function(e){ ddDrag[this.name] = true; moveColorSelector(this.name, e.clientX);}, false );
			ddDiv[i].addEventListener( 'mousemove', function(e){ moveColorSelector(this.name, e.clientX); } , false );
		}
	}

	var drawColorSelector = function (){
		var c= GRD.colors;
		var n= currentColor;

		var ctx = ddOutCanvas.getContext("2d");
		ctx.clearRect(0, 0, 64, 64);
		ctx.fillStyle = 'rgba('+c['r'+n]+','+c['v'+n]+','+c['b'+n]+','+c['a'+n]+')';
		ctx.fillRect(0, 0, 64, 64);
		drawSphereGradian();
	}

	var getColorSelector = function (){
		displayColorChoose();
		var c= GRD.colors;
		var n= currentColor;

		setActiveColor();
		var ctx = ddOutCanvas.getContext("2d");
		ctx.clearRect(0, 0, 64, 64);
		ctx.fillStyle = 'rgba('+c['r'+n]+','+c['v'+n]+','+c['b'+n]+','+c['a'+n]+')';
		ctx.fillRect(0, 0, 64, 64);
		for(var i=0;i!==4; i++){
			if(i===0) ddSel[i].style.left = (c['r'+n]/1.36).toFixed(0)+'px';
			if(i===1) ddSel[i].style.left = (c['v'+n]/1.36).toFixed(0)+'px';
			if(i===2) ddSel[i].style.left = (c['b'+n]/1.36).toFixed(0)+'px';
			if(i===3) ddSel[i].style.left = (c['a'+n]*187.5).toFixed(0)+'px';
		}
	}

	var moveColorSelector = function (n, px){
		var rect = ddcolors[n].getBoundingClientRect();
		if( ddDrag[n]){
			ddSel[n].style.left = (px-rect.left)+'px';
			if(currentColor!==-1){
				if(n===0) GRD.colors['r'+currentColor] = ((px-rect.left)*1.36).toFixed(0);
				if(n===1) GRD.colors['v'+currentColor] = ((px-rect.left)*1.36).toFixed(0);
				if(n===2) GRD.colors['b'+currentColor] = ((px-rect.left)*1.36).toFixed(0);
				if(n===3) GRD.colors['a'+currentColor] = ((px-rect.left)/187.5).toFixed(2);
				drawColorSelector();
			}
		}
	}

	var displayColorChoose = function (){
		if(currentColor!==-1){
			bigColor.style.display = 'block';
			bigColor.style.visibility = 'visible';
		} else {
			bigColor.style.display = 'none';
			bigColor.style.visibility = 'hidden';
		}
		
	}











	initInterface();









    

	return {

		domElement: container,

		begin: function ( sc, mats, n, py, s) {
			loadSphere( sc, mats, n, py, s);
		},

		update: function(y, z, render, sc){
			if(envSphere){
				envSphere.rotation.y = y;
				envSphere.rotation.z = z;
				cubeCamera.updateCubeMap( render, sc );
		    }
		},

		getTexture: function () {
			return texture;
		}
	}

}
