import dotenv from 'dotenv';

dotenv.config();

import './src/database';

import express from 'express';

import userRoutes from './src/routes/userRoutes';
import busRoutes from './src/routes/busRoutes.js';
import routeRoutes from './src/routes/routeRoutes.js';



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
  }
}

export default new App().app;
