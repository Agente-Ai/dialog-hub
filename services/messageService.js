import Message from '../models/Message.js';
import { findOrCreateConversation } from './conversationService.js';

/**
 * Salva uma mensagem recebida do webhook do WhatsApp
 */
export const saveIncomingMessage = async (messageData) => {
  try {
    console.log('Salvando mensagem recebida:', messageData);

    // Extrai dados relevantes da mensagem recebida
    const entry = messageData.entry[0];
    const value = entry.changes[0].value;
    const statuses = value.statuses;
    const messages = value.messages;
    const isStatusMessage = !messages || messages.length === 0;
    const event = isStatusMessage ? statuses[0] : messages[0];
    const messageId = event.id;
    const timestamp = event.timestamp;
    const metadata = value.metadata;
    const type = isStatusMessage ? 'status' : event.type;
    const phoneNumberId = metadata.phone_number_id;
    const displayPhoneNumber = metadata.display_phone_number;
    const whatsappBusinessAccountId = entry.id;

    let content = {};
    let from = event.from;

    if (statuses) {
      from = event.recipient_id;
      content = {
        type,
        raw: event,
      };
    } else if (messages) {
      content = {
        type,
        [type]: event[type].body,
      }
    } else {
      content = {
        type: 'unknown',
        raw: event,
      };
    }

    // Encontra ou cria a conversa
    const { conversation } = await findOrCreateConversation({
      whatsappBusinessAccountId,
      phoneNumberId,
      displayPhoneNumber,
      from
    });

    // Cria a mensagem
    const savedMessage = await Message.create({
      messageId,
      content,
      type: 'incoming',
      timestamp: new Date(timestamp * 1000), // Converte timestamp Unix para Date
      ConversationId: conversation.id,
      metadata: messageData // Armazena todos os metadados para referência
    });

    return savedMessage;
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
    console.log('Salvando mensagem enviada:', messageData);

    // Extrai dados relevantes da mensagem enviada
    const { content, from, phone_number_id: phoneNumberId, display_phone_number: displayPhoneNumber, messageId } = messageData;

    console.log('Conteúdo da mensagem enviada:', content);
    console.log('Número de telefone do remetente:', from);
    console.log('ID do número de telefone:', phoneNumberId);
    console.log('Número de telefone formatado para exibição:', displayPhoneNumber);
    console.log('ID da mensagem:', messageId);
    console.log('Dados adicionais da mensagem:', messageData);

    // Encontra a conversa
    const { conversation } = await findOrCreateConversation({
      from,
      phoneNumberId,
      displayPhoneNumber,
      whatsappBusinessAccountId: messageData.whatsapp_business_account_id,
    });

    // Cria a mensagem
    const savedMessage = await Message.create({
      content,
      messageId,
      type: 'outgoing',
      ConversationId: conversation.id,
      metadata: messageData // Armazena os metadados adicionais
    });

    return savedMessage;
  } catch (error) {
    console.error('Erro ao salvar mensagem enviada:', error);
    throw error;
  }
};
