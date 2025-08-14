import { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalEditor from "./LexicalEditor";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { addExerciseNotes, fetchExerciseNotes } from "@/app/lib/actions";
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
  const [initialNotes, setInitialNotes] = useState("");
  const initialConfig = {
    namespace: "ExerciseEditor",
    nodes: [HeadingNode, ListNode, ListItemNode], // egna nodes om du har några
    onError: (error) => console.error(error),
  };

useEffect(() => {
  if (!exerciseId) return;

  const fetchNotes = async () => {
    console.log("Hämtar övningsanteckningar för ID:", exerciseId);
    const data = await fetchExerciseNotes(exerciseId);
    setInitialNotes(data?.content || "");
  };

  fetchNotes();
}, [exerciseId]);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <LexicalEditor
        exerciseId={exerciseId}
        initialContent={initialNotes}
        onContentSave={onSave}
        onClose={onClose}
      />
    </LexicalComposer>
  );
}
