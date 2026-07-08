import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { List, Link2, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** compact=true: only B/I/U toolbar, no alignment/bullets (for per-bullet editors) */
  compact?: boolean;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  compact = false,
  minHeight = 80,
}: RichTextEditorProps) {
  const isInternal = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bulletList: compact ? false : undefined, orderedList: false }),
      Underline,
      Link.configure({ openOnClick: false }),
      ...(!compact ? [TextAlign.configure({ types: ['paragraph'] })] : []),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'rich-editor-content',
        ...(placeholder ? { 'data-placeholder': placeholder } : {}),
      },
    },
    onUpdate: ({ editor }) => {
      isInternal.current = true;
      const html = editor.getHTML();
      onChange(html === '<p></p>' ? '' : html);
      setTimeout(() => { isInternal.current = false; }, 0);
    },
  });

  useEffect(() => {
    if (!editor || isInternal.current) return;
    const current = editor.getHTML();
    const next = value || '';
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const btn = (
    label: React.ReactNode,
    active: boolean,
    action: () => void,
    title: string,
    extraClass = '',
  ) => (
    <button
      type="button"
      className={`rte-btn${active ? ' active' : ''}${extraClass ? ` ${extraClass}` : ''}`}
      onMouseDown={e => { e.preventDefault(); action(); }}
      title={title}
    >
      {label}
    </button>
  );

  function handleLink() {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt('Enter URL');
      if (url) editor.chain().focus().setLink({ href: url }).run();
    }
  }

  return (
    <div className="rich-editor">
      <div className="rich-editor-toolbar">
        {btn(<b>B</b>, editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'Bold', 'rte-bold')}
        {btn(<i>I</i>, editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'Italic', 'rte-italic')}
        {btn(<u>U</u>, editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), 'Underline', 'rte-underline')}

        {!compact && (
          <>
            <div className="rte-sep" />
            {btn(<List size={14} />, editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), 'Bullet List')}
            {btn(<Link2 size={14} />, editor.isActive('link'), handleLink, 'Link')}
            <div className="rte-sep" />
            {btn(<AlignLeft size={14} />, editor.isActive({ textAlign: 'left' }), () => editor.chain().focus().setTextAlign('left').run(), 'Align Left')}
            {btn(<AlignCenter size={14} />, editor.isActive({ textAlign: 'center' }), () => editor.chain().focus().setTextAlign('center').run(), 'Align Center')}
            {btn(<AlignRight size={14} />, editor.isActive({ textAlign: 'right' }), () => editor.chain().focus().setTextAlign('right').run(), 'Align Right')}
            {btn(<AlignJustify size={14} />, editor.isActive({ textAlign: 'justify' }), () => editor.chain().focus().setTextAlign('justify').run(), 'Justify')}
          </>
        )}
      </div>

      <EditorContent editor={editor} style={{ minHeight }} />

    </div>
  );
}
