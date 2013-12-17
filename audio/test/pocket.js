var Pocket = (function() {

// default options
var options = {
	w : 360,
	h : 360
};

// dom helper functions
var dc = function(tag) { return document.createElement(tag); };
var $ = function(id) { return document.getElementById(id); };

// the dimensions of the canvas as seen by the viewer
var displayWidth = 0;
var displayHeight = 0;

// the internal dimensions
var screenWidth = 0;
var screenHeight = 0;

// quality factor (effectively scales the internal dimensions)
var displayQuality = 1;


var canvas, ctx;		// the display canvas
var tmpCanvas, tmpCtx;		// temporary canvas used for various things
var bufferCanvas, bufferCtx;	// the buffer canvas where stuff happens before being painted to the display

var isRunning = false;

var startTime = new Date().getTime()
var now = 0;

var processList = [];	// list of Pixastic action for postprocessing the frame

var compositeMode;
var compositeAlpha = 1;

var hasImageData = false;	// does browser support imagedata, needed for Pixastic processing as well as for compositing effects
var hasLighter = false;		// does browser support "lighter" compositing op (faster than Pixastic)

var noop = function() {};

var audioData;


/* Pre3D stuff */
var Pre3dactive = false;
var Pre3dRenderer;
function Pre3dCamera(ix, iy, iz, tx, ty, tz) {
      var ct = Pre3dRenderer.camera.transform;
      ct.reset();
      ct.rotateZ(tz);
      ct.rotateY(ty);
      ct.rotateX(tx);
      ct.translate(ix, iy, iz);
}
function Pre3dInit() {
	Pre3dRenderer = new Pre3d.Renderer(bufferCanvas);
	Pre3dactive = true;
}
/* end of Pre3D stuff */


// setup everything
function init(screenElement, audioElement, scriptElement, opt) {
	options = opt || options;
	displayWidth = options.w;
	displayHeight = options.h;
	screenWidth = displayWidth * displayQuality;
	screenHeight = displayHeight * displayQuality;

	// first do a test for canvas capability
	var testCanvas = dc("canvas");
	if (!(testCanvas.getContext && testCanvas.getContext("2d")))
		throw new Error("Sorry, no canvas");

	// now test for imagedata and "lighter" operation
	testCanvas.width = testCanvas.height = 1;
	var testCtx = testCanvas.getContext("2d");
	if (testCtx.getImageData) {
		hasImageData = true;
		testCtx.fillStyle = "rgb(50,50,50)";
		testCtx.fillRect(0,0,1,1);
		testCtx.globalCompositeOperation = "lighter";
		var lightCanvas = dc("canvas");
		lightCanvas.width = lightCanvas.height = 1;
		var lightCtx = lightCanvas.getContext("2d");
		lightCtx.fillStyle = "rgb(75,75,75)";
		lightCtx.fillRect(0,0,1,1);
		testCtx.drawImage(lightCanvas,0,0);
		var data = testCtx.getImageData(0,0,1,1).data;
		if (data[0] == 125) {
			hasLighter = true;
		}
	}

	pre3dCanvas = dc("canvas");
	pre3dCanvas.width = screenWidth;
	pre3dCanvas.height = screenHeight;

	tmpCanvas = dc("canvas");
	tmpCanvas.width = screenWidth;
	tmpCanvas.height = screenHeight;
	tmpCtx = tmpCanvas.getContext("2d")

	bufferCanvas = dc("canvas");
	bufferCanvas.width = screenWidth;
	bufferCanvas.height = screenHeight;
	bufferCtx = bufferCanvas.getContext("2d")

	canvas = dc("canvas");
	canvas.id = "screencanvas";
	canvas.width = screenWidth;
	canvas.height = screenHeight;

	tmpCanvas.mozOpaque = true;
	canvas.mozOpaque = true;

	screenElement.appendChild(canvas);

	ctx = canvas.getContext("2d")

	audioData = Pocket.audio(audioElement);

	if (options.watchHash) {
		if (window.location.hash)
			loadScript(window.location.hash.substring(1), scriptElement);
	
		var hash = window.location.hash;
	
		setInterval(function() {
			if (location.hash !== hash) {
				//stopSound();
				hash = window.location.hash;
				loadScript(hash.substring(1), scriptElement);
			}
		}, 100);
	}
}

function loadScript(url, scriptElement, callback) {
	var loaded = function(script) {
		if (scriptElement)
			scriptElement.value = script;

		var vizObject = loadCode(script);

		if (callback)
			callback(vizObject);
	}

	xhr(url, 
		function(http) {
			loaded(http.responseText);
		}
	);
}

function loadCode(code) {
	startTime = new Date().getTime();
	var vizObject = update(code);

	if (vizObject)
		nextFrame(vizObject);
	return vizObject;
}

function xhr(url, callback, error, method) {
	var http = new XMLHttpRequest();
	if (http) {
		if (callback) {
			http.onreadystatechange = function() {
				if (http.readyState == 4) {
					callback(http);
					http = null;
				}
			};
		}
		http.open(method || "GET", url + "?time=" + new Date().getTime(), true);
		http.send(null);
	} else {
		if (error) error();
	}
}

// here the viz code gets eval'd and the resulting object is returned,
// but before the eval, all the API functions are declared so they are
// available in the viz's scope. Same goes for Math functions and other stuff.
function evalVizCode(code) {

	var sqrt = Math.sqrt;
	var pow = Math.pow;
	var exp = Math.exp;
	var sin = Math.sin;
	var cos = Math.cos;
	var tan = Math.tan;
	var atan = Math.atan;
	var atan2 = Math.atan2;
	var asin = Math.asin;
	var acos = Math.acos;
	var min = Math.min;
	var max = Math.max;
	var abs = Math.abs;
	var random = Math.random;
	var log = Math.log;
	var floor = Math.floor;
	var ceil = Math.ceil;
	var round = Math.round;

	var SQRT2 = Math.SQRT2;
	var SQRT1_2 = Math.SQRT1_2;
	var LN2 = Math.LN2;
	var LN10 = Math.LN10;
	var LOG2E = Math.LOG2E;
	var LOG10E = Math.LOG10E;
	var E = Math.E;
	var PI = Math.PI;
	var PI2 = Math.PI*2;

	var log10 = function(n) { return log(n) / LN10; };
	var sign = function(n) { return n < 0 ? -1 : (n == 0 ? 0 : 1); };

	var api = Pocket.api(bufferCanvas, bufferCtx, screenWidth, screenHeight);

	// import api functions
	var clearRect = api.clearRect;
	var drawRect = api.drawRect;
	var drawPath = api.drawPath;
	var drawPaths = api.drawPaths;
	var drawCircle = api.drawCircle;
	var drawCircles = api.drawCircles;
	var drawArc = api.drawArc;
	var drawArcs = api.drawArcs;
	var drawEllipse = api.drawEllipse;
	var drawLine = api.drawLine;
	var drawImage = api.drawImage;

	var drawText = api.drawText;
	var scrollText = api.scrollText;

	var decay = api.decay;
	var process = api.process;

	var zoom = api.zoom;
	var stretch = api.stretch;
	var rotate = api.rotate;
	var rotozoom = api.rotozoom;
	var move = api.move;
	var deform = api.deform;

	var rgb2hsl = api.rgb2hsl;
	var hsl2rgb = api.hsl2rgb;
	var hsv2rgb = api.hsv2rgb; 

	var quality = function(q, keepImage) {
		setDisplayQuality(q, keepImage);
		api.quality(q);
	}

	var composite = function(mode) {
		setCompositeMode(mode);
		api.composite(mode);
	}


	var time = 0, soundData = {};

	// when this gets called (prior to rendering) the time and sounddata variables
	// get updated in the viz code's scope.
	var prepareFrame = function() {
		setCompositeMode("source-over");

		time = now;

		soundData = {
			bass : audioData.relFreqBands[0],
			mid : audioData.relFreqBands[1],
			treb : audioData.relFreqBands[2],
			waveDataL : audioData.waveDataL,
			waveDataR : audioData.waveDataR,
			eqDataL : audioData.eqDataL,
			eqDataR : audioData.eqDataR,
			currentTime : audioData.currentTime,
			duration : audioData.duration
		}
	}

	var renderFnc = eval(code);

	vizObject = {
		prepare : prepareFrame,
		render : renderFnc || noop
	};
	return vizObject;

}

function update(code) {
	var vizObject;
	var err = "";
	var validViz = false;

	reset();

	try {

		vizObject = evalVizCode(code);

		// try a single render to try and catch reference errors, etc.
		vizObject.prepare();
		vizObject.render();

		// start the rendering
		render();

		validViz = true;
	} catch(e) {
		err = e;
		vizObject = {
			prepareFrame : noop,
			render : noop
		};
		validPreset = false;
	}

	if ($("status")) {
		$("status").innerHTML = 
			validViz ? 
				"OK"
			:	"Tighten up that syntax, yo!<br/><br/>" + err;
		$("status").className = validViz ? "status-ok" : "status-error";
	}
	return vizObject;
}

function reset() {
	Pre3dactive = false;
	displayQuality = 1;
	clearTimeout(frameTimer);
	frameTimer = 0;
	resetDisplay();
}

function resetDisplay(keepImage) {
	screenWidth = displayWidth * displayQuality;
	screenHeight = displayHeight * displayQuality;

	if (keepImage) {
		tmpCanvas.width = screenWidth;
		tmpCanvas.height = screenHeight;

		tmpCtx.drawImage(bufferCanvas,0,0,screenWidth,screenHeight);
		bufferCanvas.width = screenWidth;
		bufferCanvas.height = screenHeight;
		bufferCtx.drawImage(tmpCanvas,0,0);

		tmpCtx.clearRect(0,0,screenWidth,screenHeight);
		tmpCtx.drawImage(canvas,0,0,screenWidth,screenHeight);
		canvas.width = screenWidth;
		canvas.height = screenHeight;
		ctx.drawImage(tmpCanvas,0,0);
	} else {
		bufferCanvas.width = screenWidth;
		bufferCanvas.height = screenHeight;
		canvas.width = screenWidth;
		canvas.height = screenHeight;
	}


	if (Pre3dactive) { // couldn't find a nice way to tell pre3d that the canvas dimensions have changed
		Pre3dRenderer.width_ = screenWidth;
		Pre3dRenderer.height_ = screenHeight;
		Pre3dRenderer.scale_ = screenHeight / 2;
		Pre3dRenderer.xoff_ = screenWidth / 2;
	}

}


function setCompositeMode(op, alpha) {
	bufferCtx.globalCompositeOperation = compositeMode = op;

	compositeMode = op;

	if (typeof alpha != "undefined")
		compositeAlpha = alpha;
	else
		compositeAlpha = 1;
}

function setDisplayQuality(q, keepImage) {
	if (!q) return;
	if (q <= 0) return;

	if (q != displayQuality) {
		displayQuality = q;

		resetDisplay(keepImage);
	}
}


function render(vizObject) {
	if (!(vizObject && vizObject.render))
		return;

	now = (new Date().getTime() - startTime) / 1000

	vizObject.prepare();

	bufferCtx.clearRect(0,0,screenWidth,screenHeight);

	ctx.globalCompositeOperation = "source-over";
	bufferCtx.globalCompositeOperation = "source-over";
	compositeMode = "normal";
	compositeAlpha = 1;

	ctx.save();

	bufferCtx.drawImage(canvas,0,0);
	bufferCtx.save();

	ctx.clearRect(0,0,screenWidth,screenHeight);

	vizObject.render();

	bufferCtx.restore();

	ctx.restore();

	var processCanvas = $("processcanvas");
	var processCtx = processCanvas.getContext("2d");
	if (processList.length > 0) {
		processCanvas.width = canvas.width;
		processCanvas.height = canvas.height;
		processCtx.globalCompositeOperation = "copy";
		processCtx.drawImage(ctx.canvas, 0, 0);
		processCtx.globalCompositeOperation = "source-over";
		for (var i=0;i<processList.length;i++) {
			var action = processList[i][0];
			var options = processList[i][1];
			options.leaveDOM = true;
			Pixastic.process(processCanvas, action, options);
			processCtx.globalCompositeOperation = "copy";
			processCtx.drawImage(options.resultCanvas, 0, 0);
			processCtx.globalCompositeOperation = "source-over";
		}
		processList = [];
		processCanvas.style.display = "block";
		canvas.style.display = "none";
	} else {
		canvas.style.display = "block";
		processCanvas.style.display = "none";
	}
}

var frameTimer;
var lastTime = 0;
var fps = 20;

function nextFrame(vizObject) {
	isRunning = true;
	if (!audioData.pause) {
		render(vizObject);
	}
	var frameTime = 1000 / fps;
	var now = new Date().getTime();
	var sinceLast = now - lastTime;
	var lag = sinceLast - frameTime;
	var untilNext = Math.max(1, frameTime - lag);
	if (isRunning)
		frameTimer = setTimeout(function(){nextFrame(vizObject);}, untilNext);
	lastTime = now;
}


function commit(keepBuffer) {
	if ((compositeMode == "lineardodge") && hasLighter) {
		ctx.globalAlpha = compositeAlpha;
		ctx.globalCompositeOperation = "lighter";
		ctx.drawImage(bufferCanvas,0,0);
		ctx.globalAlpha = 1;
	} else {
		if (compositeMode == "normal" && compositeAlpha == 1) {
			ctx.globalCompositeOperation = "source-over";
			ctx.drawImage(bufferCanvas,0,0);
		} else {
			var resCanvas = Pixastic.process(canvas, "blend", {mode : compositeMode, image : bufferCanvas, amount : compositeAlpha, leaveDOM : true});
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx.globalCompositeOperation = "source-over";
			ctx.drawImage(resCanvas, 0, 0);
		}
	}
	if (!keepBuffer)
		bufferCtx.clearRect(0,0,screenWidth,screenHeight);
}	

function copy() {
	bufferCtx.globalCompositeOperation = "source-over";
	bufferCtx.clearRect(0,0,screenWidth,screenHeight);
	bufferCtx.drawImage(canvas,0,0);
}

return {
	init : init,
	loadScript : loadScript,
	loadCode : loadCode
}

})();