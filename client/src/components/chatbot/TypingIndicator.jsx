import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 my-2">
      <div className="w-8 h-8 rounded-xl bg-agro-600 text-white flex items-center justify-center shrink-0 shadow-sm">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-gray-100/90 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-agro-600 animate-bounce" />
        <span className="w-2 h-2 rounded-full bg-agro-600 animate-bounce [animation-delay:0.2s]" />
        <span className="w-2 h-2 rounded-full bg-agro-600 animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  );
};

