# Dialog Hub - Modelo de Dados

Este documento descreve o modelo de dados utilizado no Dialog Hub para gerenciar conversas e mensagens do WhatsApp.

## Modelo Conversation (Conversa)

O modelo `Conversation` representa uma conversa com um cliente via WhatsApp.

### Atributos

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| id | UUID | Identificador único da conversa |
| whatsapp_business_account_id | String | ID da conta de negócios do WhatsApp |
| phone_number_id | String | ID do número de telefone |
| display_phone_number | String | Número de telefone formatado para exibição |
| from | String | Número de telefone do cliente |
| status | Enum | Estado da conversa ('active', 'closed') |
| created_at | Date | Data de criação do registro |
| updated_at | Date | Data da última atualização |
| deleted_at | Date | Data de exclusão (soft delete) |

## Modelo Message (Mensagem)

O modelo `Message` representa uma mensagem individual dentro de uma conversa.

### Atributos

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| id | UUID | Identificador único da mensagem |
| messageId | String | ID original da mensagem do WhatsApp (apenas para mensagens recebidas) |
| text | Text | Conteúdo da mensagem |
| type | Enum | Tipo da mensagem ('incoming', 'outgoing') |
| timestamp | Date | Data e hora da mensagem |
| metadata | JSONB | Metadados adicionais da mensagem |
| ConversationId | UUID | ID da conversa relacionada |
| createdAt | Date | Data de criação do registro |
| updatedAt | Date | Data da última atualização |
| deletedAt | Date | Data de exclusão (soft delete) |

## Relacionamentos

- Uma `Conversation` pode ter várias `Message`
- Uma `Message` pertence a uma única `Conversation`

## Diagrama ER

```
+-------------------+       +------------------+
|   Conversation    |       |     Message      |
+-------------------+       +------------------+
| id                |       | id               |
| whatsappBusinessA |       | messageId        |
| phoneNumberId     |       | text             |
| from              |       | type             |
| status            |       | timestamp        |
| createdAt         |       | metadata         |
| updatedAt         |       | ConversationId   |
| deletedAt         |       | createdAt        |
+-------------------+       | updatedAt        |
         |                  | deletedAt        |
         |                  +------------------+
         |                          |
         +----------|--------------+
                    |
                  1 : N
```

## Fluxo de Dados

1. **Mensagem Recebida (Incoming)**:
   - Recebida via webhook do WhatsApp
   - Processada pelo controlador `webhookController`
   - Salva no banco usando `saveIncomingMessage` 
   - Publicada em uma fila RabbitMQ para processamento adicional

2. **Mensagem Enviada (Outgoing)**:
   - Recebida de uma fila RabbitMQ
   - Processada pelo consumidor `consumer-to-send`
   - Salva no banco usando `saveOutgoingMessage`
   - Enviada para a API do WhatsApp
