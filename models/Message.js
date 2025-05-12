import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Conversation from './Conversation.js';

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  messageId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'message_id',
    comment: 'ID original da mensagem do WhatsApp'
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('incoming', 'outgoing'),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Dados adicionais da mensagem'
  }
}, {
  paranoid: true, // Habilita soft delete
  timestamps: true
});

// Configurando a associação
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

export default Message;
