import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

import './src/database';

import express from 'express';

import userRoutes from './src/routes/userRoutes';
import busRoutes from './src/routes/busRoutes.js';
import routeRoutes from './src/routes/routeRoutes.js';
import scheduleRoutes from './src/routes/scheduleRoutes.js';
import ticketRoutes from './src/routes/ticketRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';
import tokenRoutes from './src/routes/tokenRoutes.js';
import passwordResetRoutes from './src/routes/passwordResetRoutes';



class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(resolve(__dirname, 'uploads')));
  }

  routes() {
    this.app.use('/users', userRoutes);
    this.app.use('/buses', busRoutes);
    this.app.use('/routes', routeRoutes);
    this.app.use('/schedules', scheduleRoutes);
    this.app.use('/tickets', ticketRoutes);
    this.app.use('/payments', paymentRoutes);
    this.app.use('/reports', reportRoutes);
    this.app.use('/tokens', tokenRoutes);
    this.app.use('/password', passwordResetRoutes);
  }
}

export default new App().app;
