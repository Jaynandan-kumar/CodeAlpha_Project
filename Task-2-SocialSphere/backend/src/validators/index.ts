import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(300).optional(),
  avatar: z.string().optional(),
  coverImage: z.string().optional(),
});

export const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  image: z.string().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1).max(1000),
});
