import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database.js';

import User from '../models/User.js';

const models = [User];

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);
    this.init();
  }

  init() {
    models.forEach(model => model.init(this.connection));

    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new Database();
