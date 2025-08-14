"use client";

import { useEffect, useState, useCallback } from "react";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { addExerciseNotes, fetchExerciseNotes } from "@/app/lib/actions";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot } from "lexical";
import ToolbarPlugin from "./ToolbarPlugin";
import styles from "./editor.module.css";

export default function LexicalEditor({
  exerciseId,
  initialHtml,
  onContentSave,
  onClose,
}) {
  const [editor] = useLexicalComposerContext();
  const [message, setMessage] = useState(false);

  useEffect(() => {
    if (!exerciseId) return;

    async function loadNotes() {
      try {
        const res = await fetchExerciseNotes(exerciseId);
        if (res?.success && res?.data?.content) {
          const htmlString = res.data.content;
          console.log("📄 Laddar HTML i editor:", htmlString);

          editor.update(() => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(htmlString, "text/html");
            const nodes = $generateNodesFromDOM(editor, dom);
            const root = $getRoot();
            root.clear();
            root.append(...nodes);
          });
        }
      } catch (err) {
        console.error("Kunde inte ladda anteckningar:", err);
      }
    }

    loadNotes();
  }, [editor, initialHtml]);

  if (!exerciseId) {
    console.log("Sparar bara lokalt, inget exerciseId ännu");
    if (typeof onContentSave === "function") {
      onContentSave(html);
    }
    return;
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
          onContentSave(html);
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
          .then(() => {
            setMessage("Anteckningar sparade!");
            console.log("Sparad!");

            setTimeout(() => {
              setMessage(null);
            }, 10000);
          })
          .catch((error));

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
