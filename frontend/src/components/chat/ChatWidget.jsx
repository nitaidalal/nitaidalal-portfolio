import { useState, useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { BsChatDots, BsX, BsSend } from "react-icons/bs";
import { BsRobot } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center
                        flex-shrink-0 mt-0.5
                        ${isUser ? "bg-primary" : "bg-accent border border-border"}`}
      >
        {isUser ? (
          <FaUser className="text-primary-foreground text-xs" />
        ) : (
          <BsRobot className="text-primary text-xs" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm
                        leading-relaxed
                        ${
                          isUser
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-card border border-border text-foreground rounded-tl-sm"
                        }`}
      >
        {/* Render newlines properly */}
        {msg.content.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < msg.content.split("\n").length - 1 && <br />}
          </span>
        ))}

        {/* Streaming cursor */}
        {msg.streaming && (
          <span
            className="inline-block w-1.5 h-3.5 bg-current ml-0.5
                           animate-pulse rounded-sm align-middle"
          />
        )}
      </div>
    </Motion.div>
  );
};

// ─── Typing indicator ─────────────────────────────────
const TypingIndicator = () => (
  <div className="flex gap-2.5 items-end">
    <div
      className="w-7 h-7 rounded-full bg-accent border border-border
                    flex items-center justify-center flex-shrink-0"
    >
      <BsRobot className="text-primary text-xs" />
    </div>
    <div
      className="bg-card border border-border rounded-2xl rounded-tl-sm
                    px-4 py-3 flex gap-1.5 items-center"
    >
      {[0, 1, 2].map((i) => (
        <Motion.div
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            delay: i * 0.15,
          }}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
        />
      ))}
    </div>
  </div>
);

// ─── Main ChatWidget ──────────────────────────────────
const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hi! 👋 I'm Nitai's AI assistant. Ask me anything about his projects, skills, background, or how to get in touch!",
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // add user message
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // build history (exclude welcome message, exclude last user msg)
    const history = messages
      .filter((m) => m.content !== WELCOME_MESSAGE.content)
      .map((m) => ({ role: m.role, content: m.content }));

    // add placeholder assistant message for streaming
    const assistantMsgId = Date.now();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", streaming: true, id: assistantMsgId },
    ]);

    try {
      // use fetch directly for SSE streaming
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/chat`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history }),
        },
      );

      if (!response.ok) throw new Error("Request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep incomplete line

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          try {
            const parsed = JSON.parse(line.slice(6));

            if (parsed.done) {
              // streaming finished — remove streaming flag
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId ? { ...m, streaming: false } : m,
                ),
              );
            } else if (parsed.error) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        content:
                          "Sorry, something went wrong. Please try again.",
                        streaming: false,
                      }
                    : m,
                ),
              );
            } else if (parsed.text) {
              // append chunk to assistant message
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: m.content + parsed.text }
                    : m,
                ),
              );
            }
          } catch {
            // skip malformed chunk
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: "Sorry, I couldn't connect. Please try again.",
                streaming: false,
              }
            : m,
        ),
      );
      } finally {
        setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isStreaming = messages.some((m) => m.streaming);

  return (
    <>
      {/* ── Chat window ───────────────────────────── */}
      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-50
                       w-[calc(100vw-2rem)] sm:w-96
                       max-h-[70vh] flex flex-col
                       bg-background border border-border rounded-2xl
                       shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3
                            bg-card border-b border-border flex-shrink-0"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full bg-primary flex items-center
                                justify-center"
                >
                  <BsRobot className="text-primary-foreground text-sm" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">
                    Nitai's Assistant
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground
                           hover:bg-accent hover:text-foreground
                           transition-colors"
              >
                <BsX className="text-xl" />
              </button>
            </div>

            {/* Messages */}
            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4
             flex flex-col gap-3 min-h-0"
            >
              {messages.map((msg, i) => {
                // Don't show the empty assistant placeholder.
                // TypingIndicator represents it until the first chunk arrives.
                if (msg.streaming && !msg.content) {
                  return null;
                }

                return <MessageBubble key={msg.id || i} msg={msg} />;
              })}

              {/* Waiting for Gemini's first response chunk */}
              {loading && messages.some((m) => m.streaming && !m.content) && (
                <TypingIndicator />
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-3 py-3 border-t border-border bg-card
                            flex-shrink-0"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about Nitai..."
                  rows={1}
                  disabled={loading}
                  className="flex-1 bg-background border border-border rounded-xl
                             px-3 py-2.5 text-sm text-foreground resize-none
                             placeholder:text-muted-foreground
                             focus:outline-none focus:ring-2 focus:ring-ring
                             disabled:opacity-50 max-h-28 overflow-y-auto
                             transition-all duration-200"
                  style={{ minHeight: "40px" }}
                />
                <Motion.button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  whileTap={{ scale: 0.92 }}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground
                             flex items-center justify-center flex-shrink-0
                             hover:opacity-90 disabled:opacity-40
                             disabled:cursor-not-allowed transition-opacity"
                  aria-label="Send message"
                >
                  <BsSend className="text-sm" />
                </Motion.button>
              </div>
              
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating trigger button ───────────────── */}
      <Motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="fixed bottom-6 right-4 sm:right-6 z-50
                   w-14 h-14 rounded-full bg-primary text-primary-foreground
                   flex items-center justify-center shadow-lg
                   hover:shadow-xl transition-shadow duration-200"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <Motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <BsX className="text-2xl" />
            </Motion.div>
          ) : (
            <Motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <BsChatDots className="text-xl" />
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.button>
    </>
  );
};

export default ChatWidget;
