import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  const [htmlString, setHtmlString] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput, html: htmlString.replace(/\n/g, '').replace(/\s*(<[^>]*>)/g, '$1') })
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setHtmlString(data.result);
      setQuestionInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>ChatGPT</h3>
        <form onSubmit={onSubmit}>
          <textarea
            type="text"
            name="question"
            placeholder="Ask a question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          >
          </textarea>
          <input type="submit" value="Answer" />
        </form>
        <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>
      </main>
    </div>
  );
}
