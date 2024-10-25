import { Suspense } from "react";



export default function EditMovieLayout({ children }) {
  return (
    <div>
        <Suspense>
    {children}
    </Suspense>
    </div>
  );
}
