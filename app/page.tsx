'use client'
import { ChangeEvent, ChangeEventHandler, useState, useEffect } from "react";

interface IAnswer {
  query: {
    text: string;
  }
}

export default function Home() {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");

  const onload = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/qa", {
        method: "POST",
        body: JSON.stringify({ query: question }),
      });

      if (!response.ok) {
        throw new Error("Request was not successful");
      }

      const data = await response.json();
      console.log(data);
      setAnswer(data.query.text)
      
      setQuestion("");
    } catch (error: any) {
      console.log("Error:", error.message);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  //invalidate answer when answer changes
  
  useEffect(() => {

    console.log(answer)
  }, [answer])

  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 mx-auto">
      <div>{answer && <p>{answer}</p>}</div>
      <input type="text" value={question} onChange={handleChange} />
      <button onClick={onload}>Load PDF</button>
    </main>
  );
}
