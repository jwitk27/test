import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  const [conversation, setConversation] = useState("");
  
  async function onSubmit(event) {
    event.preventDefault();
    try {
      setQuestionInput("");
      setConversation(`${conversation}<div><span>Human:</span> ${questionInput}</div>`);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput, conversation: conversation })
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setConversation(`${conversation}<div><span>Human:</span> ${questionInput}</div><div><span>AI:</span>${data.result}</div>`);

    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Test</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Test</h3>
        <div className={styles.response} dangerouslySetInnerHTML={{__html: conversation}}></div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="Ask a question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
        </form>
      </main>
    </div>
  );
}
