// "use client"
// // import { useSearchParams } from "next/navigation"
// import { useEffect, useState } from "react"
// import { useSearchParams } from "next/navigation"
// export default function Home() {
//     const searchParams = useSearchParams();
//     const id = searchParams.get("id");
//     const [postData, setpostData] = useState({
//         title: "",
//         description: "",
//         category: "",
//         author: "",
//         image: ""
//     })



//     {/* useEffevt to get the post data */ }

//     useEffect(() => {
//         if (!id) return;
//         fetchPostdata()

//     }, [])

//     const fetchPostdata = async () => {
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`);
//             const getData = await response.json();
//             const data = getData?.data || {}
//             if (data && Object.keys(data)?.length > 0) {
//                 const { _id, ...rest } = data;
//                 setpostData((prev) => ({
//                     ...prev,
//                     ...rest
//                 }))
//             } else {
//             setpostData({
//                 title: "",
//                 description: "",
//                 category: "",
//                 author: "",
//                 image: ""
//             })
//             }

//         } catch (error) {
//             setpostData({
//                 title: "",
//                 description: "",
//                 category: "",
//                 author: "",
//                 image: ""
//             })
//         }
//     }

//     return (
//         <>
//             <p>This is id {id}</p>
//         </>
//     )
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// const emptyPost = {
//   title: "",
//   description: "",
//   category: "",
//   author: "",
//   image: "",
// };

// const emptyFeedback = {
//   name: "",
//   description: "",
//   rating: 0,
// };

// export default function Home() {
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");

//   const [postData, setPostData] = useState(emptyPost);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [showHero, setShowHero] = useState(true);

//   const [feedback, setFeedback] = useState(emptyFeedback);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   /*
//     Get blog post
//   */
//   useEffect(() => {
//     if (!id) {
//       setError("Post ID is missing.");
//       setLoading(false);
//       return;
//     }

//     const fetchPostData = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`,
//           {
//             cache: "no-store",
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch post");
//         }

//         const result = await response.json();

//         const data = result?.data || result || {};

//         setPostData({
//           ...emptyPost,
//           ...data,
//         });
//       } catch (error) {
//         console.error(error);
//         setError("Unable to load this blog post.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPostData();
//   }, [id]);

//   /*
//     Hide hero while scrolling down.
//     Show hero while scrolling up.
//   */
//   useEffect(() => {
//     let previousScrollY = window.scrollY;
//     let ticking = false;

//     const handleScroll = () => {
//       if (ticking) return;

//       window.requestAnimationFrame(() => {
//         const currentScrollY = window.scrollY;
//         const difference = currentScrollY - previousScrollY;

//         if (difference > 5 && currentScrollY > 100) {
//           setShowHero(false);
//         }

//         if (difference < -5 || currentScrollY <= 20) {
//           setShowHero(true);
//         }

//         previousScrollY = currentScrollY;
//         ticking = false;
//       });

//       ticking = true;
//     };

//     window.addEventListener("scroll", handleScroll, {
//       passive: true,
//     });

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const handleFeedbackChange = (event) => {
//     const { name, value } = event.target;

//     setFeedback((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   const handleRatingChange = (rating) => {
//     setFeedback((previous) => ({
//       ...previous,
//       rating,
//     }));
//   };

//   const handleFeedbackSubmit = async (event) => {
//     event.preventDefault();

//     if (feedback.rating === 0) {
//       alert("Please select a star rating.");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}/feedback`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(feedback),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Feedback submission failed");
//       }

//       setSubmitted(true);
//       setFeedback(emptyFeedback);
//     } catch (error) {
//       console.error(error);
//       alert("Unable to submit feedback.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-slate-50">
//         <div className="flex flex-col items-center gap-4 text-slate-500">
//           <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
//           <p className="font-medium">Loading article...</p>
//         </div>
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
//         <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
//           <h1 className="text-2xl font-bold text-slate-900">
//             Something went wrong
//           </h1>

//           <p className="mt-2 text-slate-500">{error}</p>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
//       {/* Small hero image */}
//       <div className="relative h-[300px] overflow-hidden sm:h-[340px]">
//         <section
//           className={`absolute inset-0 flex items-end bg-cover bg-center transition-all duration-700 ease-in-out ${
//             showHero
//               ? "translate-y-0 scale-100 opacity-100"
//               : "-translate-y-full scale-105 opacity-0"
//           }`}
//           style={{
//             backgroundImage: `url(${postData.image})`,
//           }}
//         >
//           {/* Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

//           {/* Hero content */}
//           <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-8 sm:px-8">
//             <div className="animate-[fadeUp_700ms_ease-out]">
//               <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
//                 <span className="h-2 w-2 rounded-full bg-purple-300" />

//                 {postData.category || "Article"}
//               </div>

//               <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
//                 {postData.title || "Untitled article"}
//               </h1>

//               <div className="mt-5 flex items-center gap-3">
//                 <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white">
//                   {postData.author?.charAt(0)?.toUpperCase() || "A"}
//                 </div>

//                 <div>
//                   <p className="text-xs text-slate-300">Written by</p>

//                   <p className="text-sm font-bold text-white">
//                     {postData.author || "Unknown author"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>

//       {/* Main content */}
//       <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
//         <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
//           {/* Article */}
//           <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_15px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 sm:p-10">
//             <div className="mb-6 flex items-center gap-3">
//               <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-600">
//                 Latest article
//               </span>

//               <span className="h-1 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
//             </div>

//             <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
//               {postData.title}
//             </h2>

//             <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600 sm:text-lg">
//               {postData.description}
//             </p>

//             <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
//               <span className="rounded-full bg-slate-100 px-3 py-1.5">
//                 {postData.category || "General"}
//               </span>

//               <span className="rounded-full bg-slate-100 px-3 py-1.5">
//                 Blog article
//               </span>
//             </div>
//           </article>

//           {/* Sidebar */}
//           <aside className="h-fit lg:sticky lg:top-6">
//             <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
//               <p className="text-xs font-black uppercase tracking-widest text-purple-600">
//                 About this post
//               </p>

//               <h3 className="mt-3 text-xl font-black text-slate-900">
//                 {postData.title}
//               </h3>

//               <div className="mt-6 space-y-4 text-sm">
//                 <div className="flex justify-between gap-4 border-b border-slate-100 pb-4">
//                   <span className="text-slate-500">Category</span>

//                   <strong className="text-right capitalize text-slate-800">
//                     {postData.category || "General"}
//                   </strong>
//                 </div>

//                 <div className="flex justify-between gap-4 border-b border-slate-100 pb-4">
//                   <span className="text-slate-500">Author</span>

//                   <strong className="text-right text-slate-800">
//                     {postData.author || "Unknown"}
//                   </strong>
//                 </div>

//                 <div className="flex justify-between gap-4">
//                   <span className="text-slate-500">Type</span>

//                   <strong className="text-right text-slate-800">
//                     Article
//                   </strong>
//                 </div>
//               </div>
//             </div>
//           </aside>
//         </div>

//         {/* Feedback */}
//         <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_15px_45px_rgba(15,23,42,0.06)] sm:p-10">
//           <div className="mb-8">
//             <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-600">
//               Your opinion matters
//             </p>

//             <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
//               What did you think?
//             </h2>

//             <p className="mt-3 text-slate-500">
//               Share your thoughts and help us create better articles.
//             </p>
//           </div>

//           {submitted ? (
//             <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
//               <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-600 text-2xl font-black text-white">
//                 ✓
//               </div>

//               <h3 className="mt-4 text-xl font-black text-green-800">
//                 Thank you for your feedback!
//               </h3>

//               <p className="mt-2 text-green-700">
//                 Your feedback was submitted successfully.
//               </p>

//               <button
//                 type="button"
//                 onClick={() => setSubmitted(false)}
//                 className="mt-5 rounded-xl bg-green-700 px-5 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-green-600"
//               >
//                 Add another feedback
//               </button>
//             </div>
//           ) : (
//             <form
//               onSubmit={handleFeedbackSubmit}
//               className="space-y-6"
//             >
//               <div className="grid gap-6 md:grid-cols-2">
//                 {/* Name */}
//                 <div>
//                   <label
//                     htmlFor="name"
//                     className="mb-2 block text-sm font-bold text-slate-700"
//                   >
//                     Your name
//                   </label>

//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     value={feedback.name}
//                     onChange={handleFeedbackChange}
//                     placeholder="Enter your name"
//                     required
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:-translate-y-0.5 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
//                   />
//                 </div>

//                 {/* Rating */}
//                 <div>
//                   <label className="mb-2 block text-sm font-bold text-slate-700">
//                     Your rating
//                   </label>

//                   <div className="flex min-h-[52px] flex-wrap items-center gap-3">
//                     <div className="flex gap-1">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <button
//                           key={star}
//                           type="button"
//                           onClick={() => handleRatingChange(star)}
//                           aria-label={`Give ${star} stars`}
//                           className={`text-3xl leading-none transition duration-200 hover:scale-125 ${
//                             star <= feedback.rating
//                               ? "text-amber-400"
//                               : "text-slate-300"
//                           }`}
//                         >
//                           ★
//                         </button>
//                       ))}
//                     </div>

//                     <span className="text-sm font-bold text-slate-500">
//                       {feedback.rating
//                         ? `${feedback.rating}/5`
//                         : "Select rating"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Feedback */}
//               <div>
//                 <label
//                   htmlFor="description"
//                   className="mb-2 block text-sm font-bold text-slate-700"
//                 >
//                   Your feedback
//                 </label>

//                 <textarea
//                   id="description"
//                   name="description"
//                   rows="5"
//                   value={feedback.description}
//                   onChange={handleFeedbackChange}
//                   placeholder="Write your feedback here..."
//                   required
//                   className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:-translate-y-0.5 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
//                 />
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="group flex w-full items-center justify-center gap-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 font-black text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {submitting ? (
//                   <>
//                     <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     Submit feedback
//                     <span className="text-xl transition duration-300 group-hover:translate-x-1">
//                       →
//                     </span>
//                   </>
//                 )}
//               </button>
//             </form>
//           )}
//         </section>
//       </section>
//     </main>
//   );
// }

import { Suspense } from "react";
import ViewPost from "./viewpostdata";

export default function ViewPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ViewPost />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-gray-500">
        Loading post...
      </p>
    </div>
  );
}