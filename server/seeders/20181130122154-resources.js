'use strict';
const models = require('../models/index');


module.exports = {
  up: (queryInterface, Sequelize) => {
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
    let counter = 0;

    let insertEls = [
      {
        title: 'Constante de proporcionalidade entre peso e massa',
        slug: 'constante-de-proporcionalidade-entre-peso-e-massa',
        description: 'Recurso multidisciplinar. Simulação simples que permite explorar a distinção entre peso e massa na Terra e na Lua. Apresenta também a representação gráfica do peso em função da massa, mostrando a proporcionalidade entre estas variáveis. Apenas permite controlar o local e a massa. Em inglês de fácil compreensão.',
        operation: 'Recurso multidisciplinar Consulte as diferentes propostas de operacionalização.',
        techResources: 'Adobe Flash Player',
        author: 'CompassLearning',
        organization: 'Compass Learning',
        link: 'http://www.thelearningodyssey.com/Graphics/Content/vs/em/Medias/html/a222-weight-mass-on-the-moon.html',
        approved: true,
        approvedScientific: true,
        approvedLinguistic: true,
        status: true,
        user_id: 1,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: '2 Constante de proporcionalidade entre peso e massa',
        slug: '2 constante-de-proporcionalidade-entre-peso-e-massa',
        description: 'Recurso multidisciplinar. Simulação simples que permite explorar a distinção entre peso e massa na Terra e na Lua. Apresenta também a representação gráfica do peso em função da massa, mostrando a proporcionalidade entre estas variáveis. Apenas permite controlar o local e a massa. Em inglês de fácil compreensão.',
        operation: 'Recurso multidisciplinar Consulte as diferentes propostas de operacionalização.',
        techResources: 'Adobe Flash Player',
        author: 'CompassLearning',
        organization: 'Compass Learning',
        link: 'http://www.thelearningodyssey.com/Graphics/Content/vs/em/Medias/html/a222-weight-mass-on-the-moon.html',
        approved: true,
        approvedScientific: true,
        approvedLinguistic: true,
        status: true,
        user_id: 1,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
    ];

    insertEls.map( el => {
      el.id = ++counter;
    })

    return new Promise( (resolve, reject) => {
      resolve();
    })

    /* return queryInterface.bulkInsert('Resources', insertEls,
    {
      updateOnDuplicate: [
        'title',
        'slug',
        'description',
        'operation',
        'techResources',
        'author',
        'organization',
        'link',
        'approved',
        'approvedScientific',
        'approvedLinguistic',
        'status',
        'created_at',
        'updated_at'
      ],
    }
    ).then( async (result) => {
      let resources = await models.Resource.findAll();

      let format = await models.Term.findOne({
        limit: 1,
        include: [
          {
            model: models.Taxonomy,
            where: {
              slug: {
                [Op.like]: 'formato_resources'
              }
            }
          }
        ]
      })
     
      return await Promise.all(resources.map(async resc => {
        await resc.setTerms([format.id]);
      }));
    })
    .catch( err => {console.log(err)}); */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Resources', [], {});
  }
};
