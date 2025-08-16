"use client";

import { useState } from 'react';
import type { ReviewDoc } from '@/src/lib/reviews';

interface ReviewQuickFactsProps {
  review: ReviewDoc;
}

export default function ReviewQuickFacts({ review }: ReviewQuickFactsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const facts = [
    { label: 'Location', value: review.location },
    { label: 'Visit Date', value: new Date(review.visitDate).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })},
  ];

  const additionalFacts = [
    { label: 'Photos', value: review.meta.images.length.toString() },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-6 text-sm">
        {facts.map((fact, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="font-medium text-neutral-700">{fact.label}:</span>
            <span className="text-neutral-900">{fact.value}</span>
          </div>
        ))}
        
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-[var(--scot-accent)] hover:underline text-sm"
          >
            Show more details
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {additionalFacts.map((fact, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="font-medium text-neutral-700">{fact.label}:</span>
                <span className="text-neutral-900">{fact.value}</span>
              </div>
            ))}
            <button
              onClick={() => setIsExpanded(false)}
              className="text-[var(--scot-accent)] hover:underline text-sm"
            >
              Show less
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
