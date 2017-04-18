var express = require('express');  //require express module
var app = express();  //create an express app
var http = require('http').Server(app);  //app starts a http server
var request = require('request');

var data="Waiting for data, please refresh the page";

function parseData(){
  //parsing solar data
  //created by Kyle J https://github.com/kyle1james/solar_server
  var date = new Date();
  var yesterday = new Date(new Date().setDate(new Date().getDate()-1));

  var dataArray = [];

  const options = {
      url: 'http://www.lmsal.com/hek/her?cosec=2&cmd=search&type=column&event_type=fl,ar,cr,bu,ee&event_starttime='+yesterday.toISOString()+'&event_endtime='+date.toISOString()+'&event_coordsys=helioprojective&x1=-1200&x2=1200&y1=-1200&y2=1200',
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8',
      }
  };

  request(options, function(err, res, body) {
      let json = JSON.parse(body);

      for(var i = 0; i < json.result.length; i++){
        if(json.result[i].intensmean){ //some of the results are null, then we ignore
          //console.log(json.result[i].intensmean); //log mean of intens value
          dataArray.push(json.result[i].intensmean);
        }
      }
      console.log(dataArray);
      data = dataArray;
  });

}

setInterval(parseData,10000);//parse data every 10 seconds, for testing


//express.js part
app.use(express.static('public'));  //app serves static files inside public folder

app.get('/api', function (req, res) {
  // res.send(data);
  res.send(data);

})


http.listen(8080, function() {
  console.log('listening on *:8080');  //server listen on port 8080 for connections
});
