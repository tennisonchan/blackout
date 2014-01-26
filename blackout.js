javascript: (function() {
	cssList = {
		"#coveringCanvas": {
			"position": "absolute",
			"top": 0,
			"left": 0,
			"background-color": "rgba(255,255,255,.1)",
			"z-index": 9999999
		},
	};

	function canvasOverlay() {
		var canvasWidth = window.innerWidth,
			canvasHeight = window.innerHeight,
			isDrawing;

		function midPointBtw(p1, p2) {
			return {
				x: p1.x + (p2.x - p1.x) / 2,
				y: p1.y + (p2.y - p1.y) / 2
			};
		}

		function prepareSimpleCanvas() {
			$('body').append($('<div id="divCanvas"></div>'));
			var canvasDiv = document.getElementById('divCanvas');
			canvas = document.createElement('canvas');
			canvas.setAttribute('width', canvasWidth);
			canvas.setAttribute('height', canvasHeight);
			canvas.setAttribute('id', 'coveringCanvas');
			canvasDiv.appendChild(canvas);
			if (typeof G_vmlCanvasManager != 'undefined') {
				canvas = G_vmlCanvasManager.initElement(canvas);
			}
			context = canvas.getContext("2d");
			context.lineWidth = 15;
			context.lineJoin = 'miter';
			context.lineCap = 'butt';
			var isDrawing, points = [], line = [];

			canvas.onmousedown = function(e) {
				isDrawing = true;
				points.push( [ { x: e.clientX, y: e.clientY } ] );
			};

			canvas.onmousemove = function(e) {
				if (!isDrawing) return;

				context.clearRect(0, 0, context.canvas.width, context.canvas.height);

				points[points.length-1].push({ x: e.clientX, y: e.clientY });

				for(var j = 0, l = points.length; j < l; j++){
					var p1, p2, midPoint;
					line = points[j];

					context.beginPath();
					context.moveTo(line[0].x, line[0].y);

					for (var i = 0, len = line.length; i < len - 1; i++) {
						p1 = line[i];
						p2 = line[i+1];
						midPoint = midPointBtw(p1, p2);
						context.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
					}
					context.lineTo(p1.x, p1.y);
					context.stroke();
				}
			};

			canvas.onmouseup = function(e) {
				isDrawing = false;
			};
		}

		prepareSimpleCanvas();
	}

	function Locker () {
		var lockX, lockY;

		function lockIt() {
			window.scrollTo(lockX,lockY);
			return false;
		}

		return {
			lock: function() {
				lockX = window.scrollX;
				lockY = window.scrollY;

				window.addEventListener("scroll", lockIt, false);
				return {
					pos: {
						left: lockX,
						top: lockY
					}
				}
			},
			unlock : function() {
				window.removeEventListener("scroll", lockIt, false);
			}
		}
	}

	function cssSetUP(list) {
		for (var item in list) {
			var selector = $(item);
			if (selector) {
				selector.css(list[item]);
			}
		}
	}

	/**
	   * Google Analytics JS v1
	   * http://code.google.com/p/google-analytics-js/
	   * Copyright (c) 2009 Remy Sharp remysharp.com / MIT License
	   * $Date: 2009-02-25 14:25:01 +0000 (Wed, 25 Feb 2009) $
    */
	function GA() {
		(function(h, j, e) {
			function o(q, i) {
				return q + Math.floor(Math.random() * (i - q));
			}
			var l = 1000000000,
				p = o(l, 9999999999),
				f = o(10000000, 99999999),
				g = o(l, 2147483647),
				n = (new Date()).getTime(),
				m = window.location,
				k = new Image(),
				d = "http://www.google-analytics.com/__utm.gif?utmwv=1.3&utmn=" + p + "&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-&utmhn=" + j + "&utmr=" + m + "&utmp=" + e + "&utmac=" + h + "&utmcc=__utma%3D" + f + "." + g + "." + n + "." + n + "." + n + ".2%3B%2B__utmb%3D" + f + "%3B%2B__utmc%3D" + f + "%3B%2B__utmz%3D" + f + "." + n + ".2.2.utmccn%3D(referral)%7Cutmcsr%3D" + m.host + "%7Cutmcct%3D" + m.pathname + "%7Cutmcmd%3Dreferral%3B%2B__utmv%3D" + f + ".-%3B";
			k.src = d;
		})("UA-13280906-3", "tennison35.github.io", "blackout.js");
	}

	function main($) {
		GA();
		canvasOverlay();
		var locker = new Locker();
		var lockPos = locker.lock().pos;
		cssSetUP(cssList);
		cssSetUP({ "#coveringCanvas": lockPos });
	}

	if (!window.jQuery) {
		var head = document.getElementsByTagName("head")[0],
			jQueryScript = document.createElement("script");
		jQueryScript.type = "text/javascript";
		jQueryScript.src = "http://code.jquery.com/jquery-1.10.2.min.js";
		jQueryScript.onload = function() {
			main(window.jQuery);
		};
		head.appendChild(jQueryScript);
	} else {
		main(window.jQuery);
	}
})();