"use client";

import { useEffect, useCallback } from "react";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { addExerciseNotes } from "@/app/lib/actions";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import ToolbarPlugin from "./ToolbarPlugin";
import styles from "./editor.module.css";

export default function LexicalEditor({ exerciseId, onContentSave, onClose }) {
  const [editor] = useLexicalComposerContext();

  if (!exerciseId) {
    console.error("exerciseId saknas");
    return null;
  }

  const handleSaveClick = () => {
    editor.update(() => {
      editor.getEditorState().read(() => {
        const html = $generateHtmlFromNodes(editor);
        if (!html || html.trim() === "") {
          console.error("Innehållet är tomt");
          return;
        }

        if (typeof onContentSave === "function") {
          onContentSave(html); // skickas vidare till EditorWrapper
        } else {
          console.warn("onContentSave är inte definierad!");
        }

        if (!exerciseId) {
          console.error("exerciseId saknas");
          return;
        }

        console.log("exerciseId:", exerciseId);
        console.log("html:", html);

        addExerciseNotes(exerciseId, html)
          .then(() => console.log("Sparad!"))
          .catch(console.error);

        if (typeof onClose === "function") {
          onClose();
        }
      });
    });
  };

  const onChange = useCallback(
    (editorState) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor);
        if (!html || html.trim() === "") return;
        if (typeof onContentSave === "function") {
          onContentSave(html);
        }
      });
    },
    [onContentSave, editor]
  );

  useEffect(() => {
    if (!editor) return;
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor);
        if (!html || html.trim() === "") return;
        if (typeof onContentSave === "function") {
          onContentSave(html || "");
        }
      });
    });
    return () => unregister();
  }, [editor, onContentSave]);

  return (
    <>
      <div className={styles.editorWrapper}>
        <ToolbarPlugin />
        <div className={styles.editorContainer}>
          <RichTextPlugin
            contentEditable={<ContentEditable className={styles.editorInput} />}
            placeholder={
              <div className={styles.editorPlaceholder}>Skriv något…</div>
            }
          />
          <ListPlugin />
          <HistoryPlugin />
          <OnChangePlugin onChange={onChange} />
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSaveClick}
          >
            Spara
          </button>
        </div>
      </div>
    </>
  );
}
