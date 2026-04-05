import Sequelize from 'sequelize';
import Ticket from '../models/Ticket.js';
import Seat from '../models/Seat.js';
import Schedule from '../models/Schedule.js';
import Route from '../models/Route.js';

const { Op } = Sequelize;

class TicketController {

  /**
   * 🎟 Comprar bilhete
   */
  async store(req, res) {
    const transaction = await Ticket.sequelize.transaction();

    try {
      const user_id = req.userId;
      const { schedule_id, seat_id } = req.body;

      // 🔍 Buscar viagem + rota
      const schedule = await Schedule.findByPk(schedule_id, {
        include: {
          model: Route,
          as: 'route'
        },
        transaction
      });

      if (!schedule) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Viagem não encontrada' });
      }

      // 🔍 Verifica assento
      const seat = await Seat.findOne({
        where: {
          id: seat_id,
          schedule_id
        },
        transaction
      });

      if (!seat) {
        await transaction.rollback();
        return res.status(404).json({
          error: 'Assento não encontrado para esta viagem'
        });
      }

      // 🚫 EVITA OVERBOOKING
      if (seat.status !== 'available') {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Assento já está reservado ou vendido'
        });
      }

      // 💰 CALCULAR PREÇO COM BASE NA ROTA
      const route = schedule.route;

      if (!route) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Rota não associada à viagem'
        });
      }

      const ticketPrice = parseFloat(route.price);
      // 🎟 Criar ticket
      const ticket = await Ticket.create({
        schedule_id,
        seat_id,
        user_id,
        price: ticketPrice,
        purchase_date: new Date(),
        status: 'paid'
      }, { transaction });

      // 💺 Atualizar assento
      await seat.update({
        status: 'sold'
      }, { transaction });

      await transaction.commit();

      return res.status(201).json({
        message: 'Bilhete comprado com sucesso',
        ticket,
        price_details: {
          total: ticketPrice
        }
      });

    } catch (error) {
      await transaction.rollback();
      console.error(error);

      return res.status(500).json({
        error: 'Erro ao comprar bilhete'
      });
    }
  }

  /**
   * 📋 Listar bilhetes
   * GET /tickets
   */
  async index(req, res) {
    try {
      const tickets = await Ticket.findAll({
        include: [
          {
            association: 'seat',
            attributes: ['seat_number', 'status']
          },
          {
            association: 'schedule',
            include: [
              { association: 'route' },
              { association: 'bus' }
            ]
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.json({
        total: tickets.length,
        tickets
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao listar bilhetes'
      });
    }
  }

  /**
   * 🔍 Buscar bilhete por ID
   * GET /tickets/:id
   */
  async show(req, res) {
    try {
      const { id } = req.params;

      const ticket = await Ticket.findByPk(id, {
        include: [
          {
            association: 'seat',
            attributes: ['seat_number', 'status']
          },
          {
            association: 'schedule',
            include: [
              { association: 'route' },
              { association: 'bus' }
            ]
          }
        ]
      });

      if (!ticket) {
        return res.status(404).json({
          error: 'Bilhete não encontrado'
        });
      }

      return res.json(ticket);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao buscar bilhete'
      });
    }
  }

  /**
   * ❌ Cancelar bilhete
   * DELETE /tickets/:id
   */
  async cancel(req, res) {
    const transaction = await Ticket.sequelize.transaction();

    try {
      const { id } = req.params;

      const ticket = await Ticket.findByPk(id, { transaction });

      if (!ticket) {
        await transaction.rollback();
        return res.status(404).json({
          error: 'Bilhete não encontrado'
        });
      }

      // 🔄 Atualiza assento para disponível
      const seat = await Seat.findByPk(ticket.seat_id, { transaction });

      if (seat) {
        await seat.update({ status: 'available' }, { transaction });
      }

      // 🔄 Atualiza ticket
      await ticket.update({
        status: 'cancelled'
      }, { transaction });

      await transaction.commit();

      return res.json({
        message: 'Bilhete cancelado com sucesso'
      });

    } catch (error) {
      await transaction.rollback();
      console.error(error);

      return res.status(500).json({
        error: 'Erro ao cancelar bilhete'
      });
    }
  }

  // reservar bilhete
  async reserve(req, res) {
    const transaction = await Ticket.sequelize.transaction();

    try {
      const user_id = req.userId;
      const { schedule_id, seat_id } = req.body;

      const schedule = await Schedule.findByPk(schedule_id, {
        include: { model: Route, as: 'route' },
        transaction
      });

      if (!schedule) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Viagem não encontrada' });
      }

      const seat = await Seat.findOne({
        where: { id: seat_id, schedule_id },
        transaction
      });

      if (!seat) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Assento não encontrado' });
      }

      if (seat.status !== 'available') {
        await transaction.rollback();
        return res.status(400).json({ error: 'Assento indisponível' });
      }

      const ticketPrice = parseFloat(schedule.route.price);

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // 🔥 MULTICAIXA
      const entity = '12345';
      const reference = Math.floor(100000000 + Math.random() * 900000000).toString();

      const ticket = await Ticket.create({
        schedule_id,
        seat_id,
        user_id,
        price: ticketPrice,
        purchase_date: new Date(),
        status: 'pending',
        expires_at: expiresAt,
        entity,
        reference_code: reference
      }, { transaction });

      await seat.update({ status: 'reserved' }, { transaction });

      await transaction.commit();

      return res.status(201).json({
        message: 'Reserva criada. Faça o pagamento via Multicaixa',
        pagamento: {
          entidade: entity,
          referencia: reference,
          valor: ticketPrice
        },
        expires_at: expiresAt,
        ticket
      });

    } catch (error) {
      await transaction.rollback();
      console.error(error);

      return res.status(500).json({
        error: 'Erro ao reservar bilhete'
      });
    }
  }


  //MÉTODO: CONFIRMAR PAGAMENTO
  async pay(req, res) {
    const transaction = await Ticket.sequelize.transaction();

    try {
      const { reference_code } = req.body;

      const ticket = await Ticket.findOne({
        where: { reference_code },
        transaction
      });

      if (!ticket) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Bilhete não encontrado' });
      }

      if (ticket.expires_at && new Date() > ticket.expires_at) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Reserva expirada'
        });
      }

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
        message: 'Pagamento confirmado',
        reference_code,
        ticket
      });

    } catch (error) {
      console.error(error);
      await transaction.rollback();
      return res.status(500).json({
        error: 'Erro ao processar pagamento'
      });
    }
  }

  //Método: expirar reservas
  async expireTickets() {
    const expiredTickets = await Ticket.findAll({
      where: {
        status: 'pending',
        expires_at: {
          [Op.lt]: new Date()
        }
      }
    });

    for (const ticket of expiredTickets) {
      const seat = await Seat.findByPk(ticket.seat_id);

      if (seat) {
        await seat.update({ status: 'available' });
      }

      await ticket.update({ status: 'expired' });
    }

    console.log(`⏰ ${expiredTickets.length} reservas expiradas`);
  }

  async myTrips(req, res) {
    try {

      const userId = req.userId;

      const tickets = await Ticket.findAll({
        where: {
          user_id: userId
        },
        include: [
          {
            association: 'seat',
            attributes: ['seat_number', 'status']
          },
          {
            association: 'schedule',
            include: [
              { association: 'route' },
              { association: 'bus' }
            ]
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.json({
        success: true,
        total: tickets.length,
        trips: tickets
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao buscar suas viagens'
      });
    }
  }


  async myTripById(req, res) {
    try {

      const userId = req.userId;
      const { id } = req.params;

      const ticket = await Ticket.findOne({
        where: {
          id,
          user_id: userId
        },
        include: [
          {
            association: 'seat',
            attributes: ['seat_number', 'status']
          },
          {
            association: 'schedule',
            include: [
              { association: 'route' },
              { association: 'bus' }
            ]
          }
        ]
      });

      if (!ticket) {
        return res.status(404).json({
          error: 'Viagem não encontrada ou não pertence a você'
        });
      }

      return res.json(ticket);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao buscar viagem'
      });
    }
  }

}

export default new TicketController();
