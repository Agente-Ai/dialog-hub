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
| display_phone_number | String | Número do telefone formatado para exibição |
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
| message_id | String | ID original da mensagem do WhatsApp (apenas para mensagens recebidas) |
| content | JSONB | Conteúdo da mensagem (texto, imagem, áudio, vídeo, etc.) |
| type | Enum | Tipo da mensagem ('incoming', 'outgoing') |
| timestamp | Date | Data e hora da mensagem |
| metadata | JSONB | Metadados adicionais da mensagem |
| conversation_id | UUID | ID da conversa relacionada |
| created_at | Date | Data de criação do registro |
| updated_at | Date | Data da última atualização |
| deleted_at | Date | Data de exclusão (soft delete) |

## Relacionamentos

- Uma `Conversation` pode ter várias `Message`
- Uma `Message` pertence a uma única `Conversation`

## Diagrama ER

```
+------------------------+       +---------------------+
|      conversations     |       |       messages      |
+------------------------+       +---------------------+
| id                     |       | id                  |
| whatsapp_business_acco |       | message_id          |
| phone_number_id        |       | text                |
| display_phone_number   |       | type                |
| from                   |       | timestamp           |
| status                 |       | metadata            |
| created_at             |       | conversation_id     |
| updated_at             |       | created_at          |
| deleted_at             |       | updated_at          |
+------------------------+       | deleted_at          |
          |                      +---------------------+
          |                               |
          +----------|--------------------|
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
