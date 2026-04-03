import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import upload from '../middlewares/upload';

const router = new Router();

router.post('/', UserController.store);
router.post('/avatar/:id', upload.single('file'), UserController.uploadAvatar);
router.get('/', UserController.index);
router.get('/:id', UserController.show);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;
