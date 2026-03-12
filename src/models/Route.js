import Sequelize, { Model } from 'sequelize';

export default class Route extends Model {
  static init(sequelize) {
    super.init(
      {
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
          validate: {
            min: {
              args: [1],
              msg: 'A distância deve ser maior que 0',
            },
          },
        },

        price: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: false,
          validate: {
            min: {
              args: [1],
              msg: 'O preço deve ser maior que 0',
            },
          },
        },
      },
      {
        sequelize,
        tableName: 'routes',
        modelName: 'Route',
        timestamps: true,
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Schedule, { foreignKey: 'route_id' });
  }
}
