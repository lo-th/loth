
//importScripts('js/oimo_rev/net.jangaroo.examples.hello-world.classes.js');
importScripts('js/oimo/runtime_min.js');
importScripts('js/oimo/oimo_min_rev.js');
var N = 100;
var dt = 1/60;
var world;
var bodys;
var matrix;
var info = "info test";
var fps=0, time, time_prev=0, fpstxt="";

var SUPPORT_TRANSFERABLE = false;
self.postMessage = self.webkitPostMessage || self.postMessage;

/*var ab = new ArrayBuffer( 1 );
self.postMessage( ab, [ab] );
SUPPORT_TRANSFERABLE = ( ab.byteLength === 0 );
*/


self.onmessage = function (e) {
    if(e.data.N)N = e.data.N;
    if(e.data.dt)dt = e.data.dt;
   // matrix = e.data.matrix;
    matrix = e.data.matrix;
    if(world != null){
        world.step();
       // this.postMessage("world run !! " + bodys[0].position.y);

        var max = bodys.length;
        var body;
        var r, p, sleep, t;
        //var i=0;

        // Copy over the data to the buffers
       // var matrix = e.data.matrix;

        for ( var i = 0; i !== max ; ++i ) {
       // var body = world.rigidBodies;
        //while (body != null) {

            body = bodys[i];
            //if (body.type == 0x0) {
                r = body.rotation;
                p = body.position;
                if(body.sleeping) sleep = 1;
                else sleep = 0;
                if(body.shapes[0].type) 
                    t = body.shapes[0].type;
               // else t = 0;

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
                matrix[14*i + 13] = t;//stypes[i];
            //}
            //body = body.next;
            //i++;
        }
        info = "<br>";
        info += "Rigidbody: "+world.numRigidBodies+"<br>";
        info += "Shape: "+world.numShapes +"<br>";
        info += "Contact: "+world.numContacts+"<br>";
        info += "Island: " + world.numIslands +"<br><br>";

        info += fpstxt;
       // this.postMessage({tell:"working", matrix:matrix });
        //self.postMessage({tell:"RUN", matrix:matrix }, [matrix.buffer]);
        //self.postMessage({tell:"RUN", Matrix:matrix }, [matrix]);
        if(SUPPORT_TRANSFERABLE)
            self.postMessage({tell:"T-RUN", info:info, matrix:matrix }, [matrix.buffer]);
        else 
            self.postMessage({tell:"RUN", info:info, matrix:matrix });

    } else{
        initClass();
    }

    fpsUpdate();


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
        import_("com.element.oimo.physics.OimoPhysics");
        complete(function(imports){with(imports){
            World = com.element.oimo.physics.dynamics.World;
            RigidBody = com.element.oimo.physics.dynamics.RigidBody;
            // Shape
            Shape = com.element.oimo.physics.collision.shape.Shape;
            ShapeConfig = com.element.oimo.physics.collision.shape.ShapeConfig;
            BoxShape = com.element.oimo.physics.collision.shape.BoxShape;
            SphereShape = com.element.oimo.physics.collision.shape.SphereShape;
            CylinderShape = com.element.oimo.physics.collision.shape.CylinderShape;
            // Joint
            Joint = com.element.oimo.physics.constraint.joint.Joint;
            JointConfig = com.element.oimo.physics.constraint.joint.JointConfig;
            HingeJoint = com.element.oimo.physics.constraint.joint.HingeJoint;
            Hinge2Joint = com.element.oimo.physics.constraint.joint.Hinge2Joint;
            BallJoint = com.element.oimo.physics.constraint.joint.BallJoint;
            DistanceJoint = com.element.oimo.physics.constraint.joint.DistanceJoint;
            // Math
            Vec3 = com.element.oimo.math.Vec3;
            Quat = com.element.oimo.math.Quat;
            Mat33 = com.element.oimo.math.Mat33;
            Mat44 = com.element.oimo.math.Mat44;

            initWorld();
           
        }});
    }
}

function initWorld(){
    world = new World();
    world.numIterations = 8;
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
    sc.density = 10;
    sc.friction = 0.5;
    sc.restitution = 0.5;

    // ground
    var gbody = new RigidBody(0, 0, 0, 0);
    sc.position.init(0, -5, 0);
    //sc.rotation.init();
    var shape0 = new BoxShape( 10, 10, 10, sc);
    gbody.addShape(shape0);
    gbody.setupMass(0x1);
    world.addRigidBody(gbody);

    //wall
    var wbody = new RigidBody( 0, 0, 0, 0);
    sc.position.init(0, 5, -2.5);
    //sc.rotation.init();
    var sh = new BoxShape(5, 10, 1, sc);
    wbody.addShape(sh);
    wbody.setupMass(0x1);
    world.addRigidBody(wbody);

    wbody = new RigidBody( 0, 0, 0, 0);
    sc.position.init(0, 5, 2.5);
    //sc.rotation.init();
    sh = new BoxShape( 5, 10, 1, sc);
    wbody.addShape(sh);
    wbody.setupMass(0x1);
    world.addRigidBody(wbody);

    wbody = new RigidBody( 0, 0, 0, 0);
    sc.position.init(-2.5, 5, 0);
    //sc.rotation.init();
    sh = new BoxShape( 1, 10, 5, sc);
    wbody.addShape(sh);
    wbody.setupMass(0x1);
    world.addRigidBody(wbody);

    wbody = new RigidBody( 0, 0, 0, 0);
    sc.position.init(2.5, 5, 0);
    //sc.rotation.init();
    sh = new BoxShape( 1, 10, 5, sc);
    wbody.addShape(sh);
    wbody.setupMass(0x1);
    world.addRigidBody(wbody);

    sc.density = 1;

    bodys = [];
   // stypes = [];

    // add dynamique object
    var body, px, pz, type;
    for (var i=0; i!==n; ++i ){
        if(t==0)type = Math.floor(Math.random()*3)+1;
        else type = t;
        px = -1+Math.random()*2;
        pz = -1+Math.random()*2;
        if(type==1){ // sphere
            body = new RigidBody( 0, 0, 0, 0);
            sc.position.init(px, 110+i, pz);
            sc.rotation.init();
            shape = new SphereShape( 0.25, sc);
            body.addShape(shape);
            body.setupMass(0x0);
        } else if(type==3){ // cylinder
            body = new RigidBody( 0, 0, 0, 0);
            sc.position.init(px, 100+i, pz);
            sc.rotation.init();
            shape = new CylinderShape( 0.25, 0.5, sc);
            body.addShape(shape);
            body.setupMass(0x0);
        } else if(type==2) { // box
            body = new RigidBody( 0, 0, 0, 0);
            sc.position.init(px, 100+i, pz);
            sc.rotation.init();
            shape = new BoxShape( 0.5, 0.5, 0.5, sc);
            body.addShape(shape);
            body.setupMass(0x0);
        }
        world.addRigidBody(body);
        bodys[i] = body;
        //stypes[i] = type;
    }

    if(SUPPORT_TRANSFERABLE)
        self.postMessage({tell:"T-INIT", matrix:matrix }, [matrix.buffer]);
    else 
        self.postMessage({tell:"INIT", matrix:matrix });

    //self.postMessage({tell:"INIT", matrix:matrix }, [matrix.buffer]);
    //var objData = ;
    //self.postMessage({tell:"INIT", matrix:matrix }, [matrix.buffer]);
  //  self.postMessage({tell:"INIT", Matrix:matrix }, [matrix]);
   // this.postMessage({ matrix:matrix }, [matrix.buffer])
 //this.postMessage({tell:"world Init", matrix:null })//, [matrix.buffer])
   // this.postMessage("world initialised !!");
}

