"use client";

import { EditorContent, useEditor, useEditorState, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { Bold, List, ListOrdered, Underline } from "lucide-react";
import type { TripInput } from "@/types/trip";

export type TripDescriptionEditorHandle = {
  readEdit: () => Pick<TripInput, "description" | "descriptionRich"> | undefined;
};

const extensions = [
  StarterKit.configure({
    blockquote: false,
    code: false,
    codeBlock: false,
    heading: false,
    horizontalRule: false,
    italic: false,
    link: false,
    strike: false,
  }),
];

const tools = [
  { name: "Bold", icon: Bold, format: "bold", command: "toggleBold" },
  { name: "Underline", icon: Underline, format: "underline", command: "toggleUnderline" },
  { name: "Bulleted list", icon: List, format: "bulletList", command: "toggleBulletList" },
  { name: "Numbered list", icon: ListOrdered, format: "orderedList", command: "toggleOrderedList" },
] as const;

export default function TripDescriptionEditor({
  description,
  richDescription,
  disabled,
  editorRef,
}: {
  description?: string | null;
  richDescription?: JSONContent | null;
  disabled: boolean;
  editorRef: Ref<TripDescriptionEditorHandle>;
}) {
  const edited = useRef(false);
  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    editable: !disabled,
    content: richDescription ?? {
      type: "doc",
      content: (description ?? "").split(/\r\n?|\n/).map((line) => ({
        type: "paragraph",
        ...(line ? { content: [{ type: "text", text: line }] } : {}),
      })),
    },
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": "Description",
        class:
          "min-h-28 px-3 py-2 text-sm leading-relaxed outline-none [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6",
      },
    },
    onUpdate: () => {
      edited.current = true;
    },
  });

  useImperativeHandle(
    editorRef,
    () => ({
      readEdit() {
        if (!editor || !edited.current) return;
        const description = editor.getText({ blockSeparator: "\n" }).trim();
        return description
          ? { description, descriptionRich: editor.getJSON() }
          : { description: null, descriptionRich: null };
      },
    }),
    [editor],
  );

  useEffect(() => {
    editor?.setEditable(!disabled, false);
  }, [disabled, editor]);

  const active = useEditorState({
    editor,
    selector: ({ editor }) => tools.map(({ format }) => editor?.isActive(format) ?? false),
  });

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">Description</p>
      <div className="overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-sky-600">
        <div
          role="group"
          aria-label="Description formatting"
          className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-1"
        >
          {tools.map(({ name, icon: Icon, command }, index) => (
            <button
              key={command}
              type="button"
              title={name}
              aria-label={name}
              aria-pressed={active?.[index] ?? false}
              disabled={disabled || !editor}
              className="rounded p-2 text-slate-700 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-sky-600 aria-pressed:bg-sky-100 aria-pressed:text-sky-900 disabled:opacity-50"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => editor?.chain().focus()[command]().run()}
            >
              <Icon aria-hidden="true" className="size-4" />
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
