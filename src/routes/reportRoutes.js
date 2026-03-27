import { Router } from 'express';
import ReportController from '../controllers/ReportController';

const router = new Router ();

router.post('/daily', ReportController.generateDaily);
router.post('/monthly', ReportController.generateMonthly);
router.get('/', ReportController.index);
router.get('/filter/:start/:end', ReportController.filter);
router.get('/:id', ReportController.show);
router.delete('/:id', ReportController.delete);

export default router;

