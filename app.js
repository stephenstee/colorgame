var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose"); 
var bodyParser = require("body-parser");
var User = require("./models/user");

// mongoose.connect("mongodb://localhost/sarfaraaz",{useNewUrkParser:true, useUnifiedTopology:true});
mongoose.connect("mongodb+srv://sarfaraaz:sarfu@cluster0-ucije.mongodb.net/<dbname>?retryWrites=true&w=majority",{useNewUrkParser:true, useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
	secret: "i am the legend",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
})

app.get("/",function(req,res){
	res.redirect("/login");
})
app.get("/home",isLoggedIn,function(req,res){
	res.render("welcome");
})
app.get("/home/game",isLoggedIn,function(req,res){
	res.render("home");
})

///////////////////////////////////////////////////////////////////////////////////////////

app.get("/register",function(req,res){
	res.render("register");
})

app.post("/register",function(req,res){
	User.register(new User({username: req.body.username}), req.body.password, function(err,user){
		if(err){
			console.log("error");
			return res.render("register");
		}else{
		passport.authenticate("local")(req,res, function(){
			
			res.redirect("/home");
	})
		}
})
})

app.get("/login",function(req,res){

	res.render("login");
})

app.post("/login",passport.authenticate("local",{
	successRedirect: "/home",
	failureRedirect: "/login"
	
}),function(req,res){	
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
})

function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
			// console.log(req.user);
		return next();
	}
	res.redirect("/login");
}


app.listen(3000,function(){
	console.log("server starts");
})