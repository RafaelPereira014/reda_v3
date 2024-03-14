// Firstly we'll need to import the fs library
var fs = require('fs');
const mkdirp = require('mkdirp');

const { getToday } = require('./dataManipulation');

// next we'll want make our Logger object available
// to whatever file references it.
var Logger = exports.Logger = {};

if (!fs.exists('logs')) {
    mkdirp.sync('logs');
}

let today = getToday();

// Create 3 sets of write streams for the 3 levels of logging we wish to do
// every time we get an error we'll append to our error streams, any debug message
// to our debug stream etc...
var infoStream = fs.createWriteStream(`logs/info-${today.year}-${today.month}-${today.day}.log`, { flags: 'a'});
// Notice we set the path of our log files in the first parameter of 
// fs.createWriteStream. This could easily be pulled in from a config
// file if needed.
var errorStream = fs.createWriteStream(`logs/error-${today.year}-${today.month}-${today.day}.log`, { flags: 'a'});
// createWriteStream takes in options as a second, optional parameter
// if you wanted to set the file encoding of your output file you could
// do so by setting it like so: ('logs/debug.log' , { encoding : 'utf-8' });
var debugStream = fs.createWriteStream(`logs/debug-${today.year}-${today.month}-${today.day}.log`, { flags: 'a'});

var accessStream = fs.createWriteStream(`logs/debug-access-${today.year}-${today.month}-${today.day}.log`, { flags: 'a'});


// Finally we create 3 different functions
// each of which appends our given messages to 
// their own log files along with the current date as an
// iso string and a \n newline character
Logger.info = function(msg) {
  var message = new Date().toISOString() + " : " + msg + "\n";

  let today = getToday();

  if(!fs.existsSync(`logs/info-${today.year}-${today.month}-${today.day}.log`)){
    infoStream = fs.createWriteStream(`logs/info-${today.year}-${today.month}-${today.day}.log`, { flags: 'a'});
  }

  infoStream.write(message);
};

Logger.debug = function(msg) {
  var message = new Date().toISOString() + " : " + msg + "\n";

  let today = getToday();

  if(!fs.existsSync(`logs/debug-${today.year}-${today.month}-${today.day}.log`)){
    debugStream = fs.createWriteStream(`logs/debug-${today.year}-${today.month}-${today.day}.log`, { flags: 'a'});
  }
  
  debugStream.write(message);
};

Logger.error = function(msg) {
  var message = new Date().toISOString() + " : " + msg + "\n";

  let today = getToday();

  if(!fs.existsSync(`logs/error-${today.year}-${today.month}-${today.day}.log`)){
    errorStream = fs.createWriteStream(`logs/error-${today.year}-${today.month}-${today.day}.log`, { flags: 'a'});
  }

  errorStream.write(message);
};

Logger.access = function(msg) {
  var message = new Date().toISOString() + " : " + msg + "\n";

  let today = getToday();

  if(!fs.existsSync(`logs/debug-access-${today.year}-${today.month}-${today.day}.log`)){
    accessStream = fs.createWriteStream(`logs/debug-access-${today.year}-${today.month}-${today.day}.log`, { flags: 'a'});
  }
  
  accessStream.write(message);
};