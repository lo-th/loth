package loth.away3ds {
    import away3d.textures.BitmapCubeTexture;
    
	import flash.geom.Matrix;
	import flash.display.Shape;
	import flash.display.BitmapData;
	
    
    
	public class MapGradien {
        private static var _colors:Array = [0x303030, 0x140a09, 0x562f30, 0xffffff]; 
        
		static public  function set colors(C:Array):void {
            _colors = C;
        }
        
		static public function background():BitmapData {
			var s:Shape = new Shape();
			var m:Matrix = new Matrix();
			m.createGradientBox(256, 256, RadDeg(-90));
			s.graphics.beginGradientFill("linear", _colors, [1, 1, 1, 1], [0x30, 0x90, 0xAA, 0xFF], m);
			s.graphics.drawRect(0, 0, 256, 256);
			s.graphics.endFill();
			var b:BitmapData = new BitmapData(256, 256, false, 0x00000000);
			b.draw(s);
			return b;
		}
		
		static public function diffuse():BitmapData {
			var s:Shape = new Shape();
			var m:Matrix = new Matrix();
			m.createGradientBox(256, 8, 0);
			s.graphics.beginGradientFill("linear", _colors, [1, 1, 1, 1], [0x00, 0x80, 0xAA, 0xFF], m);
			s.graphics.drawRect(0, 0, 256, 8);
			s.graphics.endFill();
			var b:BitmapData = new BitmapData(256, 8, false, 0x00000000);
			b.draw(s);
			return b;
		}
        
        static public function CubicSky(xl:int = 64):BitmapCubeTexture {
			var h:BitmapData = new BitmapData(xl, xl, false, 0x000000);
			var h2:BitmapData = new BitmapData(xl, xl, false, _colors[0]);
			var h3:BitmapData = new BitmapData(xl, xl, false, _colors[2]);
			var grad:Shape = new Shape();
			var matrix:Matrix = new Matrix();
			matrix.createGradientBox(xl, xl);
			grad.graphics.beginGradientFill('radial', [_colors[3], _colors[2]], [1, 1], [0, 0xDD], matrix);
			grad.graphics.drawRect(0, 0, xl, xl);
			h3.draw(grad);
			matrix = new Matrix();
			matrix.createGradientBox(xl, xl, -Math.PI / 2);
			grad.graphics.clear();
			grad.graphics.beginGradientFill('linear', [_colors[0], _colors[0], _colors[1], _colors[2]], [1, 1, 1, 1], [0x00, 0x80, 0xAA, 0xFF], matrix);
			grad.graphics.drawRect(0, 0, xl, xl);
			h.draw(grad);
			grad.graphics.clear();
			grad = null;
			var cc:BitmapCubeTexture = new BitmapCubeTexture(h, h, h3, h2, h, h);
			return cc;
		}
        
        private static function RadDeg(d:Number):Number {
			return (d * (Math.PI / 180));
		}
	}

}