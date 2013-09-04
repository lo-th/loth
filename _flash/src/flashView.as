package {
	import away3d.animators.SkeletonAnimator;
	import away3d.cameras.Camera3D;
	import away3d.cameras.lenses.PerspectiveLens;
	import away3d.containers.Scene3D;
	import away3d.containers.View3D;
	import away3d.entities.Mesh;
	import away3d.lights.DirectionalLight;
	import away3d.lights.PointLight;
	import away3d.lights.shadowmaps.DirectionalShadowMapper;
	import away3d.materials.lightpickers.StaticLightPicker;
	import away3d.materials.methods.FilteredShadowMapMethod;
	import away3d.materials.methods.FogMethod;
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
		
		private var meshs:Array = [];
		private var materials:Array = [];
		private var animators:Array = [];
		private var players:Array = [];
		private var currentPlay:String;
		
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
			
			stage.addEventListener(Event.RESIZE, onResize);
			stage.addEventListener(Event.ENTER_FRAME, onEnterFrame);
			
			onChangeView(45, 60, 1000);
			
			initDebug();
			
			Security.allowDomain("*");
			if (ExternalInterface.available) {
				ExternalInterface.marshallExceptions = true;
				ExternalInterface.addCallback("onFlashChangeView", onChangeView);
				ExternalInterface.addCallback("onFlashChangeAnimation", changeAnimation);
			}
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
			var sea3d:SEA3D = e.target as SEA3D;
			for (var i:int = 0; i < sea3d.meshes.length; i++) {
				meshs[i] = sea3d.meshes[i];
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
			players[1] = meshs[27 + 7];
			players[1].scale(10);
			players[1].material = cubeMat2;
			players[1].rotationY = 180;
			players[1].position = new Vector3D(-100, 250, 0);
			animators[1] = players[1].animator as SkeletonAnimator;
			animators[1].updatePosition = false;
			animators[1].play("idle");
			animators[1].playbackSpeed = 0.5;
			scene.addChild(players[1]);
			currentPlay = "idle"
		}
		
		private function changeAnimation():void {
			if (animators.length > 0) {
				if (currentPlay == "idle") {
					currentPlay = "walk";
					players[0].position = new Vector3D(100, 185, -100);
					players[1].position = new Vector3D(-100, 240, 0);
				} else {
					players[0].position = new Vector3D(100, 45, -100);
					players[1].position = new Vector3D(-100, 250, 0);
					currentPlay = "idle";
				}
				animators[0].play(currentPlay);
				animators[1].play(currentPlay);
			}
		
		}
		
		//-----------------------------------------------------
		//  EVENT
		//-----------------------------------------------------
		
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
		
		private function onEnterFrame(e:Event):void {
			view.render();
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
		
		private function Orbit(origine:Vector3D, horizontal:Number, vertical:Number, distance:Number):Vector3D {
			var p:Vector3D = new Vector3D(0, 0, 0);
			var phi:Number = degToRad(unwrapDegrees(vertical));
			var theta:Number = degToRad(unwrapDegrees(horizontal));
			p.x = (distance * Math.sin(phi) * Math.cos(theta)) + origine.x;
			p.z = (distance * Math.sin(phi) * Math.sin(theta)) + origine.z;
			p.y = (distance * Math.cos(phi)) + origine.y;
			return p;
		}
		
		private function degToRad(Value:Number):Number {
			return Value * Math.PI / 180;
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
