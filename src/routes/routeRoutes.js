import { Router } from 'express';
import RouteController from '../controllers/RouteController.js';

const router = new Router();

router.post('/', RouteController.store);
router.get('/', RouteController.index);
router.get('/:id', RouteController.show);
router.put('/:id', RouteController.update);
router.delete('/:id', RouteController.delete);

export default router;
