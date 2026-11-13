import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  CalendarPlus,
  BotMessageSquare,
  ArrowRight,
} from 'lucide-react';

export const QuickActionCard = () => {
  const actions = [
    {
      title: 'Recommend Crops',
      description: 'Match soil & season to ideal crops',
      to: '/crop-recommendation',
      icon: Sprout,
      color: 'bg-green-500 text-white',
    },
    {
      title: 'Analyze Soil Health',
      description: 'Lab NPK & pH assessment',
      to: '/soil-analysis',
      icon: FlaskConical,
      color: 'bg-amber-500 text-white',
    },
    {
      title: 'Diagnose Disease',
      description: 'Symptoms & photo inspection',
      to: '/disease-detection',
      icon: Bug,
      color: 'bg-rose-500 text-white',
    },
    {
      title: 'Ask AgroAI',
      description: 'Chat in Kannada, Hindi, or English',
      to: '/ai-assistant',
      icon: BotMessageSquare,
      color: 'bg-agro-600 text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act, i) => {
        const Icon = act.icon;
        return (
          <Link
            key={i}
            to={act.to}
            className="group bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-lg hover:border-agro-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div
                className={`w-11 h-11 rounded-2xl ${act.color} flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-agro-600 transition-colors">
                {act.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {act.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-agro-600 gap-1">
              <span>Start</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

