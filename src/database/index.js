import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database.js';

import User from '../models/User.js';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import Schedule from '../models/Schedule.js';
import Seat from '../models/Seat.js';
import Ticket from '../models/Ticket.js';
import Payment from '../models/Payment.js';
import Report from '../models/Report.js';

const models = [User, Bus, Route, Schedule, Seat, Ticket, Payment, Report];

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
