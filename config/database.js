import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuração da conexão com o PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'dialog_hub',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      // Use snake_case para nomes de tabelas e atributos
      underscored: true,
      underscoredAll: true,
      // Dica: Se preferir manter os nomes das tabelas em minúsculas mas sem underscores, descomente a linha abaixo
      // freezeTableName: true
    }
  }
);

export default sequelize;
