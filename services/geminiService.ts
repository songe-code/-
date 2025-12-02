import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ExplanationResponse } from "../types";

// Initialize Gemini Client
// WARNING: process.env.API_KEY must be set in your environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a structured explanation for a futures trading concept.
 */
export const fetchConceptExplanation = async (conceptName: string): Promise<ExplanationResponse> => {
  try {
    const prompt = `
      Create a simple, educational explanation for the Futures Trading concept: "${conceptName}".
      Target audience: Beginners in China.
      Language: Chinese (Simplified).
      
      Return a JSON object with:
      1. definition: A clear, formal definition (max 2 sentences).
      2. analogy: A real-world metaphor (e.g., buying a house, booking a hotel) to explain it simply.
      3. keyPoint: One crucial thing to remember.
      4. example: A very short numerical or scenario example.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: { type: Type.STRING },
            analogy: { type: Type.STRING },
            keyPoint: { type: Type.STRING },
            example: { type: Type.STRING },
          },
          required: ["definition", "analogy", "keyPoint", "example"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data received from Gemini");

    return JSON.parse(jsonText) as ExplanationResponse;

  } catch (error) {
    console.error("Error fetching explanation:", error);
    throw error;
  }
};

/**
 * Generates audio speech for the provided text using Gemini TTS.
 */
export const fetchConceptSpeech = async (text: string): Promise<ArrayBuffer> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is usually a good neutral voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data received");
    }

    // Decode Base64 to ArrayBuffer
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes.buffer;

  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};

/**
 * Helper to decode raw PCM/Audio data for playback
 */
export const decodeAudioData = async (
  audioData: ArrayBuffer,
  audioContext: AudioContext
): Promise<AudioBuffer> => {
  // Since the API returns raw PCM in a specific container, typically we can use decodeAudioData
  // Note: The new SDK usually returns a container format (WAV/MP3 inside the bytes) depending on config, 
  // but standard browser decodeAudioData handles most common headers automatically.
  // If it's raw PCM without headers, we need manual decoding, but currently 
  // generateContent with Modality.AUDIO typically provides a decodable stream.
  
  return await audioContext.decodeAudioData(audioData);
};