import { Router } from 'express';
import PaymentController from '../controllers/PaymentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const routes = Router();

// 🔐 Protegidas
routes.use(authMiddleware);

routes.post('/pay', roleMiddleware('admin', 'user'), PaymentController.pay);
routes.get('/:reference', roleMiddleware('admin', 'user'), PaymentController.getStatus);
routes.post('/cancel', roleMiddleware('admin'), PaymentController.cancel);

export default routes;
