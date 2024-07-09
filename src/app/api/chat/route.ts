// app/api/chat/route.ts

import { HfInference } from '@huggingface/inference'
import { HuggingFaceStream, StreamingTextResponse } from 'ai'

// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY!)

// Build Gemma prompt from the messages
function buildPrompt(
  messages: { content: string; role: 'system' | 'user' | 'assistant' }[]
) {
  return messages
    .map(m =>
      m.role === 'user'
        ? `<start_of_turn>user\n${m.content}<end_of_turn>`
        : `<start_of_turn>model\n${m.content}<end_of_turn>`
    )
    .join('\n');
}

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Request the HuggingFace API for the response based on the prompt
  const response = await Hf.textGenerationStream({
    model: 'google/gemma-2b-it',
    inputs: buildPrompt(messages),
    parameters: {
      max_new_tokens: 1024,
      temperature: 0.5,
      top_p: 0.95,
      top_k: 4,
      repetition_penalty: 1.03,
      truncate: 1000,
    }
  })

  // Convert the response into a friendly text-stream
  const stream = HuggingFaceStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}
