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
          whatsapp_business_account_id: {
            type: 'string',
            description: 'ID da conta de negócios do WhatsApp',
          },
          phone_number_id: {
            type: 'string',
            description: 'ID do número de telefone',
          },
          display_phone_number: {
            type: 'string',
            description: 'Número de telefone formatado para exibição',
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
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação',
          },
          updated_at: {
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
          message_id: {
            type: 'string',
            description: 'ID original da mensagem do WhatsApp',
          },
          content: {
            type: 'object',
            description: 'Conteúdo da mensagem (texto, imagem, áudio, vídeo, etc.)',
            properties: {
              type: {
                type: 'string',
                enum: ['text', 'image', 'audio', 'video', 'document', 'unknown'],
                description: 'Tipo do conteúdo da mensagem'
              },
              text: {
                type: 'string',
                description: 'Texto da mensagem (quando o tipo é text)'
              },
              image: {
                type: 'object',
                description: 'Dados da imagem (quando o tipo é image)'
              },
              audio: {
                type: 'object',
                description: 'Dados do áudio (quando o tipo é audio)'
              },
              video: {
                type: 'object',
                description: 'Dados do vídeo (quando o tipo é video)'
              },
              document: {
                type: 'object',
                description: 'Dados do documento (quando o tipo é document)'
              }
            }
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
          conversation_id: {
            type: 'string',
            format: 'uuid',
            description: 'ID da conversa relacionada',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação',
          },
          updated_at: {
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
