'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tickets', 'entity', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '12345' // tua entidade
    });

    await queryInterface.addColumn('tickets', 'reference', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tickets', 'entity');
    await queryInterface.removeColumn('tickets', 'reference');
  }
};
