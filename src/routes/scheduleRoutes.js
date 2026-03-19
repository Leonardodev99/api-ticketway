import { Router } from 'express';
import ScheduleController from '../controllers/ScheduleController.js';

const router = new Router();

// 📅 Criar nova viagem
router.post('/', ScheduleController.store);

// 📋 Listar todas as viagens
router.get('/', ScheduleController.index);

// 📅 Filtrar por data (query param)
router.get('/date', ScheduleController.findByDate);

// 🛣 Filtrar por rota
router.get('/route/:route_id', ScheduleController.findByRoute);

// 💺 Assentos disponíveis
router.get('/:id/seats/available', ScheduleController.availableSeats);

// 🔍 Buscar viagem por ID
router.get('/:id', ScheduleController.show);

// ✏️ Atualizar viagem
router.put('/:id', ScheduleController.update);

// 🗑 Remover viagem
router.delete('/:id', ScheduleController.delete);

export default router;
