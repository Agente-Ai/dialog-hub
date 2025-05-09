import express from "express";
import { createWebhookController } from "../controllers/webhookController.js";

export default ({ GRAPH_API_TOKEN, WEBHOOK_VERIFY_TOKEN }) => {
    const router = express.Router();

    const { handleWebhookPost, handleWebhookGet } = createWebhookController({
        GRAPH_API_TOKEN,
        WEBHOOK_VERIFY_TOKEN,
    });

    router.post("/webhook", handleWebhookPost);
    router.get("/webhook", handleWebhookGet);

    return router;
};