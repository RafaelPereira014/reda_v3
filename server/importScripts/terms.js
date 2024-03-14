const models = require('../models/index');
const dataUtil = require('../utils/dataManipulation');

const Op = models.Sequelize.Op;

const csv = require("csvtojson");
const path = require('path');

async function addToDb(file) {
    let result = await csv({
        noheader:true,
        delimiter: ';',
        output: 'csv'
    })
    .fromFile(path.join(__dirname, 'files')+'/'+file+'.csv');

    if(result && result.length>0){
        let years = {};
        let macros = {};
        let subjects = {};
        let domains = {};

        // [0] => year
        // [1] => Macro
        // [2] => subject
        // [3] => area
        // Get subject and domains tax
        let macroTax = await models.Taxonomy.findOne({
          where: {
              slug: {
                  [Op.eq]: 'macro_areas_resources'
              }
          }
        });
        let yearTax = await models.Taxonomy.findOne({
          where: {
              slug: {
                  [Op.eq]: 'anos_resources'
              }
          }
        });
        let subTax = await models.Taxonomy.findOne({
          where: {
              slug: {
                  [Op.eq]: 'areas_resources'
              }
          }
        });
        let domTax = await models.Taxonomy.findOne({
            where: {
                slug: {
                    [Op.eq]: 'dominios_resources'
                }
            }
        }); 

        for(var line of result){
            let year = line[0],
            macro = line[1],
            subject = line[2],
            domain = line[3];

            //  Create a relationship
            const relationship = await models.TermRelationship.create();

            //
            //  Add year
            //
            let macroObj = await checkData(macros, macro, macroTax, 1, relationship);

            //
            //  Add year
            //
            let yearObj = await checkData(years, year, yearTax, 2, relationship);

            //
            //  Add Subject
            //
            let subjectObj = await checkData(subjects, subject, subTax, 3, relationship);           

            //
            //  Add domain
            //
            let domainObj = await checkData(domains, domain, domTax, 4, relationship);            
            
            // Save objects
            subjects[subjectObj.id] = subjectObj;
            domains[domainObj.id] =  domainObj;
            years[yearObj.id] = yearObj;
            macros[macroObj.id] = macroObj;           

            /* console.log("Subjects", subjects);
            console.log("Domains", domains);
            console.log("Years", years);
            console.log("=================="); */
        }
    }
    process.exit();
}

async function checkData(data, givenData, tax, level, relationship){
    // Check if value already exists in array.
    // This way, we avoid making queries in every iteration
    var foundFilteredObj = Object.keys(data).filter(function(key) {
        return data[key].title === givenData;
    });

    // If none, find or create a new one
    if(!foundFilteredObj || foundFilteredObj.length==0){
        foundFilteredObj = await models.Term.findOrCreate({
          paranoid: false,
          where: {
              title:{
                  [Op.like]: givenData
              },
              taxonomy_id: tax.id
          },
          defaults: {
              title: givenData,
              slug: await dataUtil.createSlug(givenData, models.Term, null, false, models)
          }
        });

    // If already exists in given array, just return it
    }else{
        foundFilteredObj = [
            data[foundFilteredObj]
        ];
    }

    // Associate with relationship
    if(foundFilteredObj){
      relationship.addTerms(foundFilteredObj[0].id, {
        through: {
          level: level
        }
      });
    }

    return foundFilteredObj[0];
}

exports.addToDb = addToDb;