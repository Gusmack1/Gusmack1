"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Comment {
  id: string;
  author: string;
  content: string;
  rating?: number;
  createdAt: string;
  reviewSlug: string;
}

interface CommentsState {
  comments: Record<string, Comment[]>;
  isLoading: boolean;
  addComment: (reviewSlug: string, comment: Omit<Comment, 'id' | 'createdAt' | 'reviewSlug'>) => Promise<void>;
  getComments: (reviewSlug: string) => Comment[];
  clearComments: (reviewSlug: string) => void;
}

export const useComments = create<CommentsState>()(
  persist(
    (set, get) => ({
      comments: {},
      isLoading: false,

      addComment: async (reviewSlug: string, commentData) => {
        set({ isLoading: true });
        
        try {
          // In a real app, you'd send this to your API
          const newComment: Comment = {
            id: Date.now().toString(),
            ...commentData,
            createdAt: new Date().toISOString(),
            reviewSlug,
          };

          set((state) => ({
            comments: {
              ...state.comments,
              [reviewSlug]: [...(state.comments[reviewSlug] || []), newComment],
            },
          }));

          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error('Error adding comment:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      getComments: (reviewSlug: string) => {
        const state = get();
        return state.comments[reviewSlug] || [];
      },

      clearComments: (reviewSlug: string) => {
        set((state) => ({
          comments: {
            ...state.comments,
            [reviewSlug]: [],
          },
        }));
      },
    }),
    {
      name: 'comments-storage',
      partialize: (state) => ({ comments: state.comments }),
    }
  )
);

// Hook for getting comments for a specific review
export const useCommentsForReview = (reviewSlug: string) => {
  const { getComments, addComment, isLoading } = useComments();
  
  return {
    comments: getComments(reviewSlug),
    addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'reviewSlug'>) => 
      addComment(reviewSlug, comment),
    isLoading,
  };
};


