import { Router } from 'express';
import RouteController from '../controllers/RouteController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
//import { use } from 'react';

const router = new Router();

//Rotas protegidas
router.use(authMiddleware);

router.post('/', roleMiddleware('admin'), RouteController.store);
router.get('/', roleMiddleware('admin', 'user'), RouteController.index);
router.get('/:id', roleMiddleware('admin', 'user'), RouteController.show);
router.put('/:id', roleMiddleware('admin'), RouteController.update);
router.delete('/:id', roleMiddleware('admin'), RouteController.delete);

export default router;
