import Sequelize, { Model } from 'sequelize';

export default class Payment extends Model {
  static init(sequelize) {
    super.init(
      {
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
      },
      {
        sequelize,
        tableName: 'payments',
        modelName: 'Payment',
        timestamps: true,
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Ticket, { foreignKey: 'ticket_id' });
  }
}
