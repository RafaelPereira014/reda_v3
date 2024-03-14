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
    return queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        value: 'Administrador',
        type: 'admin',
        status: true,        
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        value: 'Docente',
        type: 'teacher',
        status: true,        
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        value: 'Outro Utilizadcor',
        type: 'user',
        status: true,        
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        value: 'Colaborador',
        type: 'editor',
        status: true,        
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        value: 'Encarregado de Educação',
        type: 'educator',
        status: true,        
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        value: 'Aluno',
        type: 'student',
        status: true,        
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {
      updateOnDuplicate: ['created_at', 'updated_at'],
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
  }
};
