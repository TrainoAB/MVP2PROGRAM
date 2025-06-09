"use client";

import { useEffect, useCallback } from "react";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
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
      const content = root.getTextContent();
      console.log("Sparar:", content);
      if (typeof onContentSave === "function") {
        onContentSave(content);
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
        <button
          type="button"
          className={styles.saveButton}
          onClick={handleSave}
        >
          Spara
        </button>
      </div>
    </>
  );
}
