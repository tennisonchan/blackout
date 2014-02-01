(function($, bml) {

var GreatWall = {
	init: function(){
		paper.install(window);
		var wall = new Wall();
		var paint = new Paint();

		wall.init();
		paint.init();

		Panel();
	}
};

var Panel = function() {
	var menuDiv = $('<div/>', { id : 'menuContainer' });
	$(bml.body).append(menuDiv);

	menuDiv.append(template);

	new window.gnMenu( document.getElementById( 'gn-menu' ) );
};

var Wall = function(id, context) {
	var Walls = [], Wall = {};
	var canvasDiv = $('<div/>', { id : 'divCanvas' });
	this.activeWall = null;
	$(bml.body).append(canvasDiv);
	var $all = $(document);
	var width = $all.width();
	var height = $all.height();

	Wall.createCanvas = function(id){
		var canvas = $("<canvas/>", { id: id, width: width, height: height, resize: true })
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
	var path, textItem, tool, style;

	var init = function(){

		tool = new Tool();
		tool.onMouseDown = thickBrush.onMouseDown;
		tool.onMouseDrag = thickBrush.onMouseDrag;
		tool.onMouseUp = thickBrush.onMouseUp;

		style = new Style();
	};

	var Style = function(){
		var style = {
			strokeWidth: 10,
			strokeCap: 'round',
			strokeColor: 'black'
			// strokeWidth: 10,
			// strokeColor: '#ff0000'
		};
		return {
			update: function(opt) {
				console.log('style.update');
				return $.extend(style, opt);
			},
			get: function(){
				return style;
			},
			remove: function(){
				path.style = null;
			}
		}
	}

	var simpleLine = {
		onMouseDown: function(event) {
			console.log("simpleLine: onMouseDown");
			path = new Path();

			path.style = style.get();
			path.add(event.point);
		},
		onMouseDrag: function(event) {
			console.log("simpleLine: onMouseDrag");
			path.add(event.point);
			path.smooth();
		},
		onMouseUp: function(event) {
			console.log("simpleLine: onMouseUp");
			console.log("path:", path);
		}
	};

	var thickBrush = {
		onMouseDown: function(event) {
			tool.minDistance = 38;
			tool.maxDistance = 40;
			console.log("thickBrush: onMouseDown");

			path = new Path();
			path.fillColor = {
				hue: Math.random() * 360,
				saturation: 1,
				brightness: 1,
			};

			path.add(event.point);
		},
		onMouseDrag: function(event) {
			console.log("thickBrush: onMouseDrag");
			var step = event.delta;
			step.angle += 90;

			var speed = step.length = 40;
			var stepX = step.x/2;
			var stepY = step.y/2;

			var middlePoint = event.middlePoint;
			var top = new Point(middlePoint.x + stepX, middlePoint.y + stepY);
			var bottom = new Point(middlePoint.x - stepX, middlePoint.y - stepY);

			path.add(top);
			path.insert(0, bottom);
			path.opacity = 0.5;
			path.smooth();
		},
		onMouseUp: function(event) {
			console.log("thickBrush: onMouseUp");

			path.add(event.point);
			path.closed = true;
			path.smooth();

			console.log("path:", path);
		}
	};

	return {
		init: init,
		style: style,
		tool: tool
	};
}

GreatWall.init();

function GA(h, j, e) {
//("UA-30567117-1", "tennison35.github.io", graffita.js");
	function o(q, i) { return q + Math.floor(Math.random() * (i - q)); }
	var l = 1000000000,
		p = o(l, 9999999999),
		f = o(10000000, 99999999),
		g = o(l, 2147483647),
		n = (new Date()).getTime(),
		m = window.location,
		k = new Image(),
		d = "http://www.google-analytics.com/__utm.gif?utmwv=1.3&utmn=" + p + "&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-&utmhn=" + j + "&utmr=" + m + "&utmp=" + e + "&utmac=" + h + "&utmcc=__utma%3D" + f + "." + g + "." + n + "." + n + "." + n + ".2%3B%2B__utmb%3D" + f + "%3B%2B__utmc%3D" + f + "%3B%2B__utmz%3D" + f + "." + n + ".2.2.utmccn%3D(referral)%7Cutmcsr%3D" + m.host + "%7Cutmcct%3D" + m.pathname + "%7Cutmcmd%3Dreferral%3B%2B__utmv%3D" + f + ".-%3B";
	k.src = d;
}

})(window.bookmarklet.jQuery, window.bookmarklet);