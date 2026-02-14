import React, { useState } from 'react';
import { Reaction, ReactionType } from '../types';

const REACTION_EMOJIS: Record<ReactionType, string> = {
  LIKE: '👍',
  LOVE: '❤️',
  HAHA: '😂',
  WOW: '😮',
  SAD: '😢',
  ANGRY: '😠'
};

const REACTION_LABELS: Record<ReactionType, { EN: string; AR: string }> = {
  LIKE: { EN: 'Like', AR: 'إعجاب' },
  LOVE: { EN: 'Love', AR: 'حب' },
  HAHA: { EN: 'Haha', AR: 'ضحك' },
  WOW: { EN: 'Wow', AR: 'مندهش' },
  SAD: { EN: 'Sad', AR: 'حزين' },
  ANGRY: { EN: 'Angry', AR: 'غضب' }
};

interface ReactionSystemProps {
  postId: string;
  reactions: Reaction[];
  onAddReaction: (postId: string, reactionType: ReactionType) => void;
  onRemoveReaction: (postId: string, userId: string) => void;
  currentUserId?: string;
  theme: 'light' | 'dark';
  language: 'EN' | 'AR';
}

const ReactionSystem: React.FC<ReactionSystemProps> = ({
  postId,
  reactions,
  onAddReaction,
  onRemoveReaction,
  currentUserId,
  theme,
  language
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showReactionSummary, setShowReactionSummary] = useState(false);

  const reactionTypes: ReactionType[] = ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'];

  // الحصول على رد الفعل الحالي للمستخدم
  const userCurrentReaction = reactions.find(
    r => r.userId === currentUserId && r.postId === postId
  );

  const handleReactionClick = (type: ReactionType) => {
    onAddReaction(postId, type);
    setShowReactionPicker(false);
  };

  // تجميع الردود حسب النوع
  const groupedReactions = reactionTypes.reduce((acc, type) => {
    const count = reactions.filter(r => r.type === type && r.postId === postId).length;
    if (count > 0) {
      acc[type] = count;
    }
    return acc;
  }, {} as Record<ReactionType, number>);

  const totalReactions = Object.values(groupedReactions).reduce((a, b) => a + b, 0);

  // الحصول على قائمة المستخدمين لكل نوع رد فعل
  const getReactionUsers = (type: ReactionType) => {
    return reactions
      .filter(r => r.type === type && r.postId === postId)
      .map(r => r.userId);
  };

  return (
    <div className="space-y-3">
      {/* ملخص ردات الفعل */}
      {totalReactions > 0 && (
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
          <button
            onClick={() => setShowReactionSummary(!showReactionSummary)}
            className={`w-full text-left font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} hover:opacity-80 transition`}
          >
            <div className="flex flex-wrap gap-2 items-center">
              {Object.entries(groupedReactions).map(([type, count]) => (
                <span key={type} className="flex items-center gap-1">
                  {REACTION_EMOJIS[type as ReactionType]} {count}
                </span>
              ))}
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {totalReactions} {language === 'AR' ? 'ردة فعل' : 'reactions'}
              </span>
            </div>
          </button>

          {/* تفاصيل ردات الفعل */}
          {showReactionSummary && (
            <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-500' : 'border-gray-300'}`}>
              {Object.entries(groupedReactions).map(([type, count]) => (
                <div key={type} className="mb-2">
                  <p className={`text-sm font-bold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {REACTION_EMOJIS[type as ReactionType]} {REACTION_LABELS[type as ReactionType][language]} ({count})
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* أزرار الردود والمنتقي */}
      <div className="flex gap-2 flex-wrap items-center">
        {/* زر إضافة رد فعل */}
        <div className="relative">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title={language === 'AR' ? 'أضف رد فعل' : 'Add reaction'}
          >
            😊 {language === 'AR' ? 'رد فعل' : 'React'}
          </button>

          {/* منتقي الردود */}
          {showReactionPicker && (
            <div
              className={`absolute bottom-12 left-0 p-3 rounded-lg shadow-lg z-10 flex gap-2 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'
              }`}
            >
              {reactionTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleReactionClick(type)}
                  className={`text-2xl p-2 rounded hover:scale-125 transition transform ${
                    userCurrentReaction?.type === type
                      ? 'scale-110 ring-2 ring-blue-500'
                      : ''
                  }`}
                  title={REACTION_LABELS[type][language]}
                >
                  {REACTION_EMOJIS[type]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* إزالة رد الفعل الحالي */}
        {userCurrentReaction && (
          <button
            onClick={() => onRemoveReaction(postId, currentUserId || '')}
            className={`px-3 py-2 rounded-lg font-bold transition text-sm ${
              theme === 'dark'
                ? 'bg-red-700 text-white hover:bg-red-600'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
            title={language === 'AR' ? 'إزالة رد الفعل' : 'Remove reaction'}
          >
            {REACTION_EMOJIS[userCurrentReaction.type]} {language === 'AR' ? 'إزالة' : 'Remove'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReactionSystem;
