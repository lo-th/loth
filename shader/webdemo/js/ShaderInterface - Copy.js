var materials=[{name:'dark glass',diffuse:'944_large_remake2.jpg'},{name:'twilight fisheye',diffuse:'TwilightFisheye.jpg'},{name:'jeepster skinmat',diffuse:'jeepster_skinmat2.jpg'},{name:'josh shing matcap',diffuse:'JoshSingh_matcap.jpg'},{name:'dark grey metal',diffuse:'mydarkgreymetal_zbrush_matcap_by_digitalinkrod.jpg'},{name:'green shin metal',diffuse:'mygreenshinmetal_zbrush_matcap_by_digitalinkrod.jpg'},{name:'red metal',diffuse:'myredmetal_zbrush_matcap_by_digitalinkrod.jpg'},{name:'gooch',diffuse:'gooch.jpg'},{name:'smooth',diffuse:'smoothmat.jpg'},{name:'LitSphere',diffuse:'LitSphere_example_4.jpg'},{name:'green',diffuse:'5cad3098d01a8d232b753acad6f39972.jpg'},{name:'bluew2',diffuse:'bluew2.jpg'},{name:'bluew',diffuse:'bluew.jpg'},{name:'blue green',diffuse:'blu_green_litsphere_by_jujikabane.jpg'},{name:'daphz3',diffuse:'daphz3.jpg'},{name:'daphz2',diffuse:'daphz2.jpg'},{name:'daphz1',diffuse:'daphz1.jpg'},{ name:'scooby skin',diffuse:'scooby_skin_mix.jpg'},{name:'litsphere',diffuse:'LitSphere_test_05.jpg'},{name:'litsphere2',diffuse:'LitSphere_test_04.jpg'},{name:'litsphere3',diffuse:'LitSphere_test_03.jpg'},{name:'litsphere3',diffuse:'LitSphere_test_02.jpg'},{name:'litsphere3',diffuse:'LitSphere_example_5.jpg'},{name:'litsphere3',diffuse:'LitSphere_example_3.jpg'},{name:'litsphere3',diffuse:'LitSphere_example_2.jpg'},{name:'litsphere3',diffuse:'matball07.jpg'},{name:'litsphere3',diffuse:'matball04.jpg'},{name:'litsphere3',diffuse:'matball06.jpg'},{name:'litsphere3',diffuse:'matball05.jpg'},{name:'litsphere3',diffuse:'matball03.jpg'},{name:'litsphere3',diffuse:'matball02.jpg'},{name:'litsphere3',diffuse:'matball01.jpg'},{name:'red sphere',diffuse:'redsphere.jpg'},{name:'pink',diffuse:'93e1bbcf77ece0c0f7fc79ecb8ff0d00.jpg'}];
var normals=[{name:'243',map:'243-normal.jpg'},{name:'243',map:'wrinkle-normal.jpg'},{name:'243',map:'295-normal.jpg'},{name:'243',map:'879-normal.jpg'},{name:'243',map:'2563-normal.jpg'},{name:'243',map:'brick-normal.jpg'},{name:'243',map:'floor2_ddn.jpg'},{name:'243',map:'forestfloornrmii7.jpg'},{name:'243',map:'normal.jpg'},{name:'243',map:'normalmap_tile_even.jpg'},{name:'243',map:'normalmap1.jpg'},{name:'243',map:'stage7.jpg'},{name:'243',map:'Worn Temple Wall.jpg'},{name:'243',map:'fig29.png'},{name:'243',map:'Wall3_normalmap.jpg'},{name:'243',map:'metal1_normalmap.jpg'},{name:'243',map:'99232450425c8132b17dbccf65da365a.jpg'},{name:'243',map:'4918-normal.jpg'},{name:'243',map:'cr_wallpaper1_NRM.jpg'},{name:'243',map:'stone_wall_normal_map.jpg'},{name:'243',map:'02.jpg'},{name:'243',map:'242-normal.jpg'},{name:'243',map:'7146-normal.jpg'},{name:'243',map:'1324-normal.jpg'},{name:'243',map:'Rock_01_local.jpg'},{name:'243',map:'6624-normal.jpg'}]

var materialList, normalList, modelList;


var canvasSphere, ctxSphere;
var canvasSphere2, ctxSphere2;
var canvasSphere3, ctxSphere3;


var canvasNormal;

var normalReapeat = 1, normalScale=0;
var currentColor;
var modelSize = 20;
var scaleset;
var scaletxt;
//var blurset, blurtxt, blur = 2;
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


var ctxs=[];
var ctxh=[];
var ctxc=[];
var dragcc=[];
var grads = [];

var txt;
//var gradians = [];

var GRD = {
	range0:[0.1,0.3,0.8,1], color0:[ [0,0,0,1], [60,60,60,1], [60,60,60,1], [0,0,0,1] ], line:10, alpha:0.5,
	range1:[0.1,0.5,0.95,1], color1:[ [255,255,255,1], [180,180,180,1], [60,60,60,0.5], [0,0,0,0] ], pos1:[128,50, 128,128],
	range2:[0.1,0.5,0.95,1], color2:[ [0,0,0,255], [20,20,20,0.5], [30,30,30,0.1], [0,0,0,0] ], pos2:[128,200, 128,128]
}

var grad00 = {range:[0.1,0.3,0.8,1], color:[ [0,0,0,1], [60,60,60,1], [60,60,60,1], [0,0,0,1] ], line:10, alpha:0.5 };
var grad01 = {range:[0.1,0.5,0.95,1], color:[ [255,255,255,1], [180,180,180,1], [60,60,60,0.5], [0,0,0,0] ], pos:[128,50, 128,128]};
var grad02 = {range:[0.1,0.5,0.95,1], color:[ [0,0,0,255], [20,20,20,0.5], [30,30,30,0.1], [0,0,0,0] ], pos:[128,200, 128,128]};

function drawColors(){
	for(var i=0;i!==12; i++){
		canvasColors[i] = document.createElement("canvas");
		canvasColors[i].width = 12;
		canvasColors[i].height = 28;
		ctxc[i] = canvasColors[i].getContext("2d");

		
		ctxc[i].fillStyle = 'rgba(225,225,0,0)';
		ctxc[i].fillRect(0, 0, 12, 28);

		ctxc[i].beginPath();
		ctxc[i].arc(7, 7, 5, 0, 2 * Math.PI, false);
		ctxc[i].lineWidth = 2;
		ctxc[i].strokeStyle = 'rgba(0,0,0,0.5)';
		ctxc[i].stroke();

		ctxc[i].fillStyle = 'rgba(0,0,0,0.5)';
		ctxc[i].fillRect(6, 12, 2, 20);

		ctxc[i].fillStyle = 'rgba(225,225,0,1)';
		ctxc[i].fillRect(5, 10, 2, 20);


		ctxc[i].beginPath();
		ctxc[i].arc(6, 6, 4, 0, 2 * Math.PI, false);
		ctxc[i].lineWidth = 2;
		ctxc[i].strokeStyle = 'rgba(225,225,0,1)';
		ctxc[i].stroke();

		

		/*ctxc[i].strokeStyle = 'rgba(225,225,0,0.6)';
		ctxc[i].lineWidth = 2;
		ctxc[i].rect(0, 0, 12, 8);
		ctxc[i].stroke();*/
    }
}

function placeColors(){
	for(var i=0;i!==12; i++){
		if(i<4)cac[i].style.left = 256*grad00.range[i]+'px';
		else if(i<8)cac[i].style.left = 256*grad01.range[i-4]+'px';
		else cac[i].style.left = 256*grad02.range[i-8]+'px';
	}
}

function getColorsRange(){
	for(var i=0;i!==12; i++){
		if(i!==currentColor)cac[i].classList.remove('active');
		if(i<4)grad00.range[i] = (parseInt((cac[i].style.left).replace('px', ''))/256).toFixed(2);// (parseInt(cac[i].style.left.replace('px', ''))/256).toFixed(1);
		else if(i<8)grad01.range[i-4] = (parseInt((cac[i].style.left).replace('px', ''))/256).toFixed(2);
		else grad02.range[i-8] = (parseInt((cac[i].style.left).replace('px', ''))/256).toFixed(2);
	}
	drawHelper2();
	drawSphereGradian();
}

function initSphereGradian(){
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
	canvasSphere[3].height = canvasSphere[4].height = canvasSphere[5].height =20;
	ctxs[3] = canvasSphere[3].getContext("2d");
	ctxs[4] = canvasSphere[4].getContext("2d");
	ctxs[5] = canvasSphere[5].getContext("2d");

	//__________linear gradian
	
}

function drawHelper(){
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

function drawHelper2(){
	ctxh[0].clearRect(0, 0, 128, 128);
	ctxh[1].clearRect(0, 0, 128, 128);
	var r0 = grad01.range[0]*128;
	var r1 = grad02.range[0]*128;
	
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

function placeHelper(){
	mh[0].style.left = mh[2].style.left = (grad01.pos[0])+'px' ;
	mh[0].style.top = mh[2].style.top = (grad01.pos[1])+'px' ;
	mh[1].style.left = mh[3].style.left = (grad02.pos[0])+'px' ;
	mh[1].style.top = mh[3].style.top = (grad02.pos[1])+'px' ;
}

function drawSphereGradian(){
	var i;
	ctxs[0].clearRect(0, 0, 256, 256);
	ctxs[1].clearRect(0, 0, 256, 256);
	grads[0] = ctxs[0].createLinearGradient(0,0,0,256);
	grads[5] = ctxs[0].createLinearGradient(0,0,256,0);
	grads[3] = ctxs[0].createLinearGradient(0,0,256,0);
	grads[4] = ctxs[0].createLinearGradient(0,0,256,0);
	grads[1] = ctxs[0].createRadialGradient(grad01.pos[0],grad01.pos[1],grad01.range[0]*128,grad01.pos[2],grad01.pos[3],grad01.range[3]*128);
	grads[2] = ctxs[0].createRadialGradient(grad02.pos[0],grad02.pos[1],grad02.range[0]*128,grad02.pos[2],grad02.pos[3],grad02.range[3]*128);

	for(i=0; i!==grad00.range.length; i++){
		grads[0].addColorStop(grad00.range[i],'rgba('+grad00.color[i][0]+','+grad00.color[i][1]+','+grad00.color[i][2]+','+grad00.color[i][3]+')');
		grads[5].addColorStop(grad00.range[i],'rgba('+grad00.color[i][0]+','+grad00.color[i][1]+','+grad00.color[i][2]+','+grad00.color[i][3]+')');
    }

	for(i=0; i!==grad01.range.length; i++){
		grads[1].addColorStop(grad01.range[i],'rgba('+grad01.color[i][0]+','+grad01.color[i][1]+','+grad01.color[i][2]+','+grad01.color[i][3]+')');
		grads[3].addColorStop(grad01.range[i],'rgba('+grad01.color[i][0]+','+grad01.color[i][1]+','+grad01.color[i][2]+','+grad01.color[i][3]+')');
    }

	for(i=0; i!==grad02.range.length; i++){
		grads[2].addColorStop(grad02.range[i],'rgba('+grad02.color[i][0]+','+grad02.color[i][1]+','+grad02.color[i][2]+','+grad02.color[i][3]+')');
		grads[4].addColorStop(grad02.range[i],'rgba('+grad02.color[i][0]+','+grad02.color[i][1]+','+grad02.color[i][2]+','+grad02.color[i][3]+')');
    }
    
    ctxs[0].fillStyle = grads[0];
	ctxs[0].fillRect(0, 0, 256, 256);

    ctxs[0].fillStyle = grads[1];
	ctxs[0].fillRect(0, 0, 256, 256);

	ctxs[0].fillStyle = grads[2];
	ctxs[0].fillRect(0, 0, 256, 256);

	//______________linear gradian
	ctxs[3].fillStyle = grads[5];
	ctxs[3].fillRect(0, 0, 256, 20);

	ctxs[4].fillStyle = grads[3];
	ctxs[4].fillRect(0, 0, 256, 20);

	ctxs[5].fillStyle = grads[4];
	ctxs[5].fillRect(0, 0, 256, 20);

	//_____________stroke line
	ctxs[1].beginPath();
    ctxs[1].arc(128, 128, 128, 0, 2 * Math.PI, false);
    ctxs[1].lineWidth = grad00.line;
    ctxs[1].strokeStyle = grads[0];
    ctxs[1].stroke();

    //_____________copy line
   //
   // var imageData =  ctxs[1].getImageData( 0, 0, 256, 256 );
   //stackBoxBlurCanvasRGBA( canvasSphere[1], canvasSphere[2], 0, 0, 256, 256, blur, 1 );
    ctxs[0].drawImage( canvasSphere[1], 0, 0 );
    ctxs[0].globalAlpha = grad00.alpha;
   //ctxs[2].drawImage(canvasSphere[1],0,0);
	// apply blur
	//

	applySphereMaterial();
}

/*function applyBlur() {
	stackBoxBlurCanvasRGBA( canvasSphere[1], canvasSphere[2], 0, 0, 256, 256, blur, 1 );
	applySphereMaterial();
}*/

function applySphereMaterial() {
	// preview
	//ctxs[2].drawImage(canvasSphere[0],0,0);
	// update texture
	if(txt==null){
		txt = new THREE.Texture(canvasSphere[0]);
	    txt.anisotropy = MaxAnistropy;
	    txt.needsUpdate = true;
	}
	
	// update material 
	if(material && envMaterial){
		txt.needsUpdate = true;
		material.uniforms.tMatCap.value=txt;
		envMaterial.map = txt;
	}
}


function initInterface(){
	modelList=document.getElementById('modelList');
	scaleset = document.getElementById('scaleValueInput');
	scaletxt = document.getElementById('scaletxt');
	scaleset.addEventListener('change',function(e){modelSize=this.value; scaleContent(modelSize);scaletxt.innerHTML="Scale : "+modelSize;e.preventDefault();});
	//[].slice.call(document.querySelectorAll('a[rel=external]'),0).forEach(function(a){a.addEventListener('click',function(e){window.open(this.href,'_blank');e.preventDefault();},false);});
	modelList.appendChild(createSea3dDropZone());





	/*blurset = document.getElementById('blurValueInput');
	blurtxt = document.getElementById('blurtxt');
	blurset.addEventListener('change',function(e){blur=this.value; applyBlur();blurtxt.innerHTML="Blur : "+blur;e.preventDefault();});*/

	alphaset = document.getElementById('alphaValueInput');
	alphatxt = document.getElementById('alphatxt');
	alphaset.addEventListener('change',function(e){grad00.alpha=this.value/100; drawSphereGradian();alphatxt.innerHTML="Alpha : "+this.value;});

	lineset = document.getElementById('lineValueInput');
	linetxt = document.getElementById('linetxt');
	lineset.addEventListener('change',function(e){grad00.line=this.value; drawSphereGradian();linetxt.innerHTML="Line : "+this.value;});

	var mapp= document.getElementById('map');
	mh[0]= document.getElementById('mh0');
	mh[1]= document.getElementById('mh1');
	mh[2]= document.getElementById('mh2');
	mh[3]= document.getElementById('mh3');
	grd[0]=document.getElementById('grad0');
	grd[1]=document.getElementById('grad1');
	grd[2]=document.getElementById('grad2');

	initSphereGradian();
	drawSphereGradian();
	drawColors();

	for(var i=0; i!==12; i++){
		cac[i]=document.getElementById('cc'+i);
		cac[i].appendChild(canvasColors[i]);
		cac[i].name = i;
		dragcc[i] = false;
		cac[i].addEventListener( 'mousedown', function(e){ 
			//document.getElementById('title').innerHTML = this.name;
			dragcc[this.name] = true;
			 }, false );
		cac[i].addEventListener( 'mouseout', function(e){ dragcc[this.name] = false; }, false );
		cac[i].addEventListener( 'mouseup', function(e){ dragcc[this.name] = false; }, false );
		cac[i].addEventListener( 'mousemove', function(e){
			var rect = canvasSphere[0].getBoundingClientRect();
			var pos;
			if( dragcc[this.name]){
				pos = (e.clientX-rect.left);
				if(pos<0)pos = 0;
				if(pos>256)pos=256;
				cac[this.name].style.left = pos+'px';
				currentColor = this.name;
				this.classList.add('active');
				getColorsRange();
			}
	} , false )
	}
	placeColors();

	mapp.appendChild(canvasSphere[0]);
	grd[0].appendChild(canvasSphere[3]);
	grd[1].appendChild(canvasSphere[4]);
	grd[2].appendChild(canvasSphere[5]);



	mh[0].appendChild(canvasHelper[0]);
	mh[1].appendChild(canvasHelper[1]);
	mh[2].appendChild(canvasHelper[2]);
	mh[3].appendChild(canvasHelper[3]);

	mh[2].addEventListener( 'mousedown', function(e){ drag2 = true; }, false );
	mh[2].addEventListener( 'mouseout', function(e){ drag2 = false; }, false );
	mh[2].addEventListener( 'mouseup', function(e){ drag2 = false; }, false );
	mh[2].addEventListener( 'mousemove', function(e){
		var rect = canvasSphere[0].getBoundingClientRect();
		if(drag2){
			grad01.pos[0] = (e.clientX-rect.left);
			grad01.pos[1] = (e.clientY-rect.top);
			placeHelper();
			drawSphereGradian();
		}
	} , false );

	mh[3].addEventListener( 'mousedown', function(e){ drag3 = true; }, false );
	mh[3].addEventListener( 'mouseout', function(e){ drag3 = false; }, false );
	mh[3].addEventListener( 'mouseup', function(e){ drag3 = false; }, false );
	mh[3].addEventListener( 'mousemove', function(e){
		
		var rect = canvasSphere[0].getBoundingClientRect();
		if(drag3){
			grad02.pos[0] = (e.clientX-rect.left);
			grad02.pos[1] = (e.clientY-rect.top);
			placeHelper();
			drawSphereGradian();
		}
	} , false );
	 
	var j;
	materialList=document.getElementById('materialList');
	var li=document.createElement('li');
	materialList.appendChild(li);
	
	for(j in materials){
		var li=document.createElement('li');
		var a=document.createElement('a');
		a.setAttribute('href','#');
		a.setAttribute('title',materials[j].name);
		a.innerHTML='&nbsp;';
		a.className='button';

	(function(f){a.addEventListener('click',function(e){
		material.uniforms.tMatCap.value=THREE.ImageUtils.loadTexture(AssetsFolder+'matcap/'+f);
		envMaterial.map = material.uniforms.tMatCap.value;
		e.preventDefault();
	});
})(materials[j].diffuse);
	a.style.backgroundImage='url('+AssetsFolder+'matcap/'+encodeURIComponent(materials[j].diffuse)+')';
	a.style.backgroundSize='contain';li.appendChild(a);materialList.appendChild(li);}
	materialList.appendChild(createDropZone(function(){material.uniforms.tMatCap.value=new THREE.Texture(this);material.uniforms.tMatCap.value.needsUpdate=true;}));

	normalList=document.getElementById('normalList');
	for(j in normals){
		normalList.appendChild(createNormalButton(normals[j].map, j));
	}

	normalList.appendChild(createNormalButton(null, 0));
	normalList.appendChild(createDropZone(function(){adjustNormalMap(this);}));

	//_____________FULLSCREEN
	var el=document.getElementById('fullscreenBtn');
	if(el){
		var c=document.body;
		el.addEventListener('click',function(e){c.onwebkitfullscreenchange=function(e){c.onwebkitfullscreenchange=function(){};};c.onmozfullscreenchange=function(e){c.onmozfullscreenchange=function(){};};
			if(c.webkitRequestFullScreen)c.webkitRequestFullScreen();
			if(c.mozRequestFullScreen)c.mozRequestFullScreen();
			e.preventDefault();},false);
	}

	//_____________ANTIALIAS
	document.getElementById('antialiasingButton').addEventListener('click',function(e){
		CSSAntialias=!CSSAntialias;
		this.classList.toggle('active',CSSAntialias);
		onWindowResize();
		e.preventDefault();
	});
}

function isPowerOfTwo(x){return(x&(x-1))==0;}

function nextHighestPowerOfTwo(x){
	--x;
	for(var i=1;i<32;i<<=1){x=x|x>>i;}
	return x+1;
}
//_______________________________________

function createNormalButton(map, j){
	var li=document.createElement('li');
	var a=document.createElement('a');
	a.setAttribute('href','#');
	a.setAttribute('title',normals[j].name);
	a.innerHTML='&nbsp;';
	a.className='button';
	if(map==null){
		a.addEventListener('click',function(e){
			material.uniforms.useNormal.value=0.;
			e.preventDefault();
		});
		a.textContent='None';
		a.style.width='85px';
		a.style.textAlign='center';
	}else{
		a.addEventListener('click',function(e){
			var img=new Image();
			img.addEventListener('load',function(e){adjustNormalMap(img);});
			img.src=AssetsFolder+'normal/'+map;

			e.preventDefault();
		});
		a.style.backgroundImage='url('+AssetsFolder+'normal/'+encodeURIComponent(map)+')';
	}
	a.style.backgroundSize='contain';li.appendChild(a);
	return li;
}

function createDropZone(imgCallback){
	var dropzone=document.createElement('div');
	dropzone.className='dropzone';
	dropzone.textContent='Drop';
	dropzone.addEventListener('dragenter',function(event){this.style.backgroundColor='rgba( 255,255,255,.2 )';},true);
	dropzone.addEventListener('dragleave',function(event){this.style.backgroundColor='transparent';},true);
	dropzone.addEventListener('dragover',function(event){this.style.backgroundColor='rgba( 255,255,255,.2 )';event.preventDefault();},true);
	dropzone.addEventListener('drop',function(event){
		showLoader(true);
		this.style.backgroundColor='transparent';
		event.preventDefault();
		var allTheFiles=event.dataTransfer.files;
		var reader=new FileReader();
		reader.onload=function(e){
			try{var img=new Image();
				img.onload=imgCallback;
				img.src=e.currentTarget.result;
				showLoader(false);
			}catch(e){alert('Couldn\'t read that file. Make sure it\'s an mp3 or ogg file (Chrome) or ogg file (Firefox).');}
		};
		reader.readAsDataURL(allTheFiles[0]);
	},true);
	return dropzone;
}

function createSea3dDropZone(){
	var dropzone=document.createElement('div');
	dropzone.className='dropzone';
	dropzone.textContent='Drop';
	dropzone.addEventListener('dragenter',function(event){this.style.backgroundColor='rgba( 255,255,255,.2 )';},true);
	dropzone.addEventListener('dragleave',function(event){this.style.backgroundColor='transparent';},true);
	dropzone.addEventListener('dragover',function(event){this.style.backgroundColor='rgba( 255,255,255,.2 )';event.preventDefault();},true);
	dropzone.addEventListener('drop',function(event){
		showLoader(true);
		this.style.backgroundColor='transparent';
		event.preventDefault();
		var allTheFiles=event.dataTransfer.files;
		var reader=new FileReader();
		/*for (var i = 0, f; f = event.dataTransfer.files[i]; i++) {
			loadSeaFile(f.name, modelSize);
		}*/
		reader.onload=function(e){
			try{
				loadSeaFile(e.currentTarget.result, modelSize);
				//showLoader(false);
			}catch(e){showLoader(false);//alert('Couldn\'t read that file. Make sure it\'s an mp3 or ogg file (Chrome) or ogg file (Firefox).');
		}
		};
		reader.readAsDataURL(allTheFiles[0]);
		//reader.readAsText(allTheFiles[0]);
	},true);
	return dropzone;
}

function adjustNormalMap(img){
	if(!isPowerOfTwo(img.width)||!isPowerOfTwo(img.height)){
		var canvas=document.createElement("canvas");
		canvas.width=nextHighestPowerOfTwo(img.width);
		canvas.height=nextHighestPowerOfTwo(img.height);
		var ctx=canvas.getContext("2d");
		ctx.drawImage(img,0,0,canvas.width,canvas.height);
		img=canvas;
	}

	material.uniforms.tNormal.value=new THREE.Texture(img);
	material.uniforms.tNormal.value.needsUpdate=true;
	material.uniforms.tNormal.value.wrapS=material.uniforms.tNormal.value.wrapT=THREE.RepeatWrapping;
	material.uniforms.useNormal.value=1.;
	if(normalScale==0)normalScale = 1;

	materialAnim.normalMap=material.uniforms.tNormal.value;
	materialAnim.normalScale.y = materialAnim.normalScale.x = normalScale;
	materialAnim.normalMap.wrapS=materialAnim.normalMap.wrapT=THREE.RepeatWrapping;
	materialMorph.normalMap.repeat.set( normalReapeat, normalReapeat )
	materialAnim.normalMap.needsUpdate=true;

	materialMorph.normalMap=material.uniforms.tNormal.value;
	materialMorph.normalScale.y = materialMorph.normalScale.x = normalScale;
	materialMorph.normalMap.wrapS=materialMorph.normalMap.wrapT=THREE.RepeatWrapping;
	materialMorph.normalMap.repeat.set( normalReapeat, normalReapeat )
	materialMorph.normalMap.needsUpdate=true;
}


document.getElementById('pinBtn').addEventListener('click',function(e){optionsPinned=!optionsPinned;this.classList.toggle('pinned',optionsPinned);optionsPanel.classList.toggle('pinned',optionsPinned);e.preventDefault();});
document.getElementById('screenBlendingBtn').addEventListener('click',function(e){
	material.uniforms.useScreen.value=1-material.uniforms.useScreen.value;
	this.classList.toggle('active',material.uniforms.useScreen.value===1);
	e.preventDefault();
});
document.getElementById('normalValueInput').addEventListener('change',function(e){
	normalScale = this.value/100;
	material.uniforms.normalScale.value=this.value/100;
	materialAnim.normalScale.y = materialAnim.normalScale.x = this.value/100;
	materialMorph.normalScale.y = materialMorph.normalScale.x = this.value/100;
	e.preventDefault();
});

document.getElementById('normalRepeatInput').addEventListener('change',function(e){
	normalReapeat = this.value;
	material.uniforms.normalRepeat.value=this.value;
	materialAnim.normalMap.repeat.set( this.value, this.value );
	materialAnim.normalMap.needsUpdate = true;
	materialMorph.normalMap.repeat.set( this.value, this.value );
	materialMorph.normalMap.needsUpdate = true;
	e.preventDefault();
});

document.getElementById('rimValueInput').addEventListener('change',function(e){
	material.uniforms.useRim.value=this.value/100;
	e.preventDefault();
});

document.getElementById('rimPowerValueInput').addEventListener('change',function(e){
	material.uniforms.rimPower.value=this.value/20;
	e.preventDefault();
});
[].slice.call(document.querySelectorAll('a[rel=external]'),0).forEach(function(a){a.addEventListener('click',function(e){
	window.open(this.href,'_blank');
	e.preventDefault();
},false);});



var optionsPanel=document.getElementById('options');
var modelButtons=[].slice.call(document.querySelectorAll('#modelList li a'),0);
modelButtons.forEach(function(el){
	el.addEventListener('click',function(ev){
		showLoader(true);
		var f=null;
		var mod, size;
		modelButtons.forEach(function(i){i.classList.remove('active')});
		switch(el.getAttribute('data-value')){
			case'gauntlet':f=true; mod="gauntlet"; size=1; break;
			case'drum':f=true;  mod="drum"; size=1; break;
			case'dice':f=true;  mod="dice"; size=30; break;
			case'column':f=true;  mod="column"; size=30; break;
			case'gyro':f=true;  mod="gyro"; size=30; break;
			case'youbot':f=true;  mod="youbot"; size=1; break;
			case'body':f=true;  mod="body"; size=0.6; break;
			case'head':f=true;  mod="head"; size=0.2; break;
			case'onkba':f=true;  mod="onkba"; size=0.6; break;
			case'vision':f=true;  mod="vision"; size=0.2; break;
			case'dragon':f=true;  mod="dragon"; size=1; break;
			case'panthere':f=true;  mod="panthere"; size=1; break;
		}
if(f){
	currentModel = mod;
	loadSeaFile(AssetsFolder + "models/"+mod+".sea", size);
	el.classList.add('active');
    //setTimeout(function(){f(function(g){  });},250);
  }
//}});
})});
/*
var isSafari=/Safari/.test(navigator.userAgent)&&/Apple Computer/.test(navigator.vendor);

document.getElementById('snapshotBtn').addEventListener('click',function(e){
	renderer.preserveDrawingBuffer=true;
	var context = renderer.domElement.getContext("experimental-webgl", {preserveDrawingBuffer: true});
	var name='clicktorelease.com-litSphere-'+Date.now()+'.png';
	var canvas=document.createElement('canvas');
	canvas.width=renderer.domElement.width/(CSSAntialias?2:1);
	canvas.height=renderer.domElement.height/(CSSAntialias?2:1);
	var ctx=canvas.getContext('2d');
	var src=renderer.domElement;
	ctx.drawImage(src,0,0,renderer.domElement.width,renderer.domElement.height,0,0,canvas.width,canvas.height);

	var a=this;
	if(isSafari){
		var data=canvas.toDataURL('image/png');
		window.open(data,name);
		return false;
	}else{
		canvas.toBlob(function(blob){
			var url;
			if(window.webkitURL){url=window.webkitURL.createObjectURL(blob);}
			else{url=URL.createObjectURL(blob);}
			a.setAttribute('download',name);
			a.setAttribute('href',url);});
	}
	renderer.preserveDrawingBuffer=false;
});
*/