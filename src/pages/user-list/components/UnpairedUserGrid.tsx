import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import type { AnonUsersQueryItem } from "@/features/users/api/useAnonUsersQuery";

type UnpairedUserGridProps = {
  users: AnonUsersQueryItem[];
};

const UnpairedUserGrid = ({ users }: UnpairedUserGridProps) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const momentumFrameRef = useRef<number | null>(null);
  const isMomentumScrollingRef = useRef(false);
  const pointerStateRef = useRef<{
    isDown: boolean;
    startX: number;
    startScrollLeft: number;
    didDrag: boolean;
    pointerId: number | null;
    hasCapture: boolean;
    lastX: number;
    lastTime: number;
    velocity: number; // px per ms
  }>({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    didDrag: false,
    pointerId: null,
    hasCapture: false,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });
  const snapTimeoutRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hasUsers = users.length > 0;

  const stopMomentumScroll = useCallback(() => {
    if (momentumFrameRef.current) {
      window.cancelAnimationFrame(momentumFrameRef.current);
      momentumFrameRef.current = null;
    }
    isMomentumScrollingRef.current = false;
  }, []);

  const snapToClosestCard = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-user-card]")
    );
    if (!cards.length) return;

    const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;

    let closest = cards[0];
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const card of cards) {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = card;
      }
    }

    const targetLeft =
      closest.offsetLeft - (scroller.clientWidth - closest.offsetWidth) / 2;
    if (Math.abs(scroller.scrollLeft - targetLeft) < 2) {
      return;
    }
    scroller.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, []);

  const startMomentumScroll = useCallback(
    (initialVelocity: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      stopMomentumScroll();
      isMomentumScrollingRef.current = true;

      // Avoid scroll-snap fighting the inertial animation.
      scroller.style.scrollBehavior = "auto";

      let v = initialVelocity;
      let lastTs = performance.now();

      const tick = (ts: number) => {
        const dt = ts - lastTs;
        lastTs = ts;

        const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
        const next = Math.min(
          maxScrollLeft,
          Math.max(0, scroller.scrollLeft + v * dt)
        );
        scroller.scrollLeft = next;

        // Decelerate with time-based friction.
        const friction = Math.pow(0.92, dt / 16);
        v *= friction;

        const atEdge = next <= 0 || next >= maxScrollLeft;
        if (atEdge) {
          v *= 0.6;
        }

        if (Math.abs(v) < 0.02) {
          stopMomentumScroll();
          scroller.style.scrollBehavior = "";
          snapToClosestCard();
          return;
        }

        momentumFrameRef.current = window.requestAnimationFrame(tick);
      };

      momentumFrameRef.current = window.requestAnimationFrame(tick);
    },
    [snapToClosestCard, stopMomentumScroll]
  );

  useEffect(() => {
    return () => {
      if (snapTimeoutRef.current) {
        window.clearTimeout(snapTimeoutRef.current);
      }
      stopMomentumScroll();
    };
  }, [stopMomentumScroll]);

  if (!hasUsers) {
    return null;
  }

  return (
    <section className="space-y-4 pt-6">
      <div>
        <h2 className="text-xl font-semibold">Discover new people</h2>
        <p className="text-sm text-muted-foreground">
          Profiles you have not been paired with yet.
        </p>
      </div>
      <div
        ref={scrollerRef}
        className={[
          "flex gap-5 overflow-x-auto pb-2 pt-1",
          isDragging || isMomentumScrollingRef.current
            ? "snap-none"
            : "snap-x snap-mandatory scroll-smooth",
          "touch-pan-y select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
          // hide scrollbar (cross-browser)
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        ].join(" ")}
        role="list"
        aria-label="Unpaired user cards"
        onPointerDown={(e) => {
          const scroller = scrollerRef.current;
          if (!scroller) return;
          if (e.button !== 0) return;

          stopMomentumScroll();
          if (snapTimeoutRef.current) {
            window.clearTimeout(snapTimeoutRef.current);
            snapTimeoutRef.current = null;
          }

          pointerStateRef.current.isDown = true;
          pointerStateRef.current.didDrag = false;
          pointerStateRef.current.startX = e.clientX;
          pointerStateRef.current.startScrollLeft = scroller.scrollLeft;
          pointerStateRef.current.pointerId = e.pointerId;
          pointerStateRef.current.hasCapture = false;
          pointerStateRef.current.lastX = e.clientX;
          pointerStateRef.current.lastTime = performance.now();
          pointerStateRef.current.velocity = 0;
        }}
        onPointerMove={(e) => {
          const scroller = scrollerRef.current;
          if (!scroller) return;
          if (!pointerStateRef.current.isDown) return;

          const now = performance.now();
          const dt = Math.max(1, now - pointerStateRef.current.lastTime);
          const dxSinceLast = e.clientX - pointerStateRef.current.lastX;
          const instantaneousVelocity = -dxSinceLast / dt; // scrollLeft velocity
          pointerStateRef.current.velocity =
            pointerStateRef.current.velocity * 0.8 +
            instantaneousVelocity * 0.2;
          pointerStateRef.current.lastX = e.clientX;
          pointerStateRef.current.lastTime = now;

          const dx = e.clientX - pointerStateRef.current.startX;
          if (Math.abs(dx) > 8) {
            if (!pointerStateRef.current.didDrag) {
              pointerStateRef.current.didDrag = true;
              setIsDragging(true);
              scroller.style.scrollBehavior = "auto";
            }
            if (
              !pointerStateRef.current.hasCapture &&
              pointerStateRef.current.pointerId !== null
            ) {
              pointerStateRef.current.hasCapture = true;
              scroller.setPointerCapture(pointerStateRef.current.pointerId);
            }
          }

          // drag-to-scroll (always track pointer; we'll only cancel click once it's a real drag)
          scroller.scrollLeft = pointerStateRef.current.startScrollLeft - dx;
          if (pointerStateRef.current.didDrag) {
            e.preventDefault();
          }
        }}
        onPointerUp={(e) => {
          const scroller = scrollerRef.current;
          if (!scroller) return;

          pointerStateRef.current.isDown = false;
          setIsDragging(false);
          scroller.style.scrollBehavior = "";
          if (pointerStateRef.current.hasCapture) {
            try {
              scroller.releasePointerCapture(e.pointerId);
            } catch {
              // ignore
            }
          }
          pointerStateRef.current.pointerId = null;
          pointerStateRef.current.hasCapture = false;

          if (pointerStateRef.current.didDrag) {
            const v = pointerStateRef.current.velocity;
            if (Math.abs(v) > 0.05) {
              startMomentumScroll(v);
            } else {
              snapToClosestCard();
            }
          }
        }}
        onPointerCancel={() => {
          const scroller = scrollerRef.current;
          if (!scroller) return;

          pointerStateRef.current.isDown = false;
          setIsDragging(false);
          scroller.style.scrollBehavior = "";
          pointerStateRef.current.pointerId = null;
          pointerStateRef.current.hasCapture = false;
        }}
        onClickCapture={(e) => {
          // Prevent accidental navigation when the user was dragging.
          if (pointerStateRef.current.didDrag) {
            e.preventDefault();
            e.stopPropagation();
            pointerStateRef.current.didDrag = false;
          }
        }}
        onScroll={() => {
          if (
            pointerStateRef.current.isDown ||
            isMomentumScrollingRef.current
          ) {
            return;
          }
          if (snapTimeoutRef.current) {
            window.clearTimeout(snapTimeoutRef.current);
          }
          snapTimeoutRef.current = window.setTimeout(() => {
            snapToClosestCard();
          }, 120);
        }}
      >
        {users.map((user) => {
          const displayName =
            [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
            user.email ||
            "User";

          const locationLabel =
            user.location?.trim() || "Location not provided";

          return (
            <Card
              key={user.id}
              data-user-card
              role="listitem"
              className={[
                "shrink-0 snap-center overflow-hidden",
                // ~2:1 (vertical:horizontal) feel without forcing huge heights on mobile
                "h-[70vh] max-h-[34rem] w-[min(18rem,80vw)]",
                // Tinder-ish styling
                "rounded-3xl border-muted-foreground/20 shadow-sm",
                "transition duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                "bg-card",
              ].join(" ")}
            >
              <Link
                to={`/user-list/${encodeURIComponent(user.id)}`}
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
                className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={`View profile for ${displayName}`}
              >
                <CardContent className="flex h-full flex-col p-0">
                  <div className="relative h-[60%] w-full overflow-hidden bg-muted">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={displayName}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/40">
                        <span className="text-6xl font-semibold text-muted-foreground">
                          {displayName?.[0]?.toUpperCase() ?? "U"}
                        </span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col justify-start gap-1 p-5 text-left">
                    <div className="text-base font-semibold leading-tight">
                      {displayName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email ?? ""}
                    </div>
                    <div className="pt-2 text-sm text-foreground/80">
                      {locationLabel}
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default UnpairedUserGrid;
