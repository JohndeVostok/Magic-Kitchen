var createjs;
var graphics = function() {
	var stage;
	
	var doLoad = function(theStage) {
		stage = theStage;
	};
	
	// newSpriteSheet returns a sprite sheet which can be used for later rendering.
	var newSpriteSheet = function(image) {
		var ss = new createjs.SpriteSheet({
			frames: {
				width: image.width,
				height: image.height
			},
			images: [image.src]
		});
		return {
			spriteSheet: ss,
			size: {
				x: image.x,
				y: image.y,
				len: image.len
			}
		};
	};
	
	const NullPos = {
		x: -1, y: -1, len: 0
	};
	
	// newSprite returns a sprite which is associated with the stage.
	var newSprite = function(sheet) {
		var sprite = new createjs.Sprite(sheet.spriteSheet);
		var ret = {
			sprite: sprite,
			size: sheet.size
		}
		setSpriteTransform(ret.size, NullPos);
		stage.addChild(sprite);
		return ret;
	};
	
	// newCustomSprite adds a custom sprite to the stage.
	// The parameter size is the position 
	var newCustomSprite = function(sprite, size) {
		var ret = {
			sprite: sprite,
			size: size
		}
		setSpriteTransform(ret.size, NullPos);
		stage.addChild(sprite);
		return ret;
	};
	
	// removeSprite removes an onscreen sprite.
	var removeSprite = function(sprite) {
		stage.removeChild(sprite.sprite);
	};
	
	var copyPosition = function(pos) {
		return {
			x: pos.x,
			y: pos.y,
			len: pos.len
		};
	};
	
	// getTransform gets the transform from pos1 to pos2 (in createjs form).
	var getTransform = function(pos1, pos2) {
		// Map (x1, y1, len1) to (x2, y2, len2)
		// First calculate resizing factor.
		// Then calculate the offset.
		var zoom = pos2.len / pos1.len;
		return {
			x: pos2.x - pos1.x * zoom,
			y: pos2.y - pos1.y * zoom,
			scaleX: zoom,
			scaleY: zoom
		};
	};
	
	// setSpriteTransform sets the transform of sprite to trans.
	var setSpriteTransform = function(sprite, trans) {
		sprite.sprite.setTransform(
			trans.x,
			trans.y,
			trans.scaleX,
			trans.scaleY
		);
	};
	
	// setSpritePos sets the position transform of the sprite immediately.
	var setSpritePos = function(sprite, pos) {
		sprite.pos = copyPosition(pos);
		setSpriteTransform(getTransform(sprite.size, pos));
	};
	
	var getSpriteTransformToPos = function(sprite, pos) {
		return getTransform(sprite.size, pos);
	};
	
	// getSprite returns the createjs sprite of a sprite.
	var getSprite = function(sprite) {
		return sprite.sprite;
	};
	
	// getTweenObject returns the Tween object (createjs.Tween.get) of a sprite.
	var getTweenObject = function(sprite) {
		return createjs.Tween.get(sprite.sprite);
	};
	
	return {
		doLoad: doLoad,
		newSpriteSheet: newSpriteSheet,
		NullPos: NullPos,
		newSprite: newSprite,
		newCustomSprite: newCustomSprite,
		removeSprite: removeSprite,
		copyPosition: copyPosition,
		getTransform: getTransform,
		setSpriteTransform: setSpriteTransform,
		setSpritePos: setSpritePos,
		getSpriteTransformToPos: getSpriteTransformToPos,
		getSprite: getSprite,
		getTweenObject: getTweenObject
	};
}();
