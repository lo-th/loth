var materials=[{name:'dark glass',diffuse:'944_large_remake2.jpg'},{name:'twilight fisheye',diffuse:'TwilightFisheye.jpg'},{name:'jeepster skinmat',diffuse:'jeepster_skinmat2.jpg'},{name:'josh shing matcap',diffuse:'JoshSingh_matcap.jpg'},{name:'dark grey metal',diffuse:'mydarkgreymetal_zbrush_matcap_by_digitalinkrod.jpg'},{name:'green shin metal',diffuse:'mygreenshinmetal_zbrush_matcap_by_digitalinkrod.jpg'},{name:'red metal',diffuse:'myredmetal_zbrush_matcap_by_digitalinkrod.jpg'},{name:'gooch',diffuse:'gooch.jpg'},{name:'smooth',diffuse:'smoothmat.jpg'},{name:'LitSphere',diffuse:'LitSphere_example_4.jpg'},{name:'green',diffuse:'5cad3098d01a8d232b753acad6f39972.jpg'},{name:'bluew2',diffuse:'bluew2.jpg'},{name:'bluew',diffuse:'bluew.jpg'},{name:'blue green',diffuse:'blu_green_litsphere_by_jujikabane.jpg'},{name:'daphz3',diffuse:'daphz3.jpg'},{name:'daphz2',diffuse:'daphz2.jpg'},{name:'daphz1',diffuse:'daphz1.jpg'},{ name:'scooby skin',diffuse:'scooby_skin_mix.jpg'},{name:'litsphere',diffuse:'LitSphere_test_05.jpg'},{name:'litsphere2',diffuse:'LitSphere_test_04.jpg'},{name:'litsphere3',diffuse:'LitSphere_test_03.jpg'},{name:'litsphere3',diffuse:'LitSphere_test_02.jpg'},{name:'litsphere3',diffuse:'LitSphere_example_5.jpg'},{name:'litsphere3',diffuse:'LitSphere_example_3.jpg'},{name:'litsphere3',diffuse:'LitSphere_example_2.jpg'},{name:'litsphere3',diffuse:'matball07.jpg'},{name:'litsphere3',diffuse:'matball04.jpg'},{name:'litsphere3',diffuse:'matball06.jpg'},{name:'litsphere3',diffuse:'matball05.jpg'},{name:'litsphere3',diffuse:'matball03.jpg'},{name:'litsphere3',diffuse:'matball02.jpg'},{name:'litsphere3',diffuse:'matball01.jpg'},{name:'red sphere',diffuse:'redsphere.jpg'},{name:'pink',diffuse:'93e1bbcf77ece0c0f7fc79ecb8ff0d00.jpg'}];
var normals=[{name:'243',map:'243-normal.jpg'},{name:'243',map:'wrinkle-normal.jpg'},{name:'243',map:'295-normal.jpg'},{name:'243',map:'879-normal.jpg'},{name:'243',map:'2563-normal.jpg'},{name:'243',map:'brick-normal.jpg'},{name:'243',map:'floor2_ddn.jpg'},{name:'243',map:'forestfloornrmii7.jpg'},{name:'243',map:'normal.jpg'},{name:'243',map:'normalmap_tile_even.jpg'},{name:'243',map:'normalmap1.jpg'},{name:'243',map:'stage7.jpg'},{name:'243',map:'Worn Temple Wall.jpg'},{name:'243',map:'fig29.png'},{name:'243',map:'Wall3_normalmap.jpg'},{name:'243',map:'metal1_normalmap.jpg'},{name:'243',map:'99232450425c8132b17dbccf65da365a.jpg'},{name:'243',map:'4918-normal.jpg'},{name:'243',map:'cr_wallpaper1_NRM.jpg'},{name:'243',map:'stone_wall_normal_map.jpg'},{name:'243',map:'02.jpg'},{name:'243',map:'242-normal.jpg'},{name:'243',map:'7146-normal.jpg'},{name:'243',map:'1324-normal.jpg'},{name:'243',map:'Rock_01_local.jpg'},{name:'243',map:'6624-normal.jpg'}]

var materialList, normalList, modelList;
var canvasSphere, ctxSphere;
var canvasSphere2, ctxSphere2;
var canvasSphere3, ctxSphere3;
var canvasNormal;
var modelSize = 20;
var scaleset;
var scaletxt;
var blurset, blurtxt;

function initInterface(){
	modelList=document.getElementById('modelList');
	scaleset = document.getElementById('scaleValueInput');
	scaletxt = document.getElementById('scaletxt');
	scaleset.addEventListener('change',function(e){modelSize=this.value; scaleContent(modelSize);scaletxt.innerHTML="Scale : "+modelSize;e.preventDefault();});
	//[].slice.call(document.querySelectorAll('a[rel=external]'),0).forEach(function(a){a.addEventListener('click',function(e){window.open(this.href,'_blank');e.preventDefault();},false);});
	modelList.appendChild(createSea3dDropZone());





	blurset = document.getElementById('blurValueInput');
	blurtxt = document.getElementById('blurtxt');
	blurset.addEventListener('change',function(e){applyBlur(this.value);blurtxt.innerHTML="Blur : "+this.value;e.preventDefault();});
	
	

	/////____________________________________________
	canvasSphere = document.createElement("canvas");
	canvasSphere3 = document.createElement("canvas");
	canvasSphere.width = canvasSphere.height = 512;
	canvasSphere3.width = canvasSphere3.height = 512;
	ctxSphere = canvasSphere.getContext("2d");
	ctxSphere3= canvasSphere3.getContext("2d");
	ctxSphere.fillStyle = "#FF1010";
	ctxSphere.fillRect(0, 0, 512, 512);

	//__________________________________________

	var grd=ctxSphere.createLinearGradient(0,0,0,512);
	grd.addColorStop(0.1,"#EEEEEE");
	grd.addColorStop(0.3,"#00AA00");
	grd.addColorStop(0.8,"#1111AA");
	grd.addColorStop(1,"#FFFFFF");

	ctxSphere.fillStyle = grd;
	ctxSphere.fillRect(0, 0, 512, 512);

	var radgrad2 = ctxSphere.createRadialGradient(256,150,100,256,256,256);
    radgrad2.addColorStop(0, '#EEEEEE');
    radgrad2.addColorStop(0.99, '#FF0188');
    radgrad2.addColorStop(1, 'rgba(255,1,136,0)');
    ctxSphere.fillStyle = radgrad2;
	ctxSphere.fillRect(0, 0, 512, 512);

	ctxSphere.beginPath();
    ctxSphere.arc(256, 256, 256, 0, 2 * Math.PI, false);
      //context.fillStyle = 'green';
     // context.fill();
      ctxSphere.lineWidth = 40;
      ctxSphere.strokeStyle = grd;//'#003300';
      ctxSphere.stroke();

    //stackBoxBlurCanvasRGBA( canvasSphere, 0, 0, 512, 512, 10, 2 );
    var imageData = ctxSphere.getImageData( 0, 0, 512, 512 );
    ctxSphere3.putImageData( imageData, 0, 0 );

	canvasSphere2 = document.createElement("canvas");
	canvasSphere2.width = canvasSphere2.height = 256;
	ctxSphere2 = canvasSphere2.getContext("2d");
	ctxSphere2.scale(0.5, 0.5);
	ctxSphere2.drawImage(canvasSphere3, 0, 0);
	
	//////

	var j;
	materialList=document.getElementById('materialList');
	var li=document.createElement('li');
	materialList.appendChild(li);
		
	// ctxSphere.scale(0.5, 0.5);
	li.appendChild(canvasSphere2);
	canvasSphere2.addEventListener('click',applySphereMaterial);
	canvasSphere2.className='materialPreview';
	//canvasSphere2.className='button';
	//a.style.backgroundImage=canvasSphere

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

function applyBlur(b) {
	stackBoxBlurCanvasRGBA( canvasSphere, canvasSphere3, 0, 0, 512, 512, b, 2 );
	applySphereMaterial();
}

function applySphereMaterial() {
	// preview
	ctxSphere2.drawImage(canvasSphere3, 0, 0);
	// three texture
	var tx = new THREE.Texture(canvasSphere3);
	tx.anisotropy = MaxAnistropy;
	material.uniforms.tMatCap.value=tx;
	envMaterial.map = tx;
	tx.needsUpdate = true;
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

	materialAnim.normalMap=material.uniforms.tNormal.value;
	materialAnim.normalScale.y = materialAnim.normalScale.x = 1;
	materialAnim.normalMap.wrapS=materialAnim.normalMap.wrapT=THREE.RepeatWrapping;
	materialAnim.normalMap.needsUpdate=true;
}


document.getElementById('pinBtn').addEventListener('click',function(e){optionsPinned=!optionsPinned;this.classList.toggle('pinned',optionsPinned);optionsPanel.classList.toggle('pinned',optionsPinned);e.preventDefault();});
document.getElementById('screenBlendingBtn').addEventListener('click',function(e){
	material.uniforms.useScreen.value=1-material.uniforms.useScreen.value;
	this.classList.toggle('active',material.uniforms.useScreen.value===1);
	e.preventDefault();
});
document.getElementById('normalValueInput').addEventListener('change',function(e){
	material.uniforms.normalScale.value=this.value/100;
	materialAnim.normalScale.y = materialAnim.normalScale.x = this.value/100;
	e.preventDefault();
});

document.getElementById('normalRepeatInput').addEventListener('change',function(e){
	material.uniforms.normalRepeat.value=this.value;
	materialAnim.normalMap.repeat.set( this.value, this.value );
	materialAnim.normalMap.needsUpdate = true;
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