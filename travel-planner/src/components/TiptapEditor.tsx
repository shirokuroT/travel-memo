import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type Props = {
  content: string;
  onChange: (content: string) => void;
};

export const TiptapEditor = ({
  content,
  onChange,
}: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],

    content,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (
      editor &&
      editor.getHTML() !== content
    ) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <EditorContent editor={editor} />
  );
};