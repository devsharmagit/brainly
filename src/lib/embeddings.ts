import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateEmbeddings = async (input: string) => {
  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input,
      encoding_format: "float",
    });

    return embedding;
  } catch (error) {
    console.log(error);
  }
};
