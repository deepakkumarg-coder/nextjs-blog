// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { useRouter } from "next/navigation";
// import {
//   Card,
//   Input,
//   Button,
//   Tag,
//   Avatar,
//   Skeleton,
//   Empty,
//   Popconfirm,
//   message,
//   Tooltip,
//   notification
// } from "antd";

// export default function CreatePostPage() {

//   {/*Constant variables */ }
//   const defaultStyles = {
//     root: {
//       backgroundColor: '#f6ffed',
//       border: '2px solid #95de64',
//       borderRadius: 16,
//       boxShadow: '4px 4px 0 #d9f7be',
//     },
//     icon: {
//       color: '#237804',
//     },
//     title: {
//       color: '#237804',
//       fontWeight: 600,
//     },
//     description: {
//       color: '#3f6600',
//     },
//   };

//   const styleFn = ({ props }) => {
//     if (props.type === 'error') {
//       return {
//         ...defaultStyles,
//         root: {
//           ...defaultStyles.root,
//           backgroundColor: '#fff2f0',
//           borderColor: '#ffccc7',
//           boxShadow: '4px 4px 0 #ffccc7',
//         },
//         icon: {
//           color: '#cf1322',
//         },
//         title: {
//           color: '#cf1322',
//         },
//         description: {
//           color: '#5c0011',
//         },
//       };
//     }

//     return defaultStyles;
//   };
//   {/*Router & Params Management */ }

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const mode = searchParams.get("mode");
//   const cid = searchParams.get("cid");
//   const isEditMode = mode === "Edit";

//   {/* Api Scuccess and Error state Management */ }

//   const [api, contextHolder] = notification.useNotification();

//   {/*Form input state Management */ }
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     author: ""
//   })

//   {/* Loder State Mangement */ }
//   const [loading, setLoading] = useState(false);

//   {/*File Handling */ }

//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);


// // console.log("THIS IS FORM DATA BEFORE ISFORMVALID",formData)
//   const isFormValid =
//     Object.values(formData).every(
//       (value) => value?.trim() !== ""
//     ) && (isEditMode || Boolean(image));
//   // console.log("this is checking isformvaluid", isFormValid,!isFormValid,loading)
//   {/*This is set the tab name */ }
//   useEffect(() => {
//     document.title = isEditMode ? " Edit  | Page" : "Create | Page"
//   }, [])

//   {/*Side effect to get data from Database */ }
//   useEffect(() => {
//     if (!isEditMode || !cid) return;
//     fetchData()

//   }, [isEditMode, cid])

//   {/* Fetch Post Data*/ }
//   const fetchData = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${cid}`, {
//         method: "GET",
//       });
//       const getData = await response.json();
//       const data = getData?.data || {}
//       if (Object.keys(data).length > 0 && data) {
//         const { _id, __v, ...rest } = data
//         const { image } = data
//         setFormData((prev) => {
//           return{

//             ...prev,
//             ...rest
//           }
//         })
//         setPreview(image)

//       } else {
//         setFormData(
//           {
//             title: "",
//             description: "",
//             category: "",
//             author: ""
//           }
//         )
//         setPreview(null)

//       }


//     } catch (error) {
//       console.log(`This is error ${error.message}`)
//     }
//   }
//   // Handle image selection
//   const handleImage = (file) => {
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       alert("Please upload an image file.");
//       return;
//     }

//     // Optional 5MB validation
//     if (file.size > 5 * 1024 * 1024) {
//       alert("Image size should be less than 5MB.");
//       return;
//     }
//     console.log("checking file data", file);
//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   // Handle file input
//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];

//     if (file) {
//       handleImage(file);
//     }
//   };

//   // Handle drag over
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   // Handle drag leave
//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   // Handle drop
//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);

//     const file = e.dataTransfer.files?.[0];

//     if (file) {
//       handleImage(file);
//     }
//   };

//   // Remove selected image
//   const removeImage = () => {
//     if (preview) {
//       URL.revokeObjectURL(preview);
//     }

//     setImage(null);
//     setPreview(null);
//   };

//   // Handle form submission

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Start loading before making the API request
//     setLoading(true);

//     const newFormData = new FormData();

//     newFormData.append("title", formData.title.trim());
//     newFormData.append("description", formData.description.trim());
//     newFormData.append("category", formData.category);
//     newFormData.append("author", formData.author.trim());

//     // Only append image when a new image file exists
//     if (image) {
//       newFormData.append("image", image);
//     }

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//       const response = await fetch(
//         isEditMode
//           ? `/api/post/${cid}`
//           : "/api/post",
//         {
//           method: isEditMode ? "PATCH" : "POST",
//           body: newFormData,
//         }
//       );

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(
//           data.message || "Unable to save the post."
//         );
//       }

//       api.success({
//         title: "Success",
//         description: isEditMode
//           ? "Post updated successfully."
//           : "Post created successfully.",
//         placement: "bottomRight",
//         duration: 3,
//         styles: defaultStyles,
//       });

//       setTimeout(() => {
//         router.push("/");
//       }, 3000);
//     } catch (error) {
//       console.error("Submit error:", error);

//       api.error({
//         title: "API Error",
//         description: error.message || "Something went wrong.",
//         placement: "bottomRight",
//         duration: 3,
//         type: "error",
//         styles: styleFn,
//       });
//     } finally {
//       // Stop loading after success or error
//       setLoading(false);
//     }
//   };

//   return (
//     <>

//       {contextHolder}
//       <main className="relative min-h-screen bg-[#f8f9fc] px-4 py-10 md:px-8">
//         {loading && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
//             <div className="rounded-2xl border border-white/60 bg-white/90 px-8 py-6 text-center shadow-xl">
//               <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

//               <p className="font-medium text-gray-800">
//                 {isEditMode ? "Updating post..." : "Publishing post..."}
//               </p>

//               <p className="mt-1 text-sm text-gray-500">
//                 Please wait a moment
//               </p>
//             </div>
//           </div>
//         )}
//         {/* Background decoration */}
//         <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
//           <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />

//           <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
//         </div>

//         <div className="mx-auto max-w-5xl">

//           {/* Header */}
//           <div className="mb-10 animate-[fadeIn_0.5s_ease-out]">

//             {/* <Link
//             href="/"
//             className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-all duration-300 hover:-translate-x-1 hover:text-gray-900"
//           >
//             ← Back to Home
//           </Link> */}

//             {/* Badge */}
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600">
//               <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
//               {isEditMode ? "Edit Post" : "Create New Post"}
//             </div>

//             {/* Heading */}
//             <h1 className="text-4xl font-bold tracking-tight text-[#111827] md:text-5xl">
//               Share your{" "}
//               <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
//                 ideas.
//               </span>
//             </h1>

//             <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
//               Create a new blog post and share your knowledge, ideas and
//               experiences with your readers.
//             </p>
//           </div>

//           {/* Form Card */}
//           <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-500 hover:shadow-[0_25px_70px_rgba(15,23,42,0.12)]">

//             {/* Gradient top border */}
//             <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

//             <form onSubmit={handleSubmit} className="p-6 md:p-10">

//               {/* =========================
//                 POST INFORMATION
//             ========================== */}

//               <div className="mb-10">

//                 <div className="mb-6">
//                   <h2 className="text-xl font-bold text-gray-900">
//                     Post Information
//                   </h2>

//                   <p className="mt-1 text-sm text-gray-500">
//                     Add the basic information about your blog post.
//                   </p>
//                 </div>

//                 <div className="grid gap-6 md:grid-cols-2">

//                   {/* Title */}
//                   <div className="md:col-span-2">
//                     <label
//                       htmlFor="title"
//                       className="mb-2 block text-sm font-semibold text-gray-700"
//                     >
//                       Post Title
//                     </label>

//                     <input
//                       id="title"
//                       name="title"
//                       type="text"
//                       value={formData?.title || ""}
//                       onChange={(e) => setFormData({ ...formData, title: e?.target?.value })}
//                       required
//                       placeholder="Enter an engaging title..."
//                       className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
//                     />
//                   </div>

//                   {/* Category */}
//                   <div>
//                     <label
//                       htmlFor="category"
//                       className="mb-2 block text-sm font-semibold text-gray-700"
//                     >
//                       Category
//                     </label>

//                     <select
//                       id="category"
//                       name="category"
//                       value={formData.category}
//                       onChange={(e) => setFormData({ ...formData, category: e?.target?.value })}
//                       required
//                       className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-700 outline-none transition-all duration-300 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
//                     >
//                       <option value="">
//                         Select category
//                       </option>

//                       <option value="technology">
//                         Technology
//                       </option>

//                       <option value="ai">
//                         Artificial Intelligence
//                       </option>

//                       <option value="development">
//                         Development
//                       </option>

//                       <option value="design">
//                         Design
//                       </option>

//                       <option value="business">
//                         Business
//                       </option>

//                       <option value="career">
//                         Career
//                       </option>
//                     </select>
//                   </div>

//                   {/* Author */}
//                   <div>
//                     <label
//                       htmlFor="author"
//                       className="mb-2 block text-sm font-semibold text-gray-700"
//                     >
//                       Author
//                     </label>

//                     <input
//                       id="author"
//                       name="author"
//                       type="text"
//                       value={formData?.author || ""}
//                       onChange={(e) => setFormData({ ...formData, author: e?.target?.value })}
//                       required
//                       placeholder="Enter author name"
//                       className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
//                     />
//                   </div>

//                   {/* Description */}
//                   <div className="md:col-span-2">
//                     <label
//                       htmlFor="description"
//                       className="mb-2 block text-sm font-semibold text-gray-700"
//                     >
//                       Description
//                     </label>

//                     <textarea
//                       id="description"
//                       name="description"
//                       value={formData?.description}
//                       onChange={(e) => setFormData({ ...formData, description: e?.target?.value })}
//                       required
//                       rows="7"
//                       placeholder="Write your blog post description..."
//                       className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
//                     />
//                   </div>

//                 </div>
//               </div>

//               {/* =========================
//                 IMAGE UPLOAD
//             ========================== */}

//               <div className="border-t border-gray-100 pt-10">

//                 <div className="mb-6">
//                   <h2 className="text-xl font-bold text-gray-900">
//                     Featured Image
//                   </h2>

//                   <p className="mt-1 text-sm text-gray-500">
//                     Upload an image for your blog post.
//                   </p>
//                 </div>

//                 {/* Upload area */}
//                 {!preview ? (
//                   <div
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                     className={`group relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 md:p-14 ${isDragging
//                       ? "scale-[1.01] border-purple-500 bg-purple-50"
//                       : "border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/50"
//                       }`}
//                   >

//                     {/* Hidden file input */}
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       className="absolute inset-0 cursor-pointer opacity-0"
//                     />

//                     {/* Upload icon */}
//                     <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl text-white shadow-lg shadow-purple-500/20 transition-transform duration-300 group-hover:scale-110">
//                       ↑
//                     </div>

//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {isDragging
//                         ? "Drop your image here"
//                         : "Drag & drop your image"}
//                     </h3>

//                     <p className="mt-2 text-sm text-gray-500">
//                       or{" "}
//                       <span className="font-semibold text-purple-600">
//                         browse files
//                       </span>{" "}
//                       from your computer
//                     </p>

//                     <p className="mt-4 text-xs text-gray-400">
//                       PNG, JPG, JPEG or WEBP • Max 5MB
//                     </p>

//                   </div>
//                 ) : (

//                   /* Image preview */
//                   <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

//                     <img
//                       src={preview}
//                       alt="Selected preview"
//                       className="h-72 w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
//                     />

//                     {/* Image information */}
//                     <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-5 pt-12">

//                       <div className="text-white">
//                         <p className="text-sm font-medium">
//                           {image?.name}
//                         </p>

//                         <p className="mt-1 text-xs text-white/70">
//                           Image selected
//                         </p>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={removeImage}
//                         className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-red-500"
//                       >
//                         Remove
//                       </button>

//                     </div>
//                   </div>
//                 )}

//               </div>

//               {/* =========================
//                 FORM BUTTONS
//             ========================== */}

//               <div className="mt-10 flex flex-col-reverse gap-3 border-t border-gray-100 pt-8 sm:flex-row sm:justify-end">

//                 {/* Cancel */}
//                 <Link
//                   href="/"
//                   className="rounded-xl border border-gray-200 px-6 py-3.5 text-center text-sm font-semibold text-gray-600 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </Link>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   disabled={loading || !isFormValid}
//                   className={`group relative overflow-hidden rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 
//                     ${loading && !isFormValid
//                       ? "cursor-not-allowed bg-gray-400 opacity-70"
//                       : "bg-[#111827] shadow-gray-900/20 hover:-translate-y-0.5 hover:shadow-xl"
//                     }`}
//                 >
//                   {!loading && (
//                     <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 transition-transform duration-500 group-hover:translate-x-0" />
//                   )}

//                   <span className="relative z-10 flex items-center justify-center gap-2">
//                     {loading ? (
//                       <>
//                         <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                         {isEditMode ? "Updating..." : "Publishing..."}
//                       </>
//                     ) : (
//                       <>
//                         {isEditMode ? "Update Post" : "Publish Post"}

//                         <span className="transition-transform duration-300 group-hover:translate-x-1">
//                           →
//                         </span>
//                       </>
//                     )}
//                   </span>
//                 </button>

//               </div>

//             </form>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

import { Suspense } from "react";
import CreatePostForm from "./CreatePostForm";

export default function CreatePostPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreatePostForm />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-gray-500">
        Loading post form...
      </p>
    </div>
  );
}