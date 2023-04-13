import styles from "./message.module.css";
import { highlightCode } from "../helpers/highlightCode";

function Message({ message }) {
  const hasCode = message.content.includes("```");
  const MessageStyle = message.role === "user" ? styles.human : styles.ai;

  return (
    <div className={message.role === "user" ? styles.question : styles.answer}>
      <span className={MessageStyle}>{hasCode ? highlightCode(message.content) : message.content}</span>
    </div>
  );
}

export default Message;
