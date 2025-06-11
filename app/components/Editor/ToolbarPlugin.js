"use client";

import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $isListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";

import React, { useEffect, useState } from "react";
import styles from "./editor.module.css";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    heading1: false,
    heading2: false,
    paragraph: false,
    ul: false,
    ol: false,
    list: false,
  });

  function getFormatsFromSelection() {
    let newFormats = {
      bold: false,
      italic: false,
      underline: false,
      heading1: false,
      heading2: false,
      paragraph: false,
      ul: false,
      ol: false,
      list: false,
    };

    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const topLevelElement = anchorNode.getTopLevelElementOrThrow();

      // Kontrollera textformat på själva selection
      newFormats.bold = selection.hasFormat("bold");
      newFormats.italic = selection.hasFormat("italic");
      newFormats.underline = selection.hasFormat("underline");

      // Kontrollera blocktyp (rubriker, paragrafer, listor) på topLevelElement
      newFormats.heading1 =
        $isHeadingNode(topLevelElement) && topLevelElement.getTag() === "h1";
      newFormats.heading2 =
        $isHeadingNode(topLevelElement) && topLevelElement.getTag() === "h2";
      newFormats.paragraph = topLevelElement.getType() === "paragraph";
      newFormats.ul =
        $isListNode(topLevelElement) &&
        topLevelElement.getListType() === "bullet";
      newFormats.ol =
        $isListNode(topLevelElement) &&
        topLevelElement.getListType() === "number";
      newFormats.list = $isListNode(topLevelElement);
    }

    return newFormats;
  }

  const updateFormats = React.useCallback(() => {
    editor.getEditorState().read(() => {
      const newFormats = getFormatsFromSelection();
      setFormats(newFormats);
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateFormats();
        return true;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateFormats]);

  function toggleFormat(formatType) {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      switch (formatType) {
        case "bold":
        case "italic":
        case "underline":
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
          break;
        case "heading1":
          selection.insertNodes([$createHeadingNode("h1")]);
          break;
        case "heading2":
          selection.insertNodes([$createHeadingNode("h2")]);
          break;
        case "paragraph":
          selection.insertNodes([$createParagraphNode()]);
          break;
        default:
          break;
      }
    }, {
      onUpdate: updateFormats,
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
          formats.heading1 ? styles.active : ""
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
      <br />
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
        className={`${styles.toolbarButton} ${formats.ul ? styles.active : ""}`}
        onClick={() => toggleList("bullet")}
      >
        Punktlista
      </button>
      <button
        type="button"
        className={`${styles.toolbarButton} ${formats.ol ? styles.active : ""}`}
        onClick={() => toggleList("number")}
      >
        Numrerad lista
      </button>
    </div>
  );
}
