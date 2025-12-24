
export type PostType = 'image' | 'video' | 'text' | 'mixed';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  age?: number;
  mbti?: string;
  interests: string[];
  bio?: string;
  following: string[];
  followers: string[];
  isPrivate: boolean;
  showAge: boolean;
  showMBTI: boolean;
  showInterests: boolean;
}

export interface Post {
  id: string;
  type: PostType;
  content: string; // Text or Caption
  mediaUrl?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: number;
  likes: number;
  commentsCount: number;
  isAnonymous: boolean;
  tags: string[];
  aspectRatio: number; // For masonry layout simulation
}

export interface Group {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[];
  isPrivate: boolean;
  posts: GroupPost[];
}

export interface GroupPost {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: number;
  likes: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video';
  timestamp: number;
  isRead: boolean;
}

export enum Tab {
  FEED = 'feed',
  SEARCH = 'search',
  CREATE = 'create',
  COMMUNITY = 'community',
  PROFILE = 'profile'
}
