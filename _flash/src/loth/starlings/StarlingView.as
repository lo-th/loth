package loth.starlings{
	import flash.display.BitmapData;
	import flash.utils.setTimeout;
	import flash.geom.Rectangle;
	import flash.geom.Point;
	
	import starling.core.Starling;
	import starling.utils.HAlign;
	import starling.utils.VAlign;
	import starling.events.Event;
	import starling.display.Image;
	import starling.display.Stage;
	import starling.display.Sprite;
	import starling.display.Button;
	import starling.text.TextField;
	import starling.text.BitmapFont;
	import starling.textures.Texture;
	import starling.events.Touch;
	import starling.events.TouchEvent;
	import starling.events.TouchPhase;
	import starling.utils.deg2rad;
	
	/*import stars.HoverButton;
	import stars.JoyStick;
	import stars.GStats;
	import stars.Knob;*/
	
	/**
	 * Basic Starling view
	 * @author loth 2013
	 */
	public class StarlingView extends Sprite {
		[Embed(source="/../embeds/code.fnt",mimeType="application/octet-stream")]
		private static const FontXml:Class;
		[Embed(source="/../embeds/code_0.png")]
		private static const FontTexture:Class;
		private static var Singleton:StarlingView;
		private static var _container:Sprite;
		private static var ttx:TextField;
		private static var imgBack:Image;
		private static var _isIntro:Boolean = true;
		private static var _txtIntro:String;
		private static var _colorIntro:uint;
		private static var _colorTxtIntro:uint;
		private static var _introSet:Array;
		private static var _rootFont:BitmapFont;
        
		public function StarlingView() {
			_container = this;
			var texture:Texture = Texture.fromBitmap(new FontTexture());
			var xml:XML = XML(new FontXml());
            _rootFont = new BitmapFont(texture, xml);
			TextField.registerBitmapFont(_rootFont,  "Source Code Pro");
			_container.addEventListener(Event.ADDED_TO_STAGE, intro);
		}
		
		public static function intro(e:Event = null):void {
			_container.removeEventListener(Event.ADDED_TO_STAGE, intro);
			
			if (_introSet == null)
				introSetting();
			
			var bg:BitmapData = new BitmapData(_container.stage.stageWidth, _container.stage.stageHeight, true, _introSet[1]);
			imgBack = new Image(Texture.fromBitmapData(bg));
			_container.addChild(imgBack);
			ttx = new TextField(_container.stage.stageWidth, _container.stage.stageHeight, _introSet[0], "Source Code Pro", _introSet[3], _introSet[2]);
			ttx.hAlign = HAlign.CENTER;
			ttx.vAlign = VAlign.CENTER;
			_container.addChild(ttx);
			
			setTimeout(hideIntro, 4000);
		}
		
		static public function introSetting(txt:String = "Yoo", c:uint = 0xFE000000, c2:uint = 0xffffff, size:int = 28):void {
			_introSet = [txt, c, c2, size];
		}
		
		public static function get isIntro():Boolean {
			return _isIntro;
		}
		
		public static function hideIntro():void {
			_isIntro = false;
			_container.removeChild(imgBack);
			imgBack.dispose();
			
			ttx.text = "";
			ttx.fontSize = 16;
			ttx.width = 300;
			ttx.height = 500;
			ttx.color = _introSet[2];
			ttx.vAlign = VAlign.TOP;
			ttx.hAlign = HAlign.LEFT;
			ttx.y = 10;
			ttx.x = 10;//(_container.stage.stageWidth - 500) * 0.5;;
            
           // var bb:ButtonTest = new ButtonTest(_rootFont);
         //   bb.font = _rootFont;
           // _container.addChild(bb);
		}
		
		public static function tell(S:String):void {
			if (!_isIntro)
				ttx.text = S;
		}
		
        //-------------------------------------------------------------
		//        RESIZE
		//-------------------------------------------------------------
		
		public static function onResize():void {
            if (_stat)_stat.autoResize();
            if (_joystick)_joystick.autoResize();
		}
        
		//-------------------------------------------------------------
		//        JOYSTICK
		//-------------------------------------------------------------
		
		private static var _joystick:JoyStick;
		
		public static function get joystick():JoyStick {
			return _joystick;
		}
		
		public static function addJoystick(color:uint = 0x00ff00):void {
			_joystick = new JoyStick(color);
			_container.addChild(_joystick);
		}
		
		private static function onUpdate(event:Event):void {
			if (_joystick.touched) {
				tell("X:" + _joystick.velocityX.toFixed(2) + " Y:" + _joystick.velocityY.toFixed(2));
			}
		}
		
		//-------------------------------------------------------------
		//        KNOB
		//-------------------------------------------------------------
		
		private static var _knobs:Vector.<Sprite> = new Vector.<Sprite>();
		
		public static function addKnob(name:String, x:int = 0, y:int = 0):void {
			var kn:Knob = new Knob(_container, name, x, y);
			kn.setPosition(x, y);
			_container.addChild(kn);
			_knobs.push(kn);
		}
		
		//-------------------------------------------------------------
		//        BUTTON
		//-------------------------------------------------------------
		
		private static var _buttons:Vector.<Button> = new Vector.<Button>();
		
		public static function get buttons():Vector.<Button> {
			return _buttons;
		}
		
		public static function addButton(name:String, fun:Function, x:int = 0, y:int = 0, color:uint=0xff0000):void {
			var bn:HoverButton = new HoverButton(fun, name, "Source Code Pro", color);
			bn.setPosition(x, y);
			_container.addChild(bn);
			_buttons.push(bn);
		}
		
		//-------------------------------------------------------------
		//        G-STAT
		//-------------------------------------------------------------
		
		private static var _stat:GStats;
		
		public static function addStat(size:Number = 1):void {
			_stat = new GStats(size);
			_container.addChild(_stat);
		}
	
	}
}