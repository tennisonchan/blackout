javascript: (t13nb = window.t13nb || function(l) {
	var t = t13nb,
		d = document,
		o = d.body,
		c = "createElement",
		a = "appendChild",
		w = "clientWidth",
		i = d[c]("span"),
		s = i.style,
		x = o[a](d[c]("script"));
	if (o) {
		if (!t.l) {
			t.l = x.id = "t13ns";
			o[a](i).id = "t13n";
			i.innerHTML = "Loading Transliteration";
			s.cssText = "z-index:99;font-size:18px;background:#FFF1A8;top:0";
			s.position = d.all ? "absolute" : "fixed";
			s.left = ((o[w] - i[w]) / 2) + "px";
			x.src = "http://t13n.googlecode.com/svn/trunk/blet/rt13n.js?l=" + l
		}
	} else setTimeout(t, 500)
})('zh')