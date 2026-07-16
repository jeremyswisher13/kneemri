import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchFAQ, getSuggestedQuestions } from '@/lib/faq-search';
import type { FAQEntry } from '@/content/faq-knowledge-base';

interface ChatMessage {
  id: number;
  role: 'user' | 'bot';
  text: string;
  relatedModule?: string;
}

export default function FAQChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [suggested] = useState<FAQEntry[]>(() => getSuggestedQuestions(5));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const msgIdRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  function nextId() {
    return ++msgIdRef.current;
  }

  function handleSend(question?: string) {
    const q = (question ?? input).trim();
    if (!q) return;

    const userMsg: ChatMessage = { id: nextId(), role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Search with a small delay so the user message renders first
    setTimeout(() => {
      const results = searchFAQ(q);
      let botMsg: ChatMessage;

      if (results.length > 0) {
        const best = results[0].entry;
        botMsg = {
          id: nextId(),
          role: 'bot',
          text: best.answer,
          relatedModule: best.relatedModule,
        };
      } else {
        botMsg = {
          id: nextId(),
          role: 'bot',
          text: "I don't have a specific answer for that question. Try asking about meniscal tears, ligament injuries, MRI sequences, or how to use the app. You can also try the suggested questions below.",
        };
      }

      setMessages((prev) => [...prev, botMsg]);
    }, 300);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleLearnMore(path: string) {
    navigate(path);
    // Keep chat open so user can return to conversation
  }

  return (
    <>
      {/* Mobile keeps the assistant in the toolbar so it cannot cover learning
          controls. From the tablet breakpoint up it returns to a floating button. */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ucla-blue text-white transition-colors hover:bg-ucla-dark sm:fixed sm:bottom-4 sm:right-4 sm:z-50 sm:h-14 sm:w-14 sm:rounded-full sm:shadow-lg sm:transition-all sm:duration-200 sm:hover:scale-105 sm:hover:shadow-xl sm:active:scale-95"
        aria-label={open ? 'Close chat' : 'Open MRI Course Assistant'}
      >
        {open ? (
          <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
        )}
      </button>

      {/* Chat panel — `inert` when closed removes its controls from the tab order
          and a11y tree while it's visually hidden (it stays mounted for the
          open/close transition). */}
      <div
        inert={!open}
        aria-label="MRI Course Assistant chat"
        // Mobile: anchor to the BOTTOM, never a hard-coded top offset. The
        // toolbar's top edge is variable (AppLayout header, InstallPrompt, the
        // admin preview banner, the offline banner all shift it), so a fixed
        // `top-14` slid up over the toolbar and covered Report-issue + Search.
        className={`fixed right-4 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 flex max-h-[calc(100dvh_-_8rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 sm:bottom-20 sm:max-h-[500px] sm:w-96 ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-ucla-blue px-4 py-3">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
              />
            </svg>
            <span className="text-sm font-semibold text-white">MRI Course Assistant</span>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="min-h-11 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:min-h-0 sm:px-2 sm:py-1 sm:text-xs"
              aria-label="New conversation"
            >
              New Chat
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:h-8 sm:w-8"
            aria-label="Close chat"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-3" style={{ minHeight: '280px', maxHeight: '360px' }}>
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Ask me anything about MRI interpretation, the courses, or how to use the app.
              </p>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Try asking:
                </p>
                {suggested.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => handleSend(entry.question)}
                    className="block min-h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:border-ucla-blue/40 hover:bg-ucla-light/30 hover:text-ucla-dark sm:min-h-0 sm:text-xs"
                  >
                    {entry.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-ucla-blue text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {msg.text}
                {msg.role === 'bot' && msg.relatedModule && (
                  <button
                    onClick={() => handleLearnMore(msg.relatedModule!)}
                    className="mt-1.5 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-ucla-blue transition-colors hover:text-ucla-dark sm:min-h-0 sm:text-xs"
                  >
                    Learn more
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 px-3 py-2">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="min-h-11 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-ucla-blue focus:bg-white focus:ring-1 focus:ring-ucla-blue/30 sm:min-h-0"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ucla-blue text-white transition-all hover:bg-ucla-dark disabled:opacity-40 disabled:hover:bg-ucla-blue sm:h-9 sm:w-9"
              aria-label="Send message"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
