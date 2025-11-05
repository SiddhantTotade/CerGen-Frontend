import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", 
  "link", "meta", "param", "source", "track", "wbr",
]);

export default function HTMLTextEditor({ code, setCode, disabled }: any) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== ">") return;
    const ta = taRef.current;
    if (!ta) return;

    const { selectionStart, selectionEnd, value } = ta;
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);
    const match = before.match(/<([a-zA-Z][\w-]*)[^>]*$/);
    if (!match) return;

    const tag = match[1].toLowerCase();
    if (
      VOID_TAGS.has(tag) ||
      before.endsWith("</") ||
      before.endsWith("/>") ||
      after.trimStart().startsWith(`</${tag}>`)
    )
      return;

    e.preventDefault();
    const closing = `></${tag}>`;
    const newValue = before + closing + after;
    const cursorPos = selectionStart + 1;

    ta.value = newValue;
    ta.setSelectionRange(cursorPos, cursorPos);
    setCode(newValue);
  };

  return (
    <Textarea
      ref={taRef}
      value={code}
      onChange={(e) => setCode(e.target.value)}
      onKeyDown={handleKeyDown}
      spellCheck={false}
      disabled={disabled}
      className="w-full h-full resize-none font-mono text-xs p-3 outline-none focus-visible:ring-0 bg-transparent border mt-2"
    />
  );
}
