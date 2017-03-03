/*  partial server code to test alfa-ajax.html
*/

var express = require('express');
var app = express();




// this code works with alfa-ajax.html

app.get('/jsonp/:timeout?/:bad?', function (req, res) {

    console.log('JSONP '+req.originalUrl);

    var data;
    if (req.params.bad) {
        data = function () { };
    } else { data = { txt: 'GET: response from server', val: 234 }}

    if (req.params.timeout && req.params.timeout>0) { setTimeout(function () { res.jsonp(data); console.log('responded: ' + req.originalUrl);}, req.params.timeout); }
    else { res.jsonp(data); }
    
});

app.get('/ajax/:timeout?/:bad?', function (req, res) {
    console.log('get: '+req.originalUrl);
    var data;
    if (req.params.bad) {
        data = function () { };
    } else { data = { txt: 'GET: response from server', val: 234 } }
    console.log(data);

    if (req.params.timeout && req.params.timeout > 0) { setTimeout(function () { res.jsonp(data); console.log('responded: ' + req.originalUrl); }, req.params.timeout); }
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





module.exports = app;
