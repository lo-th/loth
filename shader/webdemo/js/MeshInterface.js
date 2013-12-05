/**
 * @author loth / http://3dflashlo.wordpress.com/
 */

var MeshInterface = function () {
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;'
	var container = document.createElement( 'div' );
	container.id = 'MeshInterface';
	//container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ mode % 3 ) }, false );
	container.style.cssText = unselect+'position:absolute;top:30px;left:0;bottom:30px; width:200px';

	var content= document.createElement( 'div' );
	content.id = 'MeshContent';
	content.style.cssText = unselect+'position:absolute; overflow:auto; padding:10px 10px 10px 10px;top:0px;bottom:0; direction:rtl; text-align:left;';
	container.appendChild( content );

	var modelList = ['dice', 'gauntlet', 'drum', 'column', 'gyro', 'youbot', 'body', 'head', 'onkba', 'vision', 'dragon', 'panthere', 'droid', 'rat', 'spider'];
	var typeList = ['seaStatic','seaLinked','seaAnimated','seaMorphed','seaAnimation','seaMorph']; 
	var buttonColor = ['rgba(255,255,255,0.2)', 'rgba(200,200,200,0.1)', 'rgba(255,255,0,0.2)', 'rgba(0,255,0,0.2)', 'rgba(255,150,0,0.1)','rgba(0,255,150,0.2)'];
	var borderColor = ['rgba(255,255,255,0.5)', 'rgba(200,200,200,0.2)', 'rgba(255,255,0,0.5)', 'rgba(0,255,0,0.5)', 'rgba(255,150,0,0.1)','rgba(0,255,150,0.2)'];
	var defaultStyle = unselect+'-webkit-border-radius: 10px; border-radius: 10px; padding:0px 10px 0px 10px; text-align:left; margin-bottom:1px;pointer-events: none; display:block;margin-left:1px;'
	var defaultStyle2 = unselect+'-webkit-border-top-left-radius: 10px; border-top-left-radius: 10px; -webkit-border-bottom-left-radius: 10px; border-bottom-left-radius: 10px; padding:0px 10px 0px 10px; text-align:left; margin-bottom:1px;cursor:pointer;'
	var defaultStyle3 = unselect+'-webkit-border-top-right-radius: 10px; border-top-right-radius: 10px; -webkit-border-bottom-right-radius: 10px; border-bottom-right-radius: 10px; padding:0px 5px 0px 3px;  text-align:center; margin-bottom:1px;'
	
	var seaButton = [];
	var seaAnimButton = [];
	var seaInfo = [];

	var removeselectAnim = function (o) {
		for (var i=0; i!== seaAnimButton.length; i++){
			if(seaAnimButton[i].name===o.name)seaAnimButton[i].style.backgroundColor='rgba(255,150,0,0.1)';
		}
	}

	return {
		domElement: container,
		begin: function () {


		},
		populate: function (meshs) {
			/*for (var i=0; i!== meshs.length; i++){

				// linked Object
				if(meshs[i].children.length>0){
					for(j=0; j!== meshs[i].children.length; j++){
						meshs[i].children[j].name = "_"+meshs[i].children[j].name;
					}
				}
		    }*/
		    var type = 0;
			var anim = 0;
			var info = 0;

			
			for (var i=0; i!== meshs.length; i++){
				type = 0;
				if(meshs[i].parent)type=1;
				if(meshs[i].animations){type=2; }
				if(meshs[i].geometry.morphTargets.length!==0){ type=3; }
				//else 

				seaButton[i] = document.createElement('li');
				if(type===1)seaButton[i].style.cssText =defaultStyle+'margin-left:10px; background-color:'+buttonColor[type]+';border:1px solid '+borderColor[type]+';';
				else if(type===2)seaButton[i].style.cssText =defaultStyle+'background-color:'+buttonColor[type]+';border:1px solid '+borderColor[type]+'; display:inline-block;';
				//else if(type==4 || type=='5') seaButton[i].style.cssText =defaultStyle+'left:10px; background-color:'+buttonColor[type]+'border:1px solid '+borderColor[type]+';';
				else seaButton[i].style.cssText =defaultStyle+'background-color:'+buttonColor[type]+';border:1px solid '+borderColor[type]+';';


				//if(type==2) seaButton[i].innerHTML = meshs[i].name + " _ bones"+meshs[i].bones.length; 
				seaButton[i].innerHTML = meshs[i].name;
				seaButton[i].id = meshs[i].name;
				content.appendChild( seaButton[i] );
				seaButton[i].className = '.unselectable';

				//animation
				if(type===2){
					// number of bone
					seaInfo[info] = document.createElement('li');
					seaInfo[info].style.cssText = defaultStyle3+'margin-left:2px; background-color:'+buttonColor[2]+';border:1px solid '+borderColor[2]+';display:inline;';
					seaInfo[info].innerHTML = meshs[i].bones.length;
					seaInfo[info].id = 'info'+meshs[i].name;
					content.appendChild( seaInfo[info] );
					info++;

					for(var j=0;j!==meshs[i].animations.length;j++){
						seaAnimButton[anim] = document.createElement('li');
						seaAnimButton[anim].style.cssText = defaultStyle2+'margin-left:20px; background-color:'+buttonColor[4]+';border:1px solid '+borderColor[4]+';display:block;width:150px;';
						seaAnimButton[anim].innerHTML = meshs[i].animations[j].name;
						seaAnimButton[anim].id = meshs[i].animations[j].name;
						seaAnimButton[anim].name = meshs[i].name;
						content.appendChild( seaAnimButton[anim] );
						seaAnimButton[anim].addEventListener('click',function(e){getMeshByName(this.name).play(this.id);removeselectAnim(this); this.style.backgroundColor='rgba(255,150,0,0.5)';});
						anim++;
					}
				}
				//morph
				if(type===3){
					for(var j=0;j!==meshs[i].geometry.morphTargets.length;j++){
						seaAnimButton[anim] = document.createElement('li');
						seaAnimButton[anim].style.cssText = defaultStyle2+'margin-left:20px; background-color:'+buttonColor[5]+';border:1px solid '+borderColor[5]+';';
						seaAnimButton[anim].innerHTML = meshs[i].geometry.morphTargets[j].name;
						seaAnimButton[anim].id = meshs[i].geometry.morphTargets[j].name;
						content.appendChild( seaAnimButton[anim] );
						anim++;
					}
				}
			}


		},
		clear: function () {
			for (var i=0; i!== seaButton.length; i++){
				content.removeChild(seaButton[i]);
			}
			for (var i=0; i!== seaAnimButton.length; i++){
				content.removeChild(seaAnimButton[i]);
			}
			for (var i=0; i!== seaInfo.length; i++){
				content.removeChild(seaInfo[i]);
			}
			seaButton = [];
			seaAnimButton = [];
			seaInfo = [];
		}

    }
}