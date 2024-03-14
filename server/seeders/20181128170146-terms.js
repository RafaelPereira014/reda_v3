'use strict';
const models = require('../models/index');
const dataUtil = require('../utils/dataManipulation');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    let valuesToInsert = [
      {
        anos_resources: '7.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Aspetos da cultura e da civilização francesas'
      },
      {
        anos_resources: '7.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Identificação pessoal'
      },
      {
        anos_resources: '7.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Caracterização'
      },
      {
        anos_resources: '7.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Higiene e saúde'
      },
      {
        anos_resources: '7.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'A família'
      },
      {
        anos_resources: '7.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'A escola'
      },
      {
        anos_resources: '7.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Os grupos (La bande)'
      },
      {
        anos_resources: '7.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Meio envolvente'
      },
      {
        anos_resources: '8.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Os jovens e hoje'
      },
      {
        anos_resources: '8.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Hábitos e costumes'
      },
      {
        anos_resources: '8.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Serviços'
      },
      {
        anos_resources: '8.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Vida económica'
      },
      {
        anos_resources: '8.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Quotidiano ambiental'
      },
      {
        anos_resources: '9.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Escolha da carreira'
      },
      {
        anos_resources: '9.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Cultura e estética'
      },
      {
        anos_resources: '9.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Ciência e tecnologia'
      },
      {
        anos_resources: '9.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Cooperação Internacional'
      },
      {
        anos_resources: '9.º',
        macro_areas_resources: 'Linguas',
        areas_resources: 'Francês',
        dominios_resources: 'Qualidade de vida'
      }
    ];

    let finalValues = [];
    let counter = 0;
    let relationships = [];
    let exists = {};
    await Promise.all(valuesToInsert.map( async (row, idx) => {
      
      relationships[idx+1] = [];
      
      const keys = Object.keys(row);

      // For each row, go for all keys (each key value is a term with a given taxonomy as KEY)
      await Promise.all(keys.map(async (key, keyIdx) => {

        // Get taxonomy object based on key
        const tax = await models.Taxonomy.findOne({
          where: {
            slug: {
              [Op.eq]: key
            }
          }
        });

        // Create a slug to save
        const customSlug = await dataUtil.createSlug(row[key], models.Taxonomy, null, false, models);


        if(!exists['level_'+(keyIdx+1)]){
          exists['level_'+(keyIdx+1)] = [];
        }

        // Save to final array
        let foundObj = exists['level_'+(keyIdx+1)].find(obj => obj.title == row[key]);
         if(!foundObj){

          exists['level_'+(keyIdx+1)].push({
            id: ++counter,
            title: row[key]
          });          
          
          finalValues.push({
            id: counter,
            title: row[key],
            slug: customSlug,
            taxonomy_id: tax.id,
            created_at: new Date(),
            updated_at: new Date()
          });
        }

        // Prepare terms relationships
        relationships[idx+1][keyIdx] = foundObj ? foundObj.id : counter;
        
      }));
    }));

    // Prepare terms relationships final object
    let finalRelationships = [];
    Object.keys(relationships).map( (key) => {
      Object.keys(relationships[key]).map( (colKey) => {
        finalRelationships.push({
          term_relationship_id: parseInt(key),
          term_id: relationships[key][colKey],
          created_at: new Date(),
          updated_at: new Date(),
          level: parseInt(colKey)+1
        });
      });
    });

    let numRelationships = [];
    Object.keys(relationships).map( (rel, idx) => {
      numRelationships.push({
        id: rel,
        created_at: new Date(),
        updated_at: new Date()
      })
    });

    /* if(finalValues.length>0){
       return queryInterface.bulkInsert('Terms', finalValues, {
        updateOnDuplicate: [
          'taxonomy_id',
          'created_at',
          'updated_at'
        ],
      })
      .then(function(users){
        return queryInterface.bulkInsert('TermRelationships', numRelationships, {
          updateOnDuplicate: [
            'created_at',
            'updated_at'
          ],
        } );
      })
      .then(function(relations) {
        return queryInterface.bulkInsert('terms_relations', finalRelationships, {
          updateOnDuplicate: [
            'created_at',
            'updated_at'
          ],
        });
      })
      .catch(function(err) {
        // print the error details
        console.log(err);
      }); 
    } */

    return new Promise( (resolve, reject) => {
      resolve();
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('terms_relations', [], {});
  }
};
