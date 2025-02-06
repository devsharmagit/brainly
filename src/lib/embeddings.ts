import { GoogleGenerativeAI } from "@google/generative-ai";
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export const generateEmbeddings = async (input: string) => {
  try {
    if (!input) return;
    const result = await model.embedContent(input);

    return result.embedding.values;
  } catch (error) {
    console.log(error);
  }
};
