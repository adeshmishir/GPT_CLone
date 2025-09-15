import React, { useRef, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const quickPrompts = [
  "Give me a concise summary of this meeting transcript",
  "Write a product description for a minimalist smartwatch",
  "Provide a polite response to a customer asking for a refund",
];

const Message = ({ role, text }) => (
  <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
        role === "user"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {text}
    </div>
  </div>
);

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);      // mobile open/close
  const [collapsed, setCollapsed] = useState(false); // desktop rail collapse
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const newChat = () => {
    setMessages([]);
    setInput("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const send = (text) => {
    const content = (text ?? input).trim();
    if (!content) return;
    const next = [...messages, { role: "user", text: content }];
    setMessages(next);
    setInput("");
    // Hook backend/AI here and push assistant response when ready.
  };

  const onQuickPick = (t) => {
    setInput(t);
    send(t);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      <div className="grid grid-cols-[auto,1fr] h-full">
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="flex flex-col h-full">
          {/* Header */}
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

          {/* Content */}
          <section className="flex-1 overflow-y-auto">
            {/* Hero + quick cards */}
            {messages.length === 0 && (
              <div className="max-w-3xl mx-auto px-4 pt-10">
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

            {/* Messages */}
            {messages.length > 0 && (
              <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
                {messages.map((m, i) => (
                  <Message key={i} role={m.role} text={m.text} />
                ))}
              </div>
            )}
          </section>

          {/* Composer */}
          <footer className="border-t bg-white">
            <div className="max-w-3xl mx-auto px-4 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ask me a question..."
                  rows={1}
                  className="flex-1 resize-none rounded-lg border px-3 py-2 outline-none focus:ring-2"
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
