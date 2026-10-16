
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