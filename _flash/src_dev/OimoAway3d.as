package loth.physics {
	import away3d.entities.Mesh;
	import away3d.containers.Scene3D;
	import away3d.materials.TextureMaterial;
	import away3d.primitives.CubeGeometry;
	import away3d.primitives.SphereGeometry;
	
	import com.element.oimo.physics.constraint.joint.DistanceJoint;
	import com.element.oimo.physics.constraint.joint.JointConfig;
	import com.element.oimo.physics.constraint.joint.BallJoint;
	import com.element.oimo.physics.constraint.joint.HingeJoint;
	import com.element.oimo.physics.constraint.joint.Joint;
	import com.element.oimo.physics.collision.shape.ShapeConfig;
	import com.element.oimo.physics.collision.shape.SphereShape;
	import com.element.oimo.physics.collision.shape.BoxShape;
	import com.element.oimo.physics.collision.shape.Shape;
	import com.element.oimo.physics.dynamics.RigidBody;
	import com.element.oimo.physics.dynamics.World;
	import com.element.oimo.math.Mat33;
	import com.element.oimo.math.Vec3;
	
	import flash.utils.getTimer;
	import flash.display.Sprite;
	import flash.geom.Vector3D;
	import flash.geom.Matrix3D;
	import flash.events.Event;
	
	/**
	 * OimoPhysics alpha release 8
	 * @author Saharan _ http://el-ement.com
	 * @link https://github.com/saharan/OimoPhysics
	 * ...
	 * Compact engine for away3d by Loth
	 *
	 * OimoPhysics use international system units
	 * 0.1 to 10 meters max for dynamique body
	 * in away3d mutliply by scale 100
	 */
	public class OimoAway3d {
		
		private var _scale:Number = 100;
		private var _invScale:Number = 0.01;
		private var TimeStep:Number = 0.01667; //1 / 60;
		private var Iteration:uint = 4; //8
		
		public var _maxDown:Number = 0;
		public var _resetPosition:Vector3D = new Vector3D(0, 0, 0);
		//public var world:World;
		
		public const world:World = new World();
		public const rigids:Vector.<RigidBody> = new Vector.<RigidBody>();
		public const joints:Vector.<Joint> = new Vector.<Joint>();
		public const meshs:Vector.<Mesh> = new Vector.<Mesh>();
		
		private var _demoName:String;
		private var _scene:Scene3D;
		private var _fps:Number;
		
		private var _isNoScale:Boolean = false;
		private var _tmpRigid:RigidBody;
		private var _tmpMesh:Mesh;
		private var _prevTime:Number = 0, _itime:Number, _dt:Number;
		private var _isDeltaTime:Boolean = false;
		private var _isAutoUpdate:Boolean = false;
		
		public function OimoAway3d(Scene:Scene3D) {
			_scene = Scene;
			world.timeStep = TimeStep;
		}
		
		public function maxDown(u:Number):void {
			_maxDown = u * _invScale;
		}
		
		public function resetPosition(v:Vector3D):void {
			_resetPosition = v;
			_resetPosition.scaleBy(_invScale);
		}
		
		public function worldScale(Scale:Number, InvScale:Number):void {
			_scale = Scale;
			_invScale = InvScale;
		}
		
		public function gravity(x:Number = 0, y:Number = 0, z:Number = 0):void {
			world.gravity = new Vec3(x, y, z);
		}
		
		public function update(e:Event = null):void {
			var i:uint;
			var length:uint = meshs.length;
			var r:Mat33, p:Vec3, m:Matrix3D;
			for (i = 0; i < length; ++i) {
               if(rigids[i].type == 0x1){
				r = rigids[i].rotation;
				p = rigids[i].position;
				m = new Matrix3D(Vector.<Number>([r.e00, r.e10, r.e20, 0, r.e01, r.e11, r.e21, 0, r.e02, r.e12, r.e22, 0, p.x * _scale, p.y * _scale, p.z * _scale, 1]));
				meshs[i].transform = m;
			}}
			world.step();
			
            
			var body:RigidBody = world.rigidBodies;
			while (body != null) {
				if (body.position.y < _maxDown) {
					body.position.init(_resetPosition.x, _resetPosition.y, _resetPosition.z);
				}
				body = body.next;
			}
		}
        
		private function place(rigid:RigidBody):Matrix3D {
            var r:Mat33, p:Vec3, m:Matrix3D;
				r = rigid.rotation;
				p = rigid.position;
				m = new Matrix3D(Vector.<Number>([r.e00, r.e10, r.e20, 0, r.e01, r.e11, r.e21, 0, r.e02, r.e12, r.e22, 0, p.x * _scale, p.y * _scale, p.z * _scale, 1]));
				return m;
        }
        
		public function clean():void {
			var i:uint;
			var j:uint;
			// 1 - remove all joints
			for (i = 0; i < joints.length; ++i) {
				world.removeJoint(joints[i]);
			}
			// 2 - remove all rigid
			for (i = 0; i < rigids.length; ++i) {
				// 3 - remove all shape from rigid body
				for (j = 0; j < rigids[i].shapes.length; ++j) {
					world.removeShape(rigids[i].shapes[j]);
				}
				world.removeRigidBody(rigids[i]);
			}
			// 4 - remove all mesh to simulation
			for (i = 0; i < meshs.length; ++i) {
				// 5 - remove all childrens of mesh
				for (j = 0; j < meshs[i].numChildren; ++j) {
					meshs[i].removeChild(meshs[i].getChildAt(j));
				}
				_scene.removeChild(meshs[i]);
				meshs[i].dispose();
			}
		
			// 6 - reset the physics world
			//initWorld();
		}
		
		public function addCube(mesh:Mesh = null, material:TextureMaterial = null, w:int = 10, h:int = 10, d:int = 10, pos:Vector3D = null, rot:Vector3D = null, isMove:Boolean = true, Density:Number = 1, Friction:Number = 0.5, Restitution:Number = 0.5, n:int = -1):void {
			var shape:Shape;
			var config:ShapeConfig = new ShapeConfig();
			if (mesh == null)
				mesh = new Mesh(new CubeGeometry(w, h, d), material);
			if (pos == null)
				pos = new Vector3D();
			config.position.init(pos.x * _invScale, pos.y * _invScale, pos.z * _invScale);
			config.density = Density;
			config.friction = Friction;
			config.restitution = Restitution;
			shape = new BoxShape(w * _invScale, h * _invScale, d * _invScale, config);
			if (n == -1)
				addRigid(mesh, shape, rot, isMove);
			else if (n == -2) {
				addRigid(mesh, shape, rot, isMove, true);
			} else
				addToRigid(n, shape, mesh);
		}
		
		public function addSphere(mesh:Mesh = null, material:TextureMaterial = null, r:int = 0, pos:Vector3D = null, rot:Vector3D = null, isMove:Boolean = true, Density:Number = 1, Friction:Number = 0.5, Restitution:Number = 0.5, n:int = -1):void {
			var shape:Shape;
			var config:ShapeConfig = new ShapeConfig();
			if (mesh == null)
				mesh = new Mesh(new SphereGeometry(r), material);
			if (pos == null)
				pos = new Vector3D();
			config.position.init(pos.x * _invScale, pos.y * _invScale, pos.z * _invScale);
			config.density = Density;
			config.friction = Friction;
			config.restitution = Restitution;
			shape = new SphereShape(r * _invScale, config);
			
			if (n == -1)
				addRigid(mesh, shape, rot, isMove);
			else
				addToRigid(n, shape, mesh);
		}
		
		private function addRigid(mesh:Mesh = null, shape:Shape = null, rotation:Vector3D = null, isMove:Boolean = true, isComposed:Boolean = false):void {
			var rigid:RigidBody;
			var rot:Vector3D = new Vector3D();
			var angle:Number = 0;
			if (rotation != null) {
				if (rotation.x != 0) {
					rot = new Vector3D(1, 0, 0);
					angle = rotation.x;
				} else if (rotation.y != 0) {
					rot = new Vector3D(0, 1, 0);
					angle = rotation.y;
				} else if (rotation.z != 0) {
					rot = new Vector3D(0, 0, 1);
					angle = rotation.z;
				}
			}
			rigid = new RigidBody(angle, rot.x, rot.y, rot.z);
			rigid.addShape(shape);
			
			if (isMove) {
				rigid.setupMass(RigidBody.BODY_DYNAMIC);
				
			} else {
				rigid.setupMass(RigidBody.BODY_STATIC);
				if (mesh != null) mesh.transform = place(rigid);
			}
			// add to listing
			
			//if (!isComposed) {
			rigids.push(rigid);
			meshs.push(mesh);
			world.addRigidBody(rigid);
			//}
			/*else {
			   _tmpRigid = rigid;
			   _tmpMesh = mesh;
			 }*/
			
			if (mesh != null)
				_scene.addChild(mesh);
		}
		
		private function addToRigid(n:int, shape:Shape, mesh:Mesh = null):void {
			//if (rigids[n]) {
			_tmpRigid.addShape(shape);
			if (mesh != null)
				_tmpMesh.addChild(mesh)
			//meshs[n].addChild(mesh);
			//}
		}
		
		public function addTmpRigid():void {
			//if (rigids[n]) {
			world.addRigidBody(_tmpRigid);
			//}
		}
		
		public function addBallJoint(rigid1:RigidBody, rigid2:RigidBody, collision:Boolean = true, v1:Vector3D = null, v2:Vector3D = null):void {
			var config:JointConfig = new JointConfig();
			if (v1 != null)
				config.localRelativeAnchorPosition1 = new Vec3(v1.x * _invScale, v1.y * _invScale, v1.z * _invScale);
			if (v2 != null)
				config.localRelativeAnchorPosition2 = new Vec3(v2.x * _invScale, v2.y * _invScale, v2.z * _invScale);
			//config.allowCollide = collision;
			var j:BallJoint = new BallJoint(rigid1, rigid2, config);
			
			joints.push(j);
			world.addJoint(j);
		}
		
		/* public function addDistanceJoint(rigid1:RigidBody, rigid2:RigidBody, distance:Number, collision:Boolean = true, v1:Vector3D = null, v2:Vector3D = null):void {
		   var config:JointConfig = new JointConfig();
		   if (v1 != null)
		   config.localRelativeAnchorPosition1 = new Vec3(v1.x * _invScale, v1.y * _invScale, v1.z * _invScale);
		   if (v2 != null)
		   config.localRelativeAnchorPosition2 = new Vec3(v2.x * _invScale, v2.y * _invScale, v2.z * _invScale);
		   //config.allowCollide = collision;
		   var j:DistanceJoint = new DistanceJoint(rigid1, rigid2, distance * _invScale, config);
		
		   joints.push(j);
		   world.addJoint(j);
		 }*/
		
		public function addHingeJoint(rigid1:RigidBody, rigid2:RigidBody, collision:Boolean = true, axe1:Vector3D = null, axe2:Vector3D = null, v1:Vector3D = null, v2:Vector3D = null):void {
			var config:JointConfig = new JointConfig();
			if (axe1 != null)
				config.localAxis1.init(axe1.x, axe1.y, axe1.z);
			else
				config.localAxis1.init(0, 1, 0);
			if (axe2 != null)
				config.localAxis2.init(axe2.x, axe2.y, axe2.z);
			else
				config.localAxis2.init(0, 1, 0);
			if (v1 != null)
				config.localRelativeAnchorPosition1 = new Vec3(v1.x * _invScale, v1.y * _invScale, v1.z * _invScale);
			if (v2 != null)
				config.localRelativeAnchorPosition2 = new Vec3(v2.x * _invScale, v2.y * _invScale, v2.z * _invScale);
			//config.allowCollide = collision;
			var j:HingeJoint = new HingeJoint(rigid1, rigid2, config);
			
			joints.push(j);
			world.addJoint(j);
		}
		
		public function set demoName(name:String):void {
			_demoName = name;
		}
		
		public function info():String {
			_fps += (1000 / world.performance.totalTime - _fps) * 0.5;
			if (_fps > 1000 || _fps != _fps) {
				_fps = 1000;
			}
			return "Rigid Body Count: " + world.numRigidBodies + "\n" + "Contact Count: " + world.numContacts + "\n" + "Pair Check Count: " + world.broadPhase.numPairChecks + "\n" + "Contact Point Count: " + world.numContactPoints + "\n" + "Island Count: " + world.numIslands + "\n\n" + "Broad Phase Time: " + world.performance.broadPhaseTime + "ms\n" + "Narrow Phase Time: " + world.performance.narrowPhaseTime + "ms\n" + "Solving Time: " + world.performance.solvingTime + "ms\n" + "Updating Time: " + world.performance.updatingTime + "ms\n" + "Total Time: " + world.performance.totalTime + "ms\n" + "Physics FPS: " + _fps.toFixed(2) + "\n";
		}
	}
}