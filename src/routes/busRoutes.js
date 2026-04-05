import { Router } from 'express';
import BusController from '../controllers/BusController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = new Router();

// 🔐 Protegidas
router.use(authMiddleware);

// Criar ônibus e gerar assentos automaticamente
router.post('/', roleMiddleware('admin'), BusController.store);

// Listar todos os ônibus
router.get('/', roleMiddleware('admin'), BusController.index);

// Buscar ônibus específico
router.get('/:id', roleMiddleware('admin'), BusController.show);

// Atualizar ônibus
router.put('/:id', roleMiddleware('admin'), BusController.update);

// Remover ônibus
router.delete('/:id', roleMiddleware('admin'), BusController.delete);

export default router;
