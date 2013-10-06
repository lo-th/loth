package loth.starlings {
	import feathers.controls.Button;
	import feathers.controls.Callout;
	import feathers.controls.Label;
	import feathers.text.BitmapFontTextFormat;
	import feathers.themes.AzureMobileTheme;
	
	import starling.text.BitmapFont;
	import starling.display.Sprite;
	import starling.events.Event;
	
	public class ButtonTest extends Sprite {
		protected var theme:AzureMobileTheme;
		protected var button:Button;
		protected var _font:BitmapFont;
		
		public function ButtonTest(F:BitmapFont) {
			_font = F;
			this.addEventListener(Event.ADDED_TO_STAGE, addedToStageHandler);
		}
		
		protected function addedToStageHandler(event:Event):void {
			this.removeEventListener(Event.ADDED_TO_STAGE, addedToStageHandler);
			
			//create the theme. this class will automatically pass skins to any
			//Feathers component that is added to the stage. you should always
			//create a theme immediately when your app starts up to ensure that
			//all components are properly skinned.
			this.theme = new AzureMobileTheme(this.stage, false);
			//create a button and give it some text to display.
			this.button = new Button();
			//  this.button.defaultLabelProperties.textFormat = new BitmapFontTextFormat( _font );
			// this.button.defaultLabelProperties.textFormat = new BitmapFontTextFormat( "Source Code Pro" );
			this.button.label = "Click Me 00";
			this.button.height = 100;
			this.button.width = 200;
			
			// var ff:BitmapFontTextFormat 
			
			//an event that tells us when the user has tapped the button.
			this.button.addEventListener(Event.TRIGGERED, button_triggeredHandler);
			
			//add the button to the display list, just like you would with any
			//other Starling display object. this is where the theme give some
			//skins to the button.
			this.addChild(this.button);
			
			//the button won't have a width and height until it "validates". it
			//will validate on its own before the next frame is rendered by
			//Starling, but we want to access the dimension immediately, so tell
			//it to validate right now.
			this.button.validate();
			
			//center the button
			this.button.x = (this.stage.stageWidth - this.button.width) * 0.5;
			this.button.y = 60 //(this.stage.stageHeight - this.button.height) *0.5;
		}
		
		protected function button_triggeredHandler(event:Event):void {
			const label:Label = new Label();
			
			label.setSize(200, 200);
			label.text = "Hi, I'm Feathers!\nHave a nice day.";
			Callout.show(label, this.button);
		}
	}
}