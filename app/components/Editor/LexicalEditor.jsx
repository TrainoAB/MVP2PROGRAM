"use client";

import { useEffect, useState, useCallback } from "react";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { addExerciseNotes, fetchExerciseNotes } from "@/app/lib/actions";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot } from "lexical";
import ToolbarPlugin from "./ToolbarPlugin";
import styles from "./editor.module.css";

export default function LexicalEditor({ exerciseId, onClose }) {
  const [editor] = useLexicalComposerContext();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!exerciseId || !editor) return;

    const loadNotes = async () => {
      try {
        const res = await fetchExerciseNotes(exerciseId);
        const htmlString = res?.data?.content || "<p></p>";
        console.log("📄 Laddar HTML i editor:", htmlString);

        editor.update(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(htmlString, "text/html");
          let nodes = $generateNodesFromDOM(editor, dom);

          const root = $getRoot();
          root.clear();

          if (nodes.length === 0) {
            // Om inga nodes skapades, lägg till ett tomt stycke
            const paragraphNode = editor
              .getEditorState()
              .createParagraphNode?.();
            if (paragraphNode) nodes = [paragraphNode];
          }
          root.append(...nodes);
        });
      } catch (err) {
        console.error("Kunde inte ladda anteckningar:", err);
      }
    };

    loadNotes();
  }, [exerciseId, editor]);

  const handleSaveClick = async () => {
    editor.update(async () => {
      const html = $generateHtmlFromNodes(editor);
      if (!html || html.trim() === "") {
        setMessage({ text: "Innehållet är tomt", type: "error" });
        setTimeout(() => setMessage(null), 4000);
        return;
      }

      if (!exerciseId) {
        setMessage({
          text: "Sparar lokalt (ingen exerciseId)",
          type: "success",
        });
        setTimeout(() => setMessage(null), 4000);
        return;
      }

      try {
        await addExerciseNotes(exerciseId, html);
        setMessage({ text: "Anteckningar sparade!", type: "success" });
        setTimeout(() => {
          setMessage(null);
          if (typeof onClose === "function") {
            onClose();
          }
        }, 2000);
      } catch (err) {
        console.error(err);
        setMessage({ text: "Fel vid sparande!", type: "error" });
        setTimeout(() => setMessage(null), 4000);
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
          {message && (
            <div
              className={`${styles.message} ${
                message.type === "success" ? styles.success : styles.error
              }`}
            >
              {message.text}
            </div>
          )}
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
