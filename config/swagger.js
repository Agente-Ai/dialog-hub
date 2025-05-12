import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Dialog Hub API',
    version: '1.0.0',
    description: 'API para gerenciar conversas e mensagens do WhatsApp',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
    contact: {
      name: 'Support',
      url: 'https://github.com/murilobd',
      email: 'example@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Servidor de desenvolvimento',
    },
    {
      url: 'https://dialog-hub-api.com',
      description: 'Servidor de produção',
    },
  ],
  components: {
    schemas: {
      Conversation: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID único da conversa',
          },
          whatsappBusinessAccountId: {
            type: 'string',
            description: 'ID da conta de negócios do WhatsApp',
          },
          phoneNumberId: {
            type: 'string',
            description: 'ID do número de telefone',
          },
          from: {
            type: 'string',
            description: 'Número de telefone do cliente',
          },
          status: {
            type: 'string',
            enum: ['active', 'closed'],
            description: 'Status da conversa',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de atualização',
          },
        },
      },
      Message: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID único da mensagem',
          },
          messageId: {
            type: 'string',
            description: 'ID original da mensagem do WhatsApp',
          },
          text: {
            type: 'string',
            description: 'Conteúdo da mensagem',
          },
          type: {
            type: 'string',
            enum: ['incoming', 'outgoing'],
            description: 'Tipo da mensagem (recebida/enviada)',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp da mensagem',
          },
          ConversationId: {
            type: 'string',
            format: 'uuid',
            description: 'ID da conversa relacionada',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de atualização',
          },
        },
      },
    },
  },
};

// Opções para o Swagger JSDoc
const options = {
  swaggerDefinition,
  // Caminhos para os arquivos que contém anotações Swagger
  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
