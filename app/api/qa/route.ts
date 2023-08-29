import { NextRequest, NextResponse } from "next/server";
import { loadPDF } from "@/utils/load-pdf";
import { ConversationalRetrievalQAChain, VectorDBQAChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
interface reqBody {
  query: string;
}

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  let streamedResponse = "";
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          streamedResponse += token;
        },
      },
    ],
  });
  const docs = await loadPDF();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
  });
  const splitDocs = await textSplitter.splitDocuments(docs);
  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );
  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 5,
    verbose: true,
    returnSourceDocuments: true,
  });

  const response = await chain.call({
    query: query,
  });
  console.log(response);
  return NextResponse.json({ query: response });
}
