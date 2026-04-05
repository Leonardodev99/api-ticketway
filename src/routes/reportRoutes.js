import { Router } from 'express';
import ReportController from '../controllers/ReportController';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = new Router ();

// 🔐 Protegidas
router.use(authMiddleware);

router.post('/daily', roleMiddleware('admin'), ReportController.generateDaily);
router.post('/monthly', roleMiddleware('admin'), ReportController.generateMonthly);
router.get('/', roleMiddleware('admin'), ReportController.index);
router.get('/filter/:start/:end', roleMiddleware('admin'), ReportController.filter);
router.get('/:id', roleMiddleware('admin'), ReportController.show);
router.delete('/:id', roleMiddleware('admin'), ReportController.delete);

export default router;

