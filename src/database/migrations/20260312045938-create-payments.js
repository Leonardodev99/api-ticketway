'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      ticket_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tickets',
          key: 'id',
        },
      },

      amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },

      payment_method: {
        type: Sequelize.ENUM('card', 'cash', 'transfer', 'mobile'),
        allowNull: false,
      },

      payment_status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending',
      },

      payment_date: {
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
    await queryInterface.dropTable('payments');
  }
};
