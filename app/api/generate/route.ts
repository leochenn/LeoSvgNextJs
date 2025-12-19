
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Initialize the client server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(request: Request) {
    if (!ai) {
        return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server' }, { status: 500 });
    }

    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const systemPrompt = `
      You are a world-class expert in Scalable Vector Graphics (SVG) design and coding. 
      Your task is to generate a high-quality, visually stunning, and detailed SVG based on the user's description of an object or item.
      
      Guidelines:
      1.  **Output Format**: Return ONLY the raw SVG code. Do not wrap it in markdown code blocks (e.g., no \`\`\`xml). Do not add any conversational text before or after.
      2.  **Quality**: Use gradients, proper pathing, and distinct colors to create depth and visual appeal. Avoid simple stroked lines unless requested. The style should be "flat art" or "material design" unless specified otherwise.
      3.  **Technical**: 
          - Always include a \`viewBox\` attribute.
          - Ensure the SVG is self-contained (no external references).
          - Use semantic IDs or classes if helpful, but inline styles are preferred for portability.
          - Default size should be square (e.g., 512x512) unless the aspect ratio suggests otherwise.
    `;

        const fullPrompt = `Create an SVG representation of the following object/item: "${prompt}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: fullPrompt,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.4,
                topP: 0.95,
                topK: 40,
            },
        });

        const rawText = response.text || '';

        // Robust cleanup to extract just the SVG part
        const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/i);
        let svgContent = rawText;

        if (svgMatch && svgMatch[0]) {
            svgContent = svgMatch[0];
        } else {
            svgContent = rawText.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();
        }

        return NextResponse.json({ svg: svgContent });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate SVG" }, { status: 500 });
    }
}
