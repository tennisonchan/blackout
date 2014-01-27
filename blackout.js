javascript: (function() {

    var startBookmarklet = function($) {

        function init(){
            prepareSimpleCanvas();
            var locker = new Locker();
            var lockPos = locker.lock().pos;
            cssSetUP(cssList);
            cssSetUP({ "#coveringCanvas": lockPos });
            window.blackoutIsBuilt = true;
        }

        var cssList = {
            "#coveringCanvas": {
                "position": "absolute",
                "top": 0,
                "left": 0,
                "background-color": "rgba(255,255,255,.1)",
                "z-index": 9999999
            },
        },

        prepareSimpleCanvas = function () {
            var isDrawing, points = [], line = [],
                canvasDiv = $('<div id="divCanvas"></div>'),
                canvas = document.createElement('canvas');
            canvas.setAttribute('width', window.outerWidth);
            canvas.setAttribute('height', window.outerHeight);
            canvas.setAttribute('id', 'coveringCanvas');
            $('body').append(canvasDiv);
            canvasDiv.append(canvas);
            if (typeof G_vmlCanvasManager != 'undefined') {
                canvas = G_vmlCanvasManager.initElement(canvas);
            }
            context = canvas.getContext("2d");
            context.lineWidth = 15;
            context.lineJoin = 'miter';
            context.lineCap = 'butt';

            var midPointBtw = function (p1, p2) {
                return {
                    x: p1.x + (p2.x - p1.x) / 2,
                    y: p1.y + (p2.y - p1.y) / 2
                };
            };

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
        },

        Locker = function() {
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
                    };
                },
                unlock : function() {
                    window.removeEventListener("scroll", lockIt, false);
                }
            };
        },

        cssSetUP = function (list) {
            var item, selector;
            for (item in list) {
                    selector = $(item);
                if (selector) {
                    selector.css(list[item]);
                }
            }
        };

        if(!window.blackoutIsBuilt) init();
    };

	/**
		* Google Analytics JS v1
		* http://code.google.com/p/google-analytics-js/
		* Copyright (c) 2009 Remy Sharp remysharp.com / MIT License
		* $Date: 2009-02-25 14:25:01 +0000 (Wed, 25 Feb 2009) $
	*/
	function GoogleAnalytics() {
		(function(urchinCode, domain, url) {

		function rand(min, max) {
			return min + Math.floor(Math.random() * (max - min));
		}

		var i=1000000000,
			utmn=rand(i,9999999999),
			cookie=rand(10000000,99999999),
			random=rand(i,2147483647),
			today=(new Date()).getTime(),
			win = window.location,
			img = new Image(),
			urchinUrl = 'http://www.google-analytics.com/__utm.gif?utmwv=1.3&utmn='+
				utmn+'&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-&utmhn='+
				domain+'&utmr='+win+'&utmp='+
				url+'&utmac='+
				urchinCode+'&utmcc=__utma%3D'+
				cookie+'.'+random+'.'+today+'.'+today+'.'+
				today+'.2%3B%2B__utmb%3D'+
				cookie+'%3B%2B__utmc%3D'+
				cookie+'%3B%2B__utmz%3D'+
				cookie+'.'+today+
				'.2.2.utmccn%3D(referral)%7Cutmcsr%3D' + win.host + '%7Cutmcct%3D' + win.pathname + '%7Cutmcmd%3Dreferral%3B%2B__utmv%3D'+
				cookie+'.-%3B';

		img.src = urchinUrl;
		})("UA-13280906-3", "tennison35.github.io", "blackout.js");
	}

	if (!window.jQuery) {
		var head = document.getElementsByTagName("head")[0],
			jQueryScript = document.createElement("script");
		jQueryScript.type = "text/javascript";
		jQueryScript.src = "http://code.jquery.com/jquery-1.10.2.min.js";
		jQueryScript.onload = function() {
			startBookmarklet(window.jQuery);
		};
		head.appendChild(jQueryScript);
	} else {
		startBookmarklet(window.jQuery);
	}
})();