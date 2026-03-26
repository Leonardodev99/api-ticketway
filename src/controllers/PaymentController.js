import Ticket from '../models/Ticket.js';
import Seat from '../models/Seat.js';

class PaymentController {

  /**
   * 💳 Confirmar pagamento via referência (Multicaixa)
   * POST /payments/pay
   */
  async pay(req, res) {
    const transaction = await Ticket.sequelize.transaction();

    try {
      const { reference } = req.body;

      if (!reference) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Referência é obrigatória'
        });
      }

      const ticket = await Ticket.findOne({
        where: { reference_code: reference }, // 🔥 aqui
        transaction
      });

      if (!ticket) {
        await transaction.rollback();
        return res.status(404).json({
          error: 'Referência inválida'
        });
      }

      if (ticket.status === 'paid') {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Bilhete já foi pago'
        });
      }

      // ⏰ verificar expiração
      if (ticket.expires_at && new Date() > ticket.expires_at) {

        // liberar assento automaticamente
        const seat = await Seat.findByPk(ticket.seat_id, { transaction });

        if (seat) {
          await seat.update({ status: 'available' }, { transaction });
        }

        await ticket.update({
          status: 'expired'
        }, { transaction });

        await transaction.commit();

        return res.status(400).json({
          error: 'Referência expirada. Reserva cancelada'
        });
      }

      // ✅ confirmar pagamento
      await ticket.update({
        status: 'paid',
        expires_at: null
      }, { transaction });

      const seat = await Seat.findByPk(ticket.seat_id, { transaction });

      if (seat) {
        await seat.update({ status: 'sold' }, { transaction });
      }

      await transaction.commit();

      return res.json({
        message: 'Pagamento confirmado com sucesso',
        pagamento: {
          entidade: ticket.entity,
          referencia: ticket.reference,
          valor: ticket.price
        },
        ticket
      });

    } catch (error) {
      await transaction.rollback();
      console.error(error);

      return res.status(500).json({
        error: 'Erro ao processar pagamento'
      });
    }
  }

  /**
   * 🔍 Consultar estado do pagamento
   * GET /payments/:reference
   */
  async getStatus(req, res) {
    try {
      const { reference } = req.params;

      const ticket = await Ticket.findOne({
        where: { reference_code: reference }, // 🔥 aqui
      });

      if (!ticket) {
        return res.status(404).json({
          error: 'Referência não encontrada'
        });
      }

      return res.json({
        status: ticket.status,
        pagamento: {
          entidade: ticket.entity,
          referencia: ticket.reference,
          valor: ticket.price
        },
        expires_at: ticket.expires_at
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: 'Erro ao consultar pagamento'
      });
    }
  }

  /**
   * ❌ Cancelar pagamento (manual/admin)
   * POST /payments/cancel
   */
  async cancel(req, res) {
    const transaction = await Ticket.sequelize.transaction();

    try {
      const { reference } = req.body;

      const ticket = await Ticket.findOne({
        where: { reference },
        transaction
      });

      if (!ticket) {
        await transaction.rollback();
        return res.status(404).json({
          error: 'Referência não encontrada'
        });
      }

      if (ticket.status === 'paid') {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Não é possível cancelar um bilhete já pago'
        });
      }

      await ticket.update({
        status: 'cancelled',
        expires_at: null
      }, { transaction });

      const seat = await Seat.findByPk(ticket.seat_id, { transaction });

      if (seat) {
        await seat.update({ status: 'available' }, { transaction });
      }

      await transaction.commit();

      return res.json({
        message: 'Pagamento cancelado e assento liberado'
      });

    } catch (error) {
      await transaction.rollback();
      console.error(error);

      return res.status(500).json({
        error: 'Erro ao cancelar pagamento'
      });
    }
  }

  /**
   * ⏳ Expirar reservas automaticamente (usado no CRON)
   */
  async expireReservations() {
    const transaction = await Ticket.sequelize.transaction();

    try {
      const now = new Date();

      const expiredTickets = await Ticket.findAll({
        where: {
          status: 'pending',
          expires_at: {
            [Ticket.sequelize.Op.lt]: now
          }
        },
        transaction
      });

      for (const ticket of expiredTickets) {

        const seat = await Seat.findByPk(ticket.seat_id, { transaction });

        if (seat) {
          await seat.update({ status: 'available' }, { transaction });
        }

        await ticket.update({
          status: 'expired'
        }, { transaction });
      }

      await transaction.commit();

      console.log(`⏳ ${expiredTickets.length} reservas expiradas`);

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao expirar reservas:', error);
    }
  }
}

export default new PaymentController();
