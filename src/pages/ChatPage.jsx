import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { chatStore } from '../stores/ChatStore';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Send, X, Bot, User2, ChevronDown, Loader2 } from 'lucide-react';

const MAX_INPUT_HEIGHT = 160; // keep in sync with CSS

const ChatPage = observer(() => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const listRef = useRef(null);
  const textareaRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const API = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const scrollToBottom = (behavior = 'smooth') => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  };

  useEffect(() => { scrollToBottom('auto'); }, []);
  useEffect(() => { scrollToBottom(); }, [chatStore.messages.length, chatStore.isLoading]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 140;
      setShowScrollBtn(!nearBottom);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (chatStore.messages.length === 0) chatStore.loadHistory?.();
  }, []);

  const autosize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const next = Math.min(ta.scrollHeight, MAX_INPUT_HEIGHT);
    ta.style.height = next + 'px';
    ta.style.overflowY = ta.scrollHeight > MAX_INPUT_HEIGHT ? 'auto' : 'hidden';
  };
  useEffect(() => { autosize(); }, [chatStore.userInput]);

  const handleFileChange = (e) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) setFile(uploaded);
  };
  const removeFile = () => setFile(null);

  const sendMessage = async () => {
    const userMessage = chatStore.userInput.trim();
    if (!userMessage && !file) return;

    chatStore.setUserInput('');
    chatStore.isLoading = true;

    if (file) {
      const formData = new FormData();
      formData.append('faq', file);
      try {
        await fetch(`${API}/upload-faq`, { method: 'POST', body: formData });
        chatStore.addMessage('assistant', `📄 File "${file.name}" uploaded successfully.`);
      } catch {
        chatStore.addMessage('assistant', '❌ Failed to upload file.');
      }
      setFile(null);
    }

    if (userMessage) {
      chatStore.addMessage('user', userMessage);
      try {
        const res = await fetch(`${API}/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage, userId: 'default-user' }),
        });
        const data = await res.json();
        chatStore.addMessage('assistant', data.reply || 'No response');
      } catch {
        chatStore.addMessage('assistant', '❌ Error getting AI response');
      }
    }

    chatStore.isLoading = false;
    scrollToBottom();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fmtTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-root chat-screen text-white">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-container header-inner">
          <div className="header-left">
            <div className="avatar bot"><Bot className="ic" /></div>
            <div>
              <h2 className="title">AI Chat Assistant</h2>
              <p className="subtitle">Online • 24/7</p>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/')} className="btn-ghost">Home</button>
            <button onClick={handleLogout} className="btn-danger">Logout</button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <section ref={listRef} className="chat-area">
        <div className="chat-container messages">
          {chatStore.messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div key={i} className={`row ${isUser ? 'me' : 'ai'}`}>
                {!isUser && <div className="avatar dot"><Bot className="ic-sm" /></div>}
                <div className={`bubble ${isUser ? 'me' : 'ai'}`}>
                  {msg.content}
                  <div className="ts">{fmtTime(msg.ts)}</div>
                </div>
                {isUser && <div className="avatar dot me"><User2 className="ic-sm" /></div>}
              </div>
            );
          })}
          {chatStore.isLoading && (
            <div className="typing">
              <span className="dot1" /><span className="dot2" /><span className="dot3" />
              <span className="txt">Assistant is typing…</span>
            </div>
          )}
        </div>
      </section>

      {/* Composer (fixed like GPT) */}
      <footer className="composer">
        <div className="chat-container">
          {file && (
            <div className="file-chip">
              <span className="truncate">📎 {file.name}</span>
              <button onClick={removeFile} className="chip-x" title="Remove">
                <X className="ic-sm" />
              </button>
            </div>
          )}

          <div className="composer-row">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-icon"
              title="Attach .txt/.jpg/.png"
            >
              <UploadCloud className="ic" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".txt,.jpg,.jpeg,.png"
            />

            <textarea
              ref={textareaRef}
              value={chatStore.userInput}
              onChange={(e) => chatStore.setUserInput(e.target.value)}
              onInput={autosize}
              onKeyDown={onKeyDown}
              placeholder="Write a message…  (Shift+Enter for newline)"
              className="composer-input"
              rows={1}
              spellCheck
            />

            <button
              onClick={sendMessage}
              disabled={chatStore.isLoading || (!chatStore.userInput.trim() && !file)}
              className="btn-send"
            >
              {chatStore.isLoading ? (
                <>
                  <Loader2 className="ic-sm spin" />
                  Sending
                </>
              ) : (
                <>
                  <Send className="ic-sm" />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </footer>

      {showScrollBtn && (
        <button onClick={() => scrollToBottom()} className="scroll-floater" title="Scroll to latest">
          <ChevronDown className="ic" />
        </button>
      )}
    </div>
  );
});

export default ChatPage;
