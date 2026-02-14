import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ForumPost, ForumComment, AppState, Reaction, ReactionType } from '../types';
import { UI_STRINGS } from '../constants';
import FileUpload, { UploadedFile } from '../components/FileUpload';
import MediaPreview from '../components/MediaPreview';
import ReactionSystem from '../components/ReactionSystem';
import ReactionCounter from '../components/ReactionCounter';

interface ForumProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  forumPosts: ForumPost[];
  setForumPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>;
  forumComments: ForumComment[];
  setForumComments: React.Dispatch<React.SetStateAction<ForumComment[]>>;
  reactions?: Reaction[];
  setReactions?: React.Dispatch<React.SetStateAction<Reaction[]>>;
}

const Forum: React.FC<ForumProps> = ({
  state,
  setState,
  forumPosts,
  setForumPosts,
  forumComments,
  setForumComments,
  reactions = [],
  setReactions = () => {}
}) => {
  const navigate = useNavigate();
  const t = UI_STRINGS[state.language];
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postFiles, setPostFiles] = useState<UploadedFile[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [allReactions, setAllReactions] = useState<Reaction[]>(reactions);

  // Check if user is banned from forum
  const isBannedFromForum = state.currentUser?.banFromForum || false;

  const handleCreatePost = () => {
    if (!state.currentUser) {
      alert(t.login);
      return;
    }

    if (isBannedFromForum) {
      alert('You are banned from the forum');
      return;
    }

    if (!postTitle.trim() || (!postContent.trim() && postFiles.length === 0)) {
      alert('Please fill in at least title and content or add files');
      return;
    }

    const contentArray = [];
    if (postContent.trim()) {
      contentArray.push({ type: 'TEXT' as const, text: postContent });
    }
    postFiles.forEach(file => {
      contentArray.push({
        type: file.type as any,
        url: file.url,
        fileName: file.name
      });
    });

    const newPost: ForumPost = {
      id: `post${Date.now()}`,
      authorId: state.currentUser.id,
      authorName: state.currentUser.name,
      title: postTitle,
      content: contentArray,
      createdAt: new Date().toISOString(),
      likes: 0,
      commentsCount: 0,
      isEdited: false
    };

    setForumPosts([newPost, ...forumPosts]);
    setPostTitle('');
    setPostContent('');
    setPostFiles([]);
  };

  const handleDeletePost = (postId: string) => {
    const post = forumPosts.find(p => p.id === postId);
    if (post && (state.currentUser?.id === post.authorId || state.currentUser?.adminPermission === 'SUPER_ADMIN')) {
      setForumPosts(forumPosts.filter(p => p.id !== postId));
      setForumComments(forumComments.filter(c => c.postId !== postId));
      setAllReactions(allReactions.filter(r => r.postId !== postId));
    }
  };

  const handleAddComment = (postId: string) => {
    if (!state.currentUser) {
      alert(t.login);
      return;
    }

    if (isBannedFromForum) {
      alert('You are banned from the forum');
      return;
    }

    if (!commentText.trim()) {
      alert('Please enter a comment');
      return;
    }

    const contentArray = [];
    if (commentText.trim()) {
      contentArray.push(commentText);
    }

    const newComment: ForumComment = {
      id: `comment${Date.now()}`,
      postId,
      authorId: state.currentUser.id,
      authorName: state.currentUser.name,
      content: commentText,
      createdAt: new Date().toISOString(),
      reactions: [],
      isEdited: false
    };

    setForumComments([...forumComments, newComment]);
    setCommentText('');
    setEditingCommentId(null);
  };

  const handleEditComment = (commentId: string, newText: string) => {
    if (!newText.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    setForumComments(forumComments.map(c => 
      c.id === commentId 
        ? { ...c, content: newText, isEdited: true }
        : c
    ));
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    const comment = forumComments.find(c => c.id === commentId);
    if (comment && (state.currentUser?.id === comment.authorId || state.currentUser?.adminPermission === 'SUPER_ADMIN')) {
      setForumComments(forumComments.filter(c => c.id !== commentId));
    }
  };

  const handleAddReaction = (postId: string, reactionType: ReactionType) => {
    if (!state.currentUser) {
      alert(t.login);
      return;
    }

    const existingReaction = allReactions.find(
      r => r.postId === postId && r.userId === state.currentUser?.id
    );

    if (existingReaction) {
      if (existingReaction.type === reactionType) {
        setAllReactions(allReactions.filter(r => r.id !== existingReaction.id));
      } else {
        setAllReactions(
          allReactions.map(r =>
            r.id === existingReaction.id
              ? { ...r, type: reactionType, createdAt: new Date().toISOString() }
              : r
          )
        );
      }
    } else {
      const newReaction: Reaction = {
        id: `react${Date.now()}`,
        postId,
        userId: state.currentUser.id,
        type: reactionType,
        createdAt: new Date().toISOString()
      };
      setAllReactions([...allReactions, newReaction]);
    }
  };

  const handleRemoveReaction = (postId: string, userId: string) => {
    setAllReactions(allReactions.filter(r => !(r.postId === postId && r.userId === userId)));
  };

  const getPostComments = (postId: string) => {
    return forumComments.filter(c => c.postId === postId && !c.parentCommentId);
  };

  const renderContent = (content: any) => {
    if (typeof content === 'string') {
      return <p className={state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{content}</p>;
    }

    if (content.type === 'TEXT') {
      return <p className={state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{content.text}</p>;
    }

    if (content.type === 'image') {
      return <img src={content.url} alt={content.fileName} className="max-w-full h-auto rounded-lg mt-2" />;
    }

    if (content.type === 'video') {
      return (
        <video
          src={content.url}
          controls
          className="max-w-full h-auto rounded-lg mt-2"
        />
      );
    }

    if (content.type === 'youtube') {
      return (
        <iframe
          width="100%"
          height="315"
          src={content.url}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg mt-2"
        />
      );
    }

    if (content.type === 'pdf' || content.type === 'file') {
      return (
        <a
          href={content.url}
          download={content.fileName}
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          📥 {content.fileName}
        </a>
      );
    }

    return null;
  };

  return (
    <div className={`min-h-screen ${state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold mb-8 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t.forum}
        </h1>

        {/* Create Post Section */}
        {state.currentUser && !isBannedFromForum && (
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
            <h2 className={`text-xl font-bold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.createPost}
            </h2>
            <input
              type="text"
              placeholder={t.marketplace}
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className={`w-full p-3 mb-4 rounded-lg border ${state.theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
            />
            <textarea
              placeholder={t.writeYourThoughts}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={4}
              className={`w-full p-3 mb-4 rounded-lg border ${state.theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
            />

            {/* File Upload */}
            <div className="mb-4">
              <FileUpload
                onFileUpload={(file) => setPostFiles([...postFiles, file])}
                language={state.language}
                theme={state.theme}
              />
            </div>

            {/* Media Preview */}
            <MediaPreview
              files={postFiles}
              onRemoveFile={(fileId) => setPostFiles(postFiles.filter(f => f.id !== fileId))}
              theme={state.theme}
            />

            <button
              onClick={handleCreatePost}
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition mt-4"
            >
              {t.post}
            </button>
          </div>
        )}

        {isBannedFromForum && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            You are currently banned from the forum.
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {forumPosts.map(post => (
            <div key={post.id} className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-xl font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {post.title}
                  </h3>
                  <button
                    onClick={() => navigate(`/publisher/${post.authorId}`)}
                    className={`text-sm ${state.theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} hover:underline cursor-pointer transition`}
                  >
                    {t.welcome} {post.authorName}
                  </button>
                </div>
                {(state.currentUser?.id === post.authorId || state.currentUser?.adminPermission === 'SUPER_ADMIN') && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    {t.deletePost}
                  </button>
                )}
              </div>

              {/* Post Content */}
              <div className="mb-4 space-y-3">
                {post.content.map((item, idx) => (
                  <div key={idx}>
                    {renderContent(item)}
                  </div>
                ))}
              </div>

              {/* Reactions Counter */}
              <div className="mb-4 border-t pt-4">
                <ReactionCounter
                  postId={post.id}
                  currentUserId={state.currentUser?.id}
                  theme={state.theme}
                  language={state.language}
                  onReactionChange={() => {
                    // Reaction changed, component will refresh automatically
                  }}
                />
              </div>

              {/* Reactions System */}
              <div className="mb-4">
                <ReactionSystem
                  postId={post.id}
                  reactions={allReactions}
                  onAddReaction={handleAddReaction}
                  onRemoveReaction={handleRemoveReaction}
                  currentUserId={state.currentUser?.id}
                  theme={state.theme}
                  language={state.language}
                />
              </div>

              {/* Comments Section */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
                  className="text-blue-600 hover:text-blue-800 font-bold mb-4"
                >
                  {t.comments} ({getPostComments(post.id).length})
                </button>

                {selectedPostId === post.id && (
                  <div className="space-y-4">
                    {getPostComments(post.id).map(comment => (
                      <div key={comment.id} className={`${state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className={`font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {comment.authorName}
                            </p>
                            {comment.isEdited && (
                              <p className={`text-xs ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                (edited)
                              </p>
                            )}
                          </div>
                          {state.currentUser?.id === comment.authorId && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingCommentText(comment.content);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-bold"
                              >
                                {t.edit}
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-bold"
                              >
                                {t.delete}
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {editingCommentId === comment.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              rows={2}
                              className={`w-full p-2 rounded border ${state.theme === 'dark' ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'}`}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditComment(comment.id, editingCommentText)}
                                className="px-3 py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 text-sm"
                              >
                                {t.save || 'Save'}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditingCommentText('');
                                }}
                                className={`px-3 py-1 rounded font-bold text-sm ${state.theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'}`}
                              >
                                {t.cancel || 'Cancel'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className={`${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {comment.content}
                          </p>
                        )}
                      </div>
                    ))}

                    {state.currentUser && !isBannedFromForum && (
                      <div className="mt-4">
                        <textarea
                          placeholder={t.comment}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={2}
                          className={`w-full p-3 rounded-lg border ${state.theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="mt-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        >
                          {t.comment}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;
