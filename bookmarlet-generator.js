javascript: (function(w, d, v, b, j, s, l, r) {

	if (!(j = w.jQuery) || v > j.fn.jquery || b(j)) {
		s = d.createElement("script");
		s.type = "text/javascript";
		s.src = "http://code.jquery.com/jquery-" + v + ".min.js";
		s.onload = s.onreadystatechange = function() {
			if (!l && (!(r = this.readyState) || r == "loaded" || r == "complete")) {
				b((j = w.jQuery).noConflict(1), l = 1);
				j(s).remove();
			}
		};
		d.body.appendChild(s);
	}
})(window, document, "1.3.2", function($, L) {
	/*loadscript*/
	console.log($.fn.jquery, L);
});