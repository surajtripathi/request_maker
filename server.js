var express = require('express');
var querystring = require('querystring');
var util = require('util');
var fs = require('fs');
var path = require('path');
var url = require('url');
var http = require('http');
var https = require('https');
var makeRequest_http_or_https = http;

var app = express();

app.use(express.static('rmResources'));

app.get('/', function(req, res){
	var filePath = __dirname + '/rmResources/' + 'debug.html';
	var mimeType = 'text/html';
	fs.exists(filePath, function(exists){
		if(exists) {
			//console.log("hello")
			getFile(filePath, res, mimeType);
		} else {
			res.writeHead(500);
			res.end();
		}
	}) 
});
app.post('/debug', function(req, res){
	var externalUrl = url.parse(decodeURIComponent(req.query.reqUrl));
	var data = req.query.reqData;
	if(!data) {
  		data = '{}';
  	}
	var reqHeaders = JSON.parse(req.query.reqHeaders);
	console.log("requestHeader UI"+reqHeaders);
	var headers = {
			'content-type': 'application/x-www-form-urlencoded',
			'content-length': Buffer.byteLength(querystring.stringify(JSON.parse(data)))
		};
	var keys;
	for(var i = 0; i<(keys = Object.keys(reqHeaders)).length; i++){
		if(keys[i] && reqHeaders[keys[i]]) {
			headers[keys[i].toLowerCase()] = reqHeaders[keys[i]];
		}
	}
  	console.log("requestHeader SERVER"+ JSON.stringify(headers));
  	if(externalUrl.protocol == "https:")
  		makeRequest_http_or_https = https;
  	else
  		makeRequest_http_or_https = http;
  	console.log("protocol : " + externalUrl.protocol);
	var options = {
	  host: externalUrl.hostname,
	  port: externalUrl.port,
	  path: externalUrl.path,
	  method: req.query.reqMethod,
	  headers: headers
	};
	writeDataToLogFile("{ url : " + JSON.stringify(externalUrl.href) +", method : " + JSON.stringify(req.query.reqMethod) + ", headers" + JSON.stringify(headers)+", RequestData : "+data);
	console.log("path name : " + externalUrl.path);
	if(options['host']){
		getDataFromUrl(options, data, res);
	} else {
		var filePath = __dirname + '/' + 'debug/debug.html';
		var mimeType = 'text/html';
		fs.exists(filePath, function(exists){
			if(exists) {
				console.log("hello")
				getFile(filePath, res, mimeType);
			} else {
				res.writeHead(404);
				res.end("empty url");
			}
		});
	}
});

function getFile(path, response, mimeType) {
	fs.readFile(path, function(error, content) {
		if(!error) {
			response.writeHead(200, { 'Content-Type' : mimeType, 'Content-Length' : content.length });
			response.end(content);
		} else {
			response.writeHead(404);
			response.end();
		}
	});
}
function writeDataToLogFile(pData){
	fs.appendFile(__dirname+'/herethereyougohere/log.txt', pData, function (err) {
		console.log("failed to write to log file");
	});
}
app.get("/herethereyougohere",function(req, res){
	getFile(__dirname+'/herethereyougohere/log.txt', res, 'text/html');
});
function getDataFromUrl(options, reqData, parentRes){
	var req = makeRequest_http_or_https.request(options, function(res) {
	  res.setEncoding('utf8');
	  parentRes.writeHead(res.statusCode , res.headers);
	  res.on('data', function (chunk) {
	    parentRes.write(chunk);
	  });
	  res.on('end',function(){
	  	parentRes.end();
	  });
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	req.write(querystring.stringify(JSON.parse(reqData)));
	req.end();
}


var server = app.listen(process.env.PORT || 8888, function(){
	console.log("running...");
});