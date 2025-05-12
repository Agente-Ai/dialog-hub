import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  whatsappBusinessAccountId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumberId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  from: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Número de telefone do cliente'
  },
  status: {
    type: DataTypes.ENUM('active', 'closed'),
    defaultValue: 'active'
  }
}, {
  paranoid: true, // Habilita soft delete
  timestamps: true
});

export default Conversation;
