'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('buses', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      plate_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      model: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      total_seats: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      company: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('buses');
  }
};
