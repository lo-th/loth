package loth.starlings{
	import starling.display.Button;
	import starling.display.DisplayObject;
	import starling.events.TouchEvent;
	import starling.events.Event;
	import starling.textures.Texture;
	
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.display.BitmapData;
	/**
	 * The HoverButton Class
	 * Essentially adds an overState to the Starling Button class.
	 * @author Tony Downey
	 */
	public class HoverButton extends Button {
		
		private var mUpState:Texture;
		private var mOverState:Texture;
		private var mIsOver:Boolean;
		
		public function HoverButton( FUN:Function, text:String = "", FontName:String = "" , color:uint = 0xff0000,upState:Texture= null, downState:Texture = null, overState:Texture = null) {
			upState = baseSkin(0xffffff, 0.1);
			downState = baseSkin(color, 1, 0.1);
			overState = baseSkin(color);
			
			super(upState, text, downState);
			this.fontName = FontName;
			this.fontSize = 20;
			this.fontColor = 0xffffff;
			this.addEventListener( Event.TRIGGERED, FUN );
			mOverState = overState;
			mUpState = upState;
			addEventListener(TouchEvent.TOUCH, onTouchCheckHover);
		}
		
		public function setPosition(_x:Number, _y:Number):void {
			x = _x;
			y = _y;
		}
		
		private function baseSkin(color:uint, alpha:Number=0.5, alpha2:Number=0.5):Texture {
		    var kbit:BitmapData = new BitmapData(100, 50, true, 0x000000);
			var f:flash.display.Sprite = new flash.display.Sprite();
			f.graphics.beginFill(color, alpha);
			f.graphics.lineStyle(2, color, alpha2);
			f.graphics.drawRoundRect(2, 2, 96, 46, 10, 10);
			f.graphics.endFill();
			kbit.draw(f);
			return Texture.fromBitmapData(kbit);
		}
		
		/** Checks if there is a parent, an overState, and if the touch event is hovering; if so, it replaces the upState texture */
		private function onTouchCheckHover(e:TouchEvent):void {
			if (parent && mOverState && upState != mOverState && e.interactsWith(this)) {// && e.interactsWith(e.currentTarget as DisplayObject)) {
				removeEventListener(TouchEvent.TOUCH, onTouchCheckHover);
				parent.addEventListener(TouchEvent.TOUCH, onParentTouchCheckHoverEnd);
				upState = mOverState;
			}
		}
		
		/** Checks if there is a parent, an overState, and if the touch event is finished hovering; if so, it resets the upState texture */
		private function onParentTouchCheckHoverEnd(e:TouchEvent):void {
			if (parent && mOverState && !e.interactsWith(e.currentTarget as DisplayObject)) {
				parent.removeEventListener(TouchEvent.TOUCH, onParentTouchCheckHoverEnd);
				addEventListener(TouchEvent.TOUCH, onTouchCheckHover);
				upState = mUpState;
			}
		}
		
		/** The texture that is displayed while the button is hovered over. */
		public function get overState():Texture {
			return mOverState;
		}
		
		public function set overState(value:Texture):void {
			if (mOverState != value)
				mOverState = value;
		}
		
		/** The texture that is displayed when the button is not being touched. */
		override public function get upState():Texture {
			return mUpState;
		}
		
		override public function set upState(value:Texture):void {
			if (mOverState != value)
				mUpState = value;
			super.upState = value;
		}
	
	}

}