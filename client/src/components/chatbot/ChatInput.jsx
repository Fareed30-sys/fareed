import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';
import { Button } from '../common/Button';

export const ChatInput = ({ onSend, isLoading, placeholder }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm focus-within:border-agro-500 focus-within:ring-2 focus-within:ring-agro-500/20 transition-all">
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Ask any farming question in your language (e.g. Ragi pest control, drip schedule)...'}
        className="w-full resize-none border-none bg-transparent px-3 py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none max-h-32"
      />

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={!text.trim()}
        size="sm"
        className="shrink-0 h-10 w-10 !p-0 rounded-xl"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};

