"use client";

import { useState } from 'react';

type Props = {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  id?: string;
};

export default function StarRating({ value = 0, max = 5, onChange, readOnly, id }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const current = hover ?? value;
  const controlId = id || `star-rating-${Math.random().toString(36).slice(2)}`;

  return (
    <div role="radiogroup" aria-labelledby={`${controlId}-label`} className="inline-flex items-center gap-1">
      <span id={`${controlId}-label`} className="sr-only">Rating</span>
      {stars.map((star) => {
        const checked = current >= star;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
            className={`h-6 w-6 text-[20px] leading-none ${checked ? 'text-[var(--color-rating)]' : 'text-neutral-300'}`}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(null)}
            onClick={() => !readOnly && onChange?.(star)}
            disabled={!!readOnly}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}


