# Exemplos de Requisições para o Dialog Hub

Este arquivo contém exemplos de requisições que podem ser feitas para a API do Dialog Hub.

## Webhook do WhatsApp

### Exemplo de payload de mensagem recebida

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "1193249252340821",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "555131990963",
              "phone_number_id": "638465516014689"
            },
            "contacts": [
              {
                "profile": {
                  "name": "Murilo Eduardo Dos Santos"
                },
                "wa_id": "555174019092"
              }
            ],
            "messages": [
              {
                "from": "555174019092",
                "id": "wamid.HBgMNTU1MTc0MDE5MDkyFQIAEhgWM0VCMDFFNDc4QzEyRUU5RjYyRTE4NQA=",
                "timestamp": "1747066492",
                "text": {
                  "body": "Sempre pensei nisso!"
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

### Exemplo alternativo de payload de mensagem recebida

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "123456789",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "5511999999999",
              "phone_number_id": "1234567890",
              "wabaId": "9876543210"
            },
            "contacts": [
              {
                "profile": {
                  "name": "Cliente Exemplo"
                },
                "wa_id": "5511988888888"
              }
            ],
            "messages": [
              {
                "from": "5511988888888",
                "id": "wamid.abcdefghijklmnopqrstuvwxyz",
                "timestamp": "1652345678",
                "type": "text",
                "text": {
                  "body": "Olá, preciso de ajuda!"
                }
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

### Exemplo de payload para envio de mensagem

```json
{
  "phone_number_id": "1234567890",
  "from": "5511988888888",
  "text": "Olá! Em que posso ajudar?",
  "whatsappBusinessAccountId": "9876543210"
}
```

## API REST

### Listar todas as conversas

```
GET /api/conversations
```

### Buscar uma conversa específica

```
GET /api/conversations/550e8400-e29b-41d4-a716-446655440000
```

### Listar mensagens de uma conversa

```
GET /api/conversations/550e8400-e29b-41d4-a716-446655440000/messages
```

### Fechar uma conversa

```
PUT /api/conversations/550e8400-e29b-41d4-a716-446655440000/close
```
