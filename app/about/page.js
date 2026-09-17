
"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();

  const scrollContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isPausedRef = useRef(false);

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  // -----------------------------------------
  // Navigation
  // -----------------------------------------

  const goBackButton = () => {
    router.push("/");
  };

  const nextButton = () => {
    router.push("/contact");
  };

  const openPost = (postId) => {
    if (!postId) return;

    router.push(`/blog/${postId}`);
  };

  // -----------------------------------------
  // Fetch recent feedbacks
  // -----------------------------------------

    {/*This is set the tab name */ }
    useEffect(() => {
      document.title = " About  | Page" 
    }, [])

  useEffect(() => {
    const fetchRecentFeedbacks = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await fetch("/api/feedback/recent", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch recent feedbacks."
          );
        }

        setFeedbacks(data.feedbacks || []);
      } catch (error) {
        console.error("Fetch recent feedbacks error:", error);

        setApiError(
          error.message || "Unable to load recent feedbacks."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentFeedbacks();
  }, []);

  // -----------------------------------------
  // Automatic horizontal scrolling
  // -----------------------------------------

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container || feedbacks.length === 0) {
      return;
    }

    const scrollSpeed = 0.5;

    const autoScroll = () => {
      if (!isPausedRef.current) {
        container.scrollLeft += scrollSpeed;

        const oneGroupWidth = container.scrollWidth / 3;

        // Move back when the second group is reached
        if (container.scrollLeft >= oneGroupWidth * 2) {
          container.scrollLeft -= oneGroupWidth;
        }

        // Keep the scroll position inside the middle group
        if (container.scrollLeft <= 0) {
          container.scrollLeft += oneGroupWidth;
        }
      }

      animationFrameRef.current =
        requestAnimationFrame(autoScroll);
    };

    animationFrameRef.current =
      requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [feedbacks]);

  // -----------------------------------------
  // Pause and resume scrolling
  // -----------------------------------------

  const handleMouseEnter = () => {
    isPausedRef.current = true;
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    setIsPaused(false);
  };

  const handleFocus = () => {
    isPausedRef.current = true;
    setIsPaused(true);
  };

  const handleBlur = () => {
    isPausedRef.current = false;
    setIsPaused(false);
  };

  // -----------------------------------------
  // Manual scrolling
  // -----------------------------------------

  const scrollCards = (direction) => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const scrollAmount = 360;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // -----------------------------------------
  // Render rating stars
  // -----------------------------------------

  const renderStars = (rating) => {
    const numericRating = Number(rating || 0);

    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={
          star <= numericRating
            ? "text-yellow-500"
            : "text-gray-300"
        }
      >
        ★
      </span>
    ));
  };

  // -----------------------------------------
  // Format review date
  // -----------------------------------------

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Recently";
    }

    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // -----------------------------------------
  // Duplicate feedbacks for infinite scroll
  // -----------------------------------------

  const infiniteFeedbacks = [
    ...feedbacks,
  ];

  return (
    <main className="container mx-auto px-4 py-12">
      {/* =====================================
          Navigation buttons
      ====================================== */}

      <div className="mb-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goBackButton}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:from-blue-700 hover:to-indigo-800 hover:shadow-xl"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>

          Go Back
        </button>

        <button
          type="button"
          onClick={nextButton}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:from-blue-700 hover:to-indigo-800 hover:shadow-xl"
        >
          Next

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      {/* =====================================
          Hero section
      ====================================== */}

      <section className="mx-auto mb-16 max-w-3xl text-center">
        <p className="mb-3 font-semibold uppercase tracking-wider text-blue-600">
          About Us
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
          We are building something{" "}
          <span className="text-blue-600">meaningful.</span>
        </h1>

        <p className="text-lg leading-8 text-gray-600">
          We believe technology should make life simpler, smarter,
          and more connected. Our goal is to create useful digital
          experiences that solve real problems and make a difference.
        </p>
      </section>

      {/* =====================================
          Stats section
      ====================================== */}

      <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1 */}

        <div className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl transition-transform duration-300 group-hover:scale-110">
            🚀
          </div>

          <h2 className="mb-2 text-4xl font-bold text-gray-900">
            100+
          </h2>

          <p className="text-gray-500">Projects Completed</p>
        </div>

        {/* Card 2 */}

        <div className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-purple-50 p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-purple-200 hover:shadow-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-2xl transition-transform duration-300 group-hover:scale-110">
            😊
          </div>

          <h2 className="mb-2 text-4xl font-bold text-gray-900">
            50+
          </h2>

          <p className="text-gray-500">Happy Clients</p>
        </div>

        {/* Card 3 */}

        <div className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-green-50 p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-2xl transition-transform duration-300 group-hover:scale-110">
            ⭐
          </div>

          <h2 className="mb-2 text-4xl font-bold text-gray-900">
            5+
          </h2>

          <p className="text-gray-500">Years Experience</p>
        </div>
      </section>

      {/* =====================================
          Mission section
      ====================================== */}

      <section className="mb-16 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div>
          <p className="mb-3 font-semibold text-blue-600">
            OUR MISSION
          </p>

          <h2 className="mb-5 text-3xl font-bold">
            Turning ideas into meaningful digital experiences.
          </h2>

          <p className="mb-4 leading-7 text-gray-600">
            We focus on creating simple, elegant, and powerful
            solutions. From the first idea to the final product,
            we care about every detail.
          </p>

          <p className="leading-7 text-gray-600">
            Our approach combines creativity, technology, and a
            deep understanding of our users to build products
            that are both beautiful and useful.
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white">
          <h3 className="mb-4 text-2xl font-bold">
            Why choose us?
          </h3>

          <ul className="space-y-4">
            <li>✓ Simple and user-friendly solutions</li>
            <li>✓ Modern and responsive designs</li>
            <li>✓ Performance-focused development</li>
            <li>✓ Focus on real-world problems</li>
          </ul>
        </div>
      </section>

      {/* =====================================
          Latest reviews section
          This section is now at the bottom
      ====================================== */}

      <section className="mb-4">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Latest reviews
            </p>

            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Recent reader feedback
            </h2>

            <p className="mt-3 max-w-2xl text-gray-600">
              Here are the five most recent reviews shared by
              our readers.
            </p>
          </div>





          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollCards("left")}
              aria-label="Scroll feedback cards left"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-xl text-gray-700 shadow-sm transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => scrollCards("right")}
              aria-label="Scroll feedback cards right"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-xl text-gray-700 shadow-sm transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
            >
              →
            </button>
          </div>
        </div>

        {/* Loading state */}

        {loading && (
          <div className="flex min-h-52 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />

              Loading recent feedbacks...
            </div>
          </div>
        )}

        {/* Error state */}

        {!loading && apiError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            {apiError}
          </div>
        )}

        {/* Empty state */}

        {!loading && !apiError && feedbacks.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
            No feedbacks are available yet.
          </div>
        )}

        {/* Feedback cards */}

        {!loading && !apiError && feedbacks.length > 0 && (
          <div
            ref={scrollContainerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={0}
            className="overflow-x-auto pb-5 outline-none"
          >
            <div className="flex w-max gap-6">
              {infiniteFeedbacks.map((feedback, index) => {
                const post =
                  feedback.postId &&
                  typeof feedback.postId === "object"
                    ? feedback.postId
                    : null;

                const postId = post?._id || feedback.postId;

                return (
                  <article
                    key={`${feedback._id}-${index}`}
                    className="group flex w-[310px] shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl sm:w-[360px]"
                  >
                    {/* Post image */}

                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      {post?.image ? (
                        <img
                          src={post.image}
                          alt={post.title || "Blog post image"}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-5xl">
                          📝
                        </div>
                      )}

                      {/* Rating badge */}

                      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-gray-900 shadow-sm">
                        <span className="text-yellow-500">★</span>

                        {feedback.rating}/5
                      </div>

                      {/* Category badge */}

                      {post?.category && (
                        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                          {post.category}
                        </span>
                      )}
                    </div>

                    {/* Feedback content */}

                    <div className="flex flex-1 flex-col p-5">
                      {/* Post title */}

                      <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                        {post?.title || "Blog article"}
                      </h3>

                      {/* Feedback description */}

                      <p className="mb-5 line-clamp-4 min-h-[96px] text-sm leading-6 text-gray-600">
                        “{feedback.description}”
                      </p>

                      {/* Rating and date */}

                      <div className="mb-5 flex items-center justify-between gap-3">
                        <div
                          className="flex items-center gap-1 text-lg"
                          aria-label={`Rating ${feedback.rating} out of 5`}
                        >
                          {renderStars(feedback.rating)}
                        </div>

                        <span className="text-xs text-gray-500">
                          {formatDate(feedback.createdAt)}
                        </span>
                      </div>

                      {/* Reviewer information */}

                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {feedback.name
                              ?.charAt(0)
                              ?.toUpperCase() || "R"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {feedback.name || "Anonymous reader"}
                            </p>

                            <p className="text-xs text-gray-500">
                              Reader
                            </p>
                          </div>
                        </div>

                        {/* Read article button */}

                        {postId && (
                          <button
                            type="button"
                            onClick={() => openPost(postId)}
                            className="shrink-0 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                          >
                            Read →
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Scroll status */}

        {!loading && !apiError && feedbacks.length > 0 && (
          <p className="mt-4 text-center text-xs text-gray-500">
            {isPaused
              ? "Scrolling paused. Move your mouse away to continue."
              : "Hover over the cards to pause scrolling."}
          </p>
        )}
      </section>
    </main>
  );
}