const debug = require('debug')('datautil');
const genDebug = require('debug');
const fs = require('fs');
const mkdirp = require('mkdirp');
/* const stream = require('stream'); */
const path = require('path');
const config = require('../config/config.json');
const models = require('../models/index');
const mailer = require('nodemailer');
const he = require('he');

//
//  Create a unique slug according to existing slugs.
//  If exist, increment with the total of results
//
exports.createSlug = function(str, model, scopes, getClean = false, tempModels = null) {  
  return new Promise(function(resolve){

    let modelObj = tempModels ? tempModels : models;

    const Op = modelObj.Sequelize.Op; 
    
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    if(getClean){
      resolve(str);
    }else{
      //
      //  Create date for unique
      //
      model.scope(scopes || null).findOne({
        attributes: [[modelObj.sequelize.fn('COUNT', modelObj.sequelize.col('slug')), 'total_equal']],
        where:{
          slug:{
            [Op.like]: "%"+str+"%"
          }
        },
        paranoid: false
      })
      .then(function(result){
        if (result.dataValues.total_equal==0){
          resolve(str);
        }else{
          str += "-"+parseInt(result.dataValues.total_equal);
          resolve(str);
        }      
      });
    }
    
  });
}



//
//  Convert array parcels to lowercase
//
exports.arrayToLowercase = function(array){
  for (var i = 0; i < array.length; i++) {
      array[i] = array[i].toString().toLowerCase(); 
  }

  return array;
}

//
//  Save file to a folder
//
exports.saveFile = function(req, res, folder, blob, name, ext){
  const targetFolder = config.files_path+folder;
  const targetFile = path.join(__dirname, "../../"+targetFolder+"/"+name+"."+ext);

  // Create folder
  exports.createFolder(targetFolder, function(err){
    if (!err){
       debug('=== Creating folder and file ===');
       writeBlob(targetFile, blob);
     }else{
       debug('=== Error creating folder: ', err ,' ===');
      return res.send(err);
     }
  });

  // Write blob to system
  /*var buf = new Buffer(blob, 'base64'); // decode
  fs.writeFile(targetFile, blob, function(err) {
    if(err) {
      return res.send(err);
    }
  });*/
 
}

function writeBlob(targetFile, blob){
  var wstream = fs.createWriteStream(targetFile);
  wstream.write(blob, 'base64');

  wstream.on('error', function (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  });

  wstream.end();
}

//
//  Create folder inside path
//
exports.createFolder = function(folderPath,  cb){
  if (!fs.exists(folderPath)) {
    mkdirp(folderPath).then(made =>{
        cb();
    })
    .catch(err => {
        cb({message: "Não foi possível criar a pasta"});
    })
  }  
}

//
//  Remove files inside directory recursevily
//
exports.rmDir = function(slug) {
  const targetFolder = config.files_path+slug;
  const dirPath = path.join(__dirname, "../../"+targetFolder);
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
    }
  fs.rmdirSync(dirPath);
};

//
//  Remove file in given path
//
exports.rmFile = function(path, fileName){
  var targetFolder = config.files_path+path;

  // Add forward slash if not provided
  var lastChar = targetFolder.substr(-1);
  if (lastChar!== '/'){
    targetFolder += "/";
  }

  // If file exists, delete it
  fs.exists(targetFolder+fileName, function(exists) {
    if(exists) {
      debug('=== File exists. Deleting now ... ===');
      fs.unlink(targetFolder+fileName);
    } else {
      debug('=== File not found, so not deleting. ===');
    }
  });
}


//
//  Handle order
//
exports.extractOrder = function(order, models){
  var finalOrder = ['created_at', 'DESC'];

  //
  //  Front-end options
  //
  const ordersPossible = [
    'recent',
    'rating',
    'alfa',
    'name'
  ];

  const dirsPossible = [
    'asc',
    'desc'
  ];

  //
  //  Database use
  //
  const orders = [
    'created_at',
    'rating',
    'title',
    'name'
  ];

  const dirs = [
    'asc',
    'desc'
  ];



  if (order){
    // Get matches
    const matchOrder = getMatchingWords(ordersPossible, order);
    const matchDir = getMatchingWords(dirsPossible, order);

    // Get index of those matches with the several options
    const indexOrder = ordersPossible.indexOf(matchOrder[0]);
    const indexDir = dirsPossible.indexOf(matchDir[0]);

    if (indexOrder>=0){

      // IF IS RATING, GET BY AVERAGE
      if (indexOrder==1){
        finalOrder[0] = models.sequelize.literal('ratingAvg');
      }else{
        finalOrder[0] = orders[indexOrder];
      }      
    }

    if (indexDir>=0){
      finalOrder[finalOrder.length-1] = dirs[indexDir];
    }
  }
 
  return finalOrder;
}

//
//  Checked matching words between two arrays of strings
//
function getMatchingWords(words, s) {
    var matches = [],
        regex = new RegExp("(^|[^a-zA-Z0-9])(" + words.join("|") + ")([^a-zA-Z0-9]|$)", "g");

    s.replace(regex, function(match, $1, $2, $3) {
        matches.push($2);
    });

    return matches;
}

//
//  Check if object is null
//
exports.isEmpty = function(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true && JSON.stringify(obj) === JSON.stringify({});
}

//
//  Iterate over a list of elements async
//
exports.waterfallOver = function(list, iterator, callback){
   var nextItemIndex = 0;  //keep track of the index of the next item to be processed
    
    function report() {
    
        nextItemIndex++;
        
        // if nextItemIndex equals the number of items in list, then we're done
        if(nextItemIndex === list.length)
            callback();
        else
            // otherwise, call the iterator on the next item
            iterator(list[nextItemIndex], report);
    }
    
    // instead of starting all the iterations, we only start the 1st one
    iterator(list[0], report);
}

//
//  Send emails
//
exports.sendEmail = function(info, cb){
    let env = process.env.NODE_ENV || 'development';

    var mailerData = config[env].mailer;

    debug('Mailer data:', mailerData);

    var transporter = null;

    if(env==='production'){
        transporter = mailer.createTransport({
            host: mailerData.host,
            port: mailerData.port,
            pool: mailerData.pool,
            secure: mailerData.secure,
            auth: {
                user: mailerData.auth.user,
                pass:  mailerData.auth.pass
            }
        });

        /*transporter = mailer.createTransport({
            host: mailerData.host,
            port: mailerData.port,
            tls: {
            rejectUnauthorized: false
            }
        });*/
        
        

        // verify connection configuration
        transporter.verify(function(error) {
            if (error) {
                debug("Mailer error:",error);
                cb(error);
            } else {
                debug("Mailer working");

                transporter.sendMail(info, function(err, success) {
                if (err) {
                    debug("Email error", err);
                    cb(err);
                }else{
                    debug("Email sent", success);
                    cb();
                }
                });
            }
        });
    }
}

//
//  Randomize string
//
exports.randomstr = function(len = 4){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

//
//  Reduce column names
//
exports.prefix = (table, columns) => columns.reduce((previous, column) => {
  previous.push(table + '.' + column + ' AS ' + table + '_' + column);
  return previous;
}, []);

//
//  Debug
//
exports.debug = (text, type="GENERIC", extend) => {
	if(process.env.NODE_ENV == "development" || process.env.MUST_DEBUG === "true"){
    
    var debugInstance = genDebug(type);   
    
    if(extend){      
      let debugExtended = debugInstance.extend(extend); 
      debugExtended(text);
    }else{
      debugInstance(text);
    }
	}
}

exports.debugSQL = (text) => {
  exports.debug(text, "Sequelize");
}

// Show size
exports.showFileSize = (bytes) => {
  if(bytes>=1024 && bytes < Math.pow(1024, 2)){
      return Math.trunc((bytes/1024))+"KB";
  }

  if(bytes>=Math.pow(1024, 2) && bytes < Math.pow(1024, 3)){
      return Math.trunc(bytes/Math.pow(1024, 2))+"MB";
  }

  if(bytes>=(1024*3) && bytes < Math.pow(1024, 4)){
      return Math.trunc(bytes/Math.pow(1024, 3))+"GB";
  }
}

// Compare list of elements, even with numeric
exports.compareLists = (a,b) =>{
  var alist = a.split(/(\d+)/),
      blist = b.split(/(\d+)/);
  
  alist.slice(-1) == '' ? alist.pop() : null;
  blist.slice(-1) == '' ? blist.pop() : null;

  for (var i = 0, len = alist.length; i < len;i++){
      if (alist[i] != blist[i]){
         if (alist[i].match(/\d/))
         {
            return +alist[i] - +blist[i];
         } else {
            return alist[i].localeCompare(blist[i]);
         }
      }
  }
 
  return true;
}

/**
 * Sort array of objects based on another array
 */
exports.mapOrder = (array, order, key) => {
  
  array.sort( function (a, b) {
    var A = a[key], B = b[key];
    
    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
    
  });
  
  return array;
};

//  Strip html tags, entities and linebreaks
exports.stripAllTags = (str) => {
  let finalStr = str;
  finalStr = finalStr.replace(/(<([^>]+)>)/ig,"");    
  finalStr = he.decode(finalStr);
  finalStr = finalStr.replace(/\n|\r/g, '');

  return finalStr;
}

/**
 * HANDLE DATES
 */
const addLeadingZero = (num) => {
  return ('0'+num).slice(-2);
}

exports.getToday = () => {
  var today = new Date();
  return {
    year: today.getFullYear(),
    month: addLeadingZero(today.getMonth()+1),
    day: addLeadingZero(today.getDate())
  }
}