"use client";

import { useState, useEffect } from 'react';
import { useCommentsForReview } from '@/src/lib/commentsStore';

interface CommentSectionProps {
  reviewSlug: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  rating?: number;
  createdAt: string;
  replies?: Comment[];
}

export default function CommentSection({ reviewSlug }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { comments, addComment, isLoading } = useCommentsForReview(reviewSlug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment({
        author: author.trim(),
        content: newComment.trim(),
        rating: rating > 0 ? rating : undefined,
      });
      
      setNewComment('');
      setRating(0);
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full p-4 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-600 hover:border-[var(--scot-accent)] hover:text-[var(--scot-accent)] transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Add your comment and rating</span>
          </div>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-neutral-200 rounded-lg">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-neutral-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--scot-accent)]"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-colors"
                  >
                    <svg
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                {rating > 0 && (
                  <span className="text-sm text-neutral-600 ml-2">
                    {rating}/5 stars
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 mb-1">
              Your Comment *
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--scot-accent)]"
              placeholder="Share your experience at this restaurant..."
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim() || !author.trim()}
              className="px-6 py-2 bg-[var(--scot-accent)] text-white rounded-md hover:bg-[var(--scot-accent)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--scot-accent)] mx-auto"></div>
            <p className="mt-2 text-neutral-600">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border border-neutral-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-neutral-900">{comment.author}</h4>
                  <p className="text-sm text-neutral-500">{formatDate(comment.createdAt)}</p>
                </div>
                {comment.rating && (
                  <div className="flex items-center gap-2">
                    {renderStars(comment.rating)}
                    <span className="text-sm text-neutral-600">{comment.rating}/5</span>
                  </div>
                )}
              </div>
              <p className="text-neutral-700 leading-relaxed">{comment.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-neutral-600">
            <svg className="w-12 h-12 mx-auto mb-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No comments yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>

      {/* Community Guidelines */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <h4 className="font-semibold text-neutral-900 mb-2">Community Guidelines</h4>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>• Be respectful and constructive in your comments</li>
          <li>• Share your personal experience and honest opinions</li>
          <li>• Avoid offensive language or personal attacks</li>
          <li>• Comments are moderated and may take time to appear</li>
        </ul>
      </div>
    </div>
  );
}
