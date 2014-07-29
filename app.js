var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var User = require('./models/user.js');

mongoose.connect('mongodb://localhost/wingzingly');

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/signup', function(req, res){

	var user = new User({
		email: req.body.email
	});
	user.save();
	res.render('editUser', {
		user: user
	});
});


app.post('/edited', function(req, res){

	User.findOneAndUpdate({email: req.body.oldEmail}, {$set: {email: req.body.email}}, function(err, user){
		user.save();
	});
	res.redirect('/viewusers')
});

app.get('/viewusers', function(req, res){
	User.find({}, function(err, users){
		if(err){
			res.send(500, 'Error acessing users collection.');
		}else{
			res.render('viewUsers', {
				users: users
			});
		}
	});
});

var server = app.listen(3634, function() {
	console.log('Express server listening on port ' + server.address().port);
});
