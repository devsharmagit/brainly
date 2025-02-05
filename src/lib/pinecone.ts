import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const index = pc.index("gemini-test");

interface AddVectorDataProps {
  id: number;
  vector_embeddings: number[];
  // TODO change any to required Type
  metaData: {
    content: string;
    userId: number;
    memoryId: number;
  };
}

export const addVectorData = async ({
  id,
  vector_embeddings,
  metaData,
}: AddVectorDataProps) => {
  try {
    await index.upsert([
      { id: String(id), values: vector_embeddings, metadata: { ...metaData } },
    ]);
    return true
  } catch (error) {
    console.log(error);
    return false
  }
};

export const deleteVectorData = async (id: string) => {
  try {
    await index.deleteOne(id);
  } catch (error) {
    console.log(error);
  }
};
