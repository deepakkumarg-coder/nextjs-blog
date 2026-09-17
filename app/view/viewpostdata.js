"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const emptyPost = {
  title: "",
  description: "",
  category: "",
  author: "",
  image: "",
};

const emptyFeedback = {
  name: "",
  description: "",
  rating: 0,
};

export default function Home() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [postData, setPostData] = useState(emptyPost);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showHero, setShowHero] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  const [feedback, setFeedback] = useState(emptyFeedback);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);


  {/*This is set the tab name */ }
  useEffect(() => {
    document.title = " View Blog  | Page"
  }, [])

  /*
    Fetch blog post
  */
  useEffect(() => {
    if (!id) {
      setError("Post ID is missing.");
      setLoading(false);
      return;
    }

    const fetchPostData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch blog post.");
        }

        const result = await response.json();

        const data = result?.data || result || {};

        setPostData({
          ...emptyPost,
          ...data,
        });
      } catch (error) {
        console.error("Fetch post error:", error);
        setError("Unable to load this blog post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  /*
    Start entrance animation after data loads
  */
  useEffect(() => {
    if (loading || error) return;

    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [loading, error]);

  /*
    Hide hero while scrolling down.
    Show hero while scrolling up.
  */
  useEffect(() => {
    let previousScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const difference = currentScrollY - previousScrollY;

        if (difference > 5 && currentScrollY > 100) {
          setShowHero(false);
        }

        if (difference < -5 || currentScrollY <= 20) {
          setShowHero(true);
        }

        previousScrollY = currentScrollY;
        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
    Handle form inputs
  */
  const handleFeedbackChange = (event) => {
    const { name, value } = event.target;

    setFeedback((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
    Handle star rating
  */
  const handleRatingChange = (rating) => {
    setFeedback((previous) => ({
      ...previous,
      rating,
    }));
  };

  /*
    Submit feedback
  */
  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();

    if (feedback.rating === 0) {
      alert("Please select a star rating.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: id,
            name: feedback.name,
            description: feedback.description,
            rating: feedback.rating,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit feedback.");
      }

      setSubmitted(true);
      setFeedback(emptyFeedback);
    } catch (error) {
      console.error("Feedback submit error:", error);
      alert("Unable to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /*
    Loading screen
  */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="text-sm font-semibold text-slate-500">
            Loading article...
          </p>
        </div>
      </main>
    );
  }

  /*
    Error screen
  */
  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-black text-slate-900">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <div className="relative h-[280px] overflow-hidden sm:h-[320px]">
        <section
          className={`absolute inset-0 flex items-end bg-cover bg-center transition-all duration-700 ease-in-out ${showHero
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-full scale-105 opacity-0"
            }`}
          style={{
            backgroundImage: `url(${postData.image})`,
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />

          {/* Hero content */}
          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-8 sm:px-8">
            <div
              className={`transition-all duration-700 ease-out ${contentVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
                }`}
            >
              {/* Category */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-purple-300" />

                {postData.category || "Article"}
              </div>

              {/* Title */}
              <h1 className="max-w-4xl break-words text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                {postData.title || "Untitled article"}
              </h1>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-black text-white">
                  {postData.author?.charAt(0)?.toUpperCase() || "A"}
                </div>

                <div>
                  <p className="text-xs text-slate-300">
                    Written by
                  </p>

                  <p className="text-sm font-bold text-white">
                    {postData.author || "Unknown author"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_250px]">
          {/* =================================================
              ARTICLE CARD
          ================================================== */}
          <article
            className={`group min-w-0 rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_15px_45px_rgba(15,23,42,0.06)] transition-all duration-700 ease-out hover:-translate-y-2 hover:border-indigo-200 hover:shadow-[0_25px_60px_rgba(79,70,229,0.15)] sm:p-10 ${contentVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
              }`}
          >
            {/* Article label */}
            <div className="mb-7 flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-600">
                Latest article
              </span>

              <span className="h-1 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-hover:w-20" />
            </div>

            {/* Article title */}
            <h2 className="break-words text-3xl font-black leading-tight tracking-tight text-slate-900 transition-colors duration-500 group-hover:text-indigo-700 sm:text-5xl">
              {postData.title}
            </h2>

            {/* Article description */}
            <p className="mt-7 max-w-full whitespace-pre-wrap break-words text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
              {postData.description}
            </p>

            {/* Article metadata */}
            <div className="mt-9 flex flex-wrap gap-3 border-t border-slate-100 pt-6 text-sm font-semibold text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 transition-all duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-700">
                {postData.category || "General"}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 transition-all duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-700">
                Blog article
              </span>
            </div>
          </article>

          {/* =================================================
              ABOUT ARTICLE CARD
          ================================================== */}
          <aside className="min-w-0 lg:sticky lg:top-6">
            <div
              className={`group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all delay-150 duration-700 ease-out hover:-translate-y-2 hover:border-purple-200 hover:shadow-[0_20px_45px_rgba(168,85,247,0.14)] ${contentVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
                }`}
            >
              <p className="text-[11px] font-black uppercase tracking-widest text-purple-600">
                About this article
              </p>

              <h3 className="mt-3 break-words text-lg font-black leading-snug text-slate-900 transition-colors duration-500 group-hover:text-purple-700">
                {postData.title}
              </h3>

              <div className="mt-5 space-y-3 text-xs">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <span className="text-slate-500">
                    Category
                  </span>

                  <strong className="break-words text-right capitalize text-slate-800">
                    {postData.category || "General"}
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <span className="text-slate-500">
                    Author
                  </span>

                  <strong className="break-words text-right text-slate-800">
                    {postData.author || "Unknown"}
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">
                    Content
                  </span>

                  <strong className="text-right text-slate-800">
                    Article
                  </strong>
                </div>
              </div>
            </div>
          </aside>

          {/* =================================================
              FEEDBACK CARD
          ================================================== */}
          <section
            className={`group min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-all delay-300 duration-700 ease-out hover:-translate-y-2 hover:border-indigo-200 hover:shadow-[0_25px_60px_rgba(79,70,229,0.14)] lg:col-span-2 sm:p-8 ${contentVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
              }`}
          >
            {/* Feedback heading */}
            <div className="mb-7">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-600">
                Your opinion matters
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 transition-colors duration-500 group-hover:text-indigo-700 sm:text-3xl">
                What did you think?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Share your thoughts and help us create better articles.
              </p>
            </div>

            {/* Success message */}
            {submitted ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-7 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-green-600 text-2xl font-black text-white">
                  ✓
                </div>

                <h3 className="mt-4 text-lg font-black text-green-800">
                  Thank you for your feedback!
                </h3>

                <p className="mt-2 text-sm text-green-700">
                  Your feedback was submitted successfully.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-5 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-green-600"
                >
                  Add another feedback
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleFeedbackSubmit}
                className="space-y-5"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Your name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={feedback.name}
                      onChange={handleFeedbackChange}
                      placeholder="Enter your name"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:-translate-y-0.5 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Your rating
                    </label>

                    <div className="flex min-h-[46px] flex-wrap items-center gap-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            aria-label={`Give ${star} stars`}
                            className={`text-2xl leading-none transition duration-200 hover:scale-125 ${star <= feedback.rating
                                ? "text-amber-400"
                                : "text-slate-300"
                              }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>

                      <span className="text-xs font-bold text-slate-500">
                        {feedback.rating
                          ? `${feedback.rating}/5`
                          : "Select rating"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Your feedback
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={feedback.description}
                    onChange={handleFeedbackChange}
                    placeholder="Write your feedback here..."
                    required
                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:-translate-y-0.5 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group/submit flex w-full items-center justify-center gap-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit feedback

                      <span className="text-lg transition duration-300 group-hover/submit:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}