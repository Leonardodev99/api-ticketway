import Sequelize, { Model } from 'sequelize';

export default class Ticket extends Model {
  static init(sequelize) {
    super.init(
      {
        price: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: false,
          validate: {
            min: {
              args: [1],
              msg: 'Preço inválido',
            },
          },
        },

        purchase_date: {
          type: Sequelize.DATE,
          allowNull: false,
          validate: {
            isDate: {
              msg: 'Data de compra inválida',
            },
          },
        },

        status: {
          type: Sequelize.ENUM('pending', 'paid', 'cancelled'),
          defaultValue: 'pending',
        },
      },
      {
        sequelize,
        tableName: 'tickets',
        modelName: 'Ticket',
        timestamps: true,
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });

    this.belongsTo(models.Schedule, { foreignKey: 'schedule_id' });

    this.belongsTo(models.Seat, { foreignKey: 'seat_id' });

    this.hasOne(models.Payment, { foreignKey: 'ticket_id' });
  }
}
