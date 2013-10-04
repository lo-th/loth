package {
	import awayphysics.dynamics.constraintsolver.AWPGeneric6DofConstraint;
	import awayphysics.dynamics.constraintsolver.AWPPoint2PointConstraint;
	import awayphysics.dynamics.character.AWPKinematicCharacterController;
	import awayphysics.dynamics.constraintsolver.AWPConeTwistConstraint;
	import awayphysics.dynamics.constraintsolver.AWPTypedConstraint;
	import awayphysics.dynamics.constraintsolver.AWPHingeConstraint;
	import awayphysics.collision.shapes.AWPBvhTriangleMeshShape;
	import awayphysics.collision.dispatch.AWPCollisionObject;
	import awayphysics.collision.shapes.AWPStaticPlaneShape;
	import awayphysics.collision.shapes.AWPConvexHullShape;
	import awayphysics.collision.shapes.AWPCollisionShape;
	import awayphysics.dynamics.vehicle.AWPRaycastVehicle;
	import awayphysics.collision.dispatch.AWPGhostObject;
	import awayphysics.collision.shapes.AWPCylinderShape;
	import awayphysics.collision.shapes.AWPCompoundShape;
	import awayphysics.dynamics.vehicle.AWPVehicleTuning;
	import awayphysics.collision.shapes.AWPCapsuleShape;
	import awayphysics.collision.shapes.AWPSphereShape;
	import awayphysics.dynamics.vehicle.AWPWheelInfo;
	import awayphysics.collision.shapes.AWPBoxShape;
	import awayphysics.dynamics.AWPDynamicsWorld;
	import awayphysics.data.AWPCollisionFlags;
	import awayphysics.dynamics.AWPRigidBody;
	import awayphysics.extend.AWPTerrain;
	import awayphysics.events.AWPEvent;
	import awayphysics.debug.AWPDebugDraw;
	import flash.events.Event;
	import flash.text.TextField;
	import flash.text.TextFormat;
    
	import flash.events.KeyboardEvent;
	import flash.display.Sprite;
	import flash.system.Security;
	import flash.geom.Vector3D;
	import flash.external.ExternalInterface;
	import flash.utils.getTimer;
    import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	
	[SWF(width="150",height="40",backgroundColor="0x161616",frameRate="60")]
	
	public class phy extends Sprite {
		private const TimeStep:Number = 1.0 / 60;
		private const MaxSubSteps:uint = 10;
        //private const ToRad:Number = Math.PI / 180;
		
		public var world:AWPDynamicsWorld;
		private var txt:TextField;
		private var time:Number = 0;
		private var time_prev:Number = 0;
		private var fps:Number = 0;
		private var fpsTxt:String;
		private var infoTxt:String;
        private var bodyTxt:String;
        private var scale:Number = 100;
		private var num:Number = 10;
        private var cubeSize:Number = 10;
        private var bodysInfo:Vector.<Object> = new Vector.<Object>();//Array = [];
        //private var key:Object = { front: false, back: false, left: false, right: false, jump: false, crouch: false };
        
		public function phy() {
            super();
            addEventListener(Event.ADDED_TO_STAGE, init, false, 0, true);
        }
        
        private function init(e:Event = null):void {
			removeEventListener(Event.ADDED_TO_STAGE, init);
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			initTxt();
            txt.text = "hello";
            
			Security.allowDomain("*");
			if (ExternalInterface.available) {
				ExternalInterface.marshallExceptions = true;
				  // ExternalInterface.addCallback("onFlashChangeView", onChangeView);
				   //ExternalInterface.addCallback("onFlashaddRigid", addRigid);
				
				   var flashVars:Object = this.root.loaderInfo.parameters;
                   scale = flashVars["scale"];
                   num = flashVars["num"];
                   cubeSize =  flashVars["cubeSize"];
			}
			
			world = AWPDynamicsWorld.getInstance();
			world.initWithDbvtBroadphase();
			world.collisionCallbackOn = false;
			world.gravity = new Vector3D(0, -10, 0);
			world.scaling = scale;
            
            
            for (var i:uint; i < num; i++ ) {
               addRigid('cube', new Vector3D(cubeSize, cubeSize, cubeSize), new Vector3D( -500 + Math.random() * 1000, 500 + Math.random() * 500, -500 + Math.random() * 1000), null, new Vector3D(1, 0.8, 0));
               bodysInfo[i] = { };
               
            }
            bodysInfo.fixed = true;
            addRigid('plane');
			
			infoTxt = scale  +" Away Physics \n";
			bodyTxt = " body:" + world.rigidBodies.length;
			addEventListener(Event.ENTER_FRAME, update, false, 1000, true);
            //stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDown);
			//stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUp);
		
		}
		
		private function update(e:Event):void {
            
			world.step(TimeStep, MaxSubSteps, TimeStep);
            
            sendBodytoHtml();
            //if (ExternalInterface.available) ExternalInterface.call("getBodyFromFlash", bodysInfo);
            fpsUpdate();
			txt.text = infoTxt + fpsTxt + bodyTxt;
		}
		
		private function clean():void {
			world.cleanWorld();
		}
		
		private function fpsUpdate():void {
			time = getTimer();
			if (time - 1000 > time_prev) {
				time_prev = time;
				fpsTxt = "fps: " + fps;
				fps = 0;
			}
			fps++;
		}
        
        private function sendBodytoHtml():void {
            //var b:Object;
          //  bodysInfo = [];
            for (var i:uint; i < num; i++ ) {
                bodysInfo[i] = { 
                    pos: world.rigidBodies[i].worldTransform.position,//.position,
                    rot: world.rigidBodies[i].worldTransform.rotation//,//.rotation
                    //matrix: world.rigidBodies[i].worldTransform.transform
                };
            }
            if (ExternalInterface.available)
				ExternalInterface.call("getBodyFromFlash", bodysInfo);
		}
        
		/*private function sendKeytoHtml():void {
            if (ExternalInterface.available)
				ExternalInterface.call("getKeyFromFlash", key);
		}
        
        private function onKeyDown(event:KeyboardEvent):void {
			switch (event.keyCode) {
				case 38: case 87: case 90: key.front = true; break; // up, W, Z
				case 40: case 83: key.back = true; break; // down, S
				case 37: case 65: case 81: key.left = true; break; // left, A, Q
				case 39: case 68: key.right = true; break; // right, D
				case 17: case 67: key.crouch = false; break; // ctrl, c
				case 32: key.jump = false; break; // space
			}
            sendKeytoHtml();
		}
		
		private function onKeyUp(event:KeyboardEvent):void {
			switch (event.keyCode) {
				case 38: case 87: case 90: key.front = false; break; // up, W, Z
				case 40: case 83: key.back = false; break; // down, S
				case 37: case 65: case 81: key.left = false; break; // left, A, Q
				case 39: case 68: key.right = false; break; // right, D
				case 17: case 67: key.crouch = false; break; // ctrl, c
				case 32: key.jump = false; break; // space
			}
            sendKeytoHtml();
		}*/
        
		private function addRigid(type:String = "cube", size:Vector3D = null, pos:Vector3D = null, rot:Vector3D = null, setting:Vector3D = null, collisionType:int = 1):void {
			var body:AWPRigidBody;
			var shape:AWPCollisionShape;
			if (size == null)
				size = new Vector3D(100, 100, 100);
			if (setting == null)
				setting = new Vector3D(0, 0.5, 0);
			
			switch (type) {
				case 'sphere': 
					shape = new AWPSphereShape(size.x);
					break;
				case 'cube': 
					shape = new AWPBoxShape(size.x, size.y, size.z);
					break;
				case 'cylinder': 
					shape = new AWPCylinderShape(size.x, size.y);
				case 'plane': 
					shape = new AWPStaticPlaneShape(new Vector3D(0, 1, 0));
					break;
			}
			body = new AWPRigidBody(shape, null, setting.x);
			body.friction = setting.y;
			body.restitution = setting.z;
			if (pos != null)
				body.position = pos;
			if (rot != null)
				body.rotation = rot;
			//if (!isActif)
			body.activationState = collisionType;
			
			/* body.activationState = AWPCollisionObject.DISABLE_SIMULATION//5;
			   body.activationState = AWPCollisionObject.DISABLE_DEACTIVATION; //4
			   body.activationState = AWPCollisionObject.ISLAND_SLEEPING//2;
			   body.activationState = AWPCollisionObject.WANTS_DEACTIVATION//3;
			   body.activationState = AWPCollisionObject.ACTIVE_TAG//1;
			 */
			
			world.addRigidBody(body);
		}
		
		private function initTxt():void {
			txt = new TextField();
			txt.selectable = false;
			txt.mouseEnabled = false;
			txt.defaultTextFormat = new TextFormat("_sans", 10, 0xffff99);
			txt.x = 10;
			txt.y = 5;
			txt.width = stage.stageWidth - 20;
			txt.height = 40;
			this.addChild(txt);
		}
	}
}