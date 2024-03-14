const models = require('../models/index');

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
        let subjects = {};
        let domains = {};

        // [0] => year
        // [1] => subject
        // [2] => domain
        for(var line of result){
            let year = line[0],
            subject = line[1],
            domain = line[2]

            //
            //  Add Subject
            //
            let subjectObj = await checkData(subjects, subject, 'Subject');           

            //
            //  Add domain
            //
            let domainObj = await checkData(domains, domain, 'Domain', subjectObj);

            //
            //  Add year
            //
            let yearObj = await checkData(years, year, 'Year');
            
            // Save objects
            subjects[subjectObj.id] = subjectObj;
            domains[domainObj.id] =  domainObj;
            years[yearObj.id] = yearObj;

            /* console.log("Subjects", subjects);
            console.log("Domains", domains);
            console.log("Years", years);
            console.log("=================="); */
            
            /* if(i==0)
                break;
            i++; */
        }
    }

    process.exit();
}

async function checkData(data, givenData, type, relation){
    // Check if value already exists in array.
    // This way, we avoid making queries in every iteration
    var foundFilteredObj = Object.keys(data).filter(function(key) {
        return data[key].title === givenData;
    });

    // If none, find or create a new one
    if(!foundFilteredObj || foundFilteredObj.length==0){
        foundFilteredObj = await models[type].findOrCreate({
            where: {
                title:{
                    [Op.like]: givenData
                }                
            },
            defaults: {
                title: givenData
            }
        });

        

    // If already exists in given array, just return it
    }else{
        foundFilteredObj = [
            data[foundFilteredObj]
        ];
    }

    // If has relationship to associate with
    if(foundFilteredObj && type=='Domain' && relation){
        // Check if already exists
        let relationshipResult = await foundFilteredObj[0].getSubjects({
            where: {
                id: relation.id
            }
        });

        /* if(relation.title=='Português'){
            console.log("Domain", foundFilteredObj[0].title);
            console.log("Subject", relation.title);
            console.log("==================");
        } */

        // If not, add relationship
        if(!relationshipResult || relationshipResult.length==0){
            foundFilteredObj[0].addSubjects([relation.id]);
        }
    }

    
    return foundFilteredObj[0];
}

exports.addToDb = addToDb;