import { Pinecone } from "@pinecone-database/pinecone";
import { generateEmbeddings } from "./embeddings";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const index = pc.index("brainly-test");

interface AddVectorDataProps {
  id: number;
  vectorString: string;
  // TODO change any to required Type
  metaData: any;
}

export const addVectorData = async ({
  id,
  vectorString,
  metaData,
}: AddVectorDataProps) => {
  try {
    const embedding = await generateEmbeddings(vectorString);

    if (embedding) {
      const vector = embedding.data[0].embedding;

      await index.upsert([
        { id: String(id), values: vector, metadata: { ...metaData } },
      ]);
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteVectorData = async (id: string) => {
  try {
    await index.deleteOne(id);
  } catch (error) {
    console.log(error);
  }
};
