import { Op } from 'sequelize';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

/**
 * Obtém estatísticas gerais das conversas e mensagens
 */
export const getStatistics = async () => {
  try {
    // Total de conversas
    const totalConversations = await Conversation.count();
    
    // Conversas ativas
    const activeConversations = await Conversation.count({
      where: { status: 'active' }
    });
    
    // Total de mensagens
    const totalMessages = await Message.count();
    
    // Mensagens enviadas
    const outgoingMessages = await Message.count({
      where: { type: 'outgoing' }
    });
    
    // Mensagens recebidas
    const incomingMessages = await Message.count({
      where: { type: 'incoming' }
    });
    
    // Estatísticas das últimas 24 horas
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const conversationsLast24h = await Conversation.count({
      where: {
        createdAt: {
          [Op.gte]: oneDayAgo
        }
      }
    });
    
    const messagesLast24h = await Message.count({
      where: {
        createdAt: {
          [Op.gte]: oneDayAgo
        }
      }
    });
    
    return {
      conversations: {
        total: totalConversations,
        active: activeConversations,
        closed: totalConversations - activeConversations,
        last24h: conversationsLast24h
      },
      messages: {
        total: totalMessages,
        incoming: incomingMessages,
        outgoing: outgoingMessages,
        last24h: messagesLast24h
      }
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw error;
  }
};
