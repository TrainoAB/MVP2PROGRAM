"use client";

import { useEffect, useCallback } from "react";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { $generateHtmlFromNodes } from "@lexical/html"; 
import { $getRoot } from "lexical";
import ToolbarPlugin from "./ToolbarPlugin";
import styles from "./editor.module.css";

export default function LexicalEditor({ onContentSave }) {
  const [editor] = useLexicalComposerContext();

  const onChange = useCallback(
    (editorState) => {
      const json = JSON.stringify(editorState);
      if (typeof onContentSave === "function") {
        onContentSave(json);
      }
    },
    [onContentSave]
  );

  useEffect(() => {
    if (!editor) return;
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const json = editorState.toJSON();
        if (typeof onContentSave === "function") {
          onContentSave(json);
        }
      });
    });
    return () => unregister();
  }, [editor, onContentSave]);

  const handleSave = () => {
    editor.update(() => {
      const root = $getRoot();
      const isEmpty = root.getTextContent().trim() === "";

      if (isEmpty) {
        // Avbryt eller visa meddelande
        console.warn("Kan inte spara ett tomt dokument.");
        return;
      }
      const html = $generateHtmlFromNodes(editor, null);
      console.log("HTML till DB:", html);
      if (typeof onContentSave === "function") {
        onContentSave(html); // spara till DB via prop
      }
    });
  };
  
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
            onClick={handleSave}
          >
            Spara
          </button>
         </div>
      </div>
    </>
  );
}
