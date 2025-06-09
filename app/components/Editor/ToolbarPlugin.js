"use client";

import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $isListNode,
  $createListNode,
  $createListItemNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";

import { $createParagraphNode } from "lexical";

import { useEffect, useState } from "react";
import styles from "./editor.module.css";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState({});

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const parent = anchorNode.getParent();

            const next = {
              bold: selection.hasFormat("bold"),
              italic: selection.hasFormat("italic"),
              underline: selection.hasFormat("underline"),
              heading1: $isHeadingNode(parent) && parent.getTag() === "h1",
              heading2: $isHeadingNode(parent) && parent.getTag() === "h2",
              paragraph: parent.getType() === "paragraph",
              ul: $isListNode(parent) && parent.getListType() === "bullet",
              ol: $isListNode(parent) && parent.getListType() === "number",
              list: $isListNode(parent),
            };

            setFormats(next);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor]);

  function toggleFormat(formatType) {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchor = selection.anchor.getNode();
      const parent = anchor.getParent();

      switch (formatType) {
        case "bold":
        case "italic":
        case "underline":
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
          break;
        case "heading1":
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const headingNode = $createHeadingNode("h1");
              selection.insertNodes([headingNode]);
            }
          });
          break;
        case "heading2":
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const headingNode = $createHeadingNode("h2");
              selection.insertNodes([headingNode]);
            }
          });
          break;
        case "paragraph":
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const paragraphNode = $createParagraphNode();
              selection.insertNodes([paragraphNode]);
            }
          });
          break;
      }
    });
  }

  const toggleList = (type) => {
    const isActive = formats[type];
    const command =
      type === "bullet"
        ? INSERT_UNORDERED_LIST_COMMAND
        : INSERT_ORDERED_LIST_COMMAND;

    editor.dispatchCommand(isActive ? REMOVE_LIST_COMMAND : command);
  };

  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        className={`${styles.toolbarFatButton} ${
          formats.bold ? styles.active : ""
        }`}
        onClick={() => toggleFormat("bold")}
      >
        Fet
      </button>
      <button
        type="button"
        className={`${styles.toolbarButton} ${
          formats.italic ? styles.active : ""
        }`}
        onClick={() => toggleFormat("italic")}
      >
        <i>Kursiv</i>
      </button>
      <button
          type="button"
          className={`${styles.toolbarButton} ${
            formats.underline ? styles.active : ""
          }`}
          onClick={() => toggleFormat("underline")}
        >
          Understuken
        </button>
      <button
        type="button"
        className={`${styles.toolbarButtonHeader1} ${
          formats.heading ? styles.active : ""
        }`}
        onClick={() => toggleFormat("heading1")}
      >
        Rubrik 1
      </button>
      <button
        type="button"
        className={`${styles.toolbarButtonHeader2} ${
          formats.heading2 ? styles.active : ""
        }`}
        onClick={() => toggleFormat("heading2")}
      >
        Rubrik 2
      </button>
      <button
        type="button"
        className={`${styles.toolbarButton} ${
          formats.paragraph ? styles.active : ""
        }`}
        onClick={() => toggleFormat("paragraph")}
      >
        Radbrytning
      </button>
      <button
        type="button"
        className={`${styles.toolbarButton} ${
          formats.bullet ? styles.active : ""
        }`}
        onClick={() => toggleList("bullet")}
      >
        Punktlista
      </button>
      <button
        type="button"
        className={`${styles.toolbarButton} ${
          formats.number ? styles.active : ""
        }`}
        onClick={() => toggleList("number")}
      >
        Numrerad lista
      </button>
    </div>
  );
}
