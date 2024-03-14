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
    return queryInterface.bulkInsert('Users', [
      {
        id: 1,
        email: 'tec.reda@azores.gov.pt',
        password: '$2a$10$X8IgD4QTZm8X7FaKR26CUu5XBKkdbDg8ocD0DImjfau1NSupfR5Ii',
        name: 'Técnico da REDA',
        organization: 'REDA',
        hidden: true,
        approved: true,
        status: true,        
        acceptance: true,
        newsletter: false,
        created_at: new Date(),
        updated_at: new Date(),
        role_id:1
      },
    ],{}
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
