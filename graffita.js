(function($, bml) {

var GreatWall = {
	init: function(){
		paper.install(window);
		var wall = new Wall();
		var paint = new Paint();

		wall.init();
		paint.init();
	}
};

var Wall = function(id, context) {
	var Walls = [], Wall = {};
	var canvasDiv = $('<div/>', { id : 'divCanvas' });
	this.activeWall = null;
	$(bml.body).append(canvasDiv);

	Wall.createCanvas = function(id){
		var canvas = $("<canvas/>", { id: id, width: document.body.offsetWidth, height: document.body.offsetHeight, resize: true })
		canvasDiv.append(canvas);
		return canvas;
	},

	Wall.setupPaperScope = function($canvas){
		var newWall = new paper.PaperScope();
		newWall.setup($canvas[0]);
		Walls.push(newWall);
	},

	Wall.init = function() {
		Wall.setupPaperScope( Wall.createCanvas('coveringCanvas') );
	}

	return Wall;
}

var Paint = function(){
	var path, textItem, tool;

	var init = function(){
		textItem = new PointText(new Point(20, 30));
		textItem.fillColor = 'black';
		textItem.content = 'Click and drag to draw a line.';
		
		tool = new Tool();
		tool.onMouseDown = onMouseDown;
		tool.onMouseDrag = onMouseDrag;
		tool.onMouseUp = onMouseUp;
	};

	function onMouseDown(event) {
		console.log("onMouseDown");

		path = new Path();
		path.strokeColor = 'black';
	}

	function onMouseDrag(event) {
		console.log("onMouseDrag");
		path.add(event.point);
		
		textItem.content = 'Segment count: ' + path.segments.length;
	}

	function onMouseUp(event) {
		console.log("onMouseUp");

		path.simplify();
		
		console.log("path:", path);
	}

	return {
		init: init
	};
}

GreatWall.init();

})(window.bookmarklet.jQuery, window.bookmarklet);