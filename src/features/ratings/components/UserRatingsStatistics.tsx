import { useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { ReadOnlyStarRating } from "./ReadOnlyStarRating";
import type {
  UserReceivedRatingsData,
} from "../api/useGetUserReceivedRatingsQuery";

type UserRatingsStatisticsProps = {
  data: UserReceivedRatingsData["getUserReceivedRatings"] | null | undefined;
};

export const UserRatingsStatistics = ({ data }: UserRatingsStatisticsProps) => {
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  if (!data) return null;

  const { averageRating, totalRatings, ratings } = data;

  return (
    <Card className="mt-6 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Rating Statistics</h3>

        {totalRatings === 0 ? (
          <div className="text-sm text-muted-foreground">No ratings yet</div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <ReadOnlyStarRating
                value={Math.round(averageRating ?? 0)}
                size={20}
              />
              <span className="text-2xl font-bold">
                {averageRating?.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                Based on {totalRatings}{" "}
                {totalRatings === 1 ? "rating" : "ratings"}
              </span>
            </div>
          </div>
        )}
      </div>

      {totalRatings > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Individual Ratings</h4>
          {ratings.map((rating) => {
            const isFeedbackExpanded = expandedFeedback === rating.id;
            const feedbackPreview = rating.feedback
              ? rating.feedback.substring(0, 100)
              : null;

            return (
              <div
                key={rating.id}
                className="border-l-2 border-gray-200 pl-4 pb-4"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Rating received
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(rating.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <ReadOnlyStarRating value={rating.stars} size={14} />
                  </div>
                </div>

                {rating.feedback && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {isFeedbackExpanded ? (
                      <p>{rating.feedback}</p>
                    ) : (
                      <>
                        <p>{feedbackPreview}</p>
                        {rating.feedback.length > 100 && (
                          <button
                            type="button"
                            onClick={() => setExpandedFeedback(rating.id)}
                            className="text-blue-600 hover:underline text-xs mt-1"
                          >
                            Read more
                          </button>
                        )}
                      </>
                    )}
                    {isFeedbackExpanded && rating.feedback.length > 100 && (
                      <button
                        type="button"
                        onClick={() => setExpandedFeedback(null)}
                        className="text-blue-600 hover:underline text-xs mt-1 block"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
