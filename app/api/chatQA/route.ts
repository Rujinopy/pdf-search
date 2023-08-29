import { StreamingTextResponse } from 'ai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "langchain/schema/runnable";
import { StringOutputParser, BytesOutputParser } from "langchain/schema/output_parser";
import { Document } from "langchain/document";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
  const vectorStore = await MemoryVectorStore.fromTexts(
    ["mitochondria is the powerhouse of the cell"],
    [{ id: 1 }],
    new OpenAIEmbeddings()
  );
  const retriever = vectorStore.asRetriever();
  
  const prompt =
    PromptTemplate.fromTemplate(`Answer the question based only on the following context:
  {context}
  
  Question: {question}`);
  
  const serializeDocs = (docs: Document[]) =>
    docs.map((doc) => doc.pageContent).join("\n");
  
  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(serializeDocs),
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    new BytesOutputParser(),
  ]);
  
  const result = await chain.stream(query);
  console.log(result);
  return new StreamingTextResponse(result)
}