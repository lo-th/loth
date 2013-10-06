package loth.away3ds {
	import away3d.cameras.lenses.PerspectiveLens;
	import away3d.controllers.HoverController;
	import away3d.cameras.Camera3D;
	import flash.display.Stage;
	import flash.geom.Vector3D;
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import com.greensock.TweenLite;
	
	public class CamControl {
		private static var cameraPosition:Object = {horizontal: 0, vertical: 0, distance: 300, automove: false};
		private static var mouse:Object = {x: 0, y: 0, down: false, ox: 0, oy: 0, h: 0, v: 0};
		private static var _center:Vector3D = new Vector3D(0, 0, 0);
		private static var camera:Camera3D;
		private static var stage:Stage;
        
		public static function init(S:Stage, cam:Camera3D, obj:Object):void {
			stage = S;
			camera = cam;
			
			cameraPosition.distance = obj.d || 1000;
			cameraPosition.horizontal = obj.h || 0;
			cameraPosition.vertical = obj.v || 0;
			
			update();
			
			stage.addEventListener(MouseEvent.MOUSE_WHEEL, onMouseWheel);
			stage.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			stage.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
			stage.addEventListener(MouseEvent.MOUSE_UP, onMouseUp);
			stage.addEventListener(MouseEvent.MOUSE_OUT, onMouseUp);
			stage.addEventListener(Event.MOUSE_LEAVE, onMouseOut);
		}
		
		public static function set center(V:Vector3D):void {
			_center = V;
		}
		
		public static function cameraSetting(obj:Object):void {
			camera.lens.far = obj.far || 1000
			camera.lens.near = obj.near || 1;
			camera.lens = new PerspectiveLens(obj.fov || 60);
		}
		
		//-----------------------------------------------------
		//  MOUSE
		//-----------------------------------------------------
		
		private static function onMouseDown(e:MouseEvent):void {
			mouse.ox = stage.mouseX;
			mouse.oy = stage.mouseY;
			mouse.h = cameraPosition.horizontal;
			mouse.v = cameraPosition.vertical;
			mouse.down = true;
		}
		
		private static function onMouseUp(e:MouseEvent):void {
			mouse.down = false;
		}
        
        private static function onMouseOut(e:Event):void {
			mouse.down = false;
		}
		
		private static function onMouseMove(e:MouseEvent):void {
			if (mouse.down && !cameraPosition.automove) {
				mouse.x = stage.mouseX;
				mouse.y = stage.mouseY;
				cameraPosition.horizontal = (-(mouse.x - mouse.ox) * 0.3) + mouse.h;
				cameraPosition.vertical = (-(mouse.y - mouse.oy) * 0.3) + mouse.v;
				update();
			}
		}
		
		//-----------------------------------------------------
		//  CAMERA
		//-----------------------------------------------------
		
		public static function update():void {
			camera.position = orbit(_center, cameraPosition.horizontal, cameraPosition.vertical, cameraPosition.distance);
			camera.lookAt(_center);
		}
		
		private static function endMove():void {
			cameraPosition.automove = false;
		}
		
		public static function onChangeView(h:Number, v:Number, d:Number):void {
			TweenLite.to(cameraPosition, 3, {horizontal: h, vertical: v, distance: d, onUpdate: update, onComplete: endMove});
			cameraPosition.automove = true;
		}
		
		private static function onMouseWheel(e:MouseEvent):void {
			cameraPosition.distance -= e.delta * 5;
			
			update();
		/*if (controller.distance < setting[4])
		   controller.distance = setting[4];
		   else if (controller.distance > setting[5])
		 controller.distance = setting[5];*/
		}
		
		//-----------------------------------------------------
		//  MATH
		//-----------------------------------------------------
		
		private static const ToRad:Number = Math.PI / 180;
		private static const ToDeg:Number = 180 / Math.PI;
		
		public static function orbit(origine:Vector3D, horizontal:Number, vertical:Number, distance:Number):Vector3D {
			var p:Vector3D = new Vector3D(0, 0, 0);
			var phi:Number = unwrapDegrees(vertical) * ToRad;
			var theta:Number = unwrapDegrees(horizontal) * ToRad;
			p.x = (distance * Math.sin(phi) * Math.cos(theta)) + origine.x;
			p.z = (distance * Math.sin(phi) * Math.sin(theta)) + origine.z;
			p.y = (distance * Math.cos(phi)) + origine.y;
			return p;
		}
		
		private static function unwrapDegrees(r:Number):Number {
			r = r % 360;
			if (r > 180)
				r -= 360;
			if (r < -180)
				r += 360;
			return r;
		}
	
	}
}