var path = require('path');
var express = require('express');
var data = require('./data');

var app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function() {
    console.log('listening on port ', server.address().port);
});

app.get('/data', function(req, res) {
    res.send(data);
});