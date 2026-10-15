import { User, Post, Comment, Notification } from '../types';

const STORAGE_KEYS = {
  USERS: 'socialsphere_users',
  POSTS: 'socialsphere_posts',
  NOTIFICATIONS: 'socialsphere_notifications',
  CURRENT_USER: 'socialsphere_current_user',
};

// Helper functions
const generateId = (): string => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initialize with seed data
const initializeData = () => {
  const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
  if (users.length === 0) {
    const seedUsers: User[] = [
      {
        id: 'user1',
        username: 'alex_dev',
        displayName: 'Alex Developer',
        email: 'alex@example.com',
        password: 'alex@example.com',
        bio: 'Full-stack developer passionate about building great products. 🚀',
        avatar: '',
        coverImage: '',
        followers: ['user2', 'user3'],
        following: ['user2'],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'user2',
        username: 'sarah_designs',
        displayName: 'Sarah Chen',
        email: 'sarah@example.com',
        password: 'sarah@example.com',
        bio: 'UI/UX Designer | Coffee enthusiast ☕ | Creating beautiful interfaces',
        avatar: '',
        coverImage: '',
        followers: ['user1', 'user3'],
        following: ['user1', 'user3'],
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'user3',
        username: 'mike_travels',
        displayName: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'mike@example.com',
        bio: 'Traveler 🌍 | Photographer 📸 | Living my best life',
        avatar: '',
        coverImage: '',
        followers: ['user2'],
        following: ['user1'],
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    saveToStorage(STORAGE_KEYS.USERS, seedUsers);

    const seedPosts: Post[] = [
      {
        id: 'post1',
        authorId: 'user1',
        content: 'Just launched my new project! Built with React and TypeScript. The developer experience is incredible. What tech stack are you all using these days? 🚀💻',
        likes: ['user2', 'user3'],
        comments: [
          { id: 'c1', authorId: 'user2', content: 'Congrats! The UI looks amazing!', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
          { id: 'c2', authorId: 'user3', content: 'Great work Alex! 🎉', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
        ],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'post2',
        authorId: 'user2',
        content: 'Design tip of the day: White space is not empty space — it\'s a powerful design element. Use it wisely to guide your users\' attention. ✨',
        likes: ['user1'],
        comments: [
          { id: 'c3', authorId: 'user1', content: 'So true! Less is more.', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
        ],
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'post3',
        authorId: 'user3',
        content: 'Sunset in Bali was absolutely breathtaking today. Sometimes you need to disconnect to reconnect. 🌅🏝️',
        likes: ['user1', 'user2'],
        comments: [],
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'post4',
        authorId: 'user1',
        content: 'Hot take: TypeScript is not just JavaScript with types. It fundamentally changes how you think about your code architecture. The compiler is your best friend. 🧠',
        likes: ['user2'],
        comments: [
          { id: 'c4', authorId: 'user2', content: 'Couldn\'t agree more! It catches so many bugs before runtime.', createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString() },
        ],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'post5',
        authorId: 'user2',
        content: 'Just finished a complete design system for our startup. 200+ components, all accessible and responsive. Design systems are an investment that pays off exponentially. 🎨',
        likes: ['user1', 'user3'],
        comments: [],
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      },
    ];
    saveToStorage(STORAGE_KEYS.POSTS, seedPosts);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  }
};

initializeData();

// AUTH API
export const authAPI = {
  register: (username: string, displayName: string, email: string, password: string): User => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    if (users.find(u => u.email === email)) throw new Error('Email already registered');
    if (users.find(u => u.username === username)) throw new Error('Username already taken');
    
    const newUser: User = {
      id: generateId(),
      username,
      displayName,
      email,
      password,
      bio: '',
      avatar: '',
      coverImage: '',
      followers: [],
      following: [],
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, newUser.id);
    return { ...newUser, password: '' };
  },

  login: (email: string, password: string): User => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user.id);
    return { ...user, password: '' };
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userId) return null;
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.id === userId);
    return user ? { ...user, password: '' } : null;
  },
};

// USERS API
export const usersAPI = {
  getUserById: (id: string): User | null => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.id === id);
    return user ? { ...user, password: '' } : null;
  },

  getUserByUsername: (username: string): User | null => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.username === username);
    return user ? { ...user, password: '' } : null;
  },

  updateProfile: (userId: string, updates: Partial<Pick<User, 'displayName' | 'bio' | 'avatar' | 'coverImage'>>): User => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    users[idx] = { ...users[idx], ...updates };
    saveToStorage(STORAGE_KEYS.USERS, users);
    return { ...users[idx], password: '' };
  },

  followUser: (currentUserId: string, targetUserId: string): void => {
    if (currentUserId === targetUserId) throw new Error('Cannot follow yourself');
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const currentUser = users.find(u => u.id === currentUserId);
    const targetUser = users.find(u => u.id === targetUserId);
    if (!currentUser || !targetUser) throw new Error('User not found');
    if (currentUser.following.includes(targetUserId)) throw new Error('Already following');
    
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);
    saveToStorage(STORAGE_KEYS.USERS, users);

    // Create notification
    notificationsAPI.create({
      userId: targetUserId,
      type: 'follow',
      fromUserId: currentUserId,
      content: 'started following you',
    });
  },

  unfollowUser: (currentUserId: string, targetUserId: string): void => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const currentUser = users.find(u => u.id === currentUserId);
    const targetUser = users.find(u => u.id === targetUserId);
    if (!currentUser || !targetUser) throw new Error('User not found');
    
    currentUser.following = currentUser.following.filter(id => id !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
    saveToStorage(STORAGE_KEYS.USERS, users);
  },

  searchUsers: (query: string): User[] => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const q = query.toLowerCase();
    return users
      .filter(u => u.username.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q))
      .map(u => ({ ...u, password: '' }));
  },
};

// POSTS API
export const postsAPI = {
  createPost: (authorId: string, content: string, image?: string): Post => {
    const posts = getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
    const newPost: Post = {
      id: generateId(),
      authorId,
      content: content || '',
      image: image || undefined,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.unshift(newPost);
    
    // Save with storage limit handling
    try {
      saveToStorage(STORAGE_KEYS.POSTS, posts);
    } catch (e) {
      // If localStorage is full (likely due to base64 images), 
      // try removing the image from the post
      console.warn('Storage limit reached, storing post without embedded image data');
      newPost.image = undefined;
      posts[0] = newPost;
      saveToStorage(STORAGE_KEYS.POSTS, posts);
    }
    
    return newPost;
  },

  updatePost: (postId: string, userId: string, content: string): Post => {
    const posts = getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) throw new Error('Post not found');
    if (posts[idx].authorId !== userId) throw new Error('Not authorized');
    posts[idx] = { ...posts[idx], content, updatedAt: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.POSTS, posts);
    return posts[idx];
  },

  deletePost: (postId: string, userId: string): void => {
    const posts = getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
    const post = posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    if (post.authorId !== userId) throw new Error('Not authorized');
    const filtered = posts.filter(p => p.id !== postId);
    saveToStorage(STORAGE_KEYS.POSTS, filtered);
  },

  getFeed: (userId: string, page: number = 1, limit: number = 10): { posts: Post[]; hasMore: boolean } => {
    const posts = getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const currentUser = users.find(u => u.id === userId);
    if (!currentUser) return { posts: [], hasMore: false };
    
    const followingIds = [...currentUser.following, userId];
    const feedPosts = posts.filter(p => followingIds.includes(p.authorId));
    const start = (page - 1) * limit;
    const paginatedPosts = feedPosts.slice(start, start + limit);
    return { posts: paginatedPosts, hasMore: start + limit < feedPosts.length };
  },

  getExploreFeed: (page: number = 1, limit: number = 10): { posts: Post[]; hasMore: boolean } => {
    const posts = getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
    const start = (page - 1) * limit;
    const paginatedPosts = posts.slice(start, start + limit);
    return { posts: paginatedPosts, hasMore: start + limit < posts.length };
  },

  getUserPosts: (userId: string): Post[] => {
    const posts = getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
    return posts.filter(p => p.authorId === userId);
  },

  getPostById: (postId: string): Post | null => {
    const posts = getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
    return posts.find(p => p.id === postId) || null;
  },

  likePost: (postId: string, userId: string): Post => {
    const posts = getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) throw new Error('Post not found');
    if (posts[idx].likes.includes(userId)) throw new Error('Already liked');
    posts[idx].likes.push(userId);
    saveToStorage(STORAGE_KEYS.POSTS, posts);

    // Create notification
    if (posts[idx].authorId !== userId) {
      notificationsAPI.create({
        userId: posts[idx].authorId,
        type: 'like',
        fromUserId: userId,
        postId,
        content: 'liked your post',
      });
    }
    return posts[idx];
  },

  unlikePost: (postId: string, userId: string): Post => {
    const posts = getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) throw new Error('Post not found');
    posts[idx].likes = posts[idx].likes.filter(id => id !== userId);
    saveToStorage(STORAGE_KEYS.POSTS, posts);
    return posts[idx];
  },

  addComment: (postId: string, userId: string, content: string): Comment => {
    const posts = getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) throw new Error('Post not found');
    const newComment: Comment = {
      id: generateId(),
      authorId: userId,
      content,
      createdAt: new Date().toISOString(),
    };
    posts[idx].comments.push(newComment);
    saveToStorage(STORAGE_KEYS.POSTS, posts);

    // Create notification
    if (posts[idx].authorId !== userId) {
      notificationsAPI.create({
        userId: posts[idx].authorId,
        type: 'comment',
        fromUserId: userId,
        postId,
        content: `commented: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
      });
    }
    return newComment;
  },

  deleteComment: (postId: string, commentId: string, userId: string): void => {
    const posts = getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
    const postIdx = posts.findIndex(p => p.id === postId);
    if (postIdx === -1) throw new Error('Post not found');
    const comment = posts[postIdx].comments.find(c => c.id === commentId);
    if (!comment) throw new Error('Comment not found');
    if (comment.authorId !== userId) throw new Error('Not authorized');
    posts[postIdx].comments = posts[postIdx].comments.filter(c => c.id !== commentId);
    saveToStorage(STORAGE_KEYS.POSTS, posts);
  },

  searchPosts: (query: string): Post[] => {
    const posts = getFromStorage<Post[]>(STORAGE_KEYS.POSTS, []);
    const q = query.toLowerCase();
    return posts.filter(p => p.content.toLowerCase().includes(q));
  },
};

// NOTIFICATIONS API
export const notificationsAPI = {
  create: (data: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification => {
    const notifications = getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotification: Notification = {
      ...data,
      id: generateId(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(newNotification);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotification;
  },

  getUserNotifications: (userId: string): Notification[] => {
    const notifications = getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return notifications.filter(n => n.userId === userId);
  },

  markAsRead: (notificationId: string): void => {
    const notifications = getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const idx = notifications.findIndex(n => n.id === notificationId);
    if (idx !== -1) {
      notifications[idx].read = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  },

  markAllAsRead: (userId: string): void => {
    const notifications = getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    notifications.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  getUnreadCount: (userId: string): number => {
    const notifications = getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return notifications.filter(n => n.userId === userId && !n.read).length;
  },
};
