import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthWrapper from "./components/pages/AuthWrapper/AuthWrapper";
import Register from "./components/pages/auth/Register";
import Login from "./components/pages/auth/Login";
import Home from "./components/pages/home/Home";
import { Toaster } from "sonner";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthWrapper />,
      children: [
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/home",
          element: <Home />,
        },
      ],
    },
  ]);

  return (
    <div>
      <Toaster />
      <RouterProvider router={router} />
    </div>
  );
}
