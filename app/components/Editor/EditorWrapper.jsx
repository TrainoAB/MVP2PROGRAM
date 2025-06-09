import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import LexicalEditor from "./LexicalEditor";

const editorConfig = {
  namespace: "MyEditor",
  theme: {
    paragraph: "editorParagraph",
    text: {
      bold: "textBold",
      italic: "textItalic",
      underline: "textUnderline",
    },
  },
  onError(error) {
    throw error;
  },
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
};

export default function EditorWrapper({ onContentSave }) {

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <LexicalEditor onContentSave={onContentSave} />
    </LexicalComposer>
  );
}
