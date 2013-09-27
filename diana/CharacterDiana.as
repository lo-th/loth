package {
	import away3d.cameras.lenses.PerspectiveLens;
	import away3d.lights.shadowmaps.DirectionalShadowMapper;
	import away3d.materials.lightpickers.StaticLightPicker;
	import away3d.lights.PointLight;
	import away3d.lights.DirectionalLight;
	import away3d.animator.MorphGeometry;
	import away3d.animator.MorphAnimator;
	import away3d.animator.MorphAnimationSet;
	import away3d.animators.SkeletonAnimationSet;
	import away3d.animators.SkeletonAnimator;
	import away3d.animators.states.AnimationStateBase;
	import away3d.animators.transitions.CrossfadeTransition;
	import away3d.containers.Scene3D;
	import away3d.containers.View3D;
	import away3d.debug.AwayStats;
	import away3d.entities.Mesh;
	import away3d.events.AnimationStateEvent;
	import away3d.events.AnimatorEvent;
	import away3d.primitives.CubeGeometry;
	import away3d.primitives.PlaneGeometry;
	import away3d.sea3d.animation.MeshAnimation;
	import away3d.sea3d.animation.MorphAnimation;
	import away3d.containers.ObjectContainer3D;
	import away3d.materials.methods.FresnelSpecularMethod;
	import away3d.materials.methods.FilteredShadowMapMethod;
	import away3d.materials.methods.SoftShadowMapMethod;
	import away3d.materials.methods.FogMethod;
	import away3d.materials.TextureMaterial;
	import away3d.materials.ColorMaterial;
	import away3d.textures.BitmapTexture;
	import flash.events.ProgressEvent;
	
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.KeyboardEvent;
	import flash.utils.getTimer;
	import flash.ui.Keyboard;
	import flash.events.Event;
	import flash.net.URLRequest;
	import flash.geom.Vector3D;
	import flash.events.MouseEvent;
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Loader;
	import flash.display.LoaderInfo;
	import flash.net.URLLoader;
	import flash.net.URLLoaderDataFormat;
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	import sunag.sea3d.config.DefaultConfig;
	import sunag.events.AnimationEvent;
	import sunag.events.SEAEvent;
	import sunag.sea3d.SEA3D;
	import sunag.utils.TimeStep;
	
	import com.bit101.components.*;
	
	[SWF(width="1024",height="632",backgroundColor="0x2f3032",frameRate="60")]
	
	public class CharacterDiana extends Sprite {
		private const AssetsPath:String = "assets/diana/";
		private const TextureFiles:Array = ['body.jpg', 'head.jpg', 'hair.png', 'eye.jpg', 'eye_cont.png', 'tongue.jpg', 'teethUp.png', 'teethLow.png', 'sock.jpg'];
		private var n:Number = 0;
		private var bn:Number = 0;
		private var view:View3D;
		private var scene:Scene3D;
		private var keyState:Array = [];
		private var timeStep:TimeStep = new TimeStep(stage.frameRate);
		
		private var cameraPosition:Object = {horizontal: -90, vertical: 90, distance: 100, automove: false};
		private var mouse:Object = {x: 0, y: 0, down: false, ox: 0, oy: 0, h: 0, v: 0};
		private var center:Vector3D = new Vector3D(0, 40, 0);
		
		private var lightPicker:StaticLightPicker;
		private var light:DirectionalLight;
		
		private var fresnelMethod:FresnelSpecularMethod;
		private var softShadowMethod:SoftShadowMapMethod;
		private var fogMethod:FogMethod;
		
		private var player:Mesh;
		private var axe:Mesh;
		
		private var fake_neck:Mesh;
		private var head:Mesh;
		private var hair:Mesh;
		private var neck:Mesh;
		private var eyeL:Mesh;
		private var eyeR:Mesh;
		private var eyeTop:Mesh;
		private var teethUp:Mesh;
		private var teethDown:Mesh;
		private var tongue:Mesh;
		private var troat:Mesh;
		
		private var headContainer:ObjectContainer3D;
		private var eyesTarget:ObjectContainer3D;
		
		private var animator:SkeletonAnimator;
		
		private const Materials:Vector.<TextureMaterial> = new Vector.<TextureMaterial>();
		private const Textures:Vector.<BitmapData> = new Vector.<BitmapData>();
		
		private const Morpher:Vector.<MorphAnimator> = new Vector.<MorphAnimator>();
		private const MorphAnims:Vector.<MorphAnimationSet> = new Vector.<MorphAnimationSet>();
		private const Sliders:Vector.<HSlider> = new Vector.<HSlider>();
		
		private var info:TextField;
		private var txt:String = 'DIANA - SEA3D 1.6 \n\n';
		private var stat:AwayStats;
		private var isAutoMorph:Boolean = false;
		private var bgColor:uint = 0x8E9FAF //789DC9;
		
		/*[Embed (source="../assets/diana/body.sea",mimeType="application/octet-stream")]
		   private var Body:Class;
		
		   [Embed (source="../assets/diana/head.sea",mimeType="application/octet-stream")]
		 private var Head:Class;*/
		
		public function CharacterDiana() {
			stage.stageFocusRect = false;
			stage.showDefaultContextMenu = false;
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
			
			scene = new Scene3D();
			
			view = new View3D(scene);
			view.backgroundColor = bgColor;
			view.antiAlias = 4;
			addChild(view);
			
			view.camera.lens = new PerspectiveLens(50);
			view.camera.lens.near = 1;
			view.camera.lens.far = 300;
			
			stat = new AwayStats(view, false, true);
			addChild(stat);
			stat.x = stage.stageWidth - 125;
			initInfo();
			
			light = new DirectionalLight();
			light.color = 0xfffffe;
			light.ambientColor = bgColor;
			light.ambient = 0.5;
			light.specular = 1;
			light.castsShadows = true;
			DirectionalShadowMapper(light.shadowMapper).lightOffset = 1000;
			view.scene.addChild(light);
			light.position = Orbit(center, 35, 45, 1000);
			
			var pointLight1:PointLight = new PointLight();
			pointLight1.position = new Vector3D(100, -200, -400);
			pointLight1.color = 0x46576B;
			pointLight1.diffuse = 0.5;
			pointLight1.specular = 1;
			pointLight1.ambient = 0.01;
			pointLight1.radius = 2000;
			scene.addChild(pointLight1);
			
			var pointLight2:PointLight = new PointLight();
			pointLight2.position = new Vector3D(-100, 400, 400);
			pointLight2.color = 0xFFF0CF;
			pointLight2.diffuse = 0.5;
			pointLight2.specular = 1;
			pointLight2.ambient = 0.01;
			pointLight2.radius = 2000;
			scene.addChild(pointLight2);
			
			lightPicker = new StaticLightPicker([light, pointLight1, pointLight2]);
			
			softShadowMethod = new SoftShadowMapMethod(light, 10);
			softShadowMethod.range = 3;
			softShadowMethod.alpha = 0.5;
			softShadowMethod.epsilon = 0.3;
			
			fogMethod = new FogMethod(0, 300, bgColor);
			
			load(TextureFiles[n]);
			
			// Listener
			stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDown);
			stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUp);
			stage.addEventListener(Event.RESIZE, onResize);
			
			stage.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
			stage.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			stage.addEventListener(MouseEvent.MOUSE_UP, onMouseUp);
			stage.addEventListener(MouseEvent.MOUSE_OUT, onMouseUp);
			stage.addEventListener(MouseEvent.MOUSE_WHEEL, onMouseWheels);
		}
		
		private function onKeyDown(e:KeyboardEvent):void {
			keyState[e.keyCode] = true;
		}
		
		private function onKeyUp(e:KeyboardEvent):void {
			delete keyState[e.keyCode];
		}
		
		private function getKeyState(code:int):Boolean {
			return keyState[code];
		}
		
		private function onEnterFrame(e:Event):void {
			// blink eye
			n++;
			if (n == 400) {
				n = 0;
			}
			if (bn <= 1 && n < 10) {
				bn += 0.1;
				blink(bn);
			}
			if (n > 10 && bn >= 0) {
				bn -= 0.1;
				blink(bn);
			}
			
			// test some morph
			if (isAutoMorph) {
				morph("anger", stage.mouseX / stage.stageWidth);
				morph("surprise", (stage.stageHeight - stage.mouseY) / stage.stageHeight);
			}
			
			var running:Boolean = false;
			animator.playbackSpeed = 1;
			
			if (animator.activeAnimationName == "walk" || animator.activeAnimationName == "idle") {
				if (getKeyState(Keyboard.UP)) {
					running = true;
					player.moveBackward(1 * timeStep.delta);
				}
				if (getKeyState(Keyboard.DOWN)) {
					running = true;
					player.moveForward(1 * timeStep.delta);
					animator.playbackSpeed = -1;
				}
				
				if (getKeyState(Keyboard.LEFT)) {
					player.rotationY -= 5 * timeStep.delta;
				}
				if (getKeyState(Keyboard.RIGHT)) {
					player.rotationY += 5 * timeStep.delta;
				}
				
				if (running) {
					if (animator.activeAnimationName != "walk") {
						animator.play("walk", new CrossfadeTransition(.3));
					}
				} else {
					if (animator.activeAnimationName != "idle") {
						animator.play("idle", new CrossfadeTransition(.3));
					}
				}
				
			}
			
			headContainer.transform = axe.sceneTransform;
			
			center.x = player.position.x;
			center.z = player.position.z;
			moveCamera();
			
			view.render();
		}
		
		private function onResize(event:Event = null):void {
			view.width = stage.stageWidth;
			view.height = stage.stageHeight;
			stat.x = stage.stageWidth - 125;
		}
		
		//-----------------------------------------------------
		//  TEST MORPH EXIST FOR ALL MORPHER
		//-----------------------------------------------------
		
		private function morph(name:String, weight:Number):void {
			for (var i:uint; i < Morpher.length; ++i) {
				for (var j:uint = 0; j < MorphAnims[i].morphs.length; j++) {
					if (MorphAnims[i].morphs[j].name == name)
						Morpher[i].setWeight(name, weight);
				}
			}
		}
		
		private function blink(weight:Number):void {
			morph("blinkLeft", weight);
			morph("blinkRight", weight);
		}
		
		private function autoMorph(e:Event):void {
			if (isAutoMorph) {
				isAutoMorph = false;
				morph("anger", 0);
				morph("surprise", 0);
			} else {
				isAutoMorph = true;
			}
		}
		
		//-----------------------------------------------------
		//  BITMAP LOADER
		//-----------------------------------------------------
		
		private function load(url:String):void {
			var loader:URLLoader = new URLLoader();
			loader.dataFormat = URLLoaderDataFormat.BINARY;
			loader.addEventListener(Event.COMPLETE, parseBitmap);
			loader.addEventListener(ProgressEvent.PROGRESS, loadProgress, false, 0, true);
			loader.load(new URLRequest(AssetsPath + url));
		}
		
		private function parseBitmap(e:Event):void {
			var urlLoader:URLLoader = e.target as URLLoader;
			var loader:Loader = new Loader();
			loader.loadBytes(urlLoader.data);
			loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onBitmapComplete, false, 0, true);
			urlLoader.removeEventListener(Event.COMPLETE, parseBitmap);
			loader = null;
		}
		
		private function onBitmapComplete(e:Event):void {
			Textures[n] = Bitmap(LoaderInfo(e.target).content).bitmapData;
			n++;
			if (n < TextureFiles.length)
				load(TextureFiles[n]);
			else {
				n = 0;
				initMaterials();
				initObjects();
			}
		}
		
		private function loadProgress(e:ProgressEvent):void {
			var P:int = int(e.bytesLoaded / e.bytesTotal * 100);
			if (P != 100)
				info.text = 'Load texture: ' + P + ' % | ' + int((e.bytesLoaded / 1024) << 0) + ' ko\n';
			else {
				info.text = txt;
			}
		}
		
		//-----------------------------------------------------
		//  MATERIALS
		//-----------------------------------------------------
		
		private function initMaterials():void {
			var ground:Sprite = new Sprite();
			ground.graphics.beginFill(0x505050);
			ground.graphics.drawRect(0, 0, 64, 64);
			ground.graphics.endFill();
			ground.graphics.beginFill(0x808080);
			ground.graphics.drawRect(0, 0, 63, 63);
			ground.graphics.endFill();
			ground.graphics.beginFill(0xbbbbbb);
			ground.graphics.drawRect(0, 0, 62, 62);
			ground.graphics.endFill();
			var groundmap:BitmapData = new BitmapData(64, 64, false, 0x000000);
			groundmap.draw(ground);
			
			//create fresnel specular method
			fresnelMethod = new FresnelSpecularMethod(true);
			fresnelMethod.fresnelPower = 3;
			
			var i:uint
			for (i = 0; i < Textures.length; ++i) {
				Materials[i] = new TextureMaterial(new BitmapTexture(Textures[i]));
			}
			
			Materials[2].alphaThreshold = 0.8
			Materials[2].bothSides = true;
			Materials[4].alphaBlending = true;
			Materials[6].alphaBlending = true;
			Materials[7].alphaBlending = true;
			Materials[9] = new TextureMaterial(new BitmapTexture(new BitmapData(64, 64, false, 0xbbbbbb)));
			Materials[10] = new TextureMaterial(new BitmapTexture(groundmap));
			Materials[10].addMethod(fogMethod);
			Materials[10].repeat = true;
			Materials[10].specular = 0.4;
			Materials[10].gloss = 20;
			
			for (i = 0; i < Materials.length; ++i) {
				Materials[i].lightPicker = lightPicker;
				Materials[i].shadowMethod = softShadowMethod;
				if (i < 10) {
					if (i == 3)
						Materials[i].gloss = 120;
					else
						Materials[i].gloss = 30;
					Materials[i].specular = 3;
					Materials[i].specularMethod = fresnelMethod;
				}
			}
		}
		
		//-----------------------------------------------------
		//  OBJECT
		//-----------------------------------------------------
		
		private function initObjects():void {
			var plane:Mesh = new Mesh(new PlaneGeometry(10000, 10000, 4, 4, false), Materials[10]);
			plane.rotationX = 90;
			plane.castsShadows = false;
			scene.addChild(plane);
			plane.geometry.scaleUV(1000, 1000);
			
			headContainer = new ObjectContainer3D()
			scene.addChild(headContainer);
			
			eyesTarget = new ObjectContainer3D();
			eyesTarget.position = new Vector3D(0, 0, 50);
			headContainer.addChild(eyesTarget);
			
			// Init loader body
			var sea3d:SEA3D = new SEA3D(new DefaultConfig());
			sea3d.addEventListener(SEAEvent.COMPLETE, onBodyComplete);
			sea3d.load(new URLRequest(AssetsPath + "body_d.sea"));
			//sea3d.loadBytes(new Body());
		}
		
		//-----------------------------------------------------
		//  SEA3D BODY
		//-----------------------------------------------------
		
		private function onBodyComplete(e:SEAEvent):void {
			var sea:SEA3D = e.target as SEA3D;
			player = sea.getMesh("Body");
			player.material = Materials[0];
			player.position = new Vector3D(0, 37, 0);
			animator = player.animator as SkeletonAnimator;
			animator.updatePosition = false;
			animator.play("idle");
			
			axe = sea.getMesh("AXE");
			
			scene.addChild(player);
			
			// List Sequences
			var sklAnimationSet:SkeletonAnimationSet = animator.animationSet as SkeletonAnimationSet;
			for (var i:int = 0; i < sklAnimationSet.animationNames.length; i++)
				txt += "animation : " + sklAnimationSet.animationNames[i] + '\n';
			
			// Init loader Head
			var config:DefaultConfig = new DefaultConfig();
			config.forceMorphCPU = true;
			var sea3d2:SEA3D = new SEA3D(config);
			sea3d2.addEventListener(SEAEvent.COMPLETE, onHeadComplete);
			sea3d2.load(new URLRequest(AssetsPath + "head_d.sea"));
			//sea3d2.loadBytes(new Head());
		
		}
		
		//-----------------------------------------------------
		//  SEA3D HEAD
		//-----------------------------------------------------
		
		private function onHeadComplete(e:SEAEvent):void {
			var sea:SEA3D = e.target as SEA3D;
			var i:uint;
			
			fake_neck = sea.getMesh("Fake_neck");
			var animator2:SkeletonAnimator = fake_neck.animator as SkeletonAnimator;
			headContainer.addChild(fake_neck);
			animator2.play("front");
			fake_neck.scale(0.033);
			fake_neck.position = new Vector3D(0, 0, 0.3);
			fake_neck.rotationX = -3;
			
			head = sea.getMesh("skin_hi");
			head.material = Materials[1];
			Morpher[0] = head.animator as MorphAnimator;
			
			hair = sea.getMesh("Hair");
			hair.material = Materials[2];
			
			eyeL = sea.getMesh("Eye_L");
			eyeL.material = Materials[3];
			
			eyeR = sea.getMesh("Eye_R");
			eyeR.material = Materials[3];
			
			eyeTop = sea.getMesh("eye_top");
			eyeTop.material = Materials[4];
			Morpher[1] = eyeTop.animator as MorphAnimator;
			
			tongue = sea.getMesh("tongue");
			tongue.material = Materials[5];
			Morpher[2] = tongue.animator as MorphAnimator;
			
			teethUp = sea.getMesh("teethUpper");
			teethUp.material = Materials[6];
			Morpher[3] = teethUp.animator as MorphAnimator;
			
			teethDown = sea.getMesh("teethLower");
			teethDown.material = Materials[7];
			Morpher[4] = teethDown.animator as MorphAnimator;
			
			troat = sea.getMesh("sock");
			troat.material = Materials[8];
			Morpher[5] = troat.animator as MorphAnimator;
			
			neck = sea.getMesh("Neck");
			neck.material = Materials[9];
			
			for (i = 0; i < Morpher.length; ++i) {
				MorphAnims[i] = Morpher[i].animationSet as MorphAnimationSet;
			}
			
			var pb:HSlider;
			var name:String;
			// List Morph
			for (i = 0; i < MorphAnims[0].morphs.length; i++) {
				name = MorphAnims[0].morphs[i].name;
				txt += "                   " + name + '\n';
				
				pb = new HSlider(this, 10, 71 + i * 14, function(e:Event):void {
						morph(e.target.name, e.target.value);
					});
				pb.name = name;
				if (name == "neck")
					pb.setSliderParams(0, 1, 0.8);
				else if (name == "lookfront")
					pb.setSliderParams(0, 1, 1);
				else
					pb.setSliderParams(0, 1, 0);
				pb.setSize(50, 8);
				Sliders[i] = pb;
			}
			Morpher[0].setWeight("neck", 0.8);
			Morpher[0].setWeight("lookfront", 1);
			info.text = txt;
			
			var pb2:CheckBox = new CheckBox(this, 10, 480, "Auto Morph", autoMorph);
			
			stage.addEventListener(Event.ENTER_FRAME, onEnterFrame);
		}
		
		//-----------------------------------------------------
		//  MOUSE
		//-----------------------------------------------------
		
		private function onMouseDown(e:MouseEvent):void {
			if (stage.mouseX > 100) {
				mouse.ox = stage.mouseX;
				mouse.oy = stage.mouseY;
				mouse.h = cameraPosition.horizontal;
				mouse.v = cameraPosition.vertical;
				mouse.down = true;
			}
		}
		
		private function onMouseUp(e:MouseEvent):void {
			mouse.down = false;
		}
		
		private function onMouseMove(e:MouseEvent):void {
			if (eyeR && eyeL && eyesTarget) {
				eyesTarget.position = new Vector3D((stage.mouseX - stage.stageWidth * 0.5) * 0.1, -(stage.mouseY - stage.stageHeight * 0.5) * 0.1, 50);
				var pos:Vector3D = new Vector3D(-eyesTarget.y + 100, eyesTarget.x + 0.2, eyesTarget.z);
				var pos2:Vector3D = new Vector3D(-eyesTarget.y + 100, eyesTarget.x - 0.2, eyesTarget.z);
				
				eyeR.lookAt(pos);
				eyeL.lookAt(pos2);
			}
			
			if (mouse.down) {
				mouse.x = stage.mouseX;
				mouse.y = stage.mouseY;
				cameraPosition.horizontal = (-(mouse.x - mouse.ox) * 0.3) + mouse.h;
				cameraPosition.vertical = (-(mouse.y - mouse.oy) * 0.3) + mouse.v;
			}
		}
		
		private function onMouseWheels(e:MouseEvent):void {
			cameraPosition.distance -= e.delta;
			if (cameraPosition.distance < 100)
				center.y = 70 - (cameraPosition.distance * 0.3);
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
		
		private function initInfo():void {
			info = new TextField();
			info.selectable = false;
			info.defaultTextFormat = new TextFormat("_sans", 11, 0x111111);
			info.x = 10;
			info.y = 10;
			info.width = 200;
			info.height = 600;
			info.text = "Morph Head";
			info.mouseEnabled = false;
			this.addChild(info);
		}
	}
}