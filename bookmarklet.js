javascript: (function(w, d, j) {

var bookmarklet = {};

bookmarklet.name = "blackout";
bookmarklet.anchor = null;
bookmarklet.jQuery = null;

bookmarklet.scripts = [
  { "el":"script", "attr": {"type": "text/javascript", "id": "bml-jquery", "src": "http://code.jquery.com/jquery-1.10.2.min.js"} },
  { "el":"script", "attr": {"type": "text/javascript", "id": "bml-blackout", "src": "http://localhost/blackout/blackout.js"} }
];

bookmarklet.loadScript = function(opt, onload) {
  console.log('loadScript');
  var state, attr, s = document.createElement(opt.el);
  for(attr in opt.attr) s[attr] = opt.attr[attr];

  if(typeof onload === "function") s.onload = s.onreadystatechange = function() {
    if (!(state = this.readyState) || state == "loaded" || state == "complete") onload(s);
  };

  bookmarklet.head.appendChild(s);
};

bookmarklet.create = function(el, opt) {
  var attr, item = document.createElement(el);
  for(attr in opt) item[attr] = opt[attr];
  return item;
};

bookmarklet.buildAnchor = function(callback) {
  var anchor,head, body;
  bookmarklet.anchor = anchor = bookmarklet.create("div", {"id":"bml-anchor"});
  bookmarklet.head = head = bookmarklet.create("div", {"id":"bml-head"});
  bookmarklet.body = body = bookmarklet.create("div", {"id":"bml-body"});

  anchor.appendChild(head);
  anchor.appendChild(body);
  document.body.appendChild(anchor);

  if(typeof callback === "function") callback();
};

bookmarklet.init = function(){
  bookmarklet.buildAnchor(function(){
    bookmarklet.loadScript( bookmarklet.scripts[0],
      function() {
        console.log('bml-jquery-loaded');
        bookmarklet.app((bookmarklet.jQuery = w.jQuery).noConflict(1));
      });
  });
  window.bookmarklet = bookmarklet;
};

bookmarklet.toggle = function(){
  console.log('bml-toggle');
};

bookmarklet.app = function($){
  bookmarklet.loadScript(bookmarklet.scripts[1]);
};

  if(!window.bookmarklet) bookmarklet.init();
  else bookmarklet.toggle();
})(window, document);