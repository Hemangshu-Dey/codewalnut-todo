import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Profile from "./pages/profile/Profile";
import { Toaster } from "sonner";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
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
          path: "/profile",
          element: <Profile />,
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
