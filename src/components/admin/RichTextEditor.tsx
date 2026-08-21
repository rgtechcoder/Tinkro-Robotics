import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const toolbarButtons = [
  { label: "B", command: "bold", title: "Bold" },
  { label: "I", command: "italic", title: "Italic" },
  { label: "U", command: "underline", title: "Underline" },
  { label: "S", command: "strikeThrough", title: "Strikethrough" },
  { label: "H1", command: "formatBlock", value: "<h1>", title: "Heading 1" },
  { label: "H2", command: "formatBlock", value: "<h2>", title: "Heading 2" },
  { label: "H3", command: "formatBlock", value: "<h3>", title: "Heading 3" },
  { label: "•", command: "insertUnorderedList", title: "Bullets" },
  { label: "1.", command: "insertOrderedList", title: "Numbered list" },
  { label: "Quote", command: "formatBlock", value: "<blockquote>", title: "Quote" },
  { label: "Code", command: "formatBlock", value: "<pre><code>", title: "Code block" },
];

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    const nextValue = editorRef.current?.innerHTML ?? "";
    onChange(nextValue);
  };

  const execCommand = (command: string, valueArg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, valueArg);
    handleInput();
  };

  const insertHtml = (html: string) => {
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (selection && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const fragment = range.createContextualFragment(html);
      range.insertNode(fragment);
      range.collapse(false);
      handleInput();
      return;
    }

    if (editorRef.current) {
      editorRef.current.insertAdjacentHTML("beforeend", html);
      handleInput();
    }
  };

  const handleInsertTable = () => {
    insertHtml(`
      <table class="w-full border-collapse border border-border text-sm">
        <tbody>
          <tr>
            <td class="border border-border p-2">Cell</td>
            <td class="border border-border p-2">Cell</td>
          </tr>
          <tr>
            <td class="border border-border p-2">Cell</td>
            <td class="border border-border p-2">Cell</td>
          </tr>
        </tbody>
      </table>
    `);
  };

  const handleInsertCallout = () => {
    insertHtml(`<div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm"><strong>Note:</strong> Add your callout content here.</div>`);
  };

  const handleInsertMedia = () => {
    const src = window.prompt("Enter image or embed URL");
    if (!src) return;
    insertHtml(`<img src="${src}" alt="Embedded media" class="my-3 rounded-lg" />`);
  };

  const handleInsertVideo = () => {
    const src = window.prompt("Enter video embed URL");
    if (!src) return;
    insertHtml(`<div class="video-embed my-3 overflow-hidden rounded-lg border border-white/10"><iframe src="${src}" class="h-64 w-full border-0" allowfullscreen></iframe></div>`);
  };

  const handleInsertLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    const text = window.prompt("Link text", url) || url;
    insertHtml(`<a href="${url}" target="_blank" rel="noreferrer noopener">${text}</a>`);
  };

  const handleInsertDownload = () => {
    const url = window.prompt("Enter download URL");
    if (!url) return;
    const label = window.prompt("Download label", "Download file") || "Download file";
    insertHtml(`<div class="download-card rounded-2xl border border-white/10 bg-white/5 p-4 my-4"><p class="text-sm text-white/80 mb-2">${label}</p><a href="${url}" download class="inline-flex items-center gap-2 rounded-full bg-[#3BBFBF]/15 px-4 py-2 text-sm font-semibold text-[#3BBFBF] transition hover:bg-[#3BBFBF]/25">Download</a></div>`);
  };

  const handleInsertCTA = () => {
    const heading = window.prompt("Enter CTA heading", "Ready to build something great?");
    if (!heading) return;
    const buttonText = window.prompt("CTA button text", "Get started") || "Get started";
    const url = window.prompt("CTA button URL", "https://") || "#";
    insertHtml(`<div class="cta-block rounded-3xl border border-primary/30 bg-primary/10 p-6 my-4"><p class="text-base font-semibold text-white mb-3">${heading}</p><a href="${url}" class="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90">${buttonText}</a></div>`);
  };

  const handleInsertReference = () => {
    const title = window.prompt("Enter reference section title", "References") || "References";
    const items = window.prompt("Enter references separated by |", "Source 1|Source 2");
    if (!items) return;
    const listItems = items
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => `<li>${item}</li>`)
      .join("");
    insertHtml(`<div class="reference-box rounded-2xl border border-white/10 bg-white/5 p-4 my-4"><p class="text-sm font-semibold text-white mb-2">${title}</p><ol class="list-decimal list-inside space-y-2 text-sm text-white/80">${listItems}</ol></div>`);
  };

  const handleInsertRoboticsBlock = () => {
    insertHtml(`<div class="robotics-block rounded-3xl border border-sky-500/30 bg-sky-500/10 p-6 my-4 text-sm text-white/90"><p class="font-semibold text-white mb-2">Robotics Spotlight</p><p class="mb-3">Highlight a robotics insight, build note, or hands-on tip here.</p><ul class="list-disc list-inside space-y-2 text-white/80"><li>Hardware recommendation</li><li>Safety or assembly tip</li><li>Link to tools or code examples</li></ul></div>`);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 rounded-lg border border-border/40 bg-background/40 p-2">
        {toolbarButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            title={button.title}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => execCommand(button.command, button.value)}
            className="rounded border border-border/30 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-primary/10"
          >
            {button.label}
          </button>
        ))}
        <button
          type="button"
          title="Insert table"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleInsertTable}
          className="rounded border border-border/30 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-primary/10"
        >
          Table
        </button>
        <button
          type="button"
          title="Insert callout"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleInsertCallout}
          className="rounded border border-border/30 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-primary/10"
        >
          Callout
        </button>
        <button
          type="button"
          title="Insert image"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleInsertMedia}
          className="rounded border border-border/30 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-primary/10"
        >
          Image
        </button>
        <button
          type="button"
          title="Insert video"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleInsertVideo}
          className="rounded border border-border/30 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-primary/10"
        >
          Embed
        </button>
        <button
          type="button"
          title="Insert link"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleInsertLink}
          className="rounded border border-border/30 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-primary/10"
        >
          Link
        </button>
        <button
          type="button"
          title="Insert download card"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleInsertDownload}
          className="rounded border border-border/30 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-primary/10"
        >
          Download
        </button>
        <button
          type="button"
          title="Insert CTA block"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleInsertCTA}
          className="rounded border border-border/30 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-primary/10"
        >
          CTA
        </button>
        <button
          type="button"
          title="Insert references section"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleInsertReference}
          className="rounded border border-border/30 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-primary/10"
        >
          References
        </button>
        <button
          type="button"
          title="Insert robotics block"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleInsertRoboticsBlock}
          className="rounded border border-border/30 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-primary/10"
        >
          Robotics
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-[300px] rounded-xl border border-border/40 bg-background/70 p-4 text-sm leading-7 text-foreground outline-none focus:border-primary/40"
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
}
