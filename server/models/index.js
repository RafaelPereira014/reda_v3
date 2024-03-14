"use strict";
const { debugSQL } = require('../utils/dataManipulation');
var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

var secondDbConfig = require(path.join(__dirname, '..', 'config', 'second_db.json'))[env];

if(env==='development' || env==='staging'){
  config = Object.assign({}, config, {
    logging: function(str){
      debugSQL && debugSQL(str);
    }
  });

  secondDbConfig = Object.assign({}, secondDbConfig, {
    logging: function(str){
      debugSQL && debugSQL(str);
    }
  });
}


var sequelize = new Sequelize(config.database, config.username, config.password, config);
var secondSq = new Sequelize(secondDbConfig.database, secondDbConfig.username, secondDbConfig.password, secondDbConfig);
var db        = {};

fs
	// Get files from current dir
  .readdirSync(__dirname)

  // Filter to JS only
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })

  // Import models from files
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// For each model, execute the associate function
Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

// Save sequelize object of current connection
db.sequelize = sequelize;

// Save Sequelize global object
db.Sequelize = Sequelize;

db.secondSq = secondSq;

module.exports = db;