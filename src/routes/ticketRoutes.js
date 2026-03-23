import { Router } from 'express';
import TicketController from '../controllers/TicketController.js';

const router = new Router();

/**
 * 🎟 Comprar bilhete
 * POST /tickets
 */
router.post('/', TicketController.store);

/**
 * 🎟 reservar bilhete
 * POST /viajem/tickets
 */
router.post('/reserve', TicketController.reserve);

/**
 * 📋 Listar todos os bilhetes
 * GET /tickets
 */
router.get('/', TicketController.index);

/**
 * 🔍 Buscar bilhete por ID
 * GET /tickets/:id
 */
router.get('/:id', TicketController.show);

/**
 * ❌ Cancelar bilhete
 * DELETE /tickets/:id
 */
router.delete('/:id', TicketController.cancel);

export default router;
