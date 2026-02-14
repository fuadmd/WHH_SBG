import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const REACTION_EMOJIS: Record<string, string> = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠'
};

const REACTION_LABELS: Record<string, { EN: string; AR: string }> = {
  like: { EN: 'Like', AR: 'إعجاب' },
  love: { EN: 'Love', AR: 'حب' },
  haha: { EN: 'Haha', AR: 'ضحك' },
  wow: { EN: 'Wow', AR: 'مندهش' },
  sad: { EN: 'Sad', AR: 'حزين' },
  angry: { EN: 'Angry', AR: 'غضب' }
};

interface ReactionCounterProps {
  postId: string;
  currentUserId?: string;
  theme: 'light' | 'dark';
  language: 'EN' | 'AR';
  onReactionChange?: () => void;
}

// Mock reactions data (will be replaced with Supabase later)
const mockReactions: Record<string, Record<string, number>> = {
  'post-1': { like: 5, love: 3, haha: 1 },
  'post-2': { like: 12, love: 8, haha: 2, wow: 1 },
  'post-3': { like: 3, love: 2 }
};

const mockUserReactions: Record<string, Record<string, string>> = {
  'user-1': { 'post-1': 'like', 'post-2': 'love' },
  'user-2': { 'post-1': 'love', 'post-3': 'haha' }
};

const ReactionCounter: React.FC<ReactionCounterProps> = ({
  postId,
  currentUserId,
  theme,
  language,
  onReactionChange
}) => {
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const reactionTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

  // Load reaction data from mock data
  useEffect(() => {
    setLoading(true);
    try {
      // Get reaction counts from mock data
      const counts = mockReactions[postId] || {};
      setReactionCounts(counts);

      // Get user's current reaction
      if (currentUserId) {
        const userReact = mockUserReactions[currentUserId]?.[postId] || null;
        setUserReaction(userReact);
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    } finally {
      setLoading(false);
    }
  }, [postId, currentUserId]);

  const handleReactionClick = (reactionType: string) => {
    if (!currentUserId) {
      alert(language === 'AR' ? 'يرجى تسجيل الدخول للتفاعل' : 'Please login to react');
      return;
    }

    setLoading(true);
    try {
      // Initialize mock data if not exists
      if (!mockReactions[postId]) {
        mockReactions[postId] = {};
      }
      if (!mockUserReactions[currentUserId]) {
        mockUserReactions[currentUserId] = {};
      }

      const currentReaction = userReaction;
      const newCounts = { ...reactionCounts };

      // Remove old reaction count if exists
      if (currentReaction && currentReaction !== reactionType) {
        newCounts[currentReaction] = (newCounts[currentReaction] || 0) - 1;
        if (newCounts[currentReaction] === 0) {
          delete newCounts[currentReaction];
        }
      }

      // Toggle or add new reaction
      if (currentReaction === reactionType) {
        // Remove reaction (toggle off)
        newCounts[reactionType] = (newCounts[reactionType] || 0) - 1;
        if (newCounts[reactionType] === 0) {
          delete newCounts[reactionType];
        }
        setUserReaction(null);
        delete mockUserReactions[currentUserId][postId];
      } else {
        // Add or update reaction
        newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
        setUserReaction(reactionType);
        mockUserReactions[currentUserId][postId] = reactionType;
      }

      // Update mock data
      mockReactions[postId] = newCounts;
      setReactionCounts(newCounts);

      if (onReactionChange) {
        onReactionChange();
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  const usedReactions = Object.entries(reactionCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className={`flex flex-col gap-2 py-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
      {/* Reaction Summary Bar */}
      {usedReactions.length > 0 && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center gap-1 flex-1">
            {usedReactions.map(([reactionType, count]) => (
              <div
                key={reactionType}
                className={`flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer transition ${
                  userReaction === reactionType
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700'
                    : theme === 'dark'
                    ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleReactionClick(reactionType)}
                title={REACTION_LABELS[reactionType][language]}
              >
                <span className="text-lg">{REACTION_EMOJIS[reactionType]}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
          <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {totalReactions}
          </span>
        </div>
      )}

      {/* Reaction Buttons */}
      <div className="relative">
        <div className="flex items-center gap-1 px-3 py-2">
          {reactionTypes.slice(0, 3).map(reactionType => (
            <button
              key={reactionType}
              onClick={() => handleReactionClick(reactionType)}
              disabled={loading}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                userReaction === reactionType
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 border border-blue-300'
                  : theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              } disabled:opacity-50`}
              title={REACTION_LABELS[reactionType][language]}
            >
              <span className="text-lg">{REACTION_EMOJIS[reactionType]}</span>
              <span className="text-xs hidden sm:inline">{REACTION_LABELS[reactionType][language]}</span>
            </button>
          ))}

          {/* More Reactions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {showReactionPicker && (
              <div className={`absolute bottom-full left-0 mb-2 p-2 rounded-lg shadow-lg z-10 flex gap-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
                {reactionTypes.slice(3).map(reactionType => (
                  <button
                    key={reactionType}
                    onClick={() => {
                      handleReactionClick(reactionType);
                      setShowReactionPicker(false);
                    }}
                    className={`text-2xl hover:scale-125 transition ${
                      userReaction === reactionType ? 'scale-125' : ''
                    }`}
                    title={REACTION_LABELS[reactionType][language]}
                  >
                    {REACTION_EMOJIS[reactionType]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Prompt */}
      {!currentUserId && (
        <p className={`text-xs px-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {language === 'AR' ? 'سجل الدخول للتفاعل' : 'Login to react'}
        </p>
      )}
    </div>
  );
};

export default ReactionCounter;
