import Sequelize, { Model } from 'sequelize';

export default class Seat extends Model {
  static init(sequelize) {
    super.init(
      {
        seat_number: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            min: {
              args: [1],
              msg: 'Número do assento inválido',
            },
          },
        },

        bus_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'buses', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },

        status: {
          type: Sequelize.ENUM('available', 'reserved', 'sold'),
          defaultValue: 'available',
        },
      },
      {
        sequelize,
        tableName: 'seats',
        modelName: 'Seat',
        timestamps: true,
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Schedule, { foreignKey: 'schedule_id', as: 'schedule' });

    this.hasOne(models.Ticket, { foreignKey: 'seat_id' });
  }
}
