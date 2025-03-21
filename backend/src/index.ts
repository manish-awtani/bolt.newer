require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt } from "./prompt";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in the .env file.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// specific to javascript and typescript
async function main() {
    try {
        const response = await ai.models.generateContentStream({
            model: "gemini-2.0-flash-001",
            contents: [{ role: "system", parts: [{ text: getSystemPrompt() }] },
                { role: "user", parts: [{ text: "Create a simple TODO app" }] }],
        });

        for await (const chunk of response) {
            console.log(chunk.text);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

main();

// // specific to NodeJS
// async function main() {
//     try {

//         const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

//         const prompt = "Write the code for a TODO application";

//         const result = await model.generateContent(prompt);
//         console.log(result.response.text());
//     } catch (error) {
//         console.error("Error:", error);

//     }
// }

// main();
