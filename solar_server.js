var request = require('request');
// set up date for 24 hour search
var date = new Date();
var yesterday = new Date(new Date().setDate(new Date().getDate()-1));

// api call
request('http://www.lmsal.com/hek/her?cosec=2&cmd=search&type=column&event_type=fl,ar,cr,bu,ee&event_starttime='+yesterday.toISOString()+'&event_endtime='+date.toISOString()+'&temporalmode=strict&event_coordsys=helioprojective&x1=-1200&x2=1200&y1=-1200&y2=1200', function (error, response, body) {
  console.log('body:', body); 
});


//call to rails app: not in json

//var request = require('request');
//request('https://blue-bean.herokuapp.com/index', function (error, response, body) {
//  console.log('error:', error); // Print the error if one occurred 
//  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
//  console.log('body:', body); // Print the HTML for the Google homepage. 
//});
