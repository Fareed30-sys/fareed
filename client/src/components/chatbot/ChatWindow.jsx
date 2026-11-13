import React, { useState, useEffect, useRef } from 'react';
import {
  createConversation,
  getConversations,
  getConversationById,
  sendChatMessage,
  deleteConversation,
} from '../../services/api';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from '../common/EmptyState';
import {
  Bot,
  Plus,
  Trash2,
  MessageSquare,
  Globe,
  Sprout,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../../utils/constants';

export const ChatWindow = () => {
  const { language, setLanguage } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [activeConvoId, setActiveConvoId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingConvo, setIsLoadingConvo] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConvoId) {
      loadMessages(activeConvoId);
    }
  }, [activeConvoId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const loadConversations = async () => {
    try {
      setIsLoadingConvo(true);
      const res = await getConversations();
      const list = res.data || [];
      setConversations(list);
      if (list.length > 0 && !activeConvoId) {
        setActiveConvoId(list[0].id);
      } else if (list.length === 0) {
        // Create initial default conversation
        handleNewConversation();
      }
    } catch (err) {
      console.error('[CHAT_LOAD_CONVOS_ERROR]', err);
    } finally {
      setIsLoadingConvo(false);
    }
  };

  const loadMessages = async (id) => {
    try {
      const res = await getConversationById(id);
      setMessages(res.data?.messages || []);
    } catch (err) {
      console.error('[CHAT_LOAD_MSGS_ERROR]', err);
    }
  };

  const handleNewConversation = async () => {
    try {
      const res = await createConversation({
        title: 'Agricultural Advice Discussion',
        language: language || 'en',
      });
      const newConvo = res.data;
      setConversations((prev) => [newConvo, ...prev]);
      setActiveConvoId(newConvo.id);
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content:
            language === 'kn'
              ? 'ನಮಸ್ಕಾರ! ನಾನು ಆಗ್ರೋ-ಎಐ ಕೃಷಿ ಸಹಾಯಕ. ಬೆಳೆ ಶಿಫಾರಸು, ರೋಗ ರಕ್ಷಣೆ, ರಸಗೊಬ್ಬರ ಅಥವಾ ನೀರಾವರಿಯ ಬಗ್ಗೆ ನಿಮ್ಮ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.'
              : 'Namaste! I am AgroAI, your agricultural advisory assistant. Ask me anything about crop planning, soil fertility, pest identification, fertilizer dosages, or irrigation schedules.',
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error('[CREATE_CONVO_ERROR]', err);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !activeConvoId || isSending) return;

    // Optimistic user message append
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const res = await sendChatMessage(activeConvoId, {
        message: text,
        language: language || 'en',
      });

      const assistantMsg = res.data.message;
      const meta = res.data.meta;

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        { ...tempUserMsg, id: `user-${Date.now()}` },
        { ...assistantMsg, meta },
      ]);

      // Refresh conversation list to pick up updated title
      const listRes = await getConversations();
      if (listRes?.data) setConversations(listRes.data);
    } catch (err) {
      console.error('[SEND_MSG_ERROR]', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Failed to get answer: ${err.message || 'Network or server issue'}. Please try again.`,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteConversation = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
      const filtered = conversations.filter((c) => c.id !== id);
      setConversations(filtered);
      if (activeConvoId === id) {
        if (filtered.length > 0) {
          setActiveConvoId(filtered[0].id);
        } else {
          handleNewConversation();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden h-[750px] flex flex-col md:flex-row">
      {/* Sidebar: Conversation history */}
      <div className="w-full md:w-72 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-agro-600" />
            <span className="text-sm font-bold text-gray-900">Conversations</span>
          </div>
          <button
            onClick={handleNewConversation}
            className="p-1.5 bg-white border border-gray-200 hover:bg-agro-50 hover:text-agro-700 text-gray-700 rounded-xl transition-colors shadow-sm"
            title="Start new conversation"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveConvoId(c.id)}
              className={`p-3 rounded-2xl cursor-pointer text-xs transition-all flex items-center justify-between group ${
                activeConvoId === c.id
                  ? 'bg-white font-bold text-agro-700 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:bg-gray-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <MessageSquare className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-agro-600" />
                <span className="truncate">{c.title || 'New Conversation'}</span>
              </div>

              <button
                onClick={(e) => handleDeleteConversation(c.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Language selector in Chat window */}
        <div className="p-3 border-t border-gray-200 bg-white/50 flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-agro-600" /> AI Language:
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-800"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Thread */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/50">
        {/* Chat Thread Header */}
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-agro-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                AgroAI Multilingual Assistant
              </h3>
              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Powered by Google Gemini
              </p>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 hidden sm:block">
            Safety Guardrails Active
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSelectTopic={(topic) => handleSendMessage(`Tell me more about ${topic}`)}
            />
          ))}

          {isSending && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
          <ChatInput
            onSend={handleSendMessage}
            isLoading={isSending}
            placeholder={
              language === 'kn'
                ? 'ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ (ಉದಾ: ರಾಗಿ ಬಿತ್ತನೆ ಸಮಯ, ತೊಗರಿ ಕೀಟ ಬಾಧೆ)...'
                : 'Ask AgroAI any farming query (e.g. Pest control in paddy, drip duration in cotton)...'
            }
          />
        </div>
      </div>
    </div>
  );
};

