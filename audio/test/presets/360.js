// (Non-interactive) port of Scott Schiller's 360 degrees SoundManager2 ui
// http://www.schillmania.com/projects/soundmanager2/demo/360-player/canvas-visualization.html

(function() {
    quality(0.8);
    drawRect(0,0,1,1,"white");

    var n = 60, p = [];
    var t = soundData.currentTime / soundData.duration;
    var r = 0.2 + 0.015 * soundData.bass;

    // draw green spectrum bars
    for (var i=0;i<n;i+=2) {
      var spec = pow(soundData.eqDataL[(i/n*256)>>0], 0.5) * 0.4;
      var d = i/n * PI2 - PI*0.5;
      var d2 = d + PI2 * 1/(n * 1.5);
      var r2 = r + spec * 0.3;
      p.push(
        [.5 + cos(d)*r, .5 + sin(d)*r],
        [.5 + cos(d)*r2, .5 + sin(d)*r2],
        [.5 + cos(d2)*r2, .5 + sin(d2)*r2],
        [.5 + cos(d2)*r, .5 + sin(d2)*r]
      );
    }
    drawPath(p, true, "green");

    var wr = r - 0.1;

    drawCircle(0.5, 0.5, r + 0.01, "rgb(192,192,192)"); // grey circle
    drawArc(0.5, 0.5, r + 0.01, PI2*t - PI*0.5, -PI*0.5, "black"); // black time arc
    drawCircle(0.5, 0.5, wr, "white"); // white middle

    // draw blue wave bars
    var n2 = 128;

    for (var i=0;i<n2;i++) {
      var wave = soundData.waveDataL[(i/n2*256)>>0];
      var d = i/n * PI*2 - PI*0.5;
      var r2 = wr + wave * 0.05;
      drawPath(
        [[.5 + cos(d)*wr, .5 + sin(d)*wr], [.5 + cos(d)*r2, .5 + sin(d)*r2]],
        false, null, "#0099ff", 2.5
      );
    }

    commit();

});