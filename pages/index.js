import Head from "next/head";
import styles from "./index.module.css";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
    const [questionInput, setQuestionInput] = useState("");
    const [conversation, setConversation] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [currentPrompt, setCurrentPrompt] = useState("");
    const [loadingResponse, setLoadingResponse] = useState(false);

    async function onSubmit(event) {
        setLoadingResponse(true);
        event.preventDefault();
        try {
            setQuestionInput("");

            const humanQuestion = { role: "user", content: questionInput };

            // Create a new conversation array with the updated message
            const conversationData = [...conversation, humanQuestion];

            setConversation(conversationData);

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: questionInput, conversation: conversationData, prompt: currentPrompt }),
            });

            const data = await response.json();

            setLoadingResponse(false);
            
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }
            
            const aiResponse = data.result;

            // Update the conversation state with the AI response
            setConversation([...conversationData, aiResponse]);
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
    }

    const setThePrompt = (e) => {
        setConversation([]);
        e.preventDefault();
        setCurrentPrompt(prompt);
        setPrompt("");
    };

    return (
        <div>
            <Head>
                <title>JimboGPT</title>
            </Head>

            <main className={styles.main}>
                <h2>JimboGPT</h2>
                <div className={styles.response}>
                  {loadingResponse ? <div className={styles.answer}><span className={styles.ai}>...</span></div> : ""}
                    {conversation.map((message, index) => (
                        <div key={index} className={message.role === "user" ? styles.question : styles.answer}>
                            <span className={message.role === "user" ? styles.human : styles.ai}>{message.content}</span>
                        </div>
                    ))}
                </div>
                <div>Current Prompt: {currentPrompt || "none"}</div>
                <form onSubmit={onSubmit}>
                    <input type="text" name="question" placeholder="Ask a question" value={questionInput} onChange={(e) => setQuestionInput(e.target.value)} />
                </form>
                <form onSubmit={setThePrompt}>
                    <input type="text" name="prompt" placeholder="Enter a prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </form>
            </main>
        </div>
    );
}
