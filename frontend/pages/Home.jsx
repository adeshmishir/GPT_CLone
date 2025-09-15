import React, { useRef, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Message from "../components/Message";

const quickPrompts = [
  "Give me a concise summary of this meeting transcript",
  "Write a product description for a minimalist smartwatch",
  "Provide a polite response to a customer asking for a refund",
];

const Message = ({ role, text }) => (
  <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
        role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {text}
    </div>
  </div>
);

const Home = () => {
  const [isOpen, setIsOpen] = useState(false); // mobile drawer open
  const [collapsed, setCollapsed] = useState(false); // desktop rail width
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const inputRef = useRef(null);

  // attachments state: { id, file }
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const nextId = useRef(0);

  // sidebar widths (px)
  const SIDEBAR_WIDE = 256;
  const SIDEBAR_NARROW = 64;
  const sidebarWidth = collapsed ? SIDEBAR_NARROW : SIDEBAR_WIDE;

  // update window width for responsive push behaviour
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const desktopPush = isDesktop ? sidebarWidth : 0;

  const newChat = () => {
    setMessages([]);
    setInput("");
    setAttachments([]);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // send accepts optional text parameter
  const send = (text) => {
    const content = (text ?? input).trim();
    if (!content && attachments.length === 0) return;
    // for demo: add a message noting text + number of attachments
    const summary =
      content +
      (attachments.length > 0 ? ` (sent ${attachments.length} attachment${attachments.length > 1 ? "s" : ""})` : "");
    const next = [...messages, { role: "user", text: summary }];
    setMessages(next);
    setInput("");
    setAttachments([]); // clear attachments on send
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onQuickPick = (t) => {
    setInput(t);
    send(t);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // auto-resize textarea
  const autoResize = () => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  useEffect(() => {
    autoResize();
  }, [input]);

  // file handling ------------------------------------------------

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const next = files.map((f) => ({ id: ++nextId.current, file: f }));
    setAttachments((prev) => [...prev, ...next]);
    e.target.value = ""; // reset to allow re-selecting same file(s)
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const clearAllAttachments = () => setAttachments([]);

  // --------------------------------------------------------------

  return (

    <div className="h-screen w-screen bg-gray-50">
        <Message/>
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className="relative h-full"
        style={{
          marginLeft: `${isDesktop ? desktopPush : 0}px`,
          transition: "margin-left 240ms ease-in-out",
        }}
      >
        <main className="flex flex-col h-screen min-h-0">
          <header className="h-14 bg-white border-b flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden h-9 w-9 grid place-items-center rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2"
                aria-label="Open sidebar"
              >
                ☰
              </button>
              <h1 className="font-semibold">ChatGPT 4</h1>
            </div>
            <button
              onClick={newChat}
              className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2"
            >
              New Chat
            </button>
          </header>

          <section className="flex-1 overflow-y-auto min-h-0">
            {messages.length === 0 && (
              <div className="max-w-3xl mx-auto px-4 pt-10 pb-24">
                <p className="text-2xl font-semibold mb-6">
                  👋 Hi Laurence! What do you want to learn today?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {quickPrompts.map((q) => (
                    <button
                      key={q}
                      onClick={() => onQuickPick(q)}
                      className="group relative w-full text-left rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 hover:to-blue-100/40 transition-colors p-4 focus:outline-none focus-visible:ring-2"
                    >
                      <div className="absolute -left-2 -top-2 h-6 w-6 grid place-items-center rounded-full bg-blue-600 text-white text-xs">
                        ✦
                      </div>
                      <p className="text-sm text-gray-800 pr-6">{q}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <div className="max-w-3xl mx-auto px-4 py-6 pb-24 space-y-3">
                {messages.map((m, i) => (
                  <Message key={i} role={m.role} text={m.text} />
                ))}
              </div>
            )}
          </section>

          {/* Composer area with attachments preview */}
          <footer className="border-t bg-white">
            <div className="max-w-3xl mx-auto px-4 py-3">
              {/* Attachments preview row */}
              {attachments.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>
                      Attachments ({attachments.length})
                    </span>
                    <button
                      onClick={clearAllAttachments}
                      className="text-xs px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus-visible:ring-2"
                      aria-label="Clear all attachments"
                    >
                      ✕ Clear all
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {attachments.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center gap-2 bg-white border rounded-full px-3 py-1 text-sm shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 grid place-items-center rounded-full bg-gray-100 text-xs">
                            📄
                          </div>
                          <div className="max-w-[180px] truncate">{a.file.name}</div>
                        </div>

                        <button
                          onClick={() => removeAttachment(a.id)}
                          className="h-6 w-6 grid place-items-center rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2"
                          aria-label={`Remove ${a.file.name}`}
                        >
                          −
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onInput={autoResize}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ask me a question..."
                  rows={1}
                  className="flex-1 resize-none rounded-lg border px-3 py-2 outline-none focus:ring-2 max-h-56"
                />

                {/* Camera (disabled) */}
                <button
                  type="button"
                  disabled
                  title="Camera disabled"
                  className="h-10 w-10 grid place-items-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Camera (disabled)"
                >
                  📷
                </button>

                {/* File attach (works) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach files"
                  className="h-10 w-10 grid place-items-center rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2"
                  aria-label="Attach files"
                >
                  📎
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={onFilesSelected}
                  className="hidden"
                />

                <button
                  onClick={() => send()}
                  className="h-10 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2"
                >
                  ➤
                </button>
              </div>

              <p className="text-[11px] text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for a new line.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Home;
