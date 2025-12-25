import { useState } from "react";
import { format } from "date-fns";
import { Alert } from "@/components/ui/alert";
import { ReadOnlyStarRating } from "./ReadOnlyStarRating";
import type { UserReceivedRatingsData } from "../api/useGetUserReceivedRatingsQuery";

type UserRatingsStatisticsProps = {
  data: UserReceivedRatingsData["getUserReceivedRatings"] | null | undefined;
};

export const UserRatingsStatistics = ({ data }: UserRatingsStatisticsProps) => {
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  if (!data) return null;

  const { averageRating, totalRatings, ratings } = data;

  return (
    <Alert className="mt-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-4">Meeting Ratings</h3>

          {totalRatings === 0 ? (
            <p className="text-sm text-muted-foreground">
              No ratings received yet
            </p>
          ) : (
            <div className="space-y-4">
              {/* Average Rating */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <ReadOnlyStarRating
                    value={Math.round(averageRating ?? 0)}
                    size={20}
                  />
                  <span className="text-lg font-bold">
                    {averageRating?.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {totalRatings}{" "}
                  {totalRatings === 1 ? "rating" : "ratings"}
                </p>
              </div>

              {/* Individual Ratings */}
              <div className="space-y-3">
                {ratings.map((rating) => {
                  const isFeedbackExpanded = expandedFeedback === rating.id;
                  const feedbackPreview = rating.feedback
                    ? rating.feedback.substring(0, 100)
                    : null;

                  return (
                    <div
                      key={rating.id}
                      className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-md space-y-2"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            {format(new Date(rating.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                        <ReadOnlyStarRating value={rating.stars} size={14} />
                      </div>

                      {rating.feedback && (
                        <div className="text-sm text-foreground">
                          {isFeedbackExpanded ? (
                            <p>{rating.feedback}</p>
                          ) : (
                            <>
                              <p>{feedbackPreview}</p>
                              {rating.feedback.length > 100 && (
                                <button
                                  type="button"
                                  onClick={() => setExpandedFeedback(rating.id)}
                                  className="text-xs text-primary hover:underline mt-1"
                                >
                                  Read more
                                </button>
                              )}
                            </>
                          )}
                          {isFeedbackExpanded &&
                            rating.feedback.length > 100 && (
                              <button
                                type="button"
                                onClick={() => setExpandedFeedback(null)}
                                className="text-xs text-primary hover:underline mt-1 block"
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
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};
