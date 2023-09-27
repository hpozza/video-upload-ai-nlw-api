import { FastifyInstance } from "fastify";
import { prisma } from "../lib/primsa";
import { z } from 'zod';
import { createReadStream } from "fs";
//import { openai } from "../lib/openai";
import OpenAI from "openai";

export async function createTranscriptioRoute(app: FastifyInstance) {
    app.post('/videos/:videoId/transcription', async (req) => {
        const parasmSchema = z.object({
            videoId: z.string().uuid(),
        })

        const { videoId } = parasmSchema.parse(req.params)

        const bodySchema = z.object({
            prompt: z.string(),
        })

        const { prompt } = bodySchema.parse(req.body)

        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId,
            }
        })

        const videoPath = video.path

        const audioReadStream = createReadStream(videoPath)

        const openai = new OpenAI()

        const response = await openai.audio.transcriptions.create({
            file: audioReadStream,
            model:"whisper-1",
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt,
        })

        


        const transcription = response.text;

        /* await prisma.video.update({
            where: {
                id: videoId,
            },
            data: {
                transcription,
            }
        })
 */
        return { transcription }

    })
}