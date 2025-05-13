import { findOrCreateConversation } from './conversationService.js';
import ContentMessage from '../models/ContentMessage.js';
import StatusMessage from '../models/StatusMessage.js';

/**
 * Salva uma mensagem recebida do webhook do WhatsApp
 */
export const saveIncomingMessage = async (messageData) => {
  try {
    // Extrai dados relevantes da mensagem recebida
    const entry = messageData.entry[0];
    const value = entry.changes[0].value;
    const statuses = value.statuses;
    const messages = value.messages;
    const isStatusMessage = !messages || messages.length === 0;
    const event = isStatusMessage ? statuses[0] : messages[0];
    const messageId = event.id;
    const timestamp = new Date(event.timestamp * 1000);
    const metadata = value.metadata
    const phoneNumberId = metadata.phone_number_id;
    const displayPhoneNumber = metadata.display_phone_number;
    const whatsappBusinessAccountId = entry.id;
    const from = isStatusMessage ? event.recipient_id : event.from;

    let content = {};

    // Encontra ou cria a conversa
    const { conversation } = await findOrCreateConversation({
      from,
      phoneNumberId,
      displayPhoneNumber,
      whatsappBusinessAccountId,
    });

    if (statuses) {
      console.log('Salvando status recebido');

      // Salva na tabela de mensagens de status
      const savedMessage = await StatusMessage.create({
        messageId,
        timestamp,
        content: event,
        type: event.status,
        metadata: messageData,
        ConversationId: conversation.id,
      });

      return savedMessage;
    } else if (messages) {
      console.log('Salvando mensagem recebida');

      content = {
        type: event.type,
        [event.type]: event[event.type].body,
      };

      // Salva na tabela de mensagens de conteúdo
      const savedMessage = await ContentMessage.create({
        content,
        messageId,
        timestamp,
        type: 'incoming',
        metadata: messageData,
        ConversationId: conversation.id,
      });

      return savedMessage;
    }
  } catch (error) {
    console.error('Erro ao salvar mensagem recebida:', error);
    throw error;
  }
};

/**
 * Salva uma mensagem enviada para o API do WhatsApp
 */
export const saveOutgoingMessage = async (messageData) => {
  try {
    console.log('Salvando mensagem enviada');

    // Extrai dados relevantes da mensagem enviada
    const {
      from,
      content,
      messageId,
      timestamp,
      phone_number_id: phoneNumberId,
      display_phone_number: displayPhoneNumber,
      whatsapp_business_account_id: whatsappBusinessAccountId,
    } = messageData;

    // Encontra ou cria a conversa
    const { conversation } = await findOrCreateConversation({
      from,
      phoneNumberId,
      displayPhoneNumber,
      whatsappBusinessAccountId,
    });

    // Salva na tabela de mensagens de conteúdo
    const savedMessage = await ContentMessage.create({
      content,
      messageId,
      timestamp,
      type: 'outgoing',
      metadata: messageData,
      ConversationId: conversation.id,
    });

    return savedMessage;
  } catch (error) {
    console.error('Erro ao salvar mensagem enviada:', error);
    throw error;
  }
};
