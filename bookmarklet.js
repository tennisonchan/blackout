javascript: (function(w, d, j) {

var bookmarklet = {};

bookmarklet.name = "graffita";
bookmarklet.anchor = null;
bookmarklet.jQuery = null;
/*bookmarklet.baseURL = "http://neoglory.star.is/graffita/";*/
bookmarklet.baseURL = "//127.0.0.1:8000/graffita/";
bookmarklet.baseURL = "http://127.0.0.1/graffita/";

bookmarklet.scripts = [
  { "el":"script", "attr": {"type": "text/javascript", "id": "bml-jquery", "src": bookmarklet.baseURL + "lib/jquery-1.10.2.min.js"} },
  { "el":"script", "attr": {"type": "text/javascript", "id": "bml-graffita", "src": bookmarklet.baseURL + "graffita.js"} },
  { "el":"script", "attr": {"type": "text/javascript", "id": "bml-paperjs", "src": bookmarklet.baseURL + "lib/paper.js"} },
  { "el":"link", "attr": {"type": "text/css", "rel":"stylesheet", "id": "bml-graffita-css", "href": bookmarklet.baseURL + "css/blackout.css"} },
  { "el":"script", "attr": {"type": "text/javascript", "id": "bml-dat-gui", "src": bookmarklet.baseURL + "lib/dat.gui.min.js"} },
  { "el":"script", "attr": {"type": "text/javascript", "id": "bml-dat-gui", "src": bookmarklet.baseURL + "lib/pouchdb-nightly.js"} },
  /*{ "el":"script", "attr": {"type": "text/javascript", "id": "bml-html2canvas", "src": bookmarklet.baseURL + "lib/html2canvas.js"} },*/
  { "el":"script", "attr": {"type": "text/javascript", "id": "bml-socket", "src": bookmarklet.baseURL + "lib/socket.io.min.js"} }
];


/*bookmarklet.scripts = [
  { "id": "bml-jquery", "src": "http://code.jquery.com/jquery-1.10.2.min.js" },
  { "id": "bml-graffita", "src": "http://neoglory.star.is/graffita/graffita.js" },
  { "id": "bml-paperjs", "src": "http://neoglory.star.is/graffita/lib/paper.js" },
  { "id": "bml-graffita-css", "src": "http://neoglory.star.is/graffita/css/blackout.css" },
  { "id": "bml-socket", "src": "http://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.6/socket.io.min.js" }
];

function map(src, id){
  var src_arr = src.split('.');
  var filetype = src_arr[src_arr.length - 1].toLowerCase();
  var mapList = {
    "js": { "el": "script", "attr": { "type":"text/javascript", "src": src }},
    "css": { "el": "link", "attr": { "type": "text/css", "rel":"stylesheet", "href": src }}
  };
  var script = map[filetype];
  if(id) script.attr.id = id;

  return script;
}

function deps() {
  var scripts = bookmarklet.scripts;
  var waitingList = [];
  var shell = function(onloadFunc){
    return function(){ onloadFunc(); };
  };

  for(var j=0, len = scripts.length;j < l;j++){
    var s = scripts[i];
    if(!s.dep) bookmarklet.loadScript(map(s.src, s.id));
    else waitingList.push(s);
  }

  for(var i=1, l = waitingList.length;i < l;i++){
    var id = waitingList[i].id;
    var next = $(waitingList).filter(function(index){
      return id !== waitingList[index].dep;
    })[0];
    bookmarklet.loadScript(map(next.src, next.id, next.onload));
  }
}*/

bookmarklet.loadScript = function(opt, onload) {
  console.log('loadScript');
  var state, attr, s = bookmarklet.create(opt.el, opt.attr);

  if(typeof onload === "function") s.onload = s.onreadystatechange = function() {
    if (!(state = this.readyState) || state == "loaded" || state == "complete") onload(s);
  };

  bookmarklet.head.appendChild(s);
};

bookmarklet.create = function(el, opt) {
  var attr, item = document.createElement(el);
  if(opt) for(attr in opt) item[attr] = opt[attr];
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
  /*for(var i=1, l = bookmarklet.scripts.length;i < l;i++){*/
    bookmarklet.loadScript(bookmarklet.scripts[2], function(){
      bookmarklet.loadScript(bookmarklet.scripts[5], function(){
        bookmarklet.loadScript(bookmarklet.scripts[4], function(){
          bookmarklet.loadScript(bookmarklet.scripts[1]);
        });
      });
    });
    bookmarklet.loadScript(bookmarklet.scripts[3]);
  /*}*/
};

  if(!window.bookmarklet) bookmarklet.init();
  else window.bookmarklet.toggle();
})(window, document);