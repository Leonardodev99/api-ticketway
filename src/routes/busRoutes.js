import { Router } from 'express';
import BusController from '../controllers/BusController.js';

const router = new Router();

// Criar ônibus e gerar assentos automaticamente
router.post('/', BusController.store);

// Listar todos os ônibus
router.get('/', BusController.index);

// Buscar ônibus específico
router.get('/:id', BusController.show);

// Atualizar ônibus
router.put('/:id', BusController.update);

// Remover ônibus
router.delete('/:id', BusController.delete);

export default router;
