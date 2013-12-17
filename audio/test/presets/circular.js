(function() {

    decay(0.8);

    var n = 60, p1 = [], p2 = [];

    quality(0.8);

    var r = 0.2 + 0.02 * soundData.bass;

    for (var i=0;i<n;i++) {
      var spec = pow(soundData.eqDataL[(i/n*256)>>0], 0.7) * 0.4;

      var d = i/n * PI2 - PI*0.5;
      var d2 = d + PI2 * 1/n;
      var r2 = r + spec * 0.3;
      p1.push([.5 + cos(d)*r, .5 + sin(d)*r]);
      p1.push([.5 + cos(d)*r2, .5 + sin(d)*r2]);
      p1.push([.5 + cos(d2)*r2, .5 + sin(d2)*r2]);
    }

    var n2 = 128;
    for (var i=0;i<n2;i++) {
      var wave = soundData.waveDataL[(i/n2*256)>>0] * 0.2;
      var wr = 0.1 + 0.2 * wave;  
      p2.push([.5 - r * 0.90 + i/n2 * r * 2 * 0.90, .5 + 0.2 * wave * (1 / 0.3 * sin(i/n2 * PI))]);
    }

    drawPath(p1, false, "rgb(120,120,120)", "white", 2);

    drawCircle(0.5, 0.5, r - 0.05, "black");

    drawPath(p2, false, null, "rgb(120,120,120)", 10);
    drawPath(p2, false, null, "rgb(220,220,220)", 2);


    commit();

});