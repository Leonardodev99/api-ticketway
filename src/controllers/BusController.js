import Bus from '../models/Bus.js';
import Seat from '../models/Seat.js';
import Schedule from '../models/Schedule.js';
import SeatGeneratorService from '../services/SeatGeneratorService.js';

class BusController {

  /**
   * 🚍 Criar novo autocarro
   * POST /buses
   */
  async store(req, res) {
    try {
      const { plate_number, total_seats } = req.body;

      const busExists = await Bus.findOne({ where: { plate_number } });
      if (busExists) {
        return res.status(400).json({ error: 'Já existe um autocarro com esta matrícula' });
      }

      const bus = await Bus.create(req.body);

      // Gera automaticamente os assentos
      await SeatGeneratorService.generate(bus.id, total_seats);

      return res.status(201).json({
        message: 'Autocarro criado com sucesso com assentos gerados',
        bus
      });

    }catch (error) {
      console.error(error);
      return res.status(500).json({
        error: error.message
      });
    }
  }

  /**
   * 📋 Listar todos os autocarros
   * GET /buses
   */
  async index(req, res) {

    try {

      const buses = await Bus.findAll({
        attributes: ['id', 'name', 'plate_number', 'total_seats', 'createdAt']
      });

      return res.json(buses);

    } catch (error) {

      return res.status(500).json({
        error: 'Erro ao listar autocarros'
      });

    }

  }

  /**
   * 🔍 Buscar autocarro por ID
   * GET /buses/:id
   */
  async show(req, res) {

    try {

      const { id } = req.params;

      const bus = await Bus.findByPk(id, {
        include: [
          {
            model: Seat,
            attributes: ['id', 'seat_number', 'status']
          },
          {
            model: Schedule
          }
        ]
      });

      if (!bus) {
        return res.status(404).json({
          error: 'Autocarro não encontrado'
        });
      }

      return res.json(bus);

    } catch (error) {

      return res.status(500).json({
        error: 'Erro ao buscar autocarro'
      });

    }

  }

  /**
   * ✏️ Atualizar autocarro
   * PUT /buses/:id
   */
  async update(req, res) {

    try {

      const { id } = req.params;

      const bus = await Bus.findByPk(id);

      if (!bus) {
        return res.status(404).json({
          error: 'Autocarro não encontrado'
        });
      }

      const { plate_number } = req.body;

      if (plate_number) {

        const busExists = await Bus.findOne({
          where: { plate_number }
        });

        if (busExists && busExists.id !== bus.id) {
          return res.status(400).json({
            error: 'Já existe um autocarro com esta matrícula'
          });
        }

      }

      await bus.update(req.body);

      return res.json({
        message: 'Autocarro atualizado com sucesso',
        bus
      });

    } catch (error) {

      return res.status(400).json({
        errors: error.errors?.map(err => err.message)
      });

    }

  }

  /**
   * 🗑 Remover autocarro
   * DELETE /buses/:id
   */
  async delete(req, res) {

    try {

      const { id } = req.params;

      const bus = await Bus.findByPk(id);

      if (!bus) {
        return res.status(404).json({
          error: 'Autocarro não encontrado'
        });
      }

      await bus.destroy();

      return res.json({
        message: 'Autocarro removido com sucesso'
      });

    } catch (error) {

      return res.status(500).json({
        error: 'Erro ao remover autocarro'
      });

    }

  }

}

export default new BusController();
