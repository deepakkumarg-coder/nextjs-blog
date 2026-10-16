
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