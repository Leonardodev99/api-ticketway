'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reports', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      total_sales: {
        type: Sequelize.DECIMAL(12,2),
        allowNull: false,
      },

      total_tickets: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      report_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }

    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reports');
  }
};
