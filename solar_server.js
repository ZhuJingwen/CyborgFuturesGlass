//require modules
var express = require('express');  
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


//set up date for 24 hour search
var date = new Date();
var yesterday = new Date(new Date().setDate(new Date().getDate()-1));

// request set up
const request = require('request');

// app set up
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// set up socket and call api
io.on('connection', function(socket){
  const options = {  
    url: 'http://www.lmsal.com/hek/her?cosec=2&cmd=search&type=column&event_type=fl,fe,er,fi,cw,lp,ss,cj,sp,pt,ar,cr,bu,ee&event_starttime='+yesterday.toISOString()+'&event_endtime='+date.toISOString()+'&event_coordsys=helioprojective&x1=-1200&x2=1200&y1=-1200&y2=1200',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
    }
};
    
//parse data
socket.emit(request(options, function(err, res, body) {  
    let json = JSON.parse(body);
    console.log(json);
}));




});
// heroku sets the port: don't hard set: use process.env.PORT
http.listen(process.env.PORT || 3000, function(){
  console.log('being awesome on *:3000');
});


//call to rails app: not in json

//var request = require('request');
//request('https://blue-bean.herokuapp.com/index', function (error, response, body) {
//  console.log('error:', error); // Print the error if one occurred 
//  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
//  console.log('body:', body);  
//});
