import Route from '../models/Route.js';

class RouteController {

  /**
   * 📌 Criar nova rota
   * POST /routes
   */
  async store(req, res) {
    try {
      const route = await Route.create(req.body);

      return res.status(201).json(route);

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  /**
   * 📌 Listar todas as rotas
   * GET /routes
   */
  async index(req, res) {
    try {
      const routes = await Route.findAll({
        order: [['id', 'ASC']]
      });

      return res.json(routes);

    } catch (error) {
      return res.status(500).json({
        errors: ['Erro ao listar rotas']
      });
    }
  }

  /**
   * 📌 Buscar rota por ID
   * GET /routes/:id
   */
  async show(req, res) {
    try {
      const { id } = req.params;

      const route = await Route.findByPk(id);

      if (!route) {
        return res.status(404).json({
          errors: ['Rota não encontrada']
        });
      }

      return res.json(route);

    } catch (error) {
      return res.status(500).json({
        errors: ['Erro ao buscar rota']
      });
    }
  }

  /**
   * 📌 Atualizar rota
   * PUT /routes/:id
   */
  async update(req, res) {
    try {
      const { id } = req.params;

      const route = await Route.findByPk(id);

      if (!route) {
        return res.status(404).json({
          errors: ['Rota não encontrada']
        });
      }

      await route.update(req.body);

      return res.json(route);

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  /**
   * 📌 Deletar rota
   * DELETE /routes/:id
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const route = await Route.findByPk(id);

      if (!route) {
        return res.status(404).json({
          errors: ['Rota não encontrada']
        });
      }

      await route.destroy();

      return res.json({
        message: 'Rota eliminada com sucesso'
      });

    } catch (error) {
      return res.status(500).json({
        errors: ['Erro ao deletar rota']
      });
    }
  }
}

export default new RouteController();
