var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
app.use(express.static('views/assets'));

var zendesk = require('node-zendesk');

var client = zendesk.createClient({
  username:  'janiano@prosperworks.com',
  token:     'GTaiKLP52NFr0usK53Mo8whLM8cWblBcRFiyz4cm',
  remoteUri: 'https://d3v-prosperworksdev.zendesk.com/api/v2'
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

//REMOVE: hack for PW staging environment
router.get("/sidebar",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/2",function(req,res){
  res.sendFile(path + "index2.html");
});

router.get("/zeninfo",function(req,res){
	var custEmail = req.query.email;
	var query = "type:user email:" + custEmail;
	client.search.query(query, function (err, req, result) {
		console.log("debuginquery");
		var userId;
		if (err) {
			console.log("debugerror");
			console.log(err);
			res.send(err);
			return;
		}
		
		if(result[0]) {
			console.log("debugresult");
			console.log(result);

			userId = result[0].id;

			var ticks = client.tickets.listByUserRequested(userId, function (err, statusList, body, responseList, resultList) {
			if (err) {
				console.log(err);
				return;
			}
			res.send(body);
		});

		} else {
			res.send(result);
		}
	});	  
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
  console.log('Failed Request Made for: ' + req.baseUrl);
});

app.listen(8080,function(){
  console.log("Live at Port 8080");
});
