(function($, bml) {

var canvas, ctx, socketIsOn;

var GreatWall = {
	init: function(){
		paper.install(window);
		var wall = new Wall();
		var paint = new Paint();
		wall.init();
		paint.init();
		var panel = new Panel();

		// socketIO.init();

		// html2canvas(document.body, {
		// 	onrendered: function(canvas) {
		// 		// canvas is the actual canvas element,
		// 		// to append it to the page call for example
		// 		// document.body.appendChild( canvas );
		// 		document.body.appendChild( canvas );
		// 		console.log('DONE!');
		// 	}
		// });
	}
};

var Panel = function() {
	var gui = new dat.GUI();

	gui.add(ctx, 'lineWidth').min(1).max(20).step(1);
	gui.add(ctx, 'lineJoin').options({ miter: 'miter', round: 'round', bevel: 'bevel' });
	gui.add(ctx, 'lineCap').options({ butt: 'butt', round: 'round', square: 'square' });
	gui.addColor(ctx, 'strokeStyle');
};

function Uti () {
	var w = window;
	var l = w.location;
	var href = l.href;
	var uri_arr = decodeURI(href.split("?")[1]).split("&");
	var uri = {
		hash: l.hash,
		protocol: l.protocol,
		path: l.pathname,
		host: l.host
	};
	for(var q = uri_arr.length-1;q >= 0;q--){
		var item = uri_arr[q].split("=");
		uri[item[0]] = item[1];
	}
	this._uri = uri;
}

uti.prototype.uri = function(query, isEncoded){
	if(typeof query === "string"){
		return this._uri[query];
	} else if(!query){
		return this._uri;
	}
};

var uti = new Uti();
uti.uri();

var Wall = function(id, context) {
	var Walls = [], Wall = {};
	var canvasDiv = $('<div/>', { id : 'divCanvas' });
	this.activeWall = null;
	$(bml.body).append(canvasDiv);
	var $all = $(document);
	var width = $all.width();
	var height = $all.height();

	Wall.createCanvas = function(id){
		canvas = $("<canvas/>", { id: id, width: width, height: height, resize: true })[0];
		canvasDiv.append(canvas);
		ctx =  canvas.getContext('2d');
		return canvas;
	};

	Wall.setupPaperScope = function(canvas){
		var newWall = new paper.PaperScope();
		newWall.setup(canvas);
		Walls.push(newWall);
	};

	Wall.init = function() {
		Wall.setupPaperScope( Wall.createCanvas('coveringCanvas') );
	};

	return Wall;
};

var socketIO = {
	init: function(){
		console.log("socket.io", io);
		socket = io.connect("http://neoglory.star.is", {port: 8000, transports: ["websocket"]});

		socket.on("connect", this.onSocketConnected);
		socket.on("error", this.onSocketError);

		socket.on("onMouseDown", this.onSocketMouseDown);
		socket.on("onMouseDrag", this.onSocketMouseDrag);
		socket.on("onMouseUp", this.onSocketMouseUp);
		socketIsOn = true;
	},
	onSocketConnected: function (){
		console.log("Connected to socket server");
	},
	onSocketError: function (err){
		console.log( err === "handshake error"? err : "io error", err);
	},
	onSocketMouseDown: function(data){
		console.log('remote:onMouseDown');
		bezierLine.onMouseDown.apply(null, data);
	},
	onSocketMouseDrag: function(data){
		console.log('remote:onMouseDown');
		bezierLine.onMouseDrag.apply(null, data);
	},
	onSocketMouseUp: function(data){
		console.log('remote:onMouseDown');
		bezierLine.onMouseUp.apply(null, data);
	},
	testing: function(){
		socket.emit("testing", "testing msg from client");
		socket.emit("broadcast", "broadcast testing msg from client");
	}
};

var keys = [37, 38, 39, 40];

function keydown(e) {
    for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
        }
    }
}

function wheel(e) {
	e = e || window.event;
	if (e.preventDefault) e.preventDefault();
	e.returnValue = false;
}

function disable_scroll() {
  if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', wheel, false);
  }
  window.onmousewheel = document.onmousewheel = wheel;
  document.onkeydown = keydown;
}

function enable_scroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = document.onkeydown = null;
}

var points = [];
var point1, point2, tmpImageData;
var bezierLine = {
	onMouseDown: function(event, remote) {
		console.log("bezierLine: onMouseDown");
		// ctx.lineWidth = 15;
		// ctx.lineJoin = 'miter';
		// ctx.lineCap = 'butt';
		// ctx.strokeStyle = '#000000';

		point1 = { x: event.event.offsetX, y: event.event.offsetY };
		ctx.beginPath();
		ctx.moveTo(point1.x, point1.y);
		tmpImageData = ctx.getImageData(window.scrollX, window.scrollY, window.screen.width, window.screen.height);
		disable_scroll();
		if(socketIsOn && !remote) socket.emit("onMouseDown", [{event:{offsetX: point1.x, offsetY: point1.y}}, true]);
	},
	onMouseDrag: function(event, remote) {
		point2 = { x: event.event.offsetX, y: event.event.offsetY };

		function midPointBtw(pt1, pt2){
			return { x: (pt1.x+pt2.x)/2, y:(pt1.y+pt2.y)/2 };
		}

		ctx.clearRect(window.scrollX, window.scrollY, window.screen.width, window.screen.height);
		// ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		if(tmpImageData) ctx.putImageData(tmpImageData, window.scrollX, window.scrollY);

		var midPoint = midPointBtw(point1, point2);
		ctx.quadraticCurveTo(point1.x, point1.y, midPoint.x, midPoint.y);
		ctx.stroke();

		point1 = point2;
		if(socketIsOn && !remote) socket.emit("onMouseDrag", [{event:{offsetX:point2.x, offsetY: point2.y}}, true]);
	},
	onMouseUp: function(event, remote) {
		console.log("bezierLine: onMouseUp");
		ctx.closePath();
		enable_scroll();
		if(socketIsOn && !remote) socket.emit("onMouseUp", [null, true]);
	}
};


var Paint = function(){
	var path, textItem, tool, style;

	var init = function(){
		tool = new Tool();
		tool.onMouseDown = bezierLine.onMouseDown;
		tool.onMouseDrag = bezierLine.onMouseDrag;
		tool.onMouseUp = bezierLine.onMouseUp;
		tool.minDistance = 10;
		// tool.maxDistance = 100;

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
		};
	};

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
};

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