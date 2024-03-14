'use strict';
const models = require('../models/index');

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
      // APPS
      {
        title: 'Categorias',
        slug: 'categorias',
        type: 'APPS',
        hierarchical: true
      },
      {
        title: 'Temas',
        slug: 'temas',
        type: 'APPS',
        hierarchical: true
      },
      {
        title: 'Sistemas',
        slug: 'sistemas',
        type: 'APPS',
      },
      {
        title: 'Etiquetas',
        slug: 'tags',
        type: 'APPS',
      },
      // RESOURCES
      {
        title: 'Anos de escolaridade',
        slug: 'anos',
        type: 'RESOURCES',
      },
      {
        title: 'Macroáreas',
        slug: 'macro_areas',
        type: 'RESOURCES',
      },  
      {
        title: 'Áreas',
        slug: 'areas',
        type: 'RESOURCES',
      },      
      {
        title: 'Domínios',
        slug: 'dominios',
        type: 'RESOURCES',
      },
      {
        title: 'Etiquetas',
        slug: 'tags',
        type: 'RESOURCES',
      },
      {
        title: 'Modos de utilização',
        slug: 'modos',
        type: 'RESOURCES',
      },
      {
        title: 'Formato',
        slug: 'formato',
        type: 'RESOURCES',
      },
      {
        title: 'Idiomas',
        slug: 'lang',
        type: 'RESOURCES',
      },
      {
        title: 'Requisitos técnicos',
        slug: 'tec_requirements',
        type: 'RESOURCES',
      },
      {
        title: 'Destinatários',
        slug: 'target',
        type: 'RESOURCES',
      },
      // FEEDBACK
      {
        title: 'Assunto',
        slug: 'assunto',
        type: 'FEEDBACK',
      },
      // TOOLS
      {
        title: 'Etiquetas',
        slug: 'tags',
        type: 'TOOLS',
      },
      {
        title: 'Categorias',
        slug: 'categorias',
        type: 'TOOLS',
        hierarchical: true
      },
      // APPS
      {
        title: 'Categorias',
        slug: 'categorias',
        type: 'STUDENTS',
        hierarchical: true
      },
      {
        title: 'Etiquetas',
        slug: 'tags',
        type: 'STUDENTS',
      },
      // REDA GENERIC
      {
        title: 'Versão',
        slug: 'versao',
        type: 'REDA',
      },
    ]

    await Promise.all(valuesToInsert.map( async (row, idx) => {
      const type = row.type.toLowerCase();

      row.id = idx+1;
      row.slug = row.slug+"_"+type;
      row.locked = true;
      row.created_at = new Date();
      row.updated_at = new Date();
      row.hierarchical = row.hierarchical || false;
      
      let result = await models.Type.findOne({
        where: {
          slug: {
            [Op.eq]: row.type
          }
        }
      });

      if(result!==null){
        row.type_id = result.id;
      }
      
      delete row.type;

      return row;
    }));

    return queryInterface.bulkInsert('Taxonomies', valuesToInsert, {
      updateOnDuplicate: [
        'title',
        'slug',
        'locked',
        'type_id',
        'created_at',
        'updated_at',
        'hierarchical'
      ],
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Taxonomies', null, {});
  }
};
