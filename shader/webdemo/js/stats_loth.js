/**
 * @author mrdoob / http://mrdoob.com/
 */

var Stats = function () {

	var startTime = Date.now(), prevTime = startTime;
	var ms = 0, msMin = Infinity, msMax = 0;
	var fps = 0, fpsMin = Infinity, fpsMax = 0;
	var frames = 0, mode = 0;

	var container = document.createElement( 'div' );
	container.id = 'stats';
	container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ mode % 3 ) }, false );
	container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer;position:absolute;bottom:10px;left:10px';

	var fpsDiv = document.createElement( 'div' );
	fpsDiv.id = 'fps';
	fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:center;background-color:#002;display:none;';
	container.appendChild( fpsDiv );

	var fpsText = document.createElement( 'div' );
	fpsText.id = 'fpsText';
	fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	fpsText.innerHTML = 'FPS';
	fpsDiv.appendChild( fpsText );

	var fpsGraph = document.createElement( 'div' );
	fpsGraph.id = 'fpsGraph';
	fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
	fpsDiv.appendChild( fpsGraph );

	while ( fpsGraph.children.length < 74 ) {

		var bar = document.createElement( 'span' );
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
		fpsGraph.appendChild( bar );

	}

	

	var msDiv = document.createElement( 'div' );
	msDiv.id = 'ms';
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
	container.appendChild( msDiv );

	var msText = document.createElement( 'div' );
	msText.id = 'msText';
	msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	msText.innerHTML = 'MS';
	msDiv.appendChild( msText );

	var msGraph = document.createElement( 'div' );
	msGraph.id = 'msGraph';
	msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
	msDiv.appendChild( msGraph );

	var lofpsColor = 'rgba(255,255,0,0.5)'
	var lomsColor = 'rgba(0,255,0,0.2)'
	


	var loDiv = document.createElement( 'div' );
	loDiv.id = 'lo';
	loDiv.style.cssText = 'width:32px;height:16px;padding:0 0 0 0;text-align:left;';
	container.appendChild( loDiv );

	var loGraph = document.createElement( 'canvas' );
	loGraph.width = 32;
	loGraph.height = 16;
	var ctx = loGraph.getContext("2d");
	ctx.beginPath();
	ctx.arc(16, 16, 16, 0, 2 * Math.PI, false);
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgba(255,255,255,0.2)';
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(16, 16, 2, 0, 2 * Math.PI, false);
	ctx.lineWidth = 1;
	ctx.strokeStyle = lomsColor;
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(16, 16, 1, 0, 2 * Math.PI, false);
	ctx.lineWidth = 2;
	ctx.strokeStyle =lofpsColor;
	ctx.stroke();

	//loGraph.id = 'loGraph';
	//loGraph.style.cssText = 'position:relative;width:74px;height:60px;background-color:#000';
	loDiv.appendChild( loGraph );

	

	var l02 = document.createElement( 'div' );
	l02.id = 'l02';
	l02.style.cssText = 'position:absolute;left:16px; bottom:1px;width:1px;height:15px;transform-origin: 0.5px 15px;-webkit-transform-origin: 0.5px 15px;-o-transform-origin 0.5px 15px;';
	loDiv.appendChild( l02);

	var l03 = document.createElement( 'div' );
	l03.id = 'l03';
	l03.style.cssText = 'width:1px;height:12px;background-color:'+lomsColor+';';
	l02.appendChild( l03);

	var l01 = document.createElement( 'div' );
	l01.id = 'l01';
	l01.style.cssText = 'position:absolute;left:16px; bottom:1px;width:1px;height:15px;background-color:'+lofpsColor+';transform-origin: 0.5px 15px;-webkit-transform-origin:  0.5px 15px;-o-transform-origin:  0.5px 15px%;';
	loDiv.appendChild( l01);

	while ( msGraph.children.length < 74 ) {

		var bar = document.createElement( 'span' );
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
		msGraph.appendChild( bar );

	}

	var setMode = function ( value ) {

		mode = value;

		switch ( mode ) {
			case 0:
				loDiv.style.display = 'block';
				fpsDiv.style.display = 'none';
				msDiv.style.display = 'none';
				break;
			case 1:
			    loDiv.style.display = 'none';
				fpsDiv.style.display = 'block';
				msDiv.style.display = 'none';
				break;
			case 2:
			    loDiv.style.display = 'none';
				fpsDiv.style.display = 'none';
				msDiv.style.display = 'block';
				break;
		}

	}

	var rotate = function ( dom, value ) {
		if(value>90)value = 90;
		if(value<-90)value = -90;

		//var child = dom.appendChild( dom.firstChild );
		//child.style.height = value + 'px';
		dom.style.webkitTransform = 'rotate('+value+'deg)';
		//dom.style.mozTransform = 'rotate('+value+'deg)';
		dom.style.oTransform = 'rotate('+value+'deg)';
		dom.style.transform = 'rotate('+value+'deg)';
		
	//dom.style.cssText ='-webkit-transform: rotate('+value+'deg); -moz-transform: rotate('+value+'deg); -o-transform: rotate('+value+'deg); transform: rotate('+value+'deg);'

	}

	var updateGraph = function ( dom, value ) {

		var child = dom.appendChild( dom.firstChild );
		child.style.height = value + 'px';

	}



	return {

		REVISION: 11,

		domElement: container,

		setMode: setMode,

		begin: function () {

			startTime = Date.now();

		},

		end: function () {

			var time = Date.now();

			ms = time - startTime;
			msMin = Math.min( msMin, ms );
			msMax = Math.max( msMax, ms );

			
			if(mode===0){rotate(l02, (ms*3)-90);}
			else{
				msText.textContent = ms + ' MS (' + msMin + '-' + msMax + ')';
				updateGraph( msGraph, Math.min( 30, 30 - ( ms / 200 ) * 30 ) );
			}

			frames ++;

			if ( time > prevTime + 1000 ) {

				fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
				fpsMin = Math.min( fpsMin, fps );
				fpsMax = Math.max( fpsMax, fps );

				
				if(mode===0){rotate(l01,  (fps*3)-90 );}
				else{
					fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
					updateGraph( fpsGraph, Math.min( 30, 30 - ( fps / 100 ) * 30 ) );
				}
				prevTime = time;
				frames = 0;

			}

			return time;

		},

		update: function () {

			startTime = this.end();

		}

	}

};
