'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('routes', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      origin: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      destination: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      distance_km: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      price: {
        type: Sequelize.DECIMAL(10,2),
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
    await queryInterface.dropTable('routes');
  }
};
