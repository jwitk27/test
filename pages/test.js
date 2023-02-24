import Head from "next/head";
import styles from "./index.module.css";
import Link from 'next/link';
import { useState } from "react";

export default function Home() {
  const [conversation, setConversation] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");

  async function conversate() {
    try {
  
      const response = await fetch("/api/talkToYourself", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversation: conversation, prompt: currentPrompt }),
      });
  
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
  
      setConversation([data.result, ...conversation]);

      console.log(conversation);

      setTimeout(() => {
        conversate();
      }, 1000);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const setThePrompt = e => {
    e.preventDefault();
    setCurrentPrompt(prompt);
    setPrompt("");
  }

  return (
    <div>
      <Head>
        <title>JimboGPT</title>
      </Head>

      <main className={styles.main}>
        <h2>JimboGPT</h2>
        <Link href="/">Back to Home</Link>
        <div className={styles.response}>
          {conversation.map((message, index) => (
            <div key={index} className={message.context === "human" ? styles.question : styles.answer}>
              <span className={message.context === "human" ? styles.human : styles.ai}>
                {message.content}
              </span>
            </div>
          ))}
        </div>
        <div>Current Topic: {currentPrompt || 'none'}</div>
        <button className={styles.button} onClick={conversate}>Start Conversation</button>
        <p>Choose a topic for the AIs to discuss:</p>
        <form onSubmit={setThePrompt}>
          <input
            type="text"
            name="prompt"
            placeholder="Enter a prompt"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
        </form>
      </main>
    </div>
  );
}