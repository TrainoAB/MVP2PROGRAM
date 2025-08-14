import react from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalEditor from "./LexicalEditor";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { addExerciseNotes } from "@/app/lib/actions";
import styles from "./editor.module.css";

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

export default function EditorWrapper({ exerciseId, onSave, onClose }) {
  const initialConfig = {
    namespace: "ExerciseEditor",
    nodes: [HeadingNode, ListNode, ListItemNode], // egna nodes om du har några
    onError: (error) => console.error(error),
  };

  const handleSave = (html) => {
    if (!exerciseId) {
      console.error("exerciseId saknas");
      return;
    }
    if (!html || html.trim() === "") {
      console.error("Innehållet är tomt");
      return;
    }

    addExerciseNotes({ exerciseId, content: html })
      .then(() => console.log("Sparad!"))
      .catch(console.error);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <LexicalEditor
        exerciseId={exerciseId}
        onContentSave={onSave}
        onClose={onClose}
      />
    </LexicalComposer>
  );
}
