
Pocket.audio = function(audioElement) {

// TODO: move SM2 and HTML5 specific logic (audio analysis) to separate modules

var audioData = {
	pause : true,
	waveData : [],
	waveDataL : [],
	waveDataR : [],
	eqData : [],
	eqDataL : [],
	eqDataR : [],
	freqBands : [],
	avgFreqBands : [],
	longAvgFreqBands : [],
	relFreqBands : [],
	avgRelFreqBands : [],
	numFreqBands : 3,
	freqBandInterval : 256 / 3,
	frameCount : 0,
	currentTime : 0,
	duration : Infinity
}
for (var i=0;i<audioData.numFreqBands;i++) {
	audioData.avgFreqBands[i] = 0;
	audioData.relFreqBands[i] = 0;
	audioData.longAvgFreqBands[i] = 0;
}
for (var i=0;i<256;i++) {
	audioData.waveDataL[i] = audioData.waveDataR[i] = 0
	audioData.eqDataL[i] = audioData.eqDataR[i] = 0
}

var mode = "html5";

if (!audioElement.mozSetup) {
	audioElement.parentNode.removeChild(audioElement);
	document.getElementById("audio-container").style.display = "none";
	fallbackSM2();
	mode = "sm2";
	return audioData;
}

audioElement.addEventListener("AudioAvailable", analyzeAudio, true);
audioElement.addEventListener("ended", function(){this.play();}, true);

audioElement.addEventListener("play", function() {
	audioData.pause = false;
}, true);

audioElement.addEventListener("pause", function() {
	audioData.pause = true;
}, true);

var fftCache = null;
var audioSampleRate = 44100; 

function analyzeAudio(event) {

	// TODO: optimize everything.

	var waveDataL = [], waveDataR = [], eqDataL = [], eqDataR = [];

	if (mode == "html5") {
		var audio = event.target;
		audioData.currentTime = audio.currentTime;
		var duration = audio.duration;
		if (isNaN(duration) || duration == 0)
			duration = Infinity;
		audioData.duration = duration;

		var signal = event.frameBuffer;
		var signalLength = signal.length;
 
		if(fftCache === null) {
			fftCache = new FFT(signalLength, audioSampleRate);
		}
		fftCache.forward(signal);

		var spectrum = fftCache.spectrum;
		var specLength = spectrum.length;

		for (var i=0;i<256;i++) {
			var s = i/256 * 0.5;
			var specIdx = (s * specLength) >> 0
			var signalIdx = (s * signalLength) >> 0
	
			var signalVal = signal[signalIdx];
			if (signalVal == NaN) signalVal = 0;
	
			waveDataL[i] = waveDataR[i] = signalVal;

			// spectrum modification. Borrowed from http://weare.buildingsky.net/processing/dft.js/audio.new.html
			var j = specIdx + 0.02 * specLength;
			var log = Math.log(j/specLength * (specLength - j)) * Math.sqrt(j/specLength);
			var magnitude = spectrum[specIdx] * 2048 * log * 2;

			eqDataL[i] = eqDataR[i] = magnitude / 50;

		}
	} else {
		waveDataL = this.waveformData.left;
		waveDataR = this.waveformData.right;

		eqDataL = this.eqData.left;
		eqDataR = this.eqData.right;

		for (var i=0;i<256;i++) {
			var waveL = waveDataL[i];
			var waveR = waveDataR[i];
			var specL = eqDataR[i];
			var specR = eqDataL[i];
			if (isNaN(waveL)) waveL = 0;
			if (isNaN(waveR)) waveR = 0;
			if (isNaN(specL)) specL = 0;
			if (isNaN(specR)) specR = 0;

			specL /= Math.SQRT2;
			specR /= Math.SQRT2;

			waveDataL[i] = waveL;
			waveDataL[i] = waveR;
			eqDataL[i] = specL;
			eqDataR[i] = specR;
		}
	}

	audioData.waveDataL = waveDataL;
	audioData.waveDataR = waveDataR;
	audioData.waveData = waveDataL.concat(waveDataR);
	audioData.eqDataL = eqDataL;
	audioData.eqDataR = eqDataR;

	for (var i=0;i<audioData.numFreqBands;i++)
		audioData.freqBands[i] = 0;

	for (var i=0;i<128;i++) {
		audioData.freqBands[(i/audioData.freqBandInterval*2)>>0] += parseFloat(audioData.eqDataL[i]);
	}

	audioData.frameCount++;

	for (var i=0;i<audioData.numFreqBands;i++) {
		if (audioData.freqBands[i] > audioData.avgFreqBands[i])
			audioData.avgFreqBands[i] = audioData.avgFreqBands[i]*0.2 + audioData.freqBands[i]*0.8;
		else
			audioData.avgFreqBands[i] = audioData.avgFreqBands[i]*0.5 + audioData.freqBands[i]*0.5;

		if (audioData.frameCount < 50)
			audioData.longAvgFreqBands[i] = audioData.longAvgFreqBands[i]*0.900 + audioData.freqBands[i]*0.100;
		else
			audioData.longAvgFreqBands[i] = audioData.longAvgFreqBands[i]*0.992 + audioData.freqBands[i]*0.008;


		if (Math.abs(audioData.longAvgFreqBands[i]) < 0.001)
			audioData.relFreqBands[i] = 1.0;
		else
			audioData.relFreqBands[i]  = audioData.freqBands[i] / audioData.longAvgFreqBands[i];

		if (Math.abs(audioData.longAvgFreqBands[i]) < 0.001)
			audioData.avgRelFreqBands[i] = 1.0;
		else
			audioData.avgRelFreqBands[i]  = audioData.avgFreqBands[i] / audioData.longAvgFreqBands[i];
	}


}

var sm2sound;

function fallbackSM2() {

	var script = document.createElement('script');
	script.type = "text/javascript";
	script.src = "soundmanager2.js";
	script.onload = function() {
		soundManager.flashVersion = 9;
		soundManager.flash9Options.useEQData = true;
		soundManager.flash9Options.useWaveformData = true;
		//soundManager.useHighPerformance = true;
		soundManager.allowPolling = true;
		soundManager.url = './'; // path to directory containing SoundManager2 .SWF file
		soundManager.onload = function() {
			soundManagerLoaded = true;
			$(".sm2-fallback").show();

			sm2sound = soundManager.createSound({
				id:"pocketsound",
				url:audioElement.src + ".mp3",
				autoLoad : true,
				stream : true,
				autoPlay : false,
				whileplaying : analyzeAudio,
				multiShot : false,
				onstop : function() { audioData.pause = true; },
				onplay : function() { audioData.pause = false; },
			});
		};
		soundManager.debugMode = false;
		soundManager.debugFlash = false;
		soundManager.beginDelayedInit();
		this.onload = null;
	};

	document.getElementsByTagName("head")[0].appendChild(script);
}

return audioData;

}