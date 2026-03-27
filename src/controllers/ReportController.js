import Sequelize from 'sequelize';
import Report from '../models/Report.js';
import Ticket from '../models/Ticket.js';

const { Op } = Sequelize;

class ReportController {

  /**
   * 📊 Gerar relatório diário
   * POST /reports/daily
   */
  async generateDaily(req, res) {
    try {
      const today = new Date();
      today.setHours(0,0,0,0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // 🚫 Evita duplicação
      const existing = await Report.findOne({
        where: {
          report_date: today,
          period: 'daily'
        }
      });

      if (existing) {
        return res.status(400).json({
          error: 'Relatório diário já gerado'
        });
      }

      // 📊 Buscar tickets pagos
      const tickets = await Ticket.findAll({
        where: {
          status: 'paid',
          purchase_date: {
            [Op.gte]: today,
            [Op.lt]: tomorrow
          }
        }
      });

      const totalSales = tickets.reduce((sum, t) => sum + parseFloat(t.price), 0);
      const totalTickets = tickets.length;

      const report = await Report.create({
        total_sales: totalSales,
        total_tickets: totalTickets,
        report_date: today,
        period: 'daily'
      });

      return res.status(201).json({
        message: 'Relatório diário gerado',
        report
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao gerar relatório diário'
      });
    }
  }

  /**
   * 📊 Gerar relatório mensal
   * POST /reports/monthly
   */
  async generateMonthly(req, res) {
    try {
      const now = new Date();

      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const existing = await Report.findOne({
        where: {
          report_date: firstDay,
          period: 'monthly'
        }
      });

      if (existing) {
        return res.status(400).json({
          error: 'Relatório mensal já existe'
        });
      }

      const tickets = await Ticket.findAll({
        where: {
          status: 'paid',
          purchase_date: {
            [Op.gte]: firstDay,
            [Op.lt]: lastDay
          }
        }
      });

      const totalSales = tickets.reduce((sum, t) => sum + parseFloat(t.price), 0);
      const totalTickets = tickets.length;

      const report = await Report.create({
        total_sales: totalSales,
        total_tickets: totalTickets,
        report_date: firstDay,
        period: 'monthly'
      });

      return res.status(201).json({
        message: 'Relatório mensal gerado',
        report
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao gerar relatório mensal'
      });
    }
  }

  /**
   * 📋 Listar relatórios
   * GET /reports
   */
  async index(req, res) {
    try {
      const reports = await Report.findAll({
        order: [['report_date', 'DESC']]
      });

      return res.json({
        total: reports.length,
        reports
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao listar relatórios'
      });
    }
  }

  /**
   * 🔍 Buscar relatório por ID
   */
  async show(req, res) {
    try {
      const { id } = req.params;

      const report = await Report.findByPk(id);

      if (!report) {
        return res.status(404).json({
          error: 'Relatório não encontrado'
        });
      }

      return res.json(report);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao buscar relatório'
      });
    }
  }

  /**
   * 🔎 Buscar por período
   * GET /reports/filter?start=2026-03-01&end=2026-03-31
   */
  async filter(req, res) {
    try {
      const { start, end } = req.params;

      if (!start || !end) {
        return res.status(400).json({
          error: 'Datas start e end são obrigatórias'
        });
      }

      const startDate = new Date(start);
      const endDate = new Date(end);

      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({
          error: 'Formato de data inválido. Use YYYY-MM-DD'
        });
      }

      const reports = await Report.findAll({
        where: {
          report_date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['report_date', 'DESC']]
      });

      return res.json({
        total: reports.length,
        reports
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao filtrar relatórios'
      });
    }
  }
  /**
   * ❌ Deletar relatório
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const report = await Report.findByPk(id);

      if (!report) {
        return res.status(404).json({
          error: 'Relatório não encontrado'
        });
      }

      await report.destroy();

      return res.json({
        message: 'Relatório removido'
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao remover relatório'
      });
    }
  }
}

export default new ReportController();
