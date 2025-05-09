import dotenv from "dotenv";
import express from "express";
import createWebhookRoutes from "./routes/webhookRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

const { PORT, GRAPH_API_TOKEN, GRAPH_NUMBER_ID, WEBHOOK_VERIFY_TOKEN } = process.env;

// Inject dependencies into webhook routes
const webhookRoutes = createWebhookRoutes({
    GRAPH_API_TOKEN,
    WEBHOOK_VERIFY_TOKEN,
});

app.use(webhookRoutes);

app.get("/", (req, res) => {
    res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT || 8080, () => {
    console.log(`Server is listening on port: ${PORT || 8080}`);
});
