package loth.starlings {
	import starling.events.EnterFrameEvent;
	import starling.textures.Texture;
	import starling.display.Sprite;
	import starling.utils.deg2rad;
	import starling.display.Image;
	import starling.events.Event;
	import starling.core.Starling;
	
	import flash.display.BitmapData;
	import flash.utils.getTimer;
	import flash.system.System;
	
	/**
	 * Graphics stats
	 * @author loth 2013
	 */
	public class GStats extends Sprite {
		protected var frameTime:Number = 0;
		protected var frameCount:uint;
		
		private var fps:uint;
		private var ms:uint;
		private var mem:Number;
		private var mem_max:Number = 0;
		
		private var background:Image;
		private var needles:Vector.<Image>;
		private var s:Number;
		
		private var nativeStage:flash.display.Stage;
		
		public function GStats(Size:Number = 1) {
			s = Size;
			nativeStage = Starling.current.nativeStage;
			
			init();
		}
		
		private function update(e:EnterFrameEvent):void {
			frameCount++;
			frameTime += e.passedTime;
			ms = e.passedTime * 1000;
			needles[0].rotation =  deg2rad(ms);
			
			if (frameTime > 1) {
				mem =  Number((System.totalMemory * 0.000000954).toFixed(2));
				mem_max = mem_max > mem ? mem_max : mem;
				fps = int((frameCount / frameTime)*3)+1;
				fps = fps > 180 ? 180 : fps;
				needles[3].rotation = deg2rad(fps);
				needles[1].rotation = deg2rad(mem_max);
				needles[2].rotation = deg2rad(mem);
				frameTime = frameCount = 0;
			}
		}
		
		private function init():void {
			background = createBackground();
			addChild(background);
			
			needles = new Vector.<Image>(4, true);
			needles[0] = addNeedle(0xAA6600, 20, 1, 1);
			needles[1] = addNeedle(0x006699, 21, 3);
			needles[2] = addNeedle(0x0088FF, 18, 2);
			needles[3] = addNeedle(0xffff00, 21, 1);
			
			for (var i:uint = 0; i < 4;++i) {
				needles[i].pivotX = 25 * s;
				needles[i].pivotY = 10 * s;
				addChild(needles[i]);
				needles[i].x = 25 * s;
				needles[i].y = 25 * s;
				}
				
			addEventListener(starling.events.Event.ENTER_FRAME, update);
			autoResize();
		}
		
		public function autoResize():void {
			x = nativeStage.stageWidth - (55 * s);
			y = nativeStage.stageHeight - (33 * s);
		}
		
		//-------------------------------------------------------------
		//        FLASH GRAPHICS
		//-------------------------------------------------------------
		
		private function createBackground(color:uint=0xFFFFFF):Image {
			var g:flash.display.Sprite = new flash.display.Sprite();
			g.graphics.lineStyle(2 * s, color, 0.25, true);
			g.graphics.drawCircle(25 * s, 25 * s, 24 * s);
			g.graphics.endFill();
			g.graphics.lineStyle(1 * s, color, 0.5, true);
			g.graphics.drawCircle(25 * s, 25 * s, 23 * s);
			g.graphics.endFill();
			g.graphics.lineStyle(1 * s, color, 0.25, true);
			g.graphics.moveTo(2 * s, 25 * s);
			g.graphics.lineTo(6 * s, 25 * s);
			g.graphics.endFill();
			g.graphics.moveTo(48 * s, 25 * s);
			g.graphics.lineTo(44 * s, 25 * s);
			g.graphics.endFill();
			g.graphics.moveTo(25 * s, 2 * s);
			g.graphics.lineTo(25 * s, 6 * s);
			g.graphics.endFill();
			
			var b:BitmapData = new BitmapData(50 * s, 26 * s, true, 0xffffff);
			b.draw(g);
			g.graphics.clear();
			
			return new Image(Texture.fromBitmapData(b));
		}
		
		private function addNeedle(color:uint = 0xffff00, lenght:int = 22, radius:int = 2, trick:uint=2):Image {
			var g:flash.display.Sprite = new flash.display.Sprite();
			g.graphics.lineStyle(trick * s, color, 1);
			g.graphics.moveTo(-radius * s, 0);
			g.graphics.lineTo(-lenght * s, 0);
			g.graphics.endFill();
			g.graphics.drawCircle(0, 0, radius * s);
			g.graphics.endFill();
			var g2:flash.display.Sprite = new flash.display.Sprite();
			
			g2.addChild(g);
			g.x = 25 * s;
			g.y = 10 * s;
			
			var b:BitmapData = new BitmapData(30 * s, 20 * s, true, 0xffffff);
			b.draw(g2);
			g.graphics.clear();
			return new Image(Texture.fromBitmapData(b));
		}
	
	}
}