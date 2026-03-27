'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reports', 'period', {
      type: Sequelize.ENUM('daily', 'monthly'),
      allowNull: false,
      defaultValue: 'daily'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('reports', 'period');
  }
};
