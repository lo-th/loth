//importScripts('js/joo/net.jangaroo.jangaroo-runtime.classes.js');
//importScripts('js/joo/net.jangaroo.examples.hello-world.classes.js');
//importScripts('js/joo/runtime_min.js');
//importScripts('js/joo/oimo_min.js');
importScripts('js/oimo/runtime_min.js');
importScripts('js/oimo/oimo_min_dev.js');
var world;
var bodys;


this.onmessage = function (e) {
  //  var matrix = e.data.matrix;
    if(world != null){
        world.step();
       // this.postMessage("world run !! " + bodys[0].position.y);

        var max = bodys.length;
        var body, r, p, sleep, mtx;

        // Copy over the data to the buffers
        var matrix = e.data.matrix;

        for ( var i = 0; i < 1000 ; ++i ) {
            body = bodys[i];
            //if (body.type == 0x1) {
                r = body.rotation;
                p = body.position;
                // sleep = body.sleeping;
                // type = body.shapes.type;

                matrix[12*i + 0] = r.e00;
                matrix[12*i + 1] = r.e01;
                matrix[12*i + 2] = r.e02;
                matrix[12*i + 3] = Math.floor(p.x * 100);

                matrix[12*i + 4] = r.e10;
                matrix[12*i + 5] = r.e11;
                matrix[12*i + 6] = r.e12;
                matrix[12*i + 7] = Math.floor(p.y * 100);

                matrix[12*i + 8] = r.e20;
                matrix[12*i + 9] = r.e21;
                matrix[12*i + 10] = r.e22;
                matrix[12*i + 11] = Math.floor(p.z * 100);
           // }
        }
        this.postMessage({tell:"RUN", matrix:matrix })//, [matrix.buffer])
    } else{
        initClass();
    }


}

function initClass(){
    with(joo.classLoader) {
        import_("com.elementdev.oimo.physics.OimoPhysics");
        complete(function(imports){with(imports){
            World = com.elementdev.oimo.physics.dynamics.World;
            RigidBody = com.elementdev.oimo.physics.dynamics.RigidBody;
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
    world.numIterations = 8;
    world.timeStep = 1/60;
    world.gravity = new Vec3(0, -10, 0);
    startOimoTest();
}

function clearWorld(){
    if(world != null) world.clear();
    bodys = [];
}

function startOimoTest(n, t){
    if(n == null) n=1000;
    if(t == null) t=2;

    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.4;
    sc.restitution = 0.2;

    // ground
    var gbody = new RigidBody(0, -0.5, 0, 0, 0, 0, 0);
    var shape0 = new BoxShape(sc, 10, 1, 10);
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

    // add dynamique object
    var body, px, pz, type;
    for (var i=0; i!==n; ++i ){
        if(t==0)type = Math.floor(Math.random()*2)+1;
        else type = t;
        px = -1+Math.random()*2;
        pz = -1+Math.random()*2;
        if(type==1){ // sphere
            body = new RigidBody(px, 110+i, pz, 0, 0, 0, 0);
            shape = new SphereShape(sc, 0.25);
            body.addShape(shape);
            body.setupMass(0x1);
        } else { // box
            body = new RigidBody(px, 100+i, pz, 0, 0, 0, 0);
            shape = new BoxShape(sc, 0.5, 0.5, 0.5);
            body.addShape(shape);
            body.setupMass(0x1);
        }
        world.addRigidBody(body);
        bodys[i] = body;
    }

   

   // this.postMessage({ matrix:matrix }, [matrix.buffer])
 this.postMessage({tell:"INIT", matrix:null })//, [matrix.buffer])
   // this.postMessage("world initialised !!");
}

