import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class TokenController {
  async store(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Email e senha são obrigatórios'
        });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          error: 'Usuário não encontrado'
        });
      }

      const passwordValid = await user.checkPassword(password);

      if (!passwordValid) {
        return res.status(401).json({
          error: 'Senha inválida'
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role // ✅ corrigido
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: process.env.TOKEN_EXPIRATION
        }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name, // ✅ corrigido
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao gerar token'
      });
    }
  }
}

export default new TokenController();
