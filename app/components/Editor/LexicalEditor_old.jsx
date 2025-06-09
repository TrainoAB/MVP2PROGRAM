"use client";

import { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import ToolbarPlugin from "./ToolbarPlugin";
import SaveButton from "./SaveButton";

// import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
// import { $getRoot, $getSelection } from "lexical";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import styles from "./editor.module.css"; 


const editorConfig = {
  namespace: "MyEditor",
  theme: {
    // Enkel stil för text
    paragraph: "editorParagraph",
  },
  onError(error) {
    throw error;
  },
};

export default function LexicalEditor({ onContentSave }) {
  const [editorState, setEditorState] = useState(null);
  const [editor] = useLexicalComposerContext();

  function handleEditorChange(newEditorState) {
    setEditorState(newEditorState);
  }

  const handleSave = () => {
    editor.update(() => {
      const root = $getRoot();
      const content = root.getTextContent();
      console.log("Sparar:", content);

      if (onContentSave) {
        onContentSave(content);
      }
    });
  };

  useEffect(() => {
    if (!editor) return;

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        // Gör något med editor state, t.ex. spara
        const json = editorState.toJSON();
        setEditorState(json);
        if (onContentSave) {
          onContentSave(json);
        }
      });
    });

    return () => unregister();
  }, [editor, onContentSave]);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={styles.editorWrapper}>
        <ToolbarPlugin />

        <div className={styles.editorContainer}>
          <RichTextPlugin
            contentEditable={<ContentEditable className={styles.editorInput} />}
            placeholder={
              <div className={styles.editorPlaceholder}>Skriv något…</div>
            }
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
        </div>
        <button
          type="button"
          className={styles.saveButton}
          onClick={() => {
            handleSave;
            // Här kan du skicka content till ditt API
          }}
        >
          Spara
        </button>
      </div>
    </LexicalComposer>
  );
}
