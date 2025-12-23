# Meeting Rating Feature

This feature allows users to rate meetings they participate in. Ratings appear automatically after meeting time + 2-hour buffer, blocking the user until they provide a rating.

## Architecture

### Frontend (`src/features/ratings/`)

- **API**
  - `useUnratedMeetingsQuery.ts` - Fetches eligible unrated meetings with participant details
  - `useCreateRatingMutation.ts` - Creates ratings with Apollo cache updates

- **Components**
  - `RatingModal.tsx` - Main blocking dialog component (< 200 lines)
  - `StarRating.tsx` - Accessible 5-star rating input using Lucide icons

- **Hooks**
  - `useRatingModalTrigger.ts` - Smart modal trigger with:
    - Session storage tracking to prevent duplicate displays
    - Queue management for multiple unrated meetings
    - 3-second delay between sequential modals
    - Automatic polling every 30 seconds for new unrated meetings

### Backend (`src/modules/calendar/`)

- **Resolver**: `rating.resolver.ts`
  - `createRating` mutation - Creates rating with validation
  - `unratedMeetings` query - Returns meetings eligible for rating
  - `myRatings` query - User's rating history
  - `meetingRatings` query - Meeting ratings (admin only)

- **Service**: `rating.service.ts`
  - Rating creation with authorization checks
  - Validates: participant status, meeting timing, cancellation, duplicate ratings

- **Repository**: `rating.repository.ts`
  - Data access layer with various queries

- **Types**: `unrated-meeting.type.ts`
  - GraphQL types for unrated meeting queries

## Features

✓ **Blocking Modal** - Cannot dismiss without rating (no X, no outside click, no Escape)
✓ **Smart Trigger** - Only shows modals for meetings 2+ hours after end time
✓ **Queue Management** - Multiple unrated meetings shown sequentially with 3s delay
✓ **Session Tracking** - SessionStorage prevents duplicate displays within a session
✓ **Accessible** - ARIA labels on star buttons, proper form semantics
✓ **Responsive** - Mobile-friendly modal with proper dialog containment
✓ **Error Handling** - User-friendly error messages with retry capability
✓ **Loading State** - Submit button disabled until stars selected, loading state during submission
✓ **Success Feedback** - Checkmark animation before auto-closing
✓ **Apollo Cache Updates** - Optimistic updates remove rated meetings from unrated list

## Usage

The feature is automatically integrated into the base layout. When a user has unrated meetings eligible for rating:

1. Modal appears automatically for the first unrated meeting
2. User selects star rating (1-5 stars)
3. Optional feedback textarea available
4. Submit button enabled only after rating selection
5. Success feedback shown for 1.5 seconds
6. Next unrated meeting appears after 3-second delay (if available)

## Form Validation

- Stars: Required, range 0-5
- Feedback: Optional, max 2000 characters
- Schema: Zod with zodResolver integration

## GraphQL Operations

### Query

```graphql
query UnratedMeetings {
  unratedMeetings {
    id
    startDateTime
    endDateTime
    userAId
    userBId
    userA {
      id
      firstName
      lastName
    }
    userB {
      id
      firstName
      lastName
    }
  }
}
```

### Mutation

```graphql
mutation CreateRating($input: CreateRatingInputType!) {
  createRating(input: $input) {
    id
    meetingEventId
    stars
    feedback
  }
}
```

## Component Size

- `RatingModal.tsx`: ~180 lines
- `StarRating.tsx`: ~40 lines
- `useRatingModalTrigger.ts`: ~93 lines
- Total: ~313 lines (logic extracted into hooks to keep components focused)

## Theming

Uses project's shadcn/ui components with Emotion styling:

- Dialog for modal container
- Button for submit
- Textarea for feedback
- Lucide Star icons for rating
- Project's color palette and spacing system
