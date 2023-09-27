import { FastifyInstance } from "fastify";
import { prisma } from "../lib/primsa";
import { openai } from "../lib/openai";

export async function getAllPromptsRoute(app: FastifyInstance) {
    app.get('/prompts', async () => {
        const prompts = await prisma.prompt.findMany();


        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Say this is a test" }],
            model: "gpt-3.5-turbo",
        });

        
        return chatCompletion;
    })
}