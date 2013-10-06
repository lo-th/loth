package {
	import away3d.animators.AnimationSetBase;
	import away3d.animators.data.Skeleton;
	import away3d.animators.SkeletonAnimationSet;
	import away3d.animators.SkeletonAnimator;
	import away3d.cameras.Camera3D;
	import away3d.cameras.lenses.PerspectiveLens;
	import away3d.containers.Scene3D;
	import away3d.containers.View3D;
	import away3d.entities.Mesh;
	import away3d.events.AnimatorEvent;
	import away3d.lights.DirectionalLight;
	import away3d.lights.PointLight;
	import away3d.lights.shadowmaps.DirectionalShadowMapper;
	import away3d.materials.lightpickers.StaticLightPicker;
	import away3d.materials.methods.FilteredShadowMapMethod;
	import away3d.materials.methods.FogMethod;
	import away3d.events.AnimationStateEvent;
	import away3d.materials.TextureMaterial;
	import away3d.primitives.PlaneGeometry;
	import away3d.primitives.SphereGeometry;
	import away3d.textures.BitmapTexture;
	import com.greensock.TweenLite;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import flash.geom.Vector3D;
	import flash.net.URLLoader;
	import flash.net.URLLoaderDataFormat;
	import flash.net.URLRequest;
	import flash.system.Security;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.utils.ByteArray;
    import flash.utils.getTimer;
	import sunag.events.SEAEvent;
	import sunag.sea3d.config.DefaultConfig;
	import sunag.sea3d.SEA3D;
	import com.Stats;
	
	[SWF(width="400",height="400",backgroundColor="0x292628",frameRate="60")]
	
	public class flashView extends Sprite {
		
		private var view:View3D;
		private var camera:Camera3D;
		private var scene:Scene3D;
		private var lightPicker:StaticLightPicker;
		
		private var softShadowMethod:FilteredShadowMapMethod;
		private var fogMethod:FogMethod;
		
		private var cameraPosition:Object = {horizontal: 0, vertical: 0, distance: 300, automove: false};
		private var mouse:Object = {x: 0, y: 0, down: false, ox: 0, oy: 0, h: 0, v: 0};
		private var center:Vector3D = new Vector3D(0, 150, 0);
		
		private var debug:TextField;
		private var stats:Stats;
		private var key:Object = { front: false, back: false, left: false, right: false, jump: false, crouch: false };
        private var controls:Object = { rotation: 0, speed: 0, vx: 0, vz: 0, maxSpeed: 275, acceleration: 600, angularSpeed: 2.5};
        private var currentPlayer:uint = 1;
		private var meshs:Array = [];
		private var materials:Array = [];
		private const animators:Vector.<SkeletonAnimator> = new Vector.<SkeletonAnimator>(2, true);
		private const players:Vector.<Mesh> = new Vector.<Mesh>(2, true);
		private var currentPlay:String;
		private var character:Number = 0;
        
        private var delta:Number = 0;
        private var time:Number = 0;
        private var oldTime:Number = 0;
		
		public function flashView() {
			addEventListener(Event.ADDED_TO_STAGE, init, false, 0, true);
		}
		
		//-----------------------------------------------------
		//  INIT VIEW
		//-----------------------------------------------------
		
		private function init(e:Event = null):void {
			removeEventListener(Event.ADDED_TO_STAGE, init);
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			
			camera = new Camera3D();
			camera.lens = new PerspectiveLens(70);
			//camera.lens.near = 1;
			camera.lens.far = 4000;
			scene = new Scene3D();
			view = new View3D(scene);
			view.backgroundColor = 0x161616;
			view.camera = camera;
			view.antiAlias = 8;
			view.width = stage.stageWidth;
			view.height = stage.stageHeight;
			addChild(view);
			
			initLights();
			initObject();
			initSea3DMesh();
			
			stage.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
			stage.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			stage.addEventListener(MouseEvent.MOUSE_UP, onMouseUp);
			stage.addEventListener(MouseEvent.MOUSE_OUT, onMouseUp);
			
			stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDown);
			stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUp);
			
			stage.addEventListener(Event.RESIZE, onResize);
			//stage.addEventListener(Event.ENTER_FRAME, onEnterFrame);
			
			onChangeView(45, 60, 1000);
			
			initDebug();
			
			Security.allowDomain("*");
			if (ExternalInterface.available) {
				ExternalInterface.marshallExceptions = true;
				ExternalInterface.addCallback("onFlashChangeView", onChangeView);
                ExternalInterface.addCallback("onFlashControlPlayer", controlPlayer);
				
				var flashVars:Object = this.root.loaderInfo.parameters;
				character = flashVars["character"];
			}
		}
        
        private function controlPlayer(n:uint):void {
            currentPlayer = n;
        }
		
		//-----------------------------------------------------
		//  LIGHT
		//-----------------------------------------------------
		
		private function initLights():void {
			var sunLight:DirectionalLight = new DirectionalLight();
			sunLight.castsShadows = true;
			sunLight.color = 0xffffff;
			sunLight.ambientColor = 0x505050;
			sunLight.ambient = 0.5;
			sunLight.diffuse = 1.2;
			sunLight.specular = 1;
			scene.addChild(sunLight);
			
			sunLight.position = Orbit(center, 35, 45, 1000);
			sunLight.lookAt(center);
			
			var pointLight:PointLight = new PointLight();
			pointLight.position = new Vector3D(0, 50, -400);
			pointLight.color = 0x60ff60;
			pointLight.diffuse = 0.5;
			pointLight.specular = 1;
			pointLight.ambient = 0;
			pointLight.radius = 2000;
			//pointLight.fallOff = 400;
			scene.addChild(pointLight);
			
			var pointLight2:PointLight = new PointLight();
			pointLight2.position = new Vector3D(0, 50, 400);
			pointLight2.color = 0xff6060;
			pointLight2.diffuse = 0.5;
			pointLight2.specular = 1;
			pointLight2.ambient = 0;
			pointLight2.radius = 2000;
			//pointLight.fallOff = 400;
			scene.addChild(pointLight2);
			
			lightPicker = new StaticLightPicker([sunLight, pointLight, pointLight2]);
			softShadowMethod = new FilteredShadowMapMethod(sunLight);
			softShadowMethod.alpha = 0.7;
			
			fogMethod = new FogMethod(0, 2000, 0x161616);
		}
		
		//-----------------------------------------------------
		//  OBJECT
		//-----------------------------------------------------
		
		private function initObject():void {
			var mesh:Mesh;
			var planeMat:TextureMaterial = new TextureMaterial(new BitmapTexture(new BitmapData(128, 128, false, 0x303030)));
			// var planeMat:ColorMaterial = new ColorMaterial(0xFFFFFF, 1);
			planeMat.lightPicker = lightPicker;
			planeMat.shadowMethod = softShadowMethod;
			planeMat.addMethod(fogMethod);
			var geometry0:PlaneGeometry = new PlaneGeometry(10000, 10000, 4, 4, false);
			var plane:Mesh = new Mesh(geometry0, planeMat);
			plane.rotationX = 90;
			plane.castsShadows = false;
			scene.addChild(plane);
			
			var sphereMat:TextureMaterial = new TextureMaterial(new BitmapTexture(new BitmapData(128, 128, false, 0xff0000)));
			var sphereMat2:TextureMaterial = new TextureMaterial(new BitmapTexture(new BitmapData(128, 128, false, 0x00ff00)));
			sphereMat.shadowMethod = softShadowMethod;
			sphereMat2.shadowMethod = softShadowMethod;
			sphereMat.lightPicker = lightPicker;
			sphereMat2.lightPicker = lightPicker;
			sphereMat.addMethod(fogMethod);
			sphereMat2.addMethod(fogMethod);
			var sphereA:Mesh = new Mesh(new SphereGeometry(50, 30, 30), sphereMat);
			var sphereB:Mesh = new Mesh(new SphereGeometry(50, 30, 30), sphereMat2);
			sphereA.castsShadows = true;
			sphereB.castsShadows = true;
			scene.addChild(sphereA);
			scene.addChild(sphereB);
			sphereA.z = 400;
			sphereB.z = -400;
			sphereA.y = sphereB.y = 50;
		}
		
		//-----------------------------------------------------
		//  SEA3D IMPORT
		//-----------------------------------------------------
		
		private function initSea3DMesh():void {
			var loader:URLLoader = new URLLoader();
			loader.dataFormat = URLLoaderDataFormat.BINARY;
			loader.addEventListener(Event.COMPLETE, seaHandler);
			loader.load(new URLRequest("assets/model.sea"));
		}
		
		private function seaHandler(e:Event):void {
			var byte:ByteArray = e.target.data as ByteArray;
			var config:DefaultConfig = new DefaultConfig();
			//config.forceCPU = true;
			var sea3d:SEA3D = new SEA3D(config);
			sea3d.addEventListener(SEAEvent.COMPLETE, addSea3DMesh);
			sea3d.loadBytes(byte);
		}
		
		private function addSea3DMesh(e:SEAEvent):void {
			var cubeMat0:TextureMaterial = new TextureMaterial(new BitmapTexture(new BitmapData(128, 128, false, 0x808080)));
			cubeMat0.lightPicker = lightPicker;
			cubeMat0.shadowMethod = softShadowMethod;
			cubeMat0.addMethod(fogMethod);
			var sea3d:SEA3D = e.target as SEA3D;
			for (var i:int = 0; i < sea3d.meshes.length; i++) {
				meshs[i] = sea3d.meshes[i];
				//if (meshs[i].name == "weapon0" || meshs[i].name == "weapon1" || meshs[i].name == "weapon2" || meshs[i].name == "weapon3")
				if (meshs[i].name == ("weapon" + character).toString())
					meshs[i].material = cubeMat0;
			}
			
			var cubeMat:TextureMaterial = new TextureMaterial(new BitmapTexture(new BitmapData(128, 128, false, 0x808080)));
			cubeMat.shadowMethod = softShadowMethod;
			cubeMat.addMethod(fogMethod);
			cubeMat.lightPicker = lightPicker;
			players[0] = meshs[27 + 6];
			players[0].scale(10);
			players[0].material = cubeMat;
			players[0].rotationY = 180;
			players[0].position = new Vector3D(100, 45, -100);
			animators[0] = players[0].animator as SkeletonAnimator;
			animators[0].updatePosition = false;
			animators[0].play("idle");
			animators[0].playbackSpeed = 0.5;
			scene.addChild(players[0]);
			
			var cubeMat2:TextureMaterial = new TextureMaterial(new BitmapTexture(new BitmapData(128, 128, false, 0x808080)));
			cubeMat2.shadowMethod = softShadowMethod;
			cubeMat2.addMethod(fogMethod);
			cubeMat2.lightPicker = lightPicker;
			players[1] = meshs[27 + character];
			players[1].scale(10);
			players[1].material = cubeMat2;
			players[1].rotationY = 180;
			players[1].position = new Vector3D(-100, 220, 0);
			scene.addChild(players[1]);
			animators[1] = players[1].animator as SkeletonAnimator;
			//animators[1] = new SkeletonAnimator(sea3d.getSkeletonAnimationSet(players[1].name) as SkeletonAnimationSet, sea3d.getSkeleton(players[1].name) as Skeleton, true);
			animators[1].play("idle");
			animators[1].playbackSpeed = 0.5;
			
			this.addEventListener(Event.ENTER_FRAME, testSqueleton);
			currentPlay = "idle";
		}
		
		private function testSqueleton(e:Event):void {
			if (animators[1].globalPose.numJointPoses == 14) {
				scene.addChild(players[1]);
				this.removeEventListener(Event.ENTER_FRAME, testSqueleton);
				startRender();
			}
		
		}
		
		//-----------------------------------------------------
		//  EVENT
		//-----------------------------------------------------
		
		private function startRender():void {
			stage.addEventListener(Event.ENTER_FRAME, onEnterFrame);
		}
		
		private function onEnterFrame(e:Event):void {
            time = getTimer();
            delta = 0.001 * (time-oldTime);
            updatePlayerMove();
			view.render();
            oldTime = time;
		}
		
		private function onResize(e:Event = null):void {
			view.width = stage.stageWidth;
			view.height = stage.stageHeight;
			if (debug) {
				debug.y = stage.stageHeight - 20;
				debug.width = stage.stageWidth - 20
				stats.y = stage.stageHeight - 27;
				stats.x = stage.stageWidth - 100;
			}
		}
		
		//-----------------------------------------------------
        //  PLAYER MOVE
        //-----------------------------------------------------

        private function updatePlayerMove():void {
            var n:uint = currentPlayer;
            var k:Number;
            if ( key.front ) controls.speed = clamp( controls.speed + delta * controls.acceleration, -controls.maxSpeed, controls.maxSpeed );
            if ( key.back ) controls.speed = clamp( controls.speed - delta * controls.acceleration, -controls.maxSpeed, controls.maxSpeed );
            if ( key.left ) controls.rotation -= delta * controls.angularSpeed;
            if ( key.right ) controls.rotation += delta * controls.angularSpeed;
            if ( key.right || key.left) controls.speed = clamp( controls.speed + 1 * delta * controls.acceleration, -controls.maxSpeed, controls.maxSpeed );
            
            // speed decay
            if ( ! ( key.front || key.back) ) {
                if ( controls.speed > 0 ) {
                    k = exponentialEaseOut( controls.speed / controls.maxSpeed );
                    controls.speed = clamp( controls.speed - k * delta * controls.acceleration, 0, controls.maxSpeed );
                } else {
                    k = exponentialEaseOut( controls.speed / ( -controls.maxSpeed) );
                    controls.speed = clamp( controls.speed + k * delta * controls.acceleration, -controls.maxSpeed, 0 );
                }
            }
            
            // displacement
            var forwardDelta:Number = controls.speed * delta;
            controls.vx = Math.sin( controls.rotation ) * forwardDelta;
            controls.vz = Math.cos( controls.rotation ) * forwardDelta;
            
            if (players[n]) {
                players[n].rotationY = radToDeg(controls.rotation)+180;
                players[n].x += controls.vx;
                players[n].z += controls.vz;
                // animation
                if (key.front) { if (animators[n].activeAnimationName == "idle"){ animators[n].play("walk"); animators[n].playbackSpeed = 0.5;} }
                else if (key.back) { if (animators[n].activeAnimationName == "idle"){ animators[n].play("walk"); animators[n].playbackSpeed = -0.5;}}
                else { if (animators[n].activeAnimationName == "walk"){ animators[n].play("idle"); animators[n].playbackSpeed = 0.5;} }
                
                if (animators[n].activeAnimationName == "idle"){ if (n == 0) players[n].y = 45 else players[n].y = 220;}
                else {if (n == 0) players[n].y = 185 else players[n].y = 220;}
                // camera follow
                center = players[n].position;
                moveCamera();
            }
        }
		
		//-----------------------------------------------------
		//  KEYBOARD
		//-----------------------------------------------------
        
        private function changeKey(k:Object):void {
			key = k;
		}
        
		private function sendKeytoHtml():void {
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
		}
		
		//-----------------------------------------------------
		//  MOUSE
		//-----------------------------------------------------
		
		private function onMouseDown(e:MouseEvent):void {
			mouse.ox = stage.mouseX;
			mouse.oy = stage.mouseY;
			mouse.h = cameraPosition.horizontal;
			mouse.v = cameraPosition.vertical;
			mouse.down = true;
		}
		
		private function onMouseUp(e:MouseEvent):void {
			mouse.down = false;
			//if (ExternalInterface.available)
			//	ExternalInterface.call("changeFocus");
		}
		
		private function onMouseMove(e:MouseEvent):void {
			if (mouse.down && !cameraPosition.automove) {
				mouse.x = stage.mouseX;
				mouse.y = stage.mouseY;
				cameraPosition.horizontal = (-(mouse.x - mouse.ox) * 0.3) + mouse.h;
				cameraPosition.vertical = (-(mouse.y - mouse.oy) * 0.3) + mouse.v;
				moveCamera();
			}
		}
		
		//-----------------------------------------------------
		//  CAMERA
		//-----------------------------------------------------
		
		private function moveCamera():void {
			view.camera.position = Orbit(center, cameraPosition.horizontal, cameraPosition.vertical, cameraPosition.distance);
			view.camera.lookAt(center);
		}
		
		private function endMove():void {
			cameraPosition.automove = false;
		}
		
		public function onChangeView(h:Number, v:Number, d:Number):void {
			TweenLite.to(cameraPosition, 3, {horizontal: h, vertical: v, distance: d, onUpdate: moveCamera, onComplete: endMove});
			cameraPosition.automove = true;
		}
		
		//-----------------------------------------------------
		//  MATH
		//-----------------------------------------------------
        
        private function exponentialEaseOut( v:Number ):Number { return v === 1 ? 1 : - Math.pow( 2, - 10 * v ) + 1; };
        
        private function clamp(a:Number,b:Number,c:Number):Number { return Math.max(b,Math.min(c,a)); }
		
		private function Orbit(origine:Vector3D, horizontal:Number, vertical:Number, distance:Number):Vector3D {
			var p:Vector3D = new Vector3D(0, 0, 0);
			var phi:Number = degToRad(unwrapDegrees(vertical));
			var theta:Number = degToRad(unwrapDegrees(horizontal));
			p.x = (distance * Math.sin(phi) * Math.cos(theta)) + origine.x;
			p.z = (distance * Math.sin(phi) * Math.sin(theta)) + origine.z;
			p.y = (distance * Math.cos(phi)) + origine.y;
			return p;
		}
		
		private function degToRad(v:Number):Number {
			return v * Math.PI / 180;
		}
        
        private function radToDeg(v:Number):Number {
			return v * 180 / Math.PI;
		}
		
		private function unwrapDegrees(r:Number):Number {
			r = r % 360;
			if (r > 180)
				r -= 360;
			if (r < -180)
				r += 360;
			return r;
		}
		
		//-----------------------------------------------------
		//  HUB
		//-----------------------------------------------------
		
		private function initDebug():void {
			debug = new TextField();
			debug.selectable = false;
			debug.defaultTextFormat = new TextFormat("_sans", 10, 0xffff99);
			debug.x = 10;
			debug.y = stage.stageHeight - 30;
			debug.width = stage.stageWidth - 20;
			debug.height = 20;
			debug.mouseEnabled = false;
			this.addChild(debug);
			
			stats = new Stats();
			addChild(stats);
			stats.y = stage.stageHeight - 27;
			stats.x = stage.stageWidth - 100;
		}
		
		private function tell(S:String):void {
			debug.text = S;
		}
	
	}
}
