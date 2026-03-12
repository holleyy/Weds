import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Enable dark mode by default
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}