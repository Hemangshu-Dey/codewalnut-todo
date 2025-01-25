import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "@/utils/store";
import { toast } from "sonner";
interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  const { currentUser, setCurrentUser, setActiveCategory } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {
          userid: currentUser?.userid,
        },
        {
          withCredentials: true,
        },
      );

      setCurrentUser({
        userid: "",
        username: "",
        email: "",
      });
      setActiveCategory("");
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error: unknown) {
      console.log("Error logging out", error);
      if (error instanceof Error) {
        console.log(error);
      } else {
        console.log("An unknown error occurred.");
      }
    }
  };

  return (
    <header
      className={`flex h-20 w-full shrink-0 items-center px-4 md:px-6 bg-gray-100 border-r border-gray-200s shadow-sm shadow-slate-200 ${className}`}
    >
      <button
        onClick={handleLogout}
        className="flex-row justify-center items-center hidden lg:flex"
      >
        <p className="font-extrabold leading-none tracking-tight text-2xl">
          TODO
        </p>
      </button>
      <nav className="ml-auto hidden lg:flex gap-6">
        <button
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:scale-105  ease-in-out duration-300 disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </nav>
    </header>
  );
}
