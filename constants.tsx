
import { Post, User, Group } from './types';

export const COLORS = {
  primary: '#E6D5C5', // Dusty beige
  secondary: '#C2D1C2', // Sage green
  accent: '#E5B7B7', // Soft pink
  background: '#FAF9F6', // Off-white/Cream
  text: '#2D2D2D',
  muted: '#7A7A7A'
};

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Elena Vance',
    username: 'elena_v',
    avatar: 'https://picsum.photos/id/64/200/200',
    age: 26,
    mbti: 'INFJ',
    interests: ['Minimalism', 'Cottagecore', 'Poetry'],
    following: ['2', '3'],
    followers: ['2'],
    isPrivate: false,
    showAge: true,
    showMBTI: true,
    showInterests: true,
    bio: 'Finding beauty in the quiet moments.'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    username: 'schen_art',
    avatar: 'https://picsum.photos/id/65/200/200',
    age: 24,
    mbti: 'ENFP',
    interests: ['Digital Art', 'Coffee', 'Urban Planning'],
    following: ['1'],
    followers: ['1', '3'],
    isPrivate: false,
    showAge: false,
    showMBTI: true,
    showInterests: true,
    bio: 'Capturing city vibes.'
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    type: 'image',
    content: 'Morning light in the studio.',
    mediaUrl: 'https://picsum.photos/id/10/600/800',
    authorId: '1',
    authorName: 'Elena Vance',
    authorAvatar: 'https://picsum.photos/id/64/200/200',
    timestamp: Date.now() - 3600000,
    likes: 124,
    commentsCount: 12,
    isAnonymous: false,
    tags: ['Aesthetic', 'Studio'],
    aspectRatio: 0.75
  },
  {
    id: 'p2',
    type: 'text',
    content: 'Does anyone else feel like autumn is just a long exhale? 🍂',
    authorId: 'anon',
    authorName: 'Anonymous',
    authorAvatar: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
    timestamp: Date.now() - 7200000,
    likes: 45,
    commentsCount: 8,
    isAnonymous: true,
    tags: ['Thoughts', 'Autumn'],
    aspectRatio: 1.2
  },
  {
    id: 'p3',
    type: 'image',
    content: 'New setup details.',
    mediaUrl: 'https://picsum.photos/id/20/600/400',
    authorId: '2',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://picsum.photos/id/65/200/200',
    timestamp: Date.now() - 10800000,
    likes: 89,
    commentsCount: 5,
    isAnonymous: false,
    tags: ['Tech', 'DeskSetup'],
    aspectRatio: 1.5
  },
  {
    id: 'p4',
    type: 'image',
    content: 'Dreaming of the sea.',
    mediaUrl: 'https://picsum.photos/id/30/600/900',
    authorId: '1',
    authorName: 'Elena Vance',
    authorAvatar: 'https://picsum.photos/id/64/200/200',
    timestamp: Date.now() - 14400000,
    likes: 231,
    commentsCount: 18,
    isAnonymous: false,
    tags: ['Travel', 'Nature'],
    aspectRatio: 0.66
  },
  {
    id: 'p5',
    type: 'text',
    content: 'Recommendation: Try reading "The Alchemist" while listening to lofi rain. Pure magic.',
    authorId: '3',
    authorName: 'Maya Blue',
    authorAvatar: 'https://picsum.photos/id/70/200/200',
    timestamp: Date.now() - 18000000,
    likes: 67,
    commentsCount: 4,
    isAnonymous: false,
    tags: ['Books', 'Cozy'],
    aspectRatio: 1.0
  },
  {
    id: 'p6',
    type: 'image',
    content: 'Fresh blooms.',
    mediaUrl: 'https://picsum.photos/id/40/600/800',
    authorId: 'anon',
    authorName: 'Anonymous',
    authorAvatar: 'https://www.gravatar.com/avatar/0?d=mp&f=y',
    timestamp: Date.now() - 21600000,
    likes: 156,
    commentsCount: 9,
    isAnonymous: true,
    tags: ['Flowers', 'Spring'],
    aspectRatio: 0.75
  }
];

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Quiet Readers',
    description: 'A space for introverted book lovers to share quotes and current reads.',
    creatorId: '1',
    members: ['1', '2', '3'],
    isPrivate: false,
    posts: [
      {
        id: 'gp1',
        authorId: '2',
        authorName: 'Sarah Chen',
        content: 'Finished my 10th book of the year! Any recommendations?',
        timestamp: Date.now() - 3600000,
        likes: 12
      }
    ]
  },
  {
    id: 'g2',
    name: 'Artists Collective',
    description: 'Sharing works in progress and honest critiques.',
    creatorId: '2',
    members: ['1', '2'],
    isPrivate: true,
    posts: []
  }
];
