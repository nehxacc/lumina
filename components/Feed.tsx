
import React, { useState, useEffect, useMemo } from 'react';
import { Post } from '../types';
import PostCard from './PostCard';

interface FeedProps {
  posts: Post[];
  onAuthorClick?: (authorId: string) => void;
  onQuickWhisper?: (authorId: string) => void;
  onPostClick?: (post: Post) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, onAuthorClick, onQuickWhisper, onPostClick }) => {
  const [columnCount, setColumnCount] = useState(2);

  // Determine column count based on window width
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1280) setColumnCount(4);
      else if (window.innerWidth >= 768) setColumnCount(3);
      else setColumnCount(2);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Distribute posts into columns using the shortest-column algorithm
  const columns = useMemo(() => {
    const colArrays: Post[][] = Array.from({ length: columnCount }, () => []);
    const colHeights = Array(columnCount).fill(0);

    posts.forEach((post) => {
      // Find the index of the column with the minimum height
      const shortestIndex = colHeights.indexOf(Math.min(...colHeights));
      
      colArrays[shortestIndex].push(post);
      
      // Calculate approximate height contribution
      const estimatedHeight = post.type === 'image' 
        ? (1 / (post.aspectRatio || 1)) + 0.4 
        : 1.2; // Text posts are roughly square-ish or taller
      
      colHeights[shortestIndex] += estimatedHeight;
    });

    return colArrays;
  }, [posts, columnCount]);

  return (
    <div 
      className="grid gap-4 sm:gap-6 pb-20 max-w-[1400px] mx-auto animate-in fade-in duration-1000"
      style={{ 
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` 
      }}
    >
      {columns.map((column, colIdx) => (
        <div 
          key={colIdx} 
          className="flex flex-col gap-4 sm:gap-6 animate-in slide-in-from-bottom-4"
          style={{ animationDelay: `${colIdx * 100}ms` }}
        >
          {column.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onAuthorClick={onAuthorClick} 
              onQuickWhisper={onQuickWhisper}
              onClick={() => onPostClick?.(post)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Feed;
