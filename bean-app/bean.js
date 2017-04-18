/*
  bean-app

  This example uses the first (of five available) Scratch characteristic to write data to the bean.
  You need to upload the bean_LED example (same github folder) to your Bean.
  Read more about ScratchData: https://punchthrough.com/bean/the-arduino-reference/setscratchdata/

  created 30 Mar 2015
  by Maria Paula Saba based on Jacob Rosenthal examples

*/

/*jslint node: true */
"use strict";

//require node module ble-bean (based on noble)
var Bean = require('ble-bean');

var beanUUID = "2412adbffa294bab8b1e6ad8d850658e"; //
var interval;
var connectedBean;

//parse data from api
var request = require('request');
var data= 0; //set init data value to 0
var number = 0;
var counter = 0; //set counter to loop through response data

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
			dataArray = mapArray(dataArray,55,200); //map data value to the range of LED
      console.log(dataArray);
      data = dataArray;
			number = dataArray.length;
  });

}

setInterval(parseData,10000);//parse data every 10 seconds, for testing



//here we discover any bean and automatically connects.
Bean.discover(function(bean){
	console.log(bean.uuid);
	connectedBean = bean;
    console.log("bean discovered");
    process.on('SIGINT', exitHandler.bind(this));


  //We can set a conditional to keep connected
  if(bean.uuid == beanUUID){
	bean.connectAndSetup(function(){
		//save the data you want to send in a buffer

		var writeData = function(){
      //var bufferData = new Buffer([getRandomInt(0,255),getRandomInt(0,255),getRandomInt(0,255)]);

			var bufferData = new Buffer([data[counter],150,0])
			bean.writeOne(bufferData, function(){
					 console.log("data written "+data[counter]);
					 counter++;
					 if(counter == number){
						 counter = 0;
					 }
			});
		}

		//this interval will run writeData function every second
		interval = setInterval(writeData,1000);
		console.log("bean connected and setup");

  	});

	bean.on("disconnect", function(){
		console.log("quitting the program");
		process.exit();
	});
  }
  else{
	console.log("not my bean");
  }
});

process.stdin.resume();//so the program will not close instantly
var triedToExit = false;

//turns off led before disconnecting
var exitHandler = function exitHandler() {
  var self = this;
  if (connectedBean && !triedToExit) {
    triedToExit = true;
    console.log('Turning off led...');
    clearInterval(interval);
    connectedBean.setColor(new Buffer([0x0,0x0,0x0]), function(){});
    console.log('Disconnecting from Device...');
    setTimeout(connectedBean.disconnect.bind(connectedBean, function(){}), 2000);
  }
  else {
    process.exit();
  }
};

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function mapArray(thisArray, max, min){
  var originalMax = thisArray[0];
  var originalMin = thisArray[0];
  for (var i = 0; i < thisArray.length; i++) {
    if (thisArray[i] > originalMax) {
      originalMax = thisArray[i];
    }
    if (thisArray[i] < originalMin) {
      originalMin = thisArray[i];
    }
  }
  var ratio = (max-min) / (originalMax - originalMin);
  for (var i = 0; i < thisArray.length; i++) {
    thisArray[i]= (thisArray[i]-originalMin)*ratio+min;
    thisArray[i]=Math.round(thisArray[i]);
  }

  return thisArray;
}
