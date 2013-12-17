(function() {

    decay(0.1);

    var n = 128, p1 = [], p2 = [];

    quality(0.75);

    var r = 0.1 + 0.02 * soundData.bass;

    var circles = [], points = [];
    drawCircle(0.5, 0.5, 0.03 + soundData.bass * 0.02, "rgb(255,255,220)", "black", 3);

    for (var i=0;i<n;i++) {
      var spec = pow(soundData.eqDataL[(i/n*256)>>0], 0.7) * 0.4;
      var wave = soundData.waveDataL[(i/n*256)>>0];

      var d = i/n * PI2 - PI*0.5;
      var d2 = d + PI2 * 1/n;
      var r2 = r + wave * 0.1;

      var x = .5 + cos(d) * r2;
      var y = .5 + sin(d) * r2;

      points[i] = [x,y];

      circles[i] = {
        x : x, 
        y : y, 
        radius : 0.001 + 0.0005 * soundData.bass
      };
    }

    if (soundData.bass > 2.0)
      drawPath(points, true, "rgba(200,220,255,0.5)");
    else
      drawCircles(circles, "rgb(200,220,255)");


    rotozoom(0.02 + soundData.treb * 0.05, 1.1 + soundData.mid * 0.02)

    commit();

});