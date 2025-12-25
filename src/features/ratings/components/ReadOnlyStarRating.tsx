import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type ReadOnlyStarRatingProps = {
  value: number;
  maxStars?: number;
  size?: number;
};

export const ReadOnlyStarRating = ({
  value,
  maxStars = 5,
  size = 16,
}: ReadOnlyStarRatingProps) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              "transition-colors",
              starValue <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
            aria-label={`${value} out of ${maxStars} stars`}
          />
        );
      })}
    </div>
  );
};
