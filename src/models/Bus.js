import Sequelize, { Model } from 'sequelize';

export default class Bus extends Model {
  static init(sequelize) {
    super.init(
      {
        plate_number: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: {
            msg: 'Esta matrícula já está cadastrada',
          },
          validate: {
            len: {
              args: [5, 20],
              msg: 'A matrícula deve ter entre 5 e 20 caracteres',
            },
          },
        },

        model: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [2, 100],
              msg: 'O modelo deve ter entre 2 e 100 caracteres',
            },
          },
        },

        total_seats: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            min: {
              args: [10],
              msg: 'O ônibus deve ter pelo menos 10 assentos',
            },
            max: {
              args: [100],
              msg: 'O ônibus não pode ter mais de 100 assentos',
            },
          },
        },

        company: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'buses',
        modelName: 'Bus',
        timestamps: true,
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Schedule, { foreignKey: 'bus_id' });
  }
}
