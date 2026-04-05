import { Router } from 'express';
import TicketController from '../controllers/TicketController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = new Router();

// 🔐 Protegidas
router.use(authMiddleware);

/**
 * 🎟 Comprar bilhete
 * POST /tickets
 */
router.post('/', roleMiddleware('admin', 'user'), TicketController.store);

/**
 * 🔍 Confirmar pagamento
 * POST /tickets/
 */
router.post('/conf/pay', roleMiddleware('admin', 'user'), TicketController.pay);

/**
 * 🎟 reservar bilhete
 * POST /viajem/tickets
 */
router.post('/reserve', roleMiddleware('admin', 'user'), TicketController.reserve);

// 👤 Minhas viagens
router.get('/me', roleMiddleware('admin', 'user'), TicketController.myTrips);

// 👤 Minha viagem por ID
router.get('/me/:id', roleMiddleware('admin', 'user'), TicketController.myTripById);

/**
 * 📋 Listar todos os bilhetes
 * GET /tickets
 */
router.get('/', roleMiddleware('admin'), TicketController.index);

/**
 * 🔍 Buscar bilhete por ID
 * GET /tickets/:id
 */
router.get('/:id', roleMiddleware('admin'), TicketController.show);

/**
 * ❌ Cancelar bilhete
 * DELETE /tickets/:id
 */
router.delete('/:id', roleMiddleware('admin'), TicketController.cancel);




export default router;
