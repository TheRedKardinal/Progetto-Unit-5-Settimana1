import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Post, PostCreateInput, PostUpdateInput } from './types';

export const listPosts = () => apiGet<Post[]>('/api/posts');

export const getPost = (id: string) => apiGet<Post>(`/api/posts/${id}`);

export const createPost = (input: PostCreateInput) => apiPost<Post>('/api/posts', input);

export const updatePost = (id: string, input: PostUpdateInput) =>
  apiPatch<Post>(`/api/posts/${id}`, input);

export const deletePost = (id: string) => apiDelete(`/api/posts/${id}`);
