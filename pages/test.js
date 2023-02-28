import Head from "next/head";
import styles from "./index.module.css";
import Link from 'next/link';
import { useState, useEffect } from "react";

export default function Home() {
  const [conversation, setConversation] = useState("");
  const [prompt, setPrompt] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [shouldRepeat, setShouldRepeat] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isRequesting) {
        return;
      }

      setIsRequesting(true);

      const response = await fetch("/api/initiateConversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversation, prompt: currentPrompt }),
      });

      const data = await response.json();
      setConversation(conversation => conversation + '\n' + data.result);
      setIsRequesting(false);
    };

    let intervalId = null;

    if (shouldRepeat) {
      fetchData();

      intervalId = setInterval(() => {
        fetchData();
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [shouldRepeat, currentPrompt, conversation, isRequesting]);

  const setThePrompt = e => {
    e.preventDefault();
    setCurrentPrompt(prompt);
    setPrompt("");
  }

  const handleButtonClick = () => {
    setShouldRepeat(true);
  };

  return (
    <div>
      <Head>
        <title>JimboGPT</title>
      </Head>

      <main className={styles.main}>
        <h2>JimboGPT</h2>
        <Link href="/">Back to Home</Link>
        <div className={styles.response}>
          {conversation}
        </div>
        <div>Current Topic: {currentPrompt || 'none'}</div>
        <button className={styles.button} onClick={handleButtonClick}>Start Conversation</button>
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
