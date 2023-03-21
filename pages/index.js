import styles from "./index.module.css";
import { useState } from "react";
import Header from "../components/header";
import Prompt from "../components/prompt";

export default function Home() {
    const [questionInput, setQuestionInput] = useState("");
    const [conversation, setConversation] = useState([]);
    const [currentPrompt, setCurrentPrompt] = useState("");
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [prompt, setPrompt] = useState("");

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

            // Update the conversation state with the AI response
            setConversation([...conversationData, data.result]);
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <div>
            <Header title={"JimboGPT"} />

            <main className={styles.main}>
                <div className={styles.response}>
                    {conversation.map((message, index) => (
                        <div key={index} className={message.role === "user" ? styles.question : styles.answer}>
                            <span className={message.role === "user" ? styles.human : styles.ai}>{message.content}</span>
                        </div>
                    ))}
                    {loadingResponse ? (
                        <div className={styles.answer}>
                            <span className={styles.ai}>...</span>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <form onSubmit={onSubmit}>
                    <input type="text" name="question" placeholder="Ask a question" value={questionInput} onChange={(e) => setQuestionInput(e.target.value)} />
                </form>
                <Prompt prompt={prompt} currentPrompt={currentPrompt} setPrompt={setPrompt} setCurrentPrompt={setCurrentPrompt} setConversation={setConversation} />
            </main>
        </div>
    );
}
