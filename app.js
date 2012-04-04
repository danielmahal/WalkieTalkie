var express = require('express');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
    app.register('.html', {
        compile: function(str, options){
            return function(locals){ return str; };
        }
    });

    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
    res.render('index.html', { layout: false });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

io.sockets.on('connection', function (socket) {
    socket.on('position', function(data) {
        socket.emit('area', 'copenhagen');
    });

    socket.on('msg', function(data) {
        socket.broadcast.emit('msg', data);
        socket.emit('msg', data);
    });

    // socket.emit('news', { hello: 'world' });
    // socket.on('my other event', function (data) {
    //     console.log(data);
    // });
});