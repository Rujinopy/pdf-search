import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { convertPath } from "./convertPath";
// import fs from "fs";
const windowpath = "C:\\Users\\ruth3\\OneDrive\\Desktop\\color-theory.pdf";

export async function loadPDF() {
// const loader = new PDFLoader("C:\Users\ruth3\OneDrive\Desktop\color-theory.pdf");
const path = convertPath(windowpath);
const loader = new PDFLoader(path)

const docs = await loader.load();

return docs;
}