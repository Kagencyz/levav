/**
 * ============================================================
 * RICH TEXT EDITOR — Proper Cursor Management
 * ============================================================
 * Uses a ref-only approach: innerHTML is set once on mount,
 * then all updates flow through onInput. The parent value is
 * never written back into the editor, so the cursor stays put.
 * ============================================================
 */

import { useRef, useState, useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline,
  Heading1,
  Heading2,
  Strikethrough,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  rows = 6,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const [focused, setFocused] = useState(false);

  /* ─── Set initial content ONCE on mount ─── */
  useEffect(() => {
    if (editorRef.current && isInitialMount.current) {
      isInitialMount.current = false;
      if (value && value !== "<br>" && value !== "<div><br></div>") {
        editorRef.current.innerHTML = value;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Handle input changes ─── */
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  /* ─── Check if editor is effectively empty ─── */
  const isEmpty = (): boolean => {
    if (!editorRef.current) return true;
    const html = editorRef.current.innerHTML;
    return html === "" || html === "<br>" || html === "<div><br></div>";
  };

  /* ─── execCommand wrapper ─── */
  const execCmd = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg || "");
    handleInput();
  };

  /* ─── Toolbar button ─── */
  const toolbarBtn = (
    icon: React.ReactNode,
    command: string,
    title: string,
    arg?: string
  ) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        execCmd(command, arg);
      }}
      className="p-1.5 rounded-lg text-white/35 hover:text-white/90 hover:bg-white/[0.08] active:bg-white/[0.12] transition-all duration-150"
    >
      {icon}
    </button>
  );

  const toolbarDivider = () => (
    <div className="w-px h-5 bg-white/[0.08] mx-0.5" />
  );

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all duration-200 ${
        focused
          ? "border-[#C6FF34]/30 shadow-[0_0_12px_rgba(198,255,52,0.06)]"
          : "border-white/[0.08] hover:border-white/15"
      }`}
      style={{ background: "rgba(7, 10, 19, 0.85)" }}
    >
      {/* ─── Toolbar ─── */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-white/[0.06] bg-white/[0.015]">
        {toolbarBtn(<Bold className="w-3.5 h-3.5" />, "bold", "Bold")}
        {toolbarBtn(<Italic className="w-3.5 h-3.5" />, "italic", "Italic")}
        {toolbarBtn(
          <Underline className="w-3.5 h-3.5" />,
          "underline",
          "Underline"
        )}
        {toolbarBtn(
          <Strikethrough className="w-3.5 h-3.5" />,
          "strikeThrough",
          "Strikethrough"
        )}
        {toolbarDivider()}
        {toolbarBtn(
          <Heading1 className="w-3.5 h-3.5" />,
          "formatBlock",
          "Heading",
          "H2"
        )}
        {toolbarBtn(
          <Heading2 className="w-3.5 h-3.5" />,
          "formatBlock",
          "Subheading",
          "H3"
        )}
        {toolbarDivider()}
        {toolbarBtn(
          <List className="w-3.5 h-3.5" />,
          "insertUnorderedList",
          "Bullet List"
        )}
        {toolbarBtn(
          <ListOrdered className="w-3.5 h-3.5" />,
          "insertOrderedList",
          "Numbered List"
        )}
        {toolbarBtn(
          <Quote className="w-3.5 h-3.5" />,
          "formatBlock",
          "Quote",
          "BLOCKQUOTE"
        )}
        {toolbarDivider()}
        {toolbarBtn(<Undo2 className="w-3.5 h-3.5" />, "undo", "Undo")}
        {toolbarBtn(<Redo2 className="w-3.5 h-3.5" />, "redo", "Redo")}
      </div>

      {/* ─── Editor Surface ─── */}
      <div
        className="relative"
        style={{ minHeight: `${rows * 28}px` }}
      >
        {/* Placeholder overlay */}
        {!focused && isEmpty() && (
          <div
            className="absolute inset-0 px-4 py-3 pointer-events-none select-none text-sm text-white/20"
            style={{ zIndex: 1 }}
          >
            {placeholder}
          </div>
        )}

        {/* contentEditable — NO dangerouslySetInnerHTML after mount */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 py-3 text-sm text-white/85 outline-none leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-white/20"
          data-placeholder={focused ? "" : placeholder}
          style={{
            minHeight: `${rows * 28}px`,
            background: "transparent",
            position: "relative",
            zIndex: 2,
            direction: "ltr",
            unicodeBidi: "plaintext",
          }}
        />
      </div>
    </div>
  );
}
