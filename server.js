
// require express framework and additional modules
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  User = require('./models/user'),
  session = require('express-session');


// middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost/simple-login');
// middleware (new addition)
// set session options
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minute cookie lifespan (in milliseconds)
}));

// signup route with placeholder response
app.get('/signup', function (req, res) {
  res.render('signup');
  console.log('it works!');
});

// login route with placeholder response
app.get('/login', function (req, res) {
  res.render('login');
  console.log('it works');
});



app.post('/sessions', function (req, res) {
   console.log(req.body, "used to login");
   User.authenticate(req.body.email, req.body.password, function (err, user) {
   	req.session.userId = user._id;
    res.redirect('profile');
    console.log("login successfull")
   });
 });

app.get('/profile', function (req, res) {
  	User.findOne({_id: req.session.userId}, function (err, currentUser) {
    res.render('profile.ejs', {user: currentUser})
  });
});

app.get('/logout', function (req, res) {
  // remove the session user id
  req.session.userId = null;
  // redirect to login (for now)
  res.redirect('/login');
});

// Sign up route - creates a new user with a secure password
app.post('/signup', function (req, res) {
	console.log('request body: ', req.body);
  // use the email and password to authenticate here
  User.createSecure(req.body.email, req.body.password, function (err, user) {
  	req.session.userId = user._id;
  	res.redirect('profile');
  });

});

// listen on port 3000
  app.set('port', process.env.PORT || 3001)

  app.listen(app.get('port'), () => {
    console.log(`✅ PORT: ${app.get('port')} 🌟`)
  })

