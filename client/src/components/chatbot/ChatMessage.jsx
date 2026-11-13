import React from 'react';
import { Bot, User, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export const ChatMessage = ({ message, onSelectTopic }) => {
  const isUser = message.role === 'user';
  const meta = message.meta || {};

  return (
    <div className={`flex items-start gap-3 my-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          isUser
            ? 'bg-gray-800 text-white'
            : 'bg-agro-600 text-white shadow-agro-600/20'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
        <div
          className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'bg-agro-600 text-white rounded-tr-sm font-medium'
              : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-sm'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>

          <div
            className={`text-[9px] mt-2 ${
              isUser ? 'text-agro-200 text-right' : 'text-gray-400'
            }`}
          >
            {message.created_at
              ? format(new Date(message.created_at), 'p')
              : 'Just now'}
          </div>
        </div>

        {/* Assistant Warnings */}
        {!isUser && meta.warnings?.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900">
            <p className="font-bold flex items-center gap-1 mb-1 text-amber-950">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Precaution
            </p>
            <ul className="space-y-0.5">
              {meta.warnings.map((w, idx) => (
                <li key={idx}>• {w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Assistant Suggested Follow-up Topics */}
        {!isUser && meta.relatedTopics?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {meta.relatedTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => onSelectTopic && onSelectTopic(topic)}
                className="px-2.5 py-1 bg-gray-50 hover:bg-agro-50 text-gray-700 hover:text-agro-700 border border-gray-200 rounded-xl text-[11px] font-semibold transition-colors"
              >
                + {topic}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

