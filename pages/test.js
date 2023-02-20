import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import Link from 'next/link';

export default function Test() {
  const [questionInput, setQuestionInput] = useState("");
  const [conversation, setConversation] = useState("");
  
  async function onSubmit(event) {
    event.preventDefault();
    try {
      setQuestionInput("");
      setConversation(`${conversation}<div><span>Human:</span> ${questionInput}</div>`);
      const response = await fetch("/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput })
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

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.submit();
    }
  }

  return (
    <div>
      <Head>
        <title>Test</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <Link href="/">Go to Chat Page</Link>
        <div className={styles.response} dangerouslySetInnerHTML={{__html: conversation}}></div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="Ask a question"
            value={questionInput}
            onKeyDown={handleKeyDown}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
        </form>
      </main>
    </div>
  );
}
