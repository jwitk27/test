import { useState } from "react";
import styles from "./prompt.module.css";

export default function Prompt({ prompt, currentPrompt, setPrompt, setCurrentPrompt, setConversation }) {
    const [inputPrompt, setInputPrompt] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setCurrentPrompt(inputPrompt);
        setPrompt("");
        setInputPrompt("");
        setConversation([]);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>Current Prompt: {currentPrompt || "none"}</div>
            <input type="text" name="prompt" placeholder="Enter a prompt" value={inputPrompt || prompt} onChange={(e) => setInputPrompt(e.target.value)} />
        </form>
    );
}
