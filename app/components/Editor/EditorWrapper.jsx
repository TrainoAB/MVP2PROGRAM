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
  const [loading, setLoading] = useState(false);

  const initialConfig = {
    namespace: "ExerciseEditor",
    editable: true,
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode], 
    theme: {
      paragraph: styles.editorParagraph,
      text: {
        bold: styles.textBold,
        italic: styles.textItalic,
        underline: styles.underline,
      },
    },
    onError: (error) => console.error(error),
  };

useEffect(() => {
  if (!exerciseId) return;
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await fetchExerciseNotes(exerciseId);
      setInitialNotes(data?.content || "");
    } catch (err) {
      console.error("Kunde inte hämta anteckningar:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchNotes();
}, [exerciseId]);
  
    const handleSave = async (content) => {
      try {
        if (exerciseId) {
          // Uppdatera befintliga anteckningar
          await addExerciseNotes(exerciseId, content);
          onSave?.(exerciseId);
        } else {
          // Skapa nya anteckningar (returnerar nytt ID om du vill)
          const newId = await addExerciseNotes(null, content);
          onSave?.(newId);
        }
      } catch (err) {
        console.error("Kunde inte spara anteckningar:", err);
      }
    };
    if (loading) return <p>Laddar anteckningar...</p>;

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <LexicalEditor
        exerciseId={exerciseId}
        initialContent={initialNotes}
        onContentSave={handleSave}
        onClose={onClose}
      />
    </LexicalComposer>
  );
}
