importScripts('js/oimo/runtime_min.js');
//importScripts('js/oimo/oimo_dev.js');
importScripts('js/oimo/oimo_dev_min.js');
var world;
var bodys;
var N = 100;
var dt = 1/60;
var iterations = 8;
var info = "info test";
var fps=0, time, time_prev=0, fpstxt="";
var matrix;
var sleeps;
var types;
var max;
var positions;

this.onmessage = function (e) {

    if(e.data.N)N = e.data.N;
    if(e.data.dt)dt = e.data.dt;
    if(e.data.iterations)iterations = e.data.iterations;
  //  var matrix = e.data.matrix;
    if(world != null){
      //  world.timeStep = dt;
    //var matrix = e.data.matrix;
         update();
    /*   world.step();
       // this.postMessage("world run !! " + bodys[0].position.y);

        //var max = bodys.length;
        //var body, 
        var r, p, sleep, t;
        var i=0;

        // Copy over the data to the buffers
        

        //for ( var i = 0; i !== max ; ++i ) {
        var body = world.rigidBodies;
        while (body != null) {
            //body = bodys[i];
            if (body.type == 0x1) {
                r = body.rotation;
                p = body.position;
                if(body.sleeping) sleep = 1;
                else sleep = 0;
                if(body.shapes.type) t = body.shapes.type;
                else t = 0;

                matrix[14*i + 0] = r.e00;
                matrix[14*i + 1] = r.e01;
                matrix[14*i + 2] = r.e02;
                matrix[14*i + 3] = p.x * 100;

                matrix[14*i + 4] = r.e10;
                matrix[14*i + 5] = r.e11;
                matrix[14*i + 6] = r.e12;
                matrix[14*i + 7] = p.y * 100;

                matrix[14*i + 8] = r.e20;
                matrix[14*i + 9] = r.e21;
                matrix[14*i + 10] = r.e22;
                matrix[14*i + 11] = p.z * 100;

                matrix[14*i + 12] = sleep;
                matrix[14*i + 13] = t;
            }
            body = body.next;
            i++;
        }
        info = "<br>";
        info += "Rigidbody: "+world.numRigidBodies+"<br>";
        info += "Contact: "+world.numContacts+"<br>";
        info += "Pair Check: "+world.broadPhase.numPairChecks+"<br>";
        info += "Contact Point: "+world.numContactPoints+"<br>";
        info += "Island: " + world.numIslands +"<br><br>";
        info += fpstxt;


        this.postMessage({tell:"RUN", info: info, matrix:matrix })//, [matrix.buffer])*/
    } else{
        initClass();
    }

    //fpsUpdate();
}

function update() {
    
    var r, p, sleep, t;
    //var i=0;

    // Copy over the data to the buffers
    //var matrix = [];//e.data.matrix;

    for ( var i = 0; i !== max ; ++i ) {
    //var body = world.rigidBodies;
    //while (body != null) {
       // body = bodys[i];
        //if (body.type == 0x1) {
            
          if( bodys[i].sleeping) sleep = 1;
          else sleep = 0;
            /*if(body.shapes.type) t = body.shapes.type;
            else t = 0;*/

            r = bodys[i].rotation;
            p = bodys[i].position;

            /*positions[3*i +0] = (p.x * 100).toFixed(2);
            positions[3*i +1] = (p.y * 100).toFixed(2);
            positions[3*i +2] = (p.z * 100).toFixed(2);*/

            matrix[12*i + 0] = r.e00;
            matrix[12*i + 1] = r.e01;
            matrix[12*i + 2] = r.e02;
            matrix[12*i + 3] = Math.round(p.x * 100);

            matrix[12*i + 4] = r.e10;
            matrix[12*i + 5] = r.e11;
            matrix[12*i + 6] = r.e12;
            matrix[12*i + 7] = Math.round(p.y * 100);

            matrix[12*i + 8] = r.e20;
            matrix[12*i + 9] = r.e21;
            matrix[12*i + 10] = r.e22;
            matrix[12*i + 11] = Math.round(p.z * 100);
            //matrix[14*i + 12] = sleep;
            //matrix[14*i + 13] = t;*/
            sleeps[i] = sleep;
        }
        //body = body.next;
       // i++;
    //}
world.step();


    fpsUpdate();

    info = "<br>";
    info += "Rigidbody: "+world.numRigidBodies+"<br>";
    info += "Contact: "+world.numContacts+"<br>";
    info += "Pair Check: "+world.broadPhase.numPairChecks+"<br>";
    info += "Contact Point: "+world.numContactPoints+"<br>";
    info += "Island: " + world.numIslands +"<br><br>";
    
    info += "Broad-Phase Time: " + world.performance.broadPhaseTime + "ms<br>";
    info += "Narrow-Phase Time: " + world.performance.narrowPhaseTime + "ms<br>";
    info += "Solving Time: " + world.performance.solvingTime + "ms<br>";
    info += "Updating Time: " + world.performance.updatingTime + "ms<br>";
    info += "Total Time: " + world.performance.totalTime + "ms<br>";
    info += fpstxt;

    this.postMessage({tell:"RUN", info: info, matrix:matrix, sleeps:sleeps  })


}

function fpsUpdate() {
    time = Date.now();
    if (time - 1000 > time_prev) {
        time_prev = time;
        fpstxt ="Fps: " + fps +"<br>";
        fps = 0;
    } 
    fps++;
}

function initClass(){
    with(joo.classLoader) {
        import_("com.elementdev.oimo.physics.OimoPhysics");
        complete(function(imports){with(imports){
            World = com.elementdev.oimo.physics.dynamics.World;
            RigidBody = com.elementdev.oimo.physics.dynamics.RigidBody;
            BroadPhase = com.elementdev.oimo.physics.collision.broadphase.BroadPhase;
            // Shape
            Shape = com.elementdev.oimo.physics.collision.shape.Shape;
            ShapeConfig = com.elementdev.oimo.physics.collision.shape.ShapeConfig;
            BoxShape = com.elementdev.oimo.physics.collision.shape.BoxShape;
            SphereShape = com.elementdev.oimo.physics.collision.shape.SphereShape;
            // Joint
            JointConfig = com.elementdev.oimo.physics.constraint.joint.JointConfig;
            HingeJoint = com.elementdev.oimo.physics.constraint.joint.HingeJoint;
            WheelJoint = com.elementdev.oimo.physics.constraint.joint.WheelJoint;
            DistanceJoint = com.elementdev.oimo.physics.constraint.joint.DistanceJoint;
            // Math
            Vec3 = com.elementdev.oimo.math.Vec3;
            Quat = com.elementdev.oimo.math.Quat;

            initWorld();
           
        }});
    }
}

function initWorld(){
    world = new World();

    //world.broadphase = BroadPhase.BROAD_PHASE_BRUTE_FORCE;
    //world.broadphase = BroadPhase.BROAD_PHASE_SWEEP_AND_PRUNE;
    //world.broadphase = BroadPhase.BROAD_PHASE_DYNAMIC_BOUNDING_VOLUME_TREE;
    
    world.numIterations = iterations;
    world.timeStep = dt;
    world.gravity = new Vec3(0, -10, 0);
    startOimoTest();
}

function clearWorld(){
    if(world != null) world.clear();
    bodys = [];
}

function startOimoTest(n, t){
    if(n == null) n=N;
    if(t == null) t=0;

    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.4;
    sc.restitution = 0.2;

    // ground
    var gbody = new RigidBody(0, -5, 0, 0, 0, 0, 0);
    var shape0 = new BoxShape(sc, 10, 10, 10);
    gbody.addShape(shape0);
    gbody.setupMass(0x2);
    world.addRigidBody(gbody);

    //wall
    var wbody = new RigidBody(0, 5, -2.5, 0, 0, 0, 0);
    var sh = new BoxShape(sc, 5, 10, 1);
    wbody.addShape(sh);
    wbody.setupMass(0x2);
    world.addRigidBody(wbody);

    wbody = new RigidBody(0, 5, 2.5, 0, 0, 0, 0);
    sh = new BoxShape(sc, 5, 10, 1);
    wbody.addShape(sh);
    wbody.setupMass(0x2);
    world.addRigidBody(wbody);

    wbody = new RigidBody(-2.5, 5, 0, 0, 0, 0, 0);
    sh = new BoxShape(sc, 1, 10, 5);
    wbody.addShape(sh);
    wbody.setupMass(0x2);
    world.addRigidBody(wbody);

    wbody = new RigidBody(2.5, 5, 0, 0, 0, 0, 0);
    sh = new BoxShape(sc, 1, 10, 5);
    wbody.addShape(sh);
    wbody.setupMass(0x2);
    world.addRigidBody(wbody);

    bodys = [];
    matrix = [];
    sleeps = [];
    types = [];
    positions = [];

    // add dynamique object
    var body, px, pz, type;
    for (var i=0; i!==n; ++i ){
        if(t==0)type = Math.floor(Math.random()*2)+1;
        else type = t;
        px = -1+Math.random()*2;
        pz = -1+Math.random()*2;
        if(type==1){ // sphere
            body = new RigidBody(px, 60+i, pz, 0, 0, 0, 0);
            shape = new SphereShape(sc, 0.25);
            body.addShape(shape);
            body.setupMass(0x1);
        } else { // box
            body = new RigidBody(px, 50+i, pz, 0, 0, 0, 0);
            shape = new BoxShape(sc, 0.5, 0.5, 0.5);
            body.addShape(shape);
            body.setupMass(0x1);
        }
        world.addRigidBody(body);
        bodys[i] = body;
        types[i] = type;
    }
    max = n;

   

   // this.postMessage({ matrix:matrix }, [matrix.buffer])
 this.postMessage({tell:"INIT", matrix:null, types:types })//, [matrix.buffer])
 //this.timer = setInterval( update , 1000/60);
   // this.postMessage("world initialised !!");
}

