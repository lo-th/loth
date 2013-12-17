(function() {

var n, lastPoints;

var n = 60;
var lastPoints = [];
for (var i=0;i<n;i++) {
	lastPoints[i] = [0.5,0.5];
}
quality(1.0);

return function() {
    var p = [];

    var r = 0.1 + 0.005 * soundData.bass;
    var stretchFactor = 1.1;

    var s = min(100, 70 + soundData.bass * 30);
    for (var i=0;i<n;i++) {
      var wave = soundData.waveDataL[(i/n*256)>>0];

      var d = i/n * PI2 - PI*0.5;
      var d2 = d + PI2 / n;
      var r2 = r + wave * 0.05;

      var x = .5 + cos(d) * r2;
      var y = .5 + sin(d) * r2;

      p[i] = [x,y];
      var lp = lastPoints[i];
      lp = [
        (lp[0] - 0.5) * stretchFactor + 0.5,
        (lp[1] - 0.5) * stretchFactor + 0.5,
      ];

      drawPath([p[i], lp], false, null, "hsl(220,100%," + s + "%)", 0.3 + 0.2 * soundData.mid);

      lastPoints[i] = p[i];
    }

    drawPath(p, true, "rgb(10,10,20)", "white", 0.1);

    stretch(stretchFactor, stretchFactor, 0.5 + (0.05 * sin(time)), 0.5 + 0.05 * cos(time));

    commit();
};

})();