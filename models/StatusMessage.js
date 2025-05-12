import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class StatusMessage extends Model { }

StatusMessage.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    content: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    messageId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ConversationId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'StatusMessage',
    tableName: 'status_messages',
    timestamps: true,
    paranoid: true,
});

export default StatusMessage;
