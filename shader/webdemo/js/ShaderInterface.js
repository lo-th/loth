var normals=[{name:'243',map:'243-normal.jpg'},{name:'243',map:'wrinkle-normal.jpg'},{name:'243',map:'295-normal.jpg'},
{name:'243',map:'879-normal.jpg'},{name:'wetstone',map:'wetstone.jpg'},{name:'brick',map:'brick_n.jpg'},{name:'brick2',map:'brick2_n.jpg'},
{name:'243',map:'floor2_ddn.jpg'},{name:'243',map:'forestfloornrmii7.jpg'},{name:'243',map:'normal.jpg'},
{name:'243',map:'normalmap_tile_even.jpg'},{name:'243',map:'stage7.jpg'},
{name:'worm temple',map:'worn-temple_n.jpg'},{name:'stone',map:'stone_n.jpg'},
{name:'243',map:'metal1_normalmap.jpg'},{name:'rock wall',map:'rockwall_n.jpg'},
{name:'243',map:'4918-normal.jpg'},{name:'crater',map:'crater_n.jpg'},{name:'243',map:'stone_wall_normal_map.jpg'},
{name:'bone',map:'bone_n.jpg'},{name:'243',map:'7146-normal.jpg'},{name:'243',map:'1324-normal.jpg'},
{name:'243',map:'Rock_01_local.jpg'},{name:'243',map:'6624-normal.jpg'},
{name:'sand',map:'sand_n.jpg'},{name:'arid',map:'arid_n.jpg'},{name:'water',map:'water_n.jpg'},{name:'metal',map:'metal_n.jpg'},{name:'lava',map:'lava_n.jpg'}];

var materialList, normalList, modelList;

var canvasNormal;

var normalReapeat = 1, normalScale=0;
var currentColor = -1;
var modelSize = 20;
var scaleset;
var scaletxt;

function initInterface(){
	document.getElementById('ssao').addEventListener('click',function(e){initComposer()});


	modelList=document.getElementById('modelList');
	scaleset = document.getElementById('scaleValueInput');
	scaletxt = document.getElementById('scaletxt');
	scaleset.addEventListener('change',function(e){modelSize=this.value; scaleContent(modelSize);scaletxt.innerHTML="Scale : "+modelSize;e.preventDefault();});
	//[].slice.call(document.querySelectorAll('a[rel=external]'),0).forEach(function(a){a.addEventListener('click',function(e){window.open(this.href,'_blank');e.preventDefault();},false);});
	modelList.appendChild(createSea3dDropZone());


var j;

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
			case'droid':f=true;  mod="droid"; size=0.5; break;
			case'rat':f=true;  mod="rat"; size=2; break;
			case'spider':f=true;  mod="spider"; size=1; break;
		}
if(f){
	showLoader(true);
	clearContent();

	setTimeout(function(){
	currentModel = mod;
	loadSeaFile(AssetsFolder + "models/"+mod+".sea", size);
	el.classList.add('active');
}
	,250);
    //f(function(g){  });}
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
