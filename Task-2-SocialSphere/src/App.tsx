import React, { useState, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { postsAPI, usersAPI, notificationsAPI } from './services/mockApi';
import { Post, User, Notification, Comment } from './types';
import {
  Home, Search, Bell, User as UserIcon, LogOut, Plus, Heart, MessageCircle,
  Send, Edit3, Trash2, X, Menu, ChevronLeft, Settings, Image as ImageIcon, Bookmark,
  Users, Compass, TrendingUp, MoreHorizontal, Check, AlertCircle, Loader2, Upload
} from 'lucide-react';

// ============ CONSTANTS ============
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_IMAGE_EXTENSIONS = '.jpg,.jpeg,.png,.webp';

// ============ UTILITY ============
const timeAgo = (dateStr: string): string => {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const getAvatarColor = (name: string): string => {
  const colors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

/** Convert a File to a base64 data URL (for demo/localStorage mode) */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/** Validate an image file — returns error message or null */
const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are supported.';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `Image must be smaller than ${Math.round(MAX_IMAGE_SIZE / 1024 / 1024)}MB.`;
  }
  if (file.size === 0) {
    return 'The selected file is empty.';
  }
  return null;
};

const Avatar: React.FC<{ user?: User | null; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };
  const name = user?.displayName || user?.username || '?';
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  if (user?.avatar) {
    return <img src={user.avatar} alt={name} className={`${sizeClasses[size]} rounded-full object-cover ${className}`} />;
  }
  return (
    <div className={`${sizeClasses[size]} ${getAvatarColor(name)} rounded-full flex items-center justify-center text-white font-bold ${className}`}>
      {initials}
    </div>
  );
};

// ============ IMAGE PREVIEW ============
const ImagePreview: React.FC<{
  src: string;
  onRemove: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
}> = ({ src, onRemove, isUploading, uploadProgress }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-200 group">
      {imgError ? (
        <div className="flex flex-col items-center justify-center h-48 bg-gray-50 text-gray-400">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p className="text-sm">Failed to load image</p>
        </div>
      ) : (
        <img
          src={src}
          alt="Preview"
          className="w-full max-h-80 object-cover"
          onError={() => setImgError(true)}
        />
      )}
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Remove image"
      >
        <X className="w-4 h-4" />
      </button>
      {/* Upload overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
          {uploadProgress !== undefined && (
            <div className="w-32 bg-white/30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          <p className="text-white text-sm mt-2 font-medium">Uploading...</p>
        </div>
      )}
    </div>
  );
};

// ============ NAVBAR ============
const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  React.useEffect(() => {
    if (user) {
      setUnreadCount(notificationsAPI.getUnreadCount(user.id));
    }
  }, [user, location]);

  if (!user) return null;

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Bell, label: 'Notifications', path: '/notifications', badge: unreadCount },
    { icon: UserIcon, label: 'Profile', path: `/profile/${user.username}` },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 lg:w-72 bg-white border-r border-gray-200 flex-col z-40">
        <div className="p-6">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">SocialSphere</span>
          </Link>
        </div>
        <nav className="flex-1 px-3">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-violet-50 text-violet-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-base">{item.label}</span>
              {item.badge ? (
                <span className="ml-auto bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
              ) : null}
            </Link>
          ))}
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-base">Logout</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link to={`/profile/${user.username}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
            <Avatar user={user} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{user.displayName}</p>
              <p className="text-xs text-gray-500 truncate">@{user.username}</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center p-2 rounded-lg transition-colors ${
                location.pathname === item.path ? 'text-violet-600' : 'text-gray-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.badge ? (
                <span className="absolute -top-0.5 right-0 bg-violet-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{item.badge}</span>
              ) : null}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">SocialSphere</span>
          </Link>
          <Link to={`/profile/${user.username}`}>
            <Avatar user={user} size="sm" />
          </Link>
        </div>
      </header>
    </>
  );
};

// ============ CREATE POST ============
const CreatePost: React.FC<{ onPostCreated: () => void }> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const error = validateImageFile(file);
    if (error) {
      setImageError(error);
      setImagePreview(null);
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setImageError(null);
    setSubmitError(null);
    setImageFile(file);

    // Generate preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      setImageError('Failed to read image file.');
      setImageFile(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    setImageFile(null);
    setImageError(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!user) return;
    const hasContent = content.trim().length > 0;
    const hasImage = !!imagePreview;

    if (!hasContent && !hasImage) return;

    setSubmitError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      let imageUrl: string | undefined;

      if (imageFile && imagePreview) {
        // Simulate upload progress for demo mode
        setUploadProgress(20);
        await new Promise(r => setTimeout(r, 200));
        setUploadProgress(50);
        await new Promise(r => setTimeout(r, 200));
        setUploadProgress(80);

        // In demo mode, store the base64 data URL directly
        // In production, this would upload to the backend /api/upload endpoint
        imageUrl = imagePreview;
        setUploadProgress(100);
        await new Promise(r => setTimeout(r, 100));
      }

      postsAPI.createPost(user.id, hasContent ? content.trim() : '', imageUrl);
      
      // Reset form
      setContent('');
      setImagePreview(null);
      setImageFile(null);
      setIsExpanded(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onPostCreated();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle paste for images
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const error = validateImageFile(file);
          if (error) {
            setImageError(error);
            return;
          }
          setImageError(null);
          setImageFile(file);
          const reader = new FileReader();
          reader.onload = () => setImagePreview(reader.result as string);
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  }, []);

  if (!user) return null;

  const hasContent = content.trim().length > 0;
  const hasImage = !!imagePreview;
  const canSubmit = (hasContent || hasImage) && !isUploading;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 shadow-sm">
      <div className="flex gap-3">
        <Avatar user={user} size="md" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setSubmitError(null); }}
            onFocus={() => setIsExpanded(true)}
            onPaste={handlePaste}
            placeholder="What's happening?"
            className={`w-full resize-none border-none outline-none text-gray-800 placeholder-gray-400 bg-transparent ${
              isExpanded ? 'min-h-[100px]' : 'min-h-[40px]'
            } text-base`}
            maxLength={5000}
          />

          {/* Image Error */}
          {imageError && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{imageError}</span>
              <button onClick={() => setImageError(null)} className="ml-auto">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <ImagePreview
              src={imagePreview}
              onRemove={handleRemoveImage}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
            <div className="flex gap-1 items-center">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_IMAGE_EXTENSIONS}
                onChange={handleImageSelect}
                className="hidden"
                aria-label="Select image to upload"
              />
              <button
                onClick={handleImageButtonClick}
                disabled={isUploading}
                className="p-2 rounded-full hover:bg-violet-50 text-violet-600 transition-colors disabled:opacity-50"
                title="Add image (JPEG, PNG, WebP — max 5MB)"
                aria-label="Add image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              {imageFile && (
                <span className="text-xs text-gray-400 ml-1 truncate max-w-[120px]">
                  {imageFile.name} ({(imageFile.size / 1024).toFixed(0)}KB)
                </span>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-200 transition-all duration-200 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ POST CARD ============
const PostCard: React.FC<{ post: Post; onUpdate: () => void }> = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);

  const author = usersAPI.getUserById(post.authorId);
  if (!author || !user) return null;

  const isLiked = post.likes.includes(user.id);
  const isOwner = post.authorId === user.id;

  const handleLike = () => {
    try {
      if (isLiked) {
        postsAPI.unlikePost(post.id, user.id);
      } else {
        postsAPI.likePost(post.id, user.id);
      }
      onUpdate();
    } catch (e) { /* ignore */ }
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    postsAPI.addComment(post.id, user.id, commentText.trim());
    setCommentText('');
    onUpdate();
  };

  const handleDeleteComment = (commentId: string) => {
    postsAPI.deleteComment(post.id, commentId, user.id);
    onUpdate();
  };

  const handleEdit = () => {
    if (!editContent.trim()) return;
    postsAPI.updatePost(post.id, user.id, editContent.trim());
    setIsEditing(false);
    onUpdate();
  };

  const handleDelete = () => {
    postsAPI.deletePost(post.id, user.id);
    onUpdate();
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-3">
        <button onClick={() => navigate(`/profile/${author.username}`)}>
          <Avatar user={author} size="md" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <button onClick={() => navigate(`/profile/${author.username}`)} className="font-semibold text-gray-900 hover:underline truncate text-sm">
                {author.displayName}
              </button>
              <span className="text-gray-400 text-sm truncate">@{author.username}</span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-400 text-sm whitespace-nowrap">{timeAgo(post.createdAt)}</span>
            </div>
            {isOwner && (
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded-full hover:bg-gray-100">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 min-w-[140px]">
                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full">
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => { handleDelete(); setShowMenu(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleEdit} className="px-3 py-1 bg-violet-600 text-white rounded-full text-sm font-medium">Save</button>
                <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Cancel</button>
              </div>
            </div>
          ) : (
            post.content && (
              <p className="mt-1 text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
            )
          )}

          {/* Post Image */}
          {post.image && !imgError && (
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
              <img
                src={post.image}
                alt={post.content ? 'Post attachment' : 'Image post'}
                className="w-full max-h-[500px] object-cover"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            </div>
          )}
          {post.image && imgError && (
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center h-48">
              <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-gray-400 text-sm">Image could not be loaded</p>
            </div>
          )}

          <div className="flex items-center gap-6 mt-3 pt-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 group transition-colors ${isLiked ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'}`}
            >
              <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-rose-500 scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-sm font-medium">{post.likes.length || ''}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-violet-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments.length || ''}</span>
            </button>
          </div>

          {showComments && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              {post.comments.map(comment => {
                const commentAuthor = usersAPI.getUserById(comment.authorId);
                return (
                  <div key={comment.id} className="flex gap-2 mb-3">
                    <button onClick={() => commentAuthor && navigate(`/profile/${commentAuthor.username}`)}>
                      <Avatar user={commentAuthor} size="sm" />
                    </button>
                    <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-gray-900">{commentAuthor?.displayName}</span>
                        {comment.authorId === user.id && (
                          <button onClick={() => handleDeleteComment(comment.id)} className="text-gray-400 hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">{comment.content}</p>
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-2 mt-2">
                <Avatar user={user} size="sm" />
                <div className="flex-1 flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200 border border-gray-200"
                  />
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="p-2 text-violet-600 disabled:text-gray-300 hover:bg-violet-50 rounded-full transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

// ============ PAGES ============

// Landing Page
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <header className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">SocialSphere</span>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="px-5 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 rounded-full transition-colors">
              Log in
            </Link>
            <Link to="/register" className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-violet-200 transition-all">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Connect. Share.{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Inspire.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
            Join SocialSphere — the social platform where your ideas find their audience. Share moments, discover stories, and build meaningful connections.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 text-base font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full hover:shadow-xl hover:shadow-violet-200 transition-all duration-300 transform hover:-translate-y-0.5">
              Get Started Free
            </Link>
            <Link to="/login" className="px-8 py-4 text-base font-semibold border-2 border-gray-200 text-gray-700 rounded-full hover:border-violet-300 hover:bg-violet-50 transition-all duration-300">
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: 'Build Your Network', desc: 'Follow creators, connect with friends, and grow your community organically.' },
            { icon: TrendingUp, title: 'Discover Content', desc: 'Explore trending posts and find content that resonates with your interests.' },
            { icon: Bell, title: 'Stay Updated', desc: 'Real-time notifications for likes, comments, and new followers.' },
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>© 2024 SocialSphere. Built with React, TypeScript & Tailwind CSS.</p>
          <p className="mt-1">CodeAlpha Full Stack Development Internship — Task 2</p>
        </div>
      </footer>
    </div>
  );
};

// Login Page
const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">SocialSphere</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-200 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-600 font-semibold hover:underline">Sign up</Link>
          </p>
          <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
            <p className="font-medium text-gray-700 mb-1">Demo accounts (email = password):</p>
            <p>alex@example.com</p>
            <p>sarah@example.com</p>
            <p>mike@example.com</p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Register Page
const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (username.length < 3) { setError('Username must be at least 3 characters'); return; }
    setIsLoading(true);
    try {
      await register(username, displayName || username, email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">SocialSphere</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Join the community today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                placeholder="your_username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                placeholder="Min 6 characters"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-200 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

// Home Page
const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadPosts = React.useCallback(() => {
    if (!user) return;
    setIsLoading(true);
    const result = postsAPI.getFeed(user.id, 1, 20);
    setPosts(result.posts);
    setHasMore(result.hasMore);
    setIsLoading(false);
  }, [user]);

  React.useEffect(() => { loadPosts(); }, [loadPosts]);

  const loadMore = () => {
    if (!user || !hasMore) return;
    const nextPage = page + 1;
    const result = postsAPI.getFeed(user.id, nextPage, 10);
    setPosts(prev => [...prev, ...result.posts]);
    setPage(nextPage);
    setHasMore(result.hasMore);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="sticky top-0 md:top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 mb-4 rounded-b-2xl">
        <h1 className="text-xl font-bold text-gray-900">Home</h1>
      </div>
      <CreatePost onPostCreated={loadPosts} />
      {isLoading && posts.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Your feed is empty</p>
          <p className="text-gray-400 text-sm mt-1">Follow some users to see their posts here</p>
          <Link to="/explore" className="mt-4 inline-block px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium hover:bg-violet-200 transition-colors">
            Explore Users
          </Link>
        </div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard key={post.id} post={post} onUpdate={loadPosts} />
          ))}
          {hasMore && (
            <button onClick={loadMore} className="w-full py-3 text-violet-600 font-medium text-sm hover:bg-violet-50 rounded-xl transition-colors">
              Load more posts
            </button>
          )}
        </>
      )}
    </div>
  );
};

// Explore Page
const ExplorePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = React.useCallback(() => {
    const result = postsAPI.getExploreFeed(1, 20);
    setPosts(result.posts);
    setHasMore(result.hasMore);
  }, []);

  React.useEffect(() => { loadPosts(); }, [loadPosts]);

  const loadMore = () => {
    const nextPage = page + 1;
    const result = postsAPI.getExploreFeed(nextPage, 10);
    setPosts(prev => [...prev, ...result.posts]);
    setPage(nextPage);
    setHasMore(result.hasMore);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="sticky top-0 md:top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 mb-4 rounded-b-2xl">
        <h1 className="text-xl font-bold text-gray-900">Explore</h1>
      </div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} onUpdate={loadPosts} />
      ))}
      {hasMore && (
        <button onClick={loadMore} className="w-full py-3 text-violet-600 font-medium text-sm hover:bg-violet-50 rounded-xl transition-colors">
          Load more
        </button>
      )}
    </div>
  );
};

// Profile Page
const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ displayName: '', bio: '' });
  const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');

  const loadProfile = React.useCallback(() => {
    if (!username) return;
    const u = usersAPI.getUserByUsername(username);
    setProfileUser(u);
    if (u) {
      setEditData({ displayName: u.displayName, bio: u.bio });
      const userPosts = postsAPI.getUserPosts(u.id);
      setPosts(userPosts);
    }
  }, [username]);

  React.useEffect(() => { loadProfile(); }, [loadProfile]);

  if (!profileUser) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <p className="text-gray-500">User not found</p>
        <Link to="/home" className="mt-4 inline-block text-violet-600 font-medium">Go Home</Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;
  const isFollowing = currentUser?.following.includes(profileUser.id) || false;

  const handleFollow = () => {
    if (!currentUser) return;
    try {
      if (isFollowing) {
        usersAPI.unfollowUser(currentUser.id, profileUser.id);
      } else {
        usersAPI.followUser(currentUser.id, profileUser.id);
      }
      loadProfile();
    } catch (e) { /* ignore */ }
  };

  const handleSaveProfile = () => {
    usersAPI.updateProfile(profileUser.id, editData);
    setIsEditing(false);
    loadProfile();
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Cover & Avatar */}
      <div className="relative">
        <div className="h-32 md:h-48 bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-500 rounded-b-2xl">
          {profileUser.coverImage && <img src={profileUser.coverImage} alt="" className="w-full h-full object-cover rounded-b-2xl" />}
        </div>
        <div className="absolute -bottom-10 left-4">
          <div className="border-4 border-white rounded-full">
            <Avatar user={profileUser} size="xl" />
          </div>
        </div>
      </div>

      <div className="pt-14 px-4">
        {/* Actions */}
        <div className="flex justify-end gap-2 mb-4">
          {isOwnProfile ? (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                isFollowing
                  ? 'border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-200'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Display Name</label>
                <input
                  value={editData.displayName}
                  onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveProfile} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium">Save</button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* User Info */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">{profileUser.displayName}</h1>
          <p className="text-gray-500 text-sm">@{profileUser.username}</p>
          {profileUser.bio && <p className="mt-2 text-gray-700 text-sm">{profileUser.bio}</p>}
          <div className="flex gap-4 mt-3">
            <span className="text-sm"><span className="font-bold text-gray-900">{profileUser.following.length}</span> <span className="text-gray-500">Following</span></span>
            <span className="text-sm"><span className="font-bold text-gray-900">{profileUser.followers.length}</span> <span className="text-gray-500">Followers</span></span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'posts' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'likes' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Likes
          </button>
        </div>

        {/* Posts */}
        {activeTab === 'posts' ? (
          posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No posts yet</p>
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} onUpdate={loadProfile} />)
          )
        ) : (
          <div className="text-center py-12">
            <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Liked posts will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Notifications Page
const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = React.useCallback(() => {
    if (!user) return;
    const notifs = notificationsAPI.getUserNotifications(user.id);
    setNotifications(notifs);
  }, [user]);

  React.useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const handleMarkAllRead = () => {
    if (!user) return;
    notificationsAPI.markAllAsRead(user.id);
    loadNotifications();
  };

  const handleMarkRead = (id: string) => {
    notificationsAPI.markAsRead(id);
    loadNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-rose-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow': return <Users className="w-4 h-4 text-violet-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="sticky top-0 md:top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 mb-4 rounded-b-2xl flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button onClick={handleMarkAllRead} className="text-sm text-violet-600 font-medium hover:underline">
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No notifications yet</p>
          <p className="text-gray-400 text-sm mt-1">When someone interacts with you, you'll see it here</p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map(notif => {
            const fromUser = usersAPI.getUserById(notif.fromUserId);
            return (
              <div
                key={notif.id}
                onClick={() => !notif.read && handleMarkRead(notif.id)}
                className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
                  notif.read ? 'bg-white' : 'bg-violet-50'
                } hover:bg-gray-50`}
              >
                <div className="relative">
                  <Avatar user={fromUser} size="md" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {getNotificationIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{fromUser?.displayName}</span>{' '}
                    <span className="text-gray-600">{notif.content}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 bg-violet-600 rounded-full mt-2 flex-shrink-0"></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Search Page
const SearchPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [userResults, setUserResults] = useState<User[]>([]);
  const [postResults, setPostResults] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length < 1) {
      setUserResults([]);
      setPostResults([]);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    setUserResults(usersAPI.searchUsers(q));
    setPostResults(postsAPI.searchPosts(q));
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="sticky top-0 md:top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 mb-4 rounded-b-2xl">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Search</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search users and posts..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-200 focus:bg-white border border-transparent focus:border-violet-200 transition-all"
          />
        </div>
      </div>

      {hasSearched && (
        <>
          <div className="flex border-b border-gray-200 mb-4 px-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors ${
                activeTab === 'users' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500'
              }`}
            >
              Users ({userResults.length})
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors ${
                activeTab === 'posts' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500'
              }`}
            >
              Posts ({postResults.length})
            </button>
          </div>

          {activeTab === 'users' ? (
            userResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No users found</p>
              </div>
            ) : (
              <div className="space-y-2 px-4">
                {userResults.map(u => (
                  <button
                    key={u.id}
                    onClick={() => navigate(`/profile/${u.username}`)}
                    className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <Avatar user={u} size="md" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{u.displayName}</p>
                      <p className="text-xs text-gray-500">@{u.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : (
            postResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No posts found</p>
              </div>
            ) : (
              postResults.map(post => <PostCard key={post.id} post={post} onUpdate={() => handleSearch(query)} />)
            )
          )}
        </>
      )}

      {!hasSearched && (
        <div className="text-center py-16 px-4">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Search SocialSphere</p>
          <p className="text-gray-400 text-sm mt-1">Find users and posts by keyword</p>
        </div>
      )}
    </div>
  );
};

// ============ LAYOUT ============
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="md:ml-64 lg:ml-72 pt-14 md:pt-0 pb-20 md:pb-8 px-4">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </main>
    </div>
  );
};

// ============ APP ============
const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading SocialSphere...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterPage />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
