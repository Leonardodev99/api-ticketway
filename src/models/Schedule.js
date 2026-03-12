import Sequelize, { Model } from 'sequelize';

export default class Schedule extends Model {
  static init(sequelize) {
    super.init(
      {
        departure_time: {
          type: Sequelize.DATE,
          allowNull: false,
          validate: {
            isDate: {
              msg: 'Data de partida inválida',
            },
          },
        },

        arrival_time: {
          type: Sequelize.DATE,
          allowNull: false,
          validate: {
            isDate: {
              msg: 'Data de chegada inválida',
            },
          },
        },
      },
      {
        sequelize,
        tableName: 'schedules',
        modelName: 'Schedule',
        timestamps: true,
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Route, { foreignKey: 'route_id' });
    this.belongsTo(models.Bus, { foreignKey: 'bus_id' });

    this.hasMany(models.Seat, { foreignKey: 'schedule_id', as: 'seats' });
    this.hasMany(models.Ticket, { foreignKey: 'schedule_id' });
  }
}
