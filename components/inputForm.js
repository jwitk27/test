import styles from "./inputForm.module.css";

function InputForm({ questionInput, onSubmit, onInputChange }) {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="question"
        placeholder="Ask a question"
        value={questionInput}
        onChange={onInputChange}
      />
    </form>
  );
}

export default InputForm;
