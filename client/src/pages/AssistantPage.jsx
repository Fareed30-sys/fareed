import React from 'react';
import { ChatWindow } from '../components/chatbot/ChatWindow';
import { BotMessageSquare, Sparkles } from 'lucide-react';

export const AssistantPage = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <BotMessageSquare className="w-7 h-7 text-agro-600" />
          <span>AgroAI Multilingual Conversational Assistant</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Ask questions in Kannada, Hindi, or English regarding crop cycles, pest remedies, market seasons, and organic preparations.
        </p>
      </div>

      <ChatWindow />
    </div>
  );
};

