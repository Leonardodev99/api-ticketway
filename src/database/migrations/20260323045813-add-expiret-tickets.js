'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tickets', 'expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'purchase_date' // opcional (MySQL)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tickets', 'expires_at');
  }
};
