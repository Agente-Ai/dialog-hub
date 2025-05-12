import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { startConsumers } from "./consumers/index.js";
import createWebhookRoutes from "./routes/webhookRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import { connectToRabbitMQ, publishToQueue } from "./rabbitmq.js";
import { syncDatabase } from "./models/index.js";
import swaggerSpec from "./config/swagger.js";

dotenv.config();

const app = express();
app.use(express.json());

const { PORT, GRAPH_API_TOKEN, WEBHOOK_VERIFY_TOKEN } = process.env;

(async () => {
    try {
        // Sincroniza o banco de dados
        await syncDatabase();
        console.log('Database initialized successfully');

        const rabbitMQChannel = await connectToRabbitMQ();

        // Start consumers with dependencies
        startConsumers({
            rabbitMQChannel,
            GRAPH_API_TOKEN,
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

// Inject dependencies into webhook routes
const webhookRoutes = createWebhookRoutes({
    GRAPH_API_TOKEN,
    WEBHOOK_VERIFY_TOKEN,
    publishToQueue,
});

app.use(webhookRoutes);
app.use('/api', conversationRoutes);
app.use('/api', statisticsRoutes);

// Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint para o arquivo JSON do Swagger
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.get("/", (req, res) => {
    res.send('ok');
});

app.listen(PORT || 8080, () => {
    console.log(`Server is listening on port: ${PORT || 8080}`);
});
