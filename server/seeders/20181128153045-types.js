'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Types', [
      {
        id: 1,
        title: 'Ferramentas',
        slug: 'TOOLS',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        title: 'Recursos',
        slug: 'RESOURCES',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        title: 'Aplicações',
        slug: 'APPS',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        title: 'Feedback',
        slug: 'FEEDBACK',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        title: 'Alunos',
        slug: 'STUDENTS',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        title: 'Propostas de Operacionalização',
        slug: 'SCRIPTS',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        title: 'REDA',
        slug: 'REDA',
        created_at: new Date(),
        updated_at: new Date()
      }
    ],
    {
      updateOnDuplicate: [
        'title',
        'slug',
        'created_at',
        'updated_at'
      ],
    }
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Types', null, {});
  }
};
