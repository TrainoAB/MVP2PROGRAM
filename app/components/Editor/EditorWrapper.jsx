import react from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import LexicalEditor from "./LexicalEditor";
import styles from "./editor.module.css"

const editorConfig = {
  namespace: "MyEditor",
  editable: true,
  editorState: null, // eller initial JSON vid behov
  theme: {
    paragraph: styles.editorParagraph,
    text: {
      bold: styles.textBold,
      italic: styles.textItalic,
      underline: styles.underline,
    },
  },
  onError(error) {
    throw error;
  },
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
};

console.log("Nodes:", editorConfig.nodes);

Object.entries(editorConfig).forEach(([key, value]) => {
  console.log(`${key}:`, value);
});

export default function EditorWrapper({ onContentSave }) {
  return (
    <LexicalComposer initialConfig={editorConfig || {}}>
      <LexicalEditor onContentSave={onContentSave} />
    </LexicalComposer>
  );
}
