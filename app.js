'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//
const http = require('http');
const url = require('url');
const WebSocket = require('ws');


app.get('/socket1', function (req, res) {

    const sockTest = require('./alfa-socket-test-1');

    sockTest(app, function () {   })

    res.sendFile(path.join(__dirname, 'public', 'socket-io-1.html'));

});

app.get('/socket2', function (req, res) {

    const sockTest2 = require('./alfa-socket-test-2');

    sockTest2(app, function () {    })

    res.sendFile(path.join(__dirname, 'public', 'socket-io-2.html'));

});

app.get('/socket3/:socketid', function (req, res) {
    console.log('get ' + req.originalUrl);

    const sockTest3 = require('./alfa-socket-test-3');

    sockTest3(app, req.params.socketid, function () { });

    res.json({status:'OK'});
});
app.post('/socket3', function (req, res) {
    console.log('post '+req.originalUrl);

    var data = req.body;
    const sockTest3 = require('./alfa-socket-test-3');

    sockTest3(app, data, function () { });

    res.json({ status: 'OK' });
});



app.get('/jsonp/:timeout?/:bad?', function (req, res) {

    console.log('JSONP '+req.originalUrl);

    var data;
    if (req.params.bad) {
        data = function () { };
    } else { data = { txt: 'GET: response from server', val: 234 }}

    if (req.params.timeout) { setTimeout(function () { res.jsonp(data); console.log('responded: ' + req.originalUrl);}, req.params.timeout); }
    else { res.jsonp(data); }
    
});

app.get('/ajax/:timeout?/:bad?', function (req, res) {
    console.log('get: '+req.originalUrl);
    var data;
    if (req.params.bad) {
        data = function () { };
    } else { data = { txt: 'GET: response from server', val: 234 } }
    console.log(data);

    if (req.params.timeout) { setTimeout(function () { res.jsonp(data); console.log('responded: ' + req.originalUrl); }, req.params.timeout); }
    else { res.jsonp(data); }
});
app.post('/ajax', function (req, res) {
    console.log('post: '+req.originalUrl);
    var data = req.body;
    if (req.params.bad) {
        data = function () { };
    } 

    res.json(data);
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
