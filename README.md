# Dialog Hub

Sistema de gerenciamento de conversas e mensagens do WhatsApp, integrado com a API do WhatsApp Business.

## Funcionalidades

- Recebimento de mensagens via webhook do WhatsApp
- Envio de mensagens via API do WhatsApp
- Gerenciamento de conversas e mensagens
- API REST com documentação Swagger
- Integração com PostgreSQL para armazenamento persistente
- Sistema de filas com RabbitMQ

## Tecnologias

- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- RabbitMQ
- Swagger UI
- Docker

## Requisitos

- Node.js 18+
- PostgreSQL
- RabbitMQ
- Docker e Docker Compose (opcional)

## Instalação

### Utilizando Docker (recomendado)

1. Clone o repositório:
```bash
git clone https://github.com/Agente-Ai/dialog-hub.git
cd dialog-hub
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Inicie os containers:
```bash
docker-compose up -d
```

4. Acesse a documentação da API:
```
http://localhost:8080/api-docs
```

### Instalação Manual

1. Clone o repositório:
```bash
git clone https://github.com/Agente-Ai/dialog-hub.git
cd dialog-hub
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute a migração do banco de dados:
```bash
npm run db:migrate
```

5. (Opcional) Popule o banco de dados com dados de exemplo:
```bash
npm run db:seed
```

6. Inicie o servidor:
```bash
npm start
```

6. Acesse a documentação da API:
```
http://localhost:8080/api-docs
```

## Scripts de Banco de Dados

- `npm run db:migrate` - Executa a migração do banco de dados
- `npm run db:sync` - Sincroniza o esquema do banco de dados (modo seguro)
- `npm run db:seed` - Popula o banco de dados com dados de exemplo para testes
- `npm run db:examples` - Executa consultas de exemplo para testar o banco de dados

## Modelos de Dados

### Tabela de Conversas (conversations)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único da conversa |
| whatsapp_business_account_id | String | ID da conta de negócios do WhatsApp |
| phone_number_id | String | ID do número de telefone |
| display_phone_number | String | Número do telefone formatado para exibição |
| from | String | Número de telefone do cliente |
| status | Enum | Estado da conversa ('active', 'closed') |
| created_at | Timestamp | Data de criação |
| updated_at | Timestamp | Data de atualização |
| deleted_at | Timestamp | Data de exclusão (soft delete) |

### Tabela de Mensagens (messages)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único da mensagem |
| message_id | String | ID original da mensagem do WhatsApp |
| text | Text | Conteúdo da mensagem |
| type | Enum | Tipo da mensagem ('incoming', 'outgoing') |
| timestamp | Timestamp | Data e hora da mensagem |
| metadata | JSONB | Metadados adicionais da mensagem |
| conversation_id | UUID | ID da conversa relacionada |
| created_at | Timestamp | Data de criação |
| updated_at | Timestamp | Data de atualização |
| deleted_at | Timestamp | Data de exclusão (soft delete) |

## Estrutura do Projeto

- `models/` - Definições dos modelos do Sequelize
- `controllers/` - Controladores da aplicação
- `routes/` - Rotas da API
- `services/` - Serviços para lógica de negócios
- `consumers/` - Consumidores de filas RabbitMQ
- `config/` - Configurações da aplicação
- `database/` - Scripts relacionados ao banco de dados

## API

A documentação completa da API está disponível em `/api-docs` quando o servidor estiver em execução.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.