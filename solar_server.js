var date = new Date();
var yesterday = new Date(new Date().setDate(new Date().getDate()-1));
const request = require('request');


const options = {  
    url: 'http://www.lmsal.com/hek/her?cosec=2&cmd=search&type=column&event_type=fl,ar,cr,bu,ee&event_starttime='+yesterday.toISOString()+'&event_endtime='+date.toISOString()+'&temporalmode=strict&event_coordsys=helioprojective&x1=-1200&x2=1200&y1=-1200&y2=1200',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
    }
};

request(options, function(err, res, body) {  
    let json = JSON.parse(body);
    console.log(json);
});


//call to rails app: not in json

//var request = require('request');
//request('https://blue-bean.herokuapp.com/index', function (error, response, body) {
//  console.log('error:', error); // Print the error if one occurred 
//  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
//  console.log('body:', body); // Print the HTML for the Google homepage. 
//});
