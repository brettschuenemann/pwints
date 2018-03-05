var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
app.use(express.static('views/assets'));
/*
var Zendesk = require('zendesk-node-api');

var zendesk = new Zendesk({
  url: 'https://billmcpherson.zendesk.com',
  email: 'billmcpherson87@gmail.com', 
  token: 'PnqQEsITIETSXoN3xGcNruabkS5keKx5rqX2YhAn'
  });

zendesk.objects.list(
  // (Optional) URL params available for each object.
  // https://developer.zendesk.com/rest_api/docs/core/
).then(function(result){
    console.log(result);
});
*/

var zendesk = require('node-zendesk');

var client = zendesk.createClient({
  username:  'billmcpherson87@gmail.com',
  token:     'PnqQEsITIETSXoN3xGcNruabkS5keKx5rqX2YhAn',
  remoteUri: 'https://billmcpherson.zendesk.com/api/v2'
});


router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/assets",function(req,res){
  res.sendFile(path + "/assets");
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});

router.get("/zeninfo",function(req,res){
	
	var custEmail = req.query.email;
	var query = "type:user email:" + custEmail;

	client.search.query(query, function (err, req, result) {
		if (err) {
			console.log(err);
			return;
		}

		var userId;
		if(result[0]) {
			userId = result[0].id;
		}

		var ticks = client.tickets.listByUserRequested(userId, function (err, statusList, body, responseList, resultList) {
			if (err) {
				console.log(err);
				return;
			}
			res.send(body);
		});
	});	  
});

router.get("/getuser",function(req,res){
	var userId = req.query.id;
	var query = "type:user id:" + userId;

	client.search.query(query, function (err, req, result) {
	if (err) {
		console.log(err);
		return;
	}
	
	console.log('USERID:    ' + JSON.stringify(result, null, 2, true));
	
	});	  
});


app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(8080,function(){
  console.log("Live at Port 8080");
});
