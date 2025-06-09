"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

export default function SaveButton({ onSave }) {
  const [editor] = useLexicalComposerContext();

  const handleClick = () => {
    editor.update(() => {
      const root = $getRoot();
      const content = root.getTextContent();
      console.log("Sparar:", content);
      if (onSave) onSave(content);
    });
  };

  return <button onClick={handleClick}>Spara</button>;
}
