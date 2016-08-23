var http = require('http');
var express = require('express');
var app = express();
var controllers = require('./controllers');
var mysql = require('mysql');
var feed = require('feed-read');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'blockchain'
})

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/*connection.query('SELECT * FROM articles WHERE category = "platforms"', function (err, rows, fields) {
	if (err) throw err;

	console.log(rows);
});
*/
var port = 1337;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(__dirname + "/public"));

controllers.init(app);


var server = http.createServer(app);

server.listen(port);