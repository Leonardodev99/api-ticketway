import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

export default class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [5, 150],
              msg: 'O nome deve ter entre 5 e 150 caracteres'
            },
            isNotStartWithNumber(value) {
              if (/^\d/.test(value)) {
                throw new Error('O nome não pode começar com número');
              }
            }
          }
        },

        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: {
            msg: 'Email já existe'
          },
          validate: {
            isEmail: {
              msg: 'Email inválido'
            }
          }
        },

        password: {
          type: Sequelize.VIRTUAL,
          allowNull: false,
        },

        password_hash: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        avatar: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        role: {
          type: Sequelize.ENUM('user', 'admin'),
          defaultValue: 'user',
          allowNull: false,
        },
        password_reset_token: {
          type: Sequelize.STRING,
          allowNull: true
        },
        password_reset_expires: {
          type: Sequelize.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        underscored: true,

        hooks: {
          beforeValidate: async (user) => {
            if (user.password) {
              user.password_hash = await bcrypt.hash(user.password, 8);
            }
          }
        }
      }
    );

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
