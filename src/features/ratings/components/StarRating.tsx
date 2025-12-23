import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  maxStars?: number;
};

export const StarRating = ({
  value,
  onChange,
  disabled = false,
  maxStars = 5,
}: StarRatingProps) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => onChange(starValue)}
            className={cn(
              "transition-colors",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:opacity-75"
            )}
            aria-label={`Rate ${starValue} stars`}
            aria-pressed={value === starValue}
          >
            <Star
              size={40}
              className={cn(
                "transition-colors",
                starValue <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
