import cron from 'node-cron';
import TicketController from '../controllers/TicketController.js';

// ⏱ Executa a cada 1 hora
cron.schedule('0 * * * *', async () => {
  console.log('⏰ Verificando reservas expiradas...');

  try {
    await TicketController.expireTickets();
  } catch (error) {
    console.error('Erro no cron de expiração:', error);
  }
});
