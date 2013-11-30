"use strict";
var camPos = {w: 100, h:100, horizontal: 40, vertical: 60, distance: 200, automove: false};
var vsize = { x:0, y:0 };
var mouse = {x: 0, y: 0, down:false, over:false, moving:true, ox: 0, oy: 0, h: 0, v: 0, mx:0, my:0};
var center = new THREE.Vector3(0,0,0);
var ToRad = Math.PI / 180;
var DomElement;
var camera;

function CameraLoth(domElement) {
	this.domElement = ( domElement !== undefined ) ? domElement : document
	camera = new THREE.PerspectiveCamera( 60, 1, 1, 20000 );
	camera.scale.set(-1, 1, 1);
	scene.add(camera);
	moveCamera();

	this.domElement.addEventListener( 'mouseout', onMouseOut, false );
	this.domElement.addEventListener( 'mouseover', onMouseOver, false );

	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mousemove', onMouseMove, false );
	this.domElement.addEventListener( 'mouseup', onMouseUp, false );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox

	this.domElement.addEventListener( 'touchmove', onTouchMove, false );
	this.domElement.addEventListener( 'touchstart', onTouchStart, false);
	this.domElement.addEventListener( 'touchend', onMouseUp, false);
	this.domElement.addEventListener( 'touchcancel', onMouseUp, false);
	
	DomElement = this.domElement;
}

function setCameraSize(x, y) {
	vsize.x = x;
	vsize.y = y;
	camera.aspect = x/y;
	camera.updateProjectionMatrix();
}

function onMouseOut() {
	document.body.style.cursor = 'auto';
	mouse.down = false;
	mouse.over = false;
}

function onMouseOver() {
	mouse.over = true;
}

//-----------------------------------------------------
//  MOUSE
//-----------------------------------------------------

function onMouseDown(e) {
	e.preventDefault();
	mouse.ox = e.clientX;
	mouse.oy = e.clientY;
	mouse.h = camPos.horizontal;
	mouse.v = camPos.vertical;
	mouse.mx = ( e.clientX / vsize.x ) * 2 - 1;
	mouse.my = -( e.clientY / vsize.y ) * 2 + 1;
	mouse.down = true;
}

function onMouseUp(e) {
	document.body.style.cursor = 'auto';
	mouse.down = false;
}

function onMouseMove(e) {
	//e.preventDefault();
	if (mouse.down && !camPos.automove ) {
		
	    if (mouse.moving) {
			document.body.style.cursor = 'move';
			mouse.x = e.clientX;
			mouse.y = e.clientY;
			
			camPos.horizontal = (-(mouse.x - mouse.ox) * 0.3) + mouse.h;
			camPos.vertical = (-(mouse.y - mouse.oy) * 0.3) + mouse.v;
			moveCamera();
	    } else {
	    	mouse.mx = ( e.clientX / vsize.x ) * 2 - 1;
	    	mouse.my = -( e.clientY / vsize.y ) * 2 + 1;
	    }
	}
}

//-----------------------------------------------------
//  TOUCH
//-----------------------------------------------------

function onTouchStart(e) { 
	e.preventDefault();
	var t=event.touches[0];
	mouse.ox = t.clientX;
	mouse.oy = t.clientY;
	mouse.h = camPos.horizontal;
	mouse.v = camPos.vertical;
	mouse.mx = ( t.clientX / vsize.x ) * 2 - 1;
	mouse.my = -( t.clientY / vsize.y ) * 2 + 1;
	mouse.down = true;
}

function onTouchMove(e) { 
	//e.preventDefault();
	//var touchId = e.changedTouches[0].identifier;
	var t=event.touches[0];
    if (mouse.down && !camPos.automove ) {
	    if (mouse.moving) {
			document.body.style.cursor = 'move';
			mouse.x = t.clientX;//e.touches[touchId].clientX;
			mouse.y = t.clientY;//e.touches[touchId].clientY;
			camPos.horizontal = (-(mouse.x - mouse.ox) * 0.3) + mouse.h;
			camPos.vertical = (-(mouse.y - mouse.oy) * 0.3) + mouse.v;
			moveCamera();
		} else {
			mouse.mx = ( t.clientX / vsize.x ) * 2 - 1;
	    	mouse.my = -( t.clientY / vsize.y ) * 2 + 1;
		}
    }
}

function onMouseWheel(e) {
	var delta = 0;
	if(e.wheelDeltaY){delta=e.wheelDeltaY*0.01;}
	else if(e.wheelDelta){delta=e.wheelDelta*0.05;}
	else if(e.detail){delta=-e.detail*1.0;}
	camPos.distance-=delta;
	moveCamera();
}

//-----------------------------------------------------
//  CAMERA
//-----------------------------------------------------

function moveCamera() {
	camera.position.copy(Orbit(center, camPos.horizontal, camPos.vertical, camPos.distance, true));
	camera.lookAt(center);
}

function endMove() {
	camPos.automove = false;
}

function onThreeChangeView(h, v, d) {
	TweenLite.to(camPos, 3, {horizontal: h, vertical: v, distance: d, onUpdate: moveCamera, onComplete: endMove });
	camPos.automove = true;
}

function onChangeDistance(d) {
	TweenLite.to(camPos, 1, {distance: d, onUpdate: moveCamera, onComplete: endMove });
	camPos.automove = true;
}

function cameraFollow(vec){
	center.copy(vec);
	moveCamera();
}

//-----------------------------------------------------
//  MATH
//-----------------------------------------------------

function exponentialEaseOut( v ) { return v === 1 ? 1 : - Math.pow( 2, - 10 * v ) + 1; };

function clamp(a,b,c) { return Math.max(b,Math.min(c,a)); }

function Orbit(origine, horizontal, vertical, distance, isCamera) {
	if(isCamera){
		if(distance>10000)distance =10000;
		else if(distance<10)distance =10;
		if(vertical>89){vertical =89;}
		else if(vertical<1){vertical =1;}

		camPos.vertical = vertical;
		camPos.distance = distance;
	} 
	var p = new THREE.Vector3();
	var phi = unwrapDegrees(vertical)*ToRad;
	var theta = unwrapDegrees(horizontal)*ToRad;
	
	p.x = (distance * Math.sin(phi) * Math.cos(theta)) + origine.x;
	p.z = (distance * Math.sin(phi) * Math.sin(theta)) + origine.z;
	p.y = (distance * Math.cos(phi)) + origine.y;
	return p;
}

function unwrapDegrees(r) {
	r = r % 360;
	if (r > 180) r -= 360;
	if (r < -180) r += 360;
	return r;
}

function getDistance (x1, y1, x2, y2) {
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}