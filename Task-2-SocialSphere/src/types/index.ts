export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  coverImage: string;
  followers: string[];
  following: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow';
  fromUserId: string;
  postId?: string;
  content?: string;
  read: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
