

var World, RigidBody;
var Shape, ShapeConfig, BoxShape, SphereShape;
var JointConfig, HingeJoint, WheelJoint, DistanceJoint;
var Vec3, Quat;
var dt = 1/60;
var dt2 =  0;
var sendTime;
var timeEngine;
var timeObject;
var prevTime = 0;
var delay;
var bodys = [];

var world;

function initOimoEngine(option) {
	if(!option)option = {};

	with(joo.classLoader) {
	 // import_("net.jangaroo.example.HelloWorld");
       import_("com.elementdev.oimo.physics.OimoPhysics");
	  complete(function(imports){with(imports){

	  	World = com.elementdev.oimo.physics.dynamics.World;
	    RigidBody = com.elementdev.oimo.physics.dynamics.RigidBody;
	    // shape
	    Shape = com.elementdev.oimo.physics.collision.shape.Shape;
	    ShapeConfig = com.elementdev.oimo.physics.collision.shape.ShapeConfig;
	    BoxShape = com.elementdev.oimo.physics.collision.shape.BoxShape;
	    SphereShape = com.elementdev.oimo.physics.collision.shape.SphereShape;
	    // joint
	    JointConfig = com.elementdev.oimo.physics.constraint.joint.JointConfig;
	    HingeJoint = com.elementdev.oimo.physics.constraint.joint.HingeJoint;
	    WheelJoint = com.elementdev.oimo.physics.constraint.joint.WheelJoint;
	    DistanceJoint = com.elementdev.oimo.physics.constraint.joint.DistanceJoint;

	    Vec3 = com.elementdev.oimo.math.Vec3;
	    Quat = com.elementdev.oimo.math.Quat;

        //world = new World();

	    if(option.end != null) option.end();

	   // window.setInterval(updateWorld, 1000 / 60);
	  }});
	}
}
function clearOimoTest(){
	if(world!=null)world.clear();
	bodys = [];
}

function startOimoTest(n, t){
	if(world == null){
		world = new World();
	    world.numIterations = 8;//8
	    world.timeStep = dt;
	    world.gravity = new Vec3(0, -5, 0);
    }

    if(n == null) n=100;
    if(t == null) t=0;

    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.4;
    sc.restitution = 0.2;

    // ground
    var body = new RigidBody(0, -0.5, 0, 0, 0, 0, 0);
    var shape0 = new BoxShape(sc, 10, 1, 10);
    body.addShape(shape0);
    body.setupMass(0x2);
    world.addRigidBody(body);

    //wall
    var wbody = new RigidBody(0, 5, -2.5, 0, 0, 0, 0);
    var sh = new BoxShape(sc, 5, 10, 1);
    wbody.addShape(sh);
    wbody.setupMass(0x2);
    world.addRigidBody(wbody);

    wbody = new RigidBody(0, 5, 2.5, 0, 0, 0, 0);
    sh = new BoxShape(sc, 5, 10, 1);
    wbody.addShape(sh);
    wbody.setupMass(RigidBody.BODY_STATIC);
    world.addRigidBody(wbody);

    wbody = new RigidBody(-2.5, 5, 0, 0, 0, 0, 0);
    sh = new BoxShape(sc, 1, 10, 5);
    wbody.addShape(sh);
    wbody.setupMass(RigidBody.BODY_STATIC);
    world.addRigidBody(wbody);

    wbody = new RigidBody(2.5, 5, 0, 0, 0, 0, 0);
    sh = new BoxShape(sc, 1, 10, 5);
    wbody.addShape(sh);
    wbody.setupMass(RigidBody.BODY_STATIC);
    world.addRigidBody(wbody);


    // cubes
    var r;
    var px, pz;
    var type;

    for (var i=0; i<n; ++i ){
    	if(t==0)type = Math.floor(Math.random()*2)+1;
    	else type = t;
    	px= -1+Math.random()*2;
    	pz= -1+Math.random()*2;

    	if(type==1){ // box
    		 r = new RigidBody(px, 110+i, pz, 0, 0, 0, 0);
		    shape = new SphereShape(sc, 0.25);
		    r.addShape(shape);
		    r.setupMass(RigidBody.BODY_DYNAMIC);
		    world.addRigidBody(r);
		}else{ // sphere
			r = new RigidBody(px, 100+i, pz, 0, 0, 0, 0);
		    shape = new BoxShape(sc, 0.5, 0.5, 0.5);
		    r.addShape(shape);
		    r.setupMass(RigidBody.BODY_DYNAMIC);
		    world.addRigidBody(r);
        }
	    bodys[i] = r;
    }

    updateWorld();
}


function updateWorld(){
    sendTime = new Date();//Date.now();
    //dt2 = (sendTime - prevTime) * 0.001;
    //world.timeStep=dt2;
	world.step();
    timeEngine = new Date();//Date.now();//-sendTime;
	transBody2();
    timeObject = new Date();//Date.now();//-timeEngine;
    //delay = (Date.now()-sendTime)//*0.001;
    //delay = dt * 1000 - (Date.now()-sendTime);
    delay = dt * 1000 + (Date.now()-sendTime);
    //if(delay < 0)  delay = 0;
    //world.timeStep=delay;
    //prevTime =  Date.now();
    //setTimeout(updateWorld, delay);
    setTimeout(updateWorld, (timeObject-timeEngine));
    document.getElementById("debug").innerHTML = "engine: " + (timeEngine-sendTime)+"ms<br>"+" object: "+ (timeObject-timeEngine)+"ms";
}


