import styles from "./index.module.css";
import { useState, useRef, useEffect } from "react";
import Header from "../components/header";
import Prompt from "../components/prompt";
import MessageList from "../components/messageList";
import InputForm from "../components/inputForm";
import "prismjs/themes/prism-tomorrow.css";

export default function Home() {
    const [questionInput, setQuestionInput] = useState("");
    const [conversation, setConversation] = useState([]);
    const [currentPrompt, setCurrentPrompt] = useState("");
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [prompt, setPrompt] = useState("");
    const responseDiv = useRef(null);

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
            console.log(data.result)
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

    useEffect(() => {
        const scrollToBottom = () => {
            if (responseDiv.current) {
                responseDiv.current.scrollTop = responseDiv.current.scrollHeight;
            }
        };

        scrollToBottom();
    }, [conversation]);

    return (
        <div>
            <Header title={"JimboGPT"} />
            <main className={styles.main}>
                <MessageList conversation={conversation} loadingResponse={loadingResponse} ref={responseDiv} />
                <InputForm questionInput={questionInput} onSubmit={onSubmit} onInputChange={(e) => setQuestionInput(e.target.value)} />
                <Prompt prompt={prompt} currentPrompt={currentPrompt} setPrompt={setPrompt} setCurrentPrompt={setCurrentPrompt} setConversation={setConversation} />
            </main>
        </div>
    );
}