import dotenv from 'dotenv';

dotenv.config();

import './src/database';

import express from 'express';

import userRoutes from './src/routes/userRoutes';
import busRoutes from './src/routes/busRoutes.js';
import routeRoutes from './src/routes/routeRoutes.js';
import scheduleRoutes from './src/routes/scheduleRoutes.js';
import ticketRoutes from './src/routes/ticketRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';



class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use('/users', userRoutes);
    this.app.use('/buses', busRoutes);
    this.app.use('/routes', routeRoutes);
    this.app.use('/schedules', scheduleRoutes);
    this.app.use('/tickets', ticketRoutes);
    this.app.use('/payments', paymentRoutes);
  }
}

export default new App().app;
