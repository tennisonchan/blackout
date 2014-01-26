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

			canvas.onmousedown = function(e) {
				isDrawing = true;
				context.moveTo(e.clientX, e.clientY);
			};
			canvas.onmousemove = function(e) {
				if (isDrawing) {
					context.lineTo(e.clientX, e.clientY);
					context.lineCap = "butt";
					context.lineJoin = "round";
					context.lineWidth = 15;
					context.stroke();
				}
			};
			canvas.onmouseup = function() {
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
		})("UA-30567117-1", "alefeuvre.github.io", "gd-bookmarklet.js");
	}

	function main($) {
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