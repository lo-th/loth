var materials=[{name:'dark glass',diffuse:'944_large_remake2.jpg'},{name:'twilight fisheye',diffuse:'TwilightFisheye.jpg'},{name:'jeepster skinmat',diffuse:'jeepster_skinmat2.jpg'},{name:'josh shing matcap',diffuse:'JoshSingh_matcap.jpg'},{name:'dark grey metal',diffuse:'mydarkgreymetal_zbrush_matcap_by_digitalinkrod.jpg'},{name:'green shin metal',diffuse:'mygreenshinmetal_zbrush_matcap_by_digitalinkrod.jpg'},{name:'red metal',diffuse:'myredmetal_zbrush_matcap_by_digitalinkrod.jpg'},{name:'gooch',diffuse:'gooch.jpg'},{name:'smooth',diffuse:'smoothmat.jpg'},{name:'LitSphere',diffuse:'LitSphere_example_4.jpg'},{name:'green',diffuse:'5cad3098d01a8d232b753acad6f39972.jpg'},{name:'bluew2',diffuse:'bluew2.jpg'},{name:'bluew',diffuse:'bluew.jpg'},{name:'blue green',diffuse:'blu_green_litsphere_by_jujikabane.jpg'},{name:'daphz3',diffuse:'daphz3.jpg'},{name:'daphz2',diffuse:'daphz2.jpg'},{name:'daphz1',diffuse:'daphz1.jpg'},{ name:'scooby skin',diffuse:'scooby_skin_mix.jpg'},{name:'litsphere',diffuse:'LitSphere_test_05.jpg'},{name:'litsphere2',diffuse:'LitSphere_test_04.jpg'},{name:'litsphere3',diffuse:'LitSphere_test_03.jpg'},{name:'litsphere3',diffuse:'LitSphere_test_02.jpg'},{name:'litsphere3',diffuse:'LitSphere_example_5.jpg'},{name:'litsphere3',diffuse:'LitSphere_example_3.jpg'},{name:'litsphere3',diffuse:'LitSphere_example_2.jpg'},{name:'litsphere3',diffuse:'matball07.jpg'},{name:'litsphere3',diffuse:'matball04.jpg'},{name:'litsphere3',diffuse:'matball06.jpg'},{name:'litsphere3',diffuse:'matball05.jpg'},{name:'litsphere3',diffuse:'matball03.jpg'},{name:'litsphere3',diffuse:'matball02.jpg'},{name:'litsphere3',diffuse:'matball01.jpg'},{name:'red sphere',diffuse:'redsphere.jpg'},{name:'pink',diffuse:'93e1bbcf77ece0c0f7fc79ecb8ff0d00.jpg'}];
var normals=[{name:'243',map:'243-normal.jpg'},{name:'243',map:'wrinkle-normal.jpg'},{name:'243',map:'295-normal.jpg'},{name:'243',map:'879-normal.jpg'},{name:'243',map:'2563-normal.jpg'},{name:'243',map:'brick-normal.jpg'},{name:'243',map:'floor2_ddn.jpg'},{name:'243',map:'forestfloornrmii7.jpg'},{name:'243',map:'normal.jpg'},{name:'243',map:'normalmap_tile_even.jpg'},{name:'243',map:'normalmap1.jpg'},{name:'243',map:'stage7.jpg'},{name:'243',map:'Worn Temple Wall.jpg'},{name:'243',map:'fig29.png'},{name:'243',map:'Wall3_normalmap.jpg'},{name:'243',map:'metal1_normalmap.jpg'},{name:'243',map:'99232450425c8132b17dbccf65da365a.jpg'},{name:'243',map:'4918-normal.jpg'},{name:'243',map:'cr_wallpaper1_NRM.jpg'},{name:'243',map:'stone_wall_normal_map.jpg'},{name:'243',map:'02.jpg'},{name:'243',map:'242-normal.jpg'},{name:'243',map:'7146-normal.jpg'},{name:'243',map:'1324-normal.jpg'},{name:'243',map:'Rock_01_local.jpg'},{name:'243',map:'6624-normal.jpg'}]

var materialList, normalList, modelList;


var canvasSphere, ctxSphere;
var canvasSphere2, ctxSphere2;
var canvasSphere3, ctxSphere3;


var canvasNormal;

var normalReapeat = 1, normalScale=0;
var currentColor = -1;
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

var currentShader = 0;

var tweenner = [];
 
function tweenToPreset(obj){
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
		onUpdate: updateAll
	});
}


function updateAll(){
	//tweenTime++;
	drawSphereGradian();
	//document.getElementById('title').innerHTML = parseInt(GRD.test.x)  +"/"+tweenTime+ "  //  "+ GRD.ranging['r'+1];
}

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
    }
}

function placeColors(){
	for(var i=0;i!==12; i++){
		cac[i].style.left = parseInt(256*GRD.ranging['r'+i])+'px';
	}
}

function setActiveColor(){
	for(var i=0;i!==12; i++){
		if(i!==currentColor)cac[i].classList.remove('active');
		else cac[i].classList.add('active');
	}
}

function getColorsRange(){
	setActiveColor();
	for(var i=0;i!==12; i++){
		GRD.ranging['r'+i] = (parseInt((cac[i].style.left).replace('px', ''))/256).toFixed(2);
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

function placeHelper(){
	mh[0].style.left = mh[2].style.left = parseInt(GRD.positions['p'+0])+'px' ;
	mh[0].style.top = mh[2].style.top = parseInt(GRD.positions['p'+1])+'px' ;
	mh[1].style.left = mh[3].style.left = parseInt(GRD.positions['p'+4])+'px' ;
	mh[1].style.top = mh[3].style.top = parseInt(GRD.positions['p'+5])+'px' ;
}

function drawSphereGradian(){
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
	ctxs[3].clearRect(0, 0, 256, 20);
	ctxs[4].clearRect(0, 0, 256, 20);
	ctxs[5].clearRect(0, 0, 256, 20);

	ctxs[3].fillStyle = grads[5];
	ctxs[3].fillRect(0, 0, 256, 20);

	ctxs[4].fillStyle = grads[3];
	ctxs[4].fillRect(0, 0, 256, 20);

	ctxs[5].fillStyle = grads[4];
	ctxs[5].fillRect(0, 0, 256, 20);

	//_____________stroke line
	ctxs[1].beginPath();
    ctxs[1].arc(128, 128, 128, 0, 2 * Math.PI, false);
    ctxs[1].lineWidth = GRD.line;
    ctxs[1].strokeStyle = grads[0];
    ctxs[1].stroke();

    //_____________border line
    ctxs[0].drawImage( canvasSphere[1], 0, 0 );
    ctxs[0].globalAlpha = GRD.alpha;

	applySphereMaterial();
	if(isShowfinalPreset) traceCurrent();
}

function applySphereMaterial() {
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

var finalPreset;
var finalPresetButton;
var isShowfinalPreset = false;

function traceCurrent(){
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

function initInterface(){
	finalPresetButton=document.getElementById('showFinalPreset'); 
	finalPreset=document.getElementById('finalPreset');

	finalPresetButton.addEventListener('click',function(e){
		if(isShowfinalPreset){isShowfinalPreset = false;  finalPreset.classList.remove('active');}
		else {isShowfinalPreset=true; finalPreset.classList.add('active'); traceCurrent();}
	});

	bb0=document.getElementById('EnvMapText');
	bb0.addEventListener('click',function(e){tweenToPreset(  ShaderMapList[currentShader] );});

	bb1=document.getElementById('EnvMapNext');
	bb1.addEventListener('click',function(e){
		if(currentShader!==ShaderMapList.length-1) currentShader++;
		else currentShader = 0;
		bb0.innerHTML = ShaderMapList[currentShader].name;
		tweenToPreset(  ShaderMapList[currentShader] );
	});

	bb2=document.getElementById('EnvMapPrev');
	bb2.addEventListener('click',function(e){
		if(currentShader!==0)currentShader--;
		else currentShader = ShaderMapList.length-1;
		bb0.innerHTML = ShaderMapList[currentShader].name;
		tweenToPreset(  ShaderMapList[currentShader] );
	});

	modelList=document.getElementById('modelList');
	scaleset = document.getElementById('scaleValueInput');
	scaletxt = document.getElementById('scaletxt');
	scaleset.addEventListener('change',function(e){modelSize=this.value; scaleContent(modelSize);scaletxt.innerHTML="Scale : "+modelSize;e.preventDefault();});
	//[].slice.call(document.querySelectorAll('a[rel=external]'),0).forEach(function(a){a.addEventListener('click',function(e){window.open(this.href,'_blank');e.preventDefault();},false);});
	modelList.appendChild(createSea3dDropZone());


	alphaset = document.getElementById('alphaValueInput');
	alphatxt = document.getElementById('alphatxt');
	alphaset.addEventListener('change',function(e){GRD.alpha=this.value/100; drawSphereGradian();alphatxt.innerHTML="Alpha : "+this.value;});

	lineset = document.getElementById('lineValueInput');
	linetxt = document.getElementById('linetxt');
	lineset.addEventListener('change',function(e){GRD.line=this.value; drawSphereGradian();linetxt.innerHTML="Line : "+this.value;});

	//_____ spherical mapping
	var mapp= document.getElementById('EnvMap');
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

	initColorSelector();

	mapp.appendChild(canvasSphere[0]);
	grd[0].appendChild(canvasSphere[3]);
	grd[1].appendChild(canvasSphere[4]);
	grd[2].appendChild(canvasSphere[5]);

	//_____ color helper
	for(var i=0; i!==12; i++){
		cac[i]=document.getElementById('cc'+i);
		cac[i].appendChild(canvasColors[i]);
		cac[i].name = i;
		dragcc[i] = false;
		cac[i].addEventListener( 'mousedown', function(e){ dragcc[this.name] = true; currentColor = this.name; getColorSelector();}, false );
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
				//currentColor = this.name;
				//this.classList.add('active');
				getColorsRange();
				//getColorSelector(GRD.color[currentColor]);
			}
	    } , false );
	}

	placeColors();

	//_____ position helper
	

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

var j;
	//___________________________________________________
	 
	/*
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


	
*/
	//_________________________________________________________
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

//---------------------------
//   COLOR SELECTOR
//---------------------------

var ddDrag =  [];
var ddcolors = [];
var ddselect = [];
var ddDiv = [];
var ddSel = [];
var ddOutColor;
var ddOutCanvas;

function initColorSelector(){
	var ccw = 64;
	var cch = (ccw/4);
	var ctx;
	var grd;
	ddOutCanvas = document.createElement("canvas");
	ddOutCanvas.width = ddOutCanvas.height = ccw;
	ddOutColor = document.getElementById('finalColor');

	ddOutColor.appendChild(ddOutCanvas);
	ddOutColor.style.left = 256-ccw+'px';
	ctx = ddOutCanvas.getContext("2d");
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.fillRect(0, 0, ccw, ccw);
	
	for(var i=0;i!==4; i++){
		ddDiv[i] = document.getElementById('ddcolor'+i);
		ddSel[i] = document.getElementById('ddselect'+i);
		ddDiv[i].style.top = i*cch+'px';

		ddselect[i] = document.createElement("canvas");
		ddselect[i].width = 1;
		ddselect[i].height = cch;
		ctx = ddselect[i].getContext("2d");
		ctx.fillStyle = 'rgba(255,255,0,1)';
		ctx.fillRect(0, 0, 1, cch);

		ddSel[i].appendChild(ddselect[i]);

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

function drawColorSelector(){
	var c= GRD.colors;
	var n= currentColor;

	var ctx = ddOutCanvas.getContext("2d");
	ctx.clearRect(0, 0, 64, 64);
	ctx.fillStyle = 'rgba('+c['r'+n]+','+c['v'+n]+','+c['b'+n]+','+c['a'+n]+')';
	ctx.fillRect(0, 0, 64, 64);
	drawSphereGradian();
}

function getColorSelector(){
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

function moveColorSelector(n, px){
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

