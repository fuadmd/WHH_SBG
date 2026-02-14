import React, { useState } from 'react';
import { User, ForumPost, ForumComment, AppState } from '../types';
import { UI_STRINGS } from '../constants';

interface ForumModerationProps {
  state: AppState;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  forumPosts: ForumPost[];
  setForumPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>;
  forumComments: ForumComment[];
  setForumComments: React.Dispatch<React.SetStateAction<ForumComment[]>>;
}

const ForumModeration: React.FC<ForumModerationProps> = ({
  state,
  users,
  setUsers,
  forumPosts,
  setForumPosts,
  forumComments,
  setForumComments
}) => {
  const t = UI_STRINGS[state.language];
  const [activeTab, setActiveTab] = useState<'USER_BANS' | 'CONTENT_MODERATION'>('USER_BANS');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banType, setBanType] = useState<'forum' | 'market' | 'both'>('forum');

  // Check if current user is super admin
  const isSuperAdmin = state.currentUser?.adminPermission === 'SUPER_ADMIN';

  if (!isSuperAdmin) {
    return (
      <div className={`min-h-screen ${state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            You do not have permission to access this page.
          </div>
        </div>
      </div>
    );
  }

  const handleBanUser = (userId: string) => {
    if (!banReason.trim()) {
      alert('Please provide a ban reason');
      return;
    }

    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          banFromForum: banType === 'forum' || banType === 'both',
          banFromMarket: banType === 'market' || banType === 'both',
          banReason: banReason,
          bannedAt: new Date().toISOString()
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setBanReason('');
    setSelectedUserId(null);
    alert('User banned successfully');
  };

  const handleUnbanUser = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          banFromForum: false,
          banFromMarket: false,
          banReason: undefined,
          bannedAt: undefined
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    alert('User unbanned successfully');
  };

  const handleDeletePost = (postId: string) => {
    setForumPosts(forumPosts.filter(p => p.id !== postId));
    setForumComments(forumComments.filter(c => c.postId !== postId));
    alert('Post deleted successfully');
  };

  const handleDeleteComment = (commentId: string) => {
    setForumComments(forumComments.filter(c => c.id !== commentId));
    alert('Comment deleted successfully');
  };

  const bannedUsers = users.filter(u => u.banFromForum || u.banFromMarket);

  return (
    <div className={`min-h-screen ${state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold mb-8 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t.moderationTools}
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('USER_BANS')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              activeTab === 'USER_BANS'
                ? 'bg-blue-600 text-white'
                : state.theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {t.userBans}
          </button>
          <button
            onClick={() => setActiveTab('CONTENT_MODERATION')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              activeTab === 'CONTENT_MODERATION'
                ? 'bg-blue-600 text-white'
                : state.theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {t.contentModeration}
          </button>
        </div>

        {/* User Bans Section */}
        {activeTab === 'USER_BANS' && (
          <div className="space-y-8">
            {/* Ban User Form */}
            <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h2 className={`text-2xl font-bold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t.banUser}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={`block font-bold mb-2 ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t.businessName}
                  </label>
                  <select
                    value={selectedUserId || ''}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  >
                    <option value="">Select a user</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block font-bold mb-2 ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t.banReason}
                  </label>
                  <textarea
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Explain the reason for banning this user"
                    rows={3}
                    className={`w-full p-3 rounded-lg border ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-2 ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Ban Type
                  </label>
                  <select
                    value={banType}
                    onChange={(e) => setBanType(e.target.value as 'forum' | 'market' | 'both')}
                    className={`w-full p-3 rounded-lg border ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  >
                    <option value="forum">{t.banFromForum}</option>
                    <option value="market">{t.banFromMarket}</option>
                    <option value="both">Both Forum and Market</option>
                  </select>
                </div>

                <button
                  onClick={() => selectedUserId && handleBanUser(selectedUserId)}
                  disabled={!selectedUserId}
                  className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {t.banUser}
                </button>
              </div>
            </div>

            {/* Banned Users List */}
            <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h2 className={`text-2xl font-bold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t.bannedUsers}
              </h2>

              {bannedUsers.length === 0 ? (
                <p className={state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  No banned users
                </p>
              ) : (
                <div className="space-y-4">
                  {bannedUsers.map(user => (
                    <div
                      key={user.id}
                      className={`p-4 rounded-lg border ${
                        state.theme === 'dark'
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-gray-100 border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className={`font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {user.name}
                          </p>
                          <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {user.email}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnbanUser(user.id)}
                          className="bg-green-600 text-white font-bold py-1 px-3 rounded hover:bg-green-700 transition"
                        >
                          {t.unban}
                        </button>
                      </div>
                      <div className={`text-sm ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <p><strong>Ban Reason:</strong> {user.banReason}</p>
                        <p><strong>Banned At:</strong> {user.bannedAt ? new Date(user.bannedAt).toLocaleDateString() : 'N/A'}</p>
                        <p>
                          <strong>Ban Type:</strong>{' '}
                          {user.banFromForum && user.banFromMarket
                            ? 'Both'
                            : user.banFromForum
                            ? 'Forum'
                            : 'Market'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Moderation Section */}
        {activeTab === 'CONTENT_MODERATION' && (
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h2 className={`text-2xl font-bold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.contentModeration}
            </h2>

            <div className="space-y-6">
              {/* Posts */}
              <div>
                <h3 className={`text-xl font-bold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Forum Posts
                </h3>
                {forumPosts.length === 0 ? (
                  <p className={state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    No posts to moderate
                  </p>
                ) : (
                  <div className="space-y-3">
                    {forumPosts.map(post => (
                      <div
                        key={post.id}
                        className={`p-4 rounded-lg border flex justify-between items-start ${
                          state.theme === 'dark'
                            ? 'bg-gray-700 border-gray-600'
                            : 'bg-gray-100 border-gray-300'
                        }`}
                      >
                        <div>
                          <p className={`font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {post.title}
                          </p>
                          <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            by {post.authorName}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="bg-red-600 text-white font-bold py-1 px-3 rounded hover:bg-red-700 transition"
                        >
                          {t.deletePost}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments */}
              <div>
                <h3 className={`text-xl font-bold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t.comments}
                </h3>
                {forumComments.length === 0 ? (
                  <p className={state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    No comments to moderate
                  </p>
                ) : (
                  <div className="space-y-3">
                    {forumComments.map(comment => (
                      <div
                        key={comment.id}
                        className={`p-4 rounded-lg border flex justify-between items-start ${
                          state.theme === 'dark'
                            ? 'bg-gray-700 border-gray-600'
                            : 'bg-gray-100 border-gray-300'
                        }`}
                      >
                        <div>
                          <p className={`font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {comment.authorName}
                          </p>
                          <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {comment.content}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="bg-red-600 text-white font-bold py-1 px-3 rounded hover:bg-red-700 transition"
                        >
                          {t.deleteComment}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumModeration;
