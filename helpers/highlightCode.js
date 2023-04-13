import Prism from "prismjs";
import "prismjs/components/prism-javascript";

export function highlightCode(code) {
  const codeBlockDelimiter = "```";
  const codeBlockRegex = new RegExp(
    `(${codeBlockDelimiter})([\\s\\S]*?)(${codeBlockDelimiter})`,
    "g"
  );

  const highlighted = code.replace(codeBlockRegex, (match, p1, p2) => {
    const highlightedCode = Prism.highlight(
      p2,
      Prism.languages.javascript,
      "javascript"
    );
    return `<pre style="background-color:#000;padding:1rem;border-radius:5px"><code class="language-javascript">${highlightedCode}</code></pre>`;
  });

  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
}
