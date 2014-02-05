var util = require("util"),
	io = require("socket.io");


function init() {
	io = io.listen(8000);

	io.configure(function() {
		io.set("transports", ["websocket"]);

		io.set("log level", 2);
	});

	setEventHandlers();
}


var setEventHandlers = function()
{
	io.sockets.on("connection", onSocketConnect);
};

function onSocketConnect(socket) {
	util.log("server.onSocketConnect, socket.id:"+socket.id);

	socket.on("testing", onSocketTesting);
	socket.on("broadcast", onSocketBroadcast);
	socket.on("onMouseDown", onSocketMouseDown);
	socket.on("onMouseDrag", onSocketMouseDrag);
	socket.on("onMouseUp", onSocketonMouseUp);

	socket.on("disconnect", onSocketDisconnect);
}

function onSocketDisconnect() {
	util.log("server.onSocketDisconnect, socket.id:"+this.id);
}

function onSocketTesting(data) {
	util.log("socket.onSocketTesting, data: "+data);
}

function onSocketBroadcast(data) {
	util.log("socket.onSocketBroadcast, data: "+data);

	var msg = "broadcast msg from client-user:"+this.id;
	this.broadcast.emit("msg-to-client", msg);
}


function onSocketMouseDown(data){
	util.log("socket.onSocketDraw, data: "+data);
	this.broadcast.emit("onMouseDown", data);
}
function onSocketMouseDrag(data){
	util.log("socket.onSocketDraw, data: "+data);
	this.broadcast.emit("onMouseDrag", data);
}
function onSocketonMouseUp(data){
	util.log("socket.onSocketDraw, data: "+data);
	this.broadcast.emit("onMouseUp", data);
}

init();