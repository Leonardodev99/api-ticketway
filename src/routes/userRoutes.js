import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import upload from '../middlewares/upload.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = new Router();

// 🔓 Públicas
router.post('/', UserController.store); // cadastro

// 🔐 Protegidas
router.use(authMiddleware);

// 👤 Ver pirfil
router.get('/me', UserController.profile);

// 🛡️ Apenas admin
router.get('/', roleMiddleware('admin'), UserController.index);
router.get('/:id', roleMiddleware('admin'), UserController.show);
router.delete('/:id', roleMiddleware('admin'), UserController.delete);

// 👤 User ou Admin
router.put('/me', UserController.update);
router.post('/avatar', upload.single('file'), UserController.uploadAvatar);

export default router;
