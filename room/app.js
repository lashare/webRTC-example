// Module dependencies.
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , socket = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/chat', routes.chat);
app.get('/demo', routes.demo);

server = http.createServer(app);
io = socket.listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


io.sockets.on('connection', function (socket){

  function log(){
    var array = [">>> Message from server: "];
    for (var i = 0; i < arguments.length; i++) {
      array.push(arguments[i]);
    }
    socket.emit('log', array);
  }

  socket.on('message', function (message) {
    log('Got message: ', message);
    socket.broadcast.emit('message', message); // should be room only
  });

  socket.on('create or join', function (room) {
    var numClients = io.sockets.clients(room).length;

    log('Room ' + room + ' has ' + numClients + ' client(s)');
    log('Request to create or join room', room);

    if (numClients == 0){
      socket.join(room);
      socket.emit('created', room);
    //} else if (numClients == 1) {
    //  io.sockets.in(room).emit('join', room);
    //  socket.join(room);
    //  socket.emit('joined', room);
    } else { // max two clients
      //socket.emit('full', room);
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room);
    }
    socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
    socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);
  });
});
