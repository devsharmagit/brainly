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

export const deleteVectorData = async (memoryId: string) => {
  try {
    await index.deleteOne(memoryId);
  } catch (error) {
    console.log(error);
  }
};

export const queryVectorDB = async (userId : number, embedding: number[])=>{
try {
  const result = await index.query({
    vector: embedding,
    topK: 5,
    filter: {
      userId
    },
    includeMetadata: true
  })
  return result
} catch (error) {
  console.log(error)
}
}

export const getVectorEmbeddigsById = async (id : number)=>{
  try {
  const result = await index.fetch([String(id)])
  const record = result.records[String(id)]
  if (!record) return null
  const {values} = record
    return values

  } catch (error) {
    console.log(error)
    return null
  }
}
