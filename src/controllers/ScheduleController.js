import Schedule from '../models/Schedule.js';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import Seat from '../models/Seat.js';
import SeatGeneratorService from '../services/SeatGeneratorService.js';
import { Op } from 'sequelize';

class ScheduleController {

  /**
   * 📅 Criar nova viagem
   */
  async store(req, res) {
    try {
      const {
        route_id,
        bus_id,
        departure_time,
        arrival_time
      } = req.body;

      const route = await Route.findByPk(route_id);
      if (!route) {
        return res.status(404).json({ error: 'Rota não encontrada' });
      }

      const bus = await Bus.findByPk(bus_id);
      if (!bus) {
        return res.status(404).json({ error: 'Autocarro não encontrado' });
      }

      if (new Date(arrival_time) <= new Date(departure_time)) {
        return res.status(400).json({
          error: 'A chegada deve ser depois da partida'
        });
      }

      const schedule = await Schedule.create({
        route_id,
        bus_id,
        departure_time,
        arrival_time
      });

      // ✅ CORREÇÃO AQUI (faltava bus_id)
      await SeatGeneratorService.generateForSchedule(
        schedule.id,
        bus.id,
        bus.total_seats
      );

      return res.status(201).json({
        message: 'Viagem criada com sucesso',
        schedule
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: error.message
      });
    }
  }

  /**
   * 📋 Listar todas viagens
   */
  async index(req, res) {
    try {
      const schedules = await Schedule.findAll({
        include: [
          { association: 'route' },
          { association: 'bus' }
        ],
        order: [['departure_time', 'ASC']]
      });

      return res.json(schedules);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao listar viagens'
      });
    }
  }

  /**
   * 🔍 Buscar viagem por ID
   */
  async show(req, res) {
    try {
      const { id } = req.params;

      const schedule = await Schedule.findByPk(id, {
        include: [
          { association: 'route' },
          { association: 'bus' },
          { association: 'seats' }
        ]
      });

      if (!schedule) {
        return res.status(404).json({
          error: 'Viagem não encontrada'
        });
      }

      return res.json(schedule);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao buscar viagem'
      });
    }
  }

  /**
   * ✏️ Atualizar viagem
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        route_id,
        bus_id,
        departure_time,
        arrival_time
      } = req.body;

      const schedule = await Schedule.findByPk(id);

      if (!schedule) {
        return res.status(404).json({
          error: 'Viagem não encontrada'
        });
      }

      if (arrival_time && departure_time) {
        if (new Date(arrival_time) <= new Date(departure_time)) {
          return res.status(400).json({
            error: 'A chegada deve ser depois da partida'
          });
        }
      }

      await schedule.update({
        route_id,
        bus_id,
        departure_time,
        arrival_time
      });

      return res.json({
        message: 'Viagem atualizada com sucesso',
        schedule
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao atualizar viagem'
      });
    }
  }

  /**
   * 🗑 Deletar viagem
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const schedule = await Schedule.findByPk(id);

      if (!schedule) {
        return res.status(404).json({
          error: 'Viagem não encontrada'
        });
      }

      await schedule.destroy();

      return res.json({
        message: 'Viagem removida com sucesso'
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao remover viagem'
      });
    }
  }

  /**
   * 📅 Filtrar por data
   * GET /schedules/date?date=2026-03-20
   */
  async findByDate(req, res) {
    try {
      const { date } = req.query;

      const start = new Date(date + ' 00:00:00');
      const end = new Date(date + ' 23:59:59');

      const schedules = await Schedule.findAll({
        where: {
          departure_time: {
            [Op.between]: [start, end]
          }
        },
        include: ['route', 'bus']
      });

      if (schedules.length === 0) {
        return res.json({
          success: true,
          count: 0,
          message: 'Nenhuma viagem encontrada para esta data',
          data: []
        });
      }

      return res.json({
        success: true,
        count: schedules.length,
        message: 'Viagens encontradas',
        data: schedules
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao filtrar por data'
      });
    }
  }

  /**
   * 🛣 Filtrar por rota
   * GET /schedules/route/:route_id
   */
  async findByRoute(req, res) {
    try {
      const { route_id } = req.params;

      const schedules = await Schedule.findAll({
        where: { route_id },
        include: ['route', 'bus']
      });

      if (schedules.length === 0) {
        return res.json({
          success: true,
          count: 0,
          message: 'Nenhuma viagem encontrada para esta rota',
          data: []
        });
      }

      return res.json({
        success: true,
        count: schedules.length,
        message: 'Viagens encontradas para a rota',
        data: schedules
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao filtrar por rota'
      });
    }
  }

  /**
   * 💺 Listar assentos disponíveis
   */
  async availableSeats(req, res) {
    try {
      const { id } = req.params;

      const seats = await Seat.findAll({
        where: {
          schedule_id: id,
          status: 'available'
        },
        order: [['seat_number', 'ASC']]
      });

      if (seats.length === 0) {
        return res.status(200).json({
          success: true,
          count: 0,
          message: 'Nenhum assento disponível para esta viagem',
          data: []
        });
      }

      return res.json({
        success: true,
        count: seats.length,
        message: 'Assentos disponíveis encontrados',
        data: seats
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar assentos disponíveis'
      });
    }
  }
}

export default new ScheduleController();
