import User from '../models/User.js';

class UserController {

  // Criar usuário (cadastro)
  async store(req, res) {
    try {

      const { name, email, password, role } = req.body;

      const user = await User.create({
        name,
        email,
        password,
        role
      });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });

    } catch (error) {

      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });

    }
  }


  // Listar todos usuários
  async index(req, res) {
    try {

      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'created_at']
      });

      return res.json(users);

    } catch (error) {

      return res.status(500).json({
        error: 'Erro ao listar usuários'
      });

    }
  }


  // Mostrar usuário específico
  async show(req, res) {
    try {

      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'role', 'created_at']
      });

      if (!user) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      return res.json(user);

    } catch (error) {

      return res.status(500).json({
        error: 'Erro ao buscar usuário'
      });

    }
  }


  // Atualizar usuário
  async update(req, res) {
    try {

      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      const { name, email, password, role } = req.body;

      await user.update({
        name,
        email,
        password,
        role
      });

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });

    } catch (error) {

      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });

    }
  }


  // Excluir usuário
  async delete(req, res) {
    try {

      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      await user.destroy();

      return res.json({
        message: 'Usuário removido com sucesso'
      });

    } catch (error) {

      return res.status(500).json({
        error: 'Erro ao excluir usuário'
      });

    }
  }

}

export default new UserController();
