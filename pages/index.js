import Head from "next/head";
import styles from "./index.module.css";
import Link from 'next/link';
import { useState, useRef } from "react";

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setQuestionInput("");
  
      const humanQuestion = { content: questionInput, className: "human-message", context: "human" };
  
      // Create a new conversation array with the updated message
      const conversationData = [humanQuestion, ...conversation];
  
      setConversation(conversationData);
  
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput, conversation: conversationData, prompt: currentPrompt }),
      });
  
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
  
      const aiResponse = { content: data.result, className: "ai-message", context: "ai" };
  
      // Update the conversation state with the AI response
      setConversation([aiResponse, ...conversationData]);
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
        <p>You can enter a prompt to determine the behavior of the AI.</p>
        <p>For example:</p>
        <ul>
          <li>"include dog sounds in every response"</li>
          <li>"respond as though you're macho man randy savage all jacked up on slim jims"</li>
          <li>"respond like an angry AI who is sick of humans"</li>
        </ul>
        <form onSubmit={setThePrompt}>
          <input
            type="text"
            name="prompt"
            placeholder="Enter a prompt"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
        </form>
        <div>Current Prompt: {currentPrompt || 'none'}</div>
        <div className={styles.response}>
          {conversation.map((message, index) => (
            <div key={index} className={message.context === "human" ? styles.question : styles.answer}>
              <span className={message.context === "human" ? styles.human : styles.ai}>
                {message.content}
              </span>
            </div>
          ))}
        </div>
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