import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class ContentMessage extends Model { }

ContentMessage.init({
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
    modelName: 'ContentMessage',
    tableName: 'content_messages',
    timestamps: true,
    paranoid: true,
});

export default ContentMessage;
