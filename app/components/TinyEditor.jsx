"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

import "tinymce/tinymce"; // Måste importeras först
// Plugins & teman (du kan välja bort de du inte vill ha)
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";

import "tinymce/plugins/advlist";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/code";

import "tinymce-i18n/langs5/sv_SE";

import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/content/default/content.min.css";

export default function TinyEditor({ initialValue = "", onChange }) {
  const editorRef = useRef(null);

  return (
    <Editor
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
          onEditorChange={(content) => {
                  if (onChange) onChange(content);
          }
  
        }
      init={{
        height: 300,
        menubar: false,
        content_css: "default",
        block_formats: "Brödtext=p; Rubrik 1=h1; Rubrik 2=h2; Rubrik 3=h3",
        language: "sv_SE",
        plugins: ["advlist", "link", "lists", "code"],
        toolbar:
          "undo redo | formatselect | bold italic underline | bullist numlist | link | code",
        skin: "oxide",
        branding: false,
      }}
    />
  );
}
