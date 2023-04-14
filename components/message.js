// Message.js
import styles from "./message.module.css";
import { highlightCode } from "../helpers/highlightCode";

function Message({ message }) {
    const hasCode = message.content.includes("```");
    const MessageStyle = message.role === "user" ? styles.human : styles.ai;

    return (
        <div className={message.role === "user" ? styles.question : styles.answer}>
            <span className={MessageStyle}>
                <div className={styles.messageContent}>
                    {hasCode ? highlightCode(message.content) : message.content}
                </div>
            </span>
        </div>
    );
}

export default Message;