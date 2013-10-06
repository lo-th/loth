package loth.away3ds {
	import away3d.core.managers.Stage3DProxy;
	import away3d.containers.Scene3D;
	import away3d.containers.View3D;
	import away3d.entities.Mesh;
	import away3d.materials.methods.FogMethod;
	import away3d.materials.TextureMaterial;
	import away3d.primitives.CubeGeometry;
	import away3d.primitives.SphereGeometry;
	import away3d.textures.BitmapTexture;
	
	import away3d.materials.lightpickers.StaticLightPicker;
	import away3d.materials.methods.SoftShadowMapMethod;
	import away3d.lights.shadowmaps.DirectionalShadowMapper;
	import away3d.lights.DirectionalLight;
	import away3d.lights.PointLight;
	
	import away3d.tools.helpers.MeshHelper;
	
	import flash.display.Stage;
	import flash.utils.getTimer;
	import flash.display.Sprite;
	import flash.geom.Vector3D;
	import flash.geom.Matrix3D;
	import flash.events.Event;
	
	/**
	 * Away3d 4.1.4
	 * ...
	 * Compact engine by Loth
	 */
	public class AwayView {
		private static var Singleton:AwayView;
		// needed
		private static var _proxy:Stage3DProxy;
		private static var _contener:Sprite;
		private static var _stage:Stage;
		
		private static var _scene:Scene3D;
		private static var _view:View3D;
		
		private static var _center:Vector3D = new Vector3D();
		
		private static var _lightPicker:StaticLightPicker;
		private static var _shadowMethod:SoftShadowMapMethod;
		private static var _fog:FogMethod;
		private static var _colors:Array = [0x303030, 0x140a09, 0x562f30, 0xffffff];
        private static var _camSet:Object = { near:1, far:1000, fov:60 };
		private static var _backSphere:Mesh;
		/**
		 * Singleton enforcer
		 */
		public static function getInstance(Proxy:Stage3DProxy, RootStage:Stage, Contener:Sprite, Colors:Array = null, CamSet:Object = null):AwayView {
			_proxy = Proxy;
			_stage = RootStage;
			_contener = Contener;
			if (Colors != null)
				_colors = Colors;
            if (CamSet != null)
				_camSet = CamSet;
			if (Singleton == null) {
				Singleton = new AwayView();
				AwayView.initView();
			}
			return Singleton;
		}
		
		/**
		 * Init Away3d view
		 */
		private static function initView():void {
			_view = new View3D();
			_view.stage3DProxy = _proxy;
			_view.shareContext = true;
			_contener.addChildAt(_view, 0);
			
			_scene = _view.scene;
			
			CamControl.init(_stage, _view.camera, { v: 75, h: -90, d: 300 } );
            CamControl.cameraSetting(_camSet);
			CamControl.center = _center;
			CamControl.update();
			
			_fog = new FogMethod(100, _camSet.far*0.5, _colors[1]);
			
			initLight();
			MapGradien.colors = _colors;
			addBackground();
		
		}
		
		/*public static function cameraSetting(Obj:Object):void {
            _camSet = Obj;
			CamControl.cameraSetting(_camSet);
            _fog.maxDistance = _camSet.far * 0.5;
            _backSphere.scale(1);
            _backSphere.scale(_camSet.far * 0.5);
		}*/
		
		public static function update():void {
			_view.render();
		}
		
		public static function resize(event:Event = null):void {
			_view.width = _proxy.width = _stage.stageWidth;
			_view.height = _proxy.height = _stage.stageHeight;
			_view.stage3DProxy.recoverFromDisposal();
		
		}
		
		/**
		 * Getter
		 */
		
		public static function get view():View3D {
			return _view;
		}
		
		public static function get lightPicker():StaticLightPicker {
			return _lightPicker;
		}
		
		public static function get shadowMethod():SoftShadowMapMethod {
			return _shadowMethod;
		}
		
		public static function get fog():FogMethod {
			return _fog;
		}
		
		/**
		 * Init Away3d light
		 */
		private static function initLight():void {
			var light:DirectionalLight = new DirectionalLight();
			light.color = 0xfffffe;
			light.ambientColor = 0x403020;
			light.ambient = 0.5;
			light.specular = 1;
			light.castsShadows = true;
			DirectionalShadowMapper(light.shadowMapper).lightOffset = 1000;
			_scene.addChild(light);
			light.position = CamControl.orbit(_center, 35, 45, 1000);
			
			var pointLight1:PointLight = new PointLight();
			pointLight1.position = new Vector3D(100, -200, -400);
			pointLight1.color = 0x46576B;
			pointLight1.diffuse = 0.5;
			pointLight1.specular = 1;
			pointLight1.ambient = 0.01;
			pointLight1.radius = 2000;
			_scene.addChild(pointLight1);
			
			var pointLight2:PointLight = new PointLight();
			pointLight2.position = new Vector3D(-100, 400, 400);
			pointLight2.color = 0xFFF0CF;
			pointLight2.diffuse = 0.5;
			pointLight2.specular = 1;
			pointLight2.ambient = 0.01;
			pointLight2.radius = 2000;
			_scene.addChild(pointLight2);
			
			_lightPicker = new StaticLightPicker([light, pointLight1, pointLight2]);
			
			_shadowMethod = new SoftShadowMapMethod(light, 10);
			_shadowMethod.range = 3;
			_shadowMethod.alpha = 0.5;
			_shadowMethod.epsilon = 0.3;
		}
		
		private static function addBackground():void {
			var backgroundMaterial:TextureMaterial = new TextureMaterial(new BitmapTexture(MapGradien.background()));
			_backSphere = new Mesh(new SphereGeometry(1, 20, 16), backgroundMaterial);
            
            _backSphere.scale(_camSet.far * 0.5);
			_backSphere.geometry.convertToSeparateBuffers();
			MeshHelper.invertFaces(_backSphere);
			_backSphere.castsShadows = false;
			_view.scene.addChild(_backSphere);
		}
	
	}
}