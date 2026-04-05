import { Router } from 'express';
import ScheduleController from '../controllers/ScheduleController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = new Router();

// 🔐 Protegidas
router.use(authMiddleware);

// 📅 Criar nova viagem
router.post('/', roleMiddleware('admin', 'user'), ScheduleController.store);

// 📋 Listar todas as viagens
router.get('/', roleMiddleware('admin'), ScheduleController.index);

// 📅 Filtrar por data (query param)
router.get('/date', roleMiddleware('admin'), ScheduleController.findByDate);

// 🛣 Filtrar por rota
router.get('/route/:route_id', roleMiddleware('admin'), ScheduleController.findByRoute);

// 💺 Assentos disponíveis
router.get('/:id/seats/available', roleMiddleware('admin', 'user'), ScheduleController.availableSeats);

// 🔍 Buscar viagem por ID
router.get('/:id', roleMiddleware('admin'), ScheduleController.show);

// ✏️ Atualizar viagem
router.put('/:id', roleMiddleware('admin'), ScheduleController.update);

// 🗑 Remover viagem
router.delete('/:id', roleMiddleware('admin'), ScheduleController.delete);

export default router;
