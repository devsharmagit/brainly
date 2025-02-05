import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyC0pPVg8sQyNw_PYNQjswnUEaYvnDzoEKY");
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
