package {
	import away3d.core.managers.Stage3DManager;
	import away3d.core.managers.Stage3DProxy;
    import away3d.events.Stage3DEvent;
    
    import away3d.entities.Mesh;
    import away3d.materials.ColorMaterial;
    import away3d.primitives.CylinderGeometry;
    import away3d.primitives.SphereGeometry;
    import away3d.primitives.PlaneGeometry;
	import away3d.primitives.CubeGeometry;
	
	import flash.display.StageScaleMode;
	import flash.display.StageQuality;
	import flash.display.StageAlign;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.utils.setTimeout;
	import flash.geom.Rectangle;
	import flash.geom.Vector3D;
	
	import starling.core.Starling;
    
	import loth.starlings.StarlingView;
	import loth.physics.OimoEngineDev;
    import loth.away3ds.AwayView;
	
	/**
	 * OIMO LABS
	 * @author loth 2013
	 */
	public class OimoLabsStaticDev extends Sprite {
		private const Colors:Array = [0x303030, 0x140a09, 0x562f30, 0xffffff];
		//___________________________________ STAGE3D
		private var _stage3DManager:Stage3DManager;
		private var _stage3DProxy:Stage3DProxy;
		//___________________________________ STARLING
		private var _starling:Starling;
        
		/**
		 * Constructor
		 */
		function OimoLabsStaticDev() {
			addEventListener(Event.ADDED_TO_STAGE, init, false, 0, true);
		}
		
		/**
		 * Global initialise
		 */
		private function init(e:Event = null):void {
			removeEventListener(Event.ADDED_TO_STAGE, init);
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			stage.color = Colors[0];
			setTimeout(initProxies, 1);
		}
		
		/**
		 * Global initialise stage3D
		 */
		private function initProxies():void {
			_stage3DManager = Stage3DManager.getInstance(stage);
			_stage3DProxy = _stage3DManager.getFreeStage3DProxy();
			_stage3DProxy.addEventListener(Stage3DEvent.CONTEXT3D_CREATED, initAway3d);
			_stage3DProxy.color = Colors[0];
			_stage3DProxy.antiAlias = 0;
		}
		
		/**
		 * Global initialise away3D and starling
		 */
		private function initAway3d(event:Stage3DEvent):void {
			_stage3DProxy.removeEventListener(Stage3DEvent.CONTEXT3D_CREATED, initAway3d);
            
            AwayView.getInstance(_stage3DProxy, stage, this, Colors, {near:1, far:1000, fov:60 });
 
			initPhysics();
			initListeners();
			initStarling();
		}
        
		// ---------------------------------------------------------------------
		//      PHYSICS
		// ---------------------------------------------------------------------
		
		private function initPhysics():void {
			OimoEngineDev.getInstance(AwayView.view.scene);
			OimoEngineDev.gravity(0, -1, 0);
			var mat0:ColorMaterial = new ColorMaterial(0x303030);
			var mat1:ColorMaterial = new ColorMaterial(0xff0000);
			var mat2:ColorMaterial = new ColorMaterial(0x0000ff);
			var mat3:ColorMaterial = new ColorMaterial(0x00ff00);
            mat0.addMethod(AwayView.fog);
			mat0.lightPicker = AwayView.lightPicker;
			mat1.lightPicker = AwayView.lightPicker;
			mat2.lightPicker = AwayView.lightPicker;
			mat3.lightPicker = AwayView.lightPicker;
            mat0.shadowMethod =AwayView.shadowMethod;
            mat1.shadowMethod =AwayView.shadowMethod;
            mat2.shadowMethod = AwayView.shadowMethod;
			mat3.shadowMethod = AwayView.shadowMethod;
			var geo0:PlaneGeometry = new PlaneGeometry(1000, 1000, 1000);
			var geo1:CubeGeometry = new CubeGeometry(10, 10, 10);
			var geo2:SphereGeometry = new SphereGeometry(5);
			var geo3:CylinderGeometry = new CylinderGeometry(5, 5, 10);
            
			var plan:Mesh = new Mesh(geo0, mat0);
            AwayView.view.scene.addChild(plan);
			// wall
			OimoEngineDev.addRigid("cube", null, new Vector3D(1000, 50, 1000), new Vector3D(0, -25, 0), null, new Vector3D(1, 0.5, 0), false);
			OimoEngineDev.addRigid("cube", null, new Vector3D(100, 100, 10), new Vector3D(0, 50, 50), null, new Vector3D(1, 0.5, 0), false);
			OimoEngineDev.addRigid("cube", null, new Vector3D(100, 100, 10), new Vector3D(0, 50, -50), null, new Vector3D(1, 0.5, 0), false);
			OimoEngineDev.addRigid("cube", null, new Vector3D(10, 100, 100), new Vector3D(50, 50, 0), null, new Vector3D(1, 0.5, 0), false);
			OimoEngineDev.addRigid("cube", null, new Vector3D(10, 100, 100), new Vector3D(-50, 50, 0), null, new Vector3D(1, 0.5, 0), false);
			
			// object
			var m:Mesh;
			for (var i:int = 0; i < 100; i++) {
				m = new Mesh(geo1, mat1);
				OimoEngineDev.addRigid("cube", m, new Vector3D(10, 10, 10), new Vector3D(0, 200 + (i * 20), 0), null, new Vector3D(1, 0.5, 0.1), true);
				m = new Mesh(geo2, mat2);
				OimoEngineDev.addRigid("sphere", m, new Vector3D(5, 0, 0), new Vector3D(30, 200 + (i * 20), 0), null, new Vector3D(1, 0.5, 0.1), true);
			}
		}
		
		// ---------------------------------------------------------------------
		//      LISTENERS
		// ---------------------------------------------------------------------
		
		/**
		 * Initialise the listeners
		 */
		private function initListeners():void {
			addEventListener(Event.ENTER_FRAME, onEnterFrame);
			stage.addEventListener(Event.RESIZE, onResize);
			stage.quality = StageQuality.LOW;
		}
		
		/**
		 * EnterFrame loop
		 */
		private function onEnterFrame(e:Event):void {
            _stage3DProxy.clear();
			OimoEngineDev.update();
            AwayView.update();
           
			if (_starling) {
				StarlingView.tell(OimoEngineDev.oimoInfo());
				_starling.nextFrame();
			}
			 _stage3DProxy.present();
		}
		
		/**
		 * Stage listener for resize events
		 */
		private function onResize(event:Event = null):void {
			if (_starling != null) {
				_starling.viewPort = new Rectangle(0, 0, stage.stageWidth, stage.stageHeight);
				_starling.stage.stageWidth = stage.stageWidth;
				_starling.stage.stageHeight = stage.stageHeight;
				StarlingView.onResize();
			}
            AwayView.resize();
		}
		
		//-------------------------------------------------------------
		//        STARLING
		//-------------------------------------------------------------
		
		private function initStarling():void {
			Starling.handleLostContext = true;
			Starling.multitouchEnabled = true;
			StarlingView.introSetting("OIMO LABS\nversion 0.2 - ©loth.2013\nAway3D - Sea3D - OimoPhysics dev - Starling", 0xEF000000 + Colors[0], 0xf4f3f4, 28);
			
			_starling = new Starling(StarlingView, stage, _stage3DProxy.viewPort, _stage3DProxy.stage3D);
			_starling.antiAliasing = 1;
			_starling.start();
			
			stage.addEventListener(Event.ENTER_FRAME, addControl, false, 0, true);
			// this.loaderInfo.addEventListener(Event.COMPLETE, loaderInfo_completeHandler);
		}
		
		private function addControl(e:Event):void {
			if (!StarlingView.isIntro) {
				stage.removeEventListener(Event.ENTER_FRAME, addControl);
				var mid:int = stage.stageWidth * 0.5;
				StarlingView.addStat(2);
				//	StarlingView.addKnob("volume", mid - 70, 600);
				//	StarlingView.addKnob("BPM", mid + 70, 600);
				//StarlingView.addJoystick();
				
				stage.quality = StageQuality.LOW;
			}
		}
	
	}
}