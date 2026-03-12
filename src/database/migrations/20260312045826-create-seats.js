'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seats', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      schedule_id: {
        type: Sequelize.INTEGER,
        allowNull: true,  // antes era false
        references: {
          model: 'schedules',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      seat_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM('available', 'reserved', 'sold'),
        defaultValue: 'available',
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
    await queryInterface.dropTable('seats');
  }
};
