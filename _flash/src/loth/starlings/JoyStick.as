package loth.starlings {
	import flash.events.Event;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.display.BitmapData;
	
	import starling.core.Starling;
	import starling.display.Image;
	import starling.display.Sprite;
	import starling.events.Touch;
	import starling.events.TouchEvent;
	import starling.events.TouchPhase;
	import starling.textures.Texture;
	
	public class JoyStick extends Sprite {
		private var nativeStage:flash.display.Stage;
		private var _velocityX:Number = 0;
		private var _velocityY:Number = 0;
		private var _minOffsetX:Number;
		private var _minOffsetY:Number;
		private var _touched:Boolean = false;
		
		private var stickRadius:Number;
		private var holderRadius:Number;
		private var maximumVelocityX:Number;
		private var maximumVelocityY:Number;
		private var pivotPoint:Point;
		private var holder:Image;
		private var stick:Image;
		private var _color:uint;
		
		public function JoyStick(Color:uint , activateImmediately:Boolean = true) {
			_color = Color;
			nativeStage = Starling.current.nativeStage;
			
			initialize(activateImmediately);
		}
		
		public function setPosition(_x:Number, _y:Number):void {
			x = _x;
			y = _y;
		}
		
		public function get velocityY():Number {
			return _velocityY;
		}
		
		public function get minOffsetY():Number {
			return _minOffsetY;
		}
		
		public function get touched():Boolean {
			if (velocityX == 0 && velocityY == 0)
				_touched = false;
			return _touched;
		}
		
		public function get minOffsetX():Number {
			return _minOffsetX;
		}
		
		public function get velocityX():Number {
			return _velocityX;
		}
		
		public function activate():void {
			if (stick.hasEventListener(TouchEvent.TOUCH)) return;
			stick.addEventListener(TouchEvent.TOUCH, onJoystickTouch);
		}
		
		public function deactivate():void {
			if (!stick.hasEventListener(TouchEvent.TOUCH)) return;
			stick.removeEventListener(TouchEvent.TOUCH, onJoystickTouch);
			resetStick();
		}
		
		private function joySkin():Image {
		    var kbit:BitmapData = new BitmapData(200, 200, true, 0x000000);
			var f:flash.display.Sprite = new flash.display.Sprite();
			f.graphics.beginFill(0xFFFFFF, 0.1);
			f.graphics.lineStyle(1, 0xFFFFFF, 0.1);
			f.graphics.drawCircle(100, 100, 98);
			f.graphics.endFill();
			kbit.draw(f);
			return new Image(Texture.fromBitmapData(kbit));
		}
		
		private function padSkin():Image {
		    var kbit:BitmapData = new BitmapData(100, 100, true, 0x000000);
			var f:flash.display.Sprite = new flash.display.Sprite();
			f.graphics.beginFill(_color, 0.5);
			var m:Matrix = new Matrix();
			m.createGradientBox(100, 100);
			f.graphics.beginGradientFill("radial", [_color, _color, _color], [0.2, 0.6, 0.8], [0x70, 0xcc, 0xff], m);
			f.graphics.lineStyle(2, _color, 1);
			
			f.graphics.drawCircle(50, 50, 47);
			f.graphics.endFill();
			f.graphics.lineStyle(2, _color, 0);
			f.graphics.beginFill(_color, 0.5);
			f.graphics.drawCircle(50, 20, 3);
			f.graphics.drawCircle(50, 80, 3);
			f.graphics.drawCircle(20, 50, 3);
			f.graphics.drawCircle(80, 50, 3);
			f.graphics.endFill();
			kbit.draw(f);
			return new Image(Texture.fromBitmapData(kbit));
		}
		
		private function initialize(activateImmediately:Boolean = true):void {
			if (holder) {
				holder.dispose();
				removeChild(holder);
			}
			if (stick) {
				stick.dispose();
				stick.removeEventListener(TouchEvent.TOUCH, onJoystickTouch);
				removeChild(stick);
			}
			
			holder = joySkin();
			stick = padSkin();
			stick.pivotX = stick.width / 2;
			stick.pivotY = stick.height / 2;
			
			resetStick();
			stickRadius = stick.pivotX;
			holderRadius = holder.pivotX;
			
			addChild(holder);
			addChild(stick);
			holder.touchable = false;
			
			pivotX = holder.width / 2;
			pivotY = holder.height / 2;
			maximumVelocityX = holder.width / 2;
			maximumVelocityY = holder.height / 2;
			_minOffsetX = (holder.width / 2) + stick.width / 2;
			_minOffsetY = (holder.height / 2) + stick.height / 2;
			
			pivotPoint = new Point(pivotX, pivotY);
			if (activateImmediately) activate();
			
			autoResize();
		}
		
		public function autoResize():void {
			x = _minOffsetX;
			y = nativeStage.stageHeight - _minOffsetY;
		}
		
		public function changeSkin():void {
			initialize( true);
		}
		
		private function onJoystickTouch(event:TouchEvent):void {
			var touch:Touch = event.getTouch(this);
			if (touch == null) return;
			_touched = true;
			switch (touch.phase) {
				case TouchPhase.BEGAN: 
					pivotPoint.x = touch.globalX - pivotX + stick.x;
					pivotPoint.y = touch.globalY - pivotY + stick.y;
				case TouchPhase.MOVED: 
					moveJoystick(touch.globalX, touch.globalY);
					break;
				case TouchPhase.ENDED: 
					resetStick();
					break;
			}
			
			_velocityX = (stick.x - pivotX) / maximumVelocityX;
			_velocityY = (stick.y - pivotY) / maximumVelocityY;
		}
		
		private function resetStick():void {
			_touched = false;
			stick.x = holder.width * 0.5;
			stick.y = holder.height * 0.5;
		}
		
		private function moveJoystick(touchX:Number, touchY:Number):void {
			var distX:Number = (touchX - pivotPoint.x);
			var distY:Number = (touchY - pivotPoint.y);
			stick.x = distX + pivotX;
			stick.y = distY + pivotY;
			
			var dis:Number = Math.sqrt((distX * distX) + (distY * distY));
			
			if (Math.abs(dis) > pivotX) {
				var force:Number = dis - pivotX;
				stick.x -= distX / dis * force;
				stick.y -= distY / dis * force;
			}
		}
	
	}

}
