require("dotenv").config();
import express from "express";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenAI } from "@google/genai";
import { BASE_PROMPT, getSystemPrompt } from "./prompt";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in the .env file.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const app = express();
app.use(express.json());

app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-001",
            contents: [{ role: "system", parts: [{ text: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra" }] },
                { role: "user", parts: [{ text: prompt }] },
            ],
        });

        const answer = response.text; // react or node
        if (answer != "react" && answer != "node") {
            res.status(403).json({message: "You can't access this"})
        }
        console.log(response);
        
    } catch (error) {
        console.error("Error:", error);
    }


})

// specific to javascript and typescript
async function main() {
    try {
        const response = await ai.models.generateContentStream({
            model: "gemini-2.0-flash-001",
            contents: [{ role: "system", parts: [{ text: getSystemPrompt() }] },
                { role: "user", parts: [{ text: BASE_PROMPT }] },
                { role: "user", parts: [{ text: "Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${BASE_PROMPT}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n - .bolt/prompt" }] },
                { role: "user", parts: [{ text: "Create a simple TODO app" }] },
            ],
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
