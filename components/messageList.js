import React from 'react';
import styles from "./messageList.module.css";
import Message from './message';

const MessageList = React.forwardRef(({ conversation, loadingResponse }, ref) => {
  return (
    <div className={styles.response} ref={ref}>
      {conversation.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      {loadingResponse && (
        <div className={styles.answer}>
          <span className={styles.ai}>...</span>
        </div>
      )}
    </div>
  );
});

export default MessageList;
