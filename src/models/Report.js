import Sequelize, { Model } from 'sequelize';

export default class Report extends Model {
  static init(sequelize) {
    super.init(
      {
        total_sales: {
          type: Sequelize.DECIMAL(12,2),
          allowNull: false,
        },

        total_tickets: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        report_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'reports',
        modelName: 'Report',
        timestamps: true,
        underscored: true,
      }
    );

    return this;
  }
}
