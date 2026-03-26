import { Router } from 'express';
import PaymentController from '../controllers/PaymentController.js';

const routes = Router();

routes.post('/pay', PaymentController.pay);
routes.get('/:reference', PaymentController.getStatus);
routes.post('/cancel', PaymentController.cancel);

export default routes;
